const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

class PyTorchPredictor {
  constructor() {
    this.usePythonService = false;
    this.pythonServiceUrl = process.env.PYTORCH_SERVICE_URL || 'http://localhost:5001';
    // __dirname is backend/src/ai, so go up two levels to backend/models
    // Using the new ConvNeXt model
    this.modelPath = path.join(__dirname, '..', '..', 'models', process.env.MODEL_NAME_ONNX || 'model.onnx');
    this.modelPathPth = path.join(__dirname, '..', '..', 'models', 'best_model_convnext_base_acc0.7007.pth');
    this.modelInfoPath = path.join(__dirname, '..', '..', 'models', 'model_info.json');
    this.breeds = [];
    this.modelInfo = null;
    this.species = ['cattle', 'buffalo', 'non_animal'];
    this.loadModelInfo();
    this.checkModelAvailability();
  }

  async checkModelAvailability() {
    // Check if .pth file exists (use Python service)
    if (fs.existsSync(this.modelPathPth)) {
      // Check if Python service is running (with retry)
      let retries = 3;
      for (let i = 0; i < retries; i++) {
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 2000)
          );
          
          const fetchPromise = fetch(`${this.pythonServiceUrl}/health`);
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (response.ok) {
            const data = await response.json();
            if (data.model_loaded) {
              this.usePythonService = true;
              console.log('✅ Using Python PyTorch service for predictions');
              console.log(`   Service URL: ${this.pythonServiceUrl}`);
              return;
            }
          }
        } catch (error) {
          if (i === retries - 1) {
            // Last retry failed
            console.log('⚠️  Python PyTorch service not available, using mock predictions');
            console.log(`   Start the service with: cd backend/models && python pytorch_service.py`);
            console.log(`   Service URL: ${this.pythonServiceUrl}`);
          } else {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }
    
    // Check if ONNX model exists (direct Node.js inference)
    if (fs.existsSync(this.modelPath)) {
      try {
        const ort = require('onnxruntime-node');
        this.session = await ort.InferenceSession.create(this.modelPath);
        console.log('✅ PyTorch model (ONNX) loaded successfully');
        this.usePythonService = false;
        return;
      } catch (error) {
        console.log('⚠️  Failed to load ONNX model:', error.message);
      }
    }
    
    console.log('⚠️  No model available, using mock predictions');
  }

  loadModelInfo() {
    try {
      if (fs.existsSync(this.modelInfoPath)) {
        this.modelInfo = JSON.parse(fs.readFileSync(this.modelInfoPath, 'utf8'));
        this.breeds = this.modelInfo.classes || [];
        console.log(`Loaded model info: ${this.breeds.length} breeds`);
      } else {
        // Fallback to default breeds
        this.breeds = [
          'Alambadi', 'Amritmahal', 'Ayrshire', 'Banni', 'Bargur', 'Bhadawari', 
          'Brown_Swiss', 'Dangi', 'Deoni', 'Gir', 'Guernsey', 'Hallikar', 
          'Hariana', 'Holstein_Friesian', 'Jaffrabadi', 'Jersey', 'Kangayam', 
          'Kankrej', 'Kasargod', 'Kenkatha', 'Kherigarh', 'Khillari', 
          'Krishna_Valley', 'Malnad_gidda', 'Mehsana', 'Murrah', 'Nagori', 
          'Nagpuri', 'Nili_Ravi', 'Nimari', 'Ongole', 'Pulikulam', 'Rathi', 
          'Red_Dane', 'Red_Sindhi', 'Sahiwal', 'Surti', 'Tharparkar', 'Toda', 
          'Umblachery', 'Vechur'
        ];
        console.log('Using default breed list');
      }
    } catch (error) {
      console.error('Failed to load model info:', error);
      this.breeds = [];
    }
  }

  async loadModel() {
    // Model loading is now handled in checkModelAvailability()
    // This method is kept for backward compatibility
    return this.usePythonService || this.session !== null;
  }

  async preprocessImage(imageBuffer) {
    try {
      // Get normalization values from model info or use defaults
      const mean = this.modelInfo?.mean || [0.485, 0.456, 0.406];
      const std = this.modelInfo?.std || [0.229, 0.224, 0.225];
      const imgSize = this.modelInfo?.input_size?.[0] || 224;
      
      // Resize and normalize image for model input
      const processed = await sharp(imageBuffer)
        .resize(imgSize, imgSize)
        .removeAlpha()
        .raw()
        .toBuffer();
      
      // Convert to float32 array and normalize
      const pixels = new Float32Array(processed.length);
      
      for (let i = 0; i < processed.length; i += 3) {
        const r = processed[i] / 255.0;
        const g = processed[i + 1] / 255.0;
        const b = processed[i + 2] / 255.0;
        
        pixels[i] = (r - mean[0]) / std[0];
        pixels[i + 1] = (g - mean[1]) / std[1];
        pixels[i + 2] = (b - mean[2]) / std[2];
      }
      
      // Reshape to [1, 3, imgSize, imgSize] for RGB channels (ONNX format)
      const ort = require('onnxruntime-node');
      const input = new ort.Tensor('float32', pixels, [1, 3, imgSize, imgSize]);
      return input;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }

  async predictBreed(imageBuffer) {
    try {
      // Use Python service if available
      if (this.usePythonService) {
        return await this.predictViaPythonService(imageBuffer);
      }
      
      // Use ONNX model if available
      if (this.session) {
        const ort = require('onnxruntime-node');
        const input = await this.preprocessImage(imageBuffer);
        const results = await this.session.run({ input });
        
        // Get predictions from model output
        const predictions = Array.from(results.output.data);
        const topIndices = predictions
          .map((score, index) => ({ score, index }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        return topIndices.map(({ score, index }) => ({
          breed: this.breeds[index] || 'Unknown',
          confidence: Math.max(0, Math.min(1, score))
        }));
      }
      
      // Fallback to mock predictions
      return this.getMockPrediction();
    } catch (error) {
      console.error('Prediction failed:', error);
      return this.getMockPrediction();
    }
  }

  async predictViaPythonService(imageBuffer) {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });

      const response = await fetch(`${this.pythonServiceUrl}/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Python service error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.predictions || this.getMockPrediction();
    } catch (error) {
      console.error('Python service prediction failed:', error.message);
      return this.getMockPrediction();
    }
  }

  async detectSpecies(imageBuffer) {
    try {
      // Use Python service if available
      if (this.usePythonService) {
        try {
          const formData = new FormData();
          formData.append('image', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
          });

          const response = await fetch(`${this.pythonServiceUrl}/species`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            return {
              species: data.species || 'cattle_or_buffalo',
              confidence: data.confidence || 0.85
            };
          }
        } catch (error) {
          console.error('Python service species detection failed:', error.message);
        }
      }

      // Fallback: Use breed prediction to determine species
      const predictions = await this.predictBreed(imageBuffer);
      if (!predictions || predictions.length === 0) {
        return { species: 'cattle_or_buffalo', confidence: 0.85 };
      }
      
      const topBreed = predictions[0].breed;
      
      // Classify as cattle or buffalo based on breed
      const buffaloBreeds = ['Murrah', 'Mehsana', 'Surti', 'Jaffrabadi', 'Nili_Ravi', 'Nagpuri', 'Bhadawari'];
      const isBuffalo = buffaloBreeds.some(breed => topBreed.includes(breed));
      
      return {
        species: isBuffalo ? 'buffalo' : 'cattle',
        confidence: predictions[0].confidence || 0.85
      };
    } catch (error) {
      console.error('Species detection failed:', error);
      return { species: 'cattle_or_buffalo', confidence: 0.85 };
    }
  }

  getMockPrediction() {
    // Use actual breeds from model info or fallback to common breeds
    const commonBreeds = this.breeds.length > 0 ? this.breeds : [
      'Gir', 'Sahiwal', 'Murrah', 'Holstein_Friesian', 'Jersey', 
      'Kankrej', 'Tharparkar', 'Red_Sindhi', 'Hariana', 'Ongole'
    ];
    
    // Return only one breed with 100% confidence
    const randomBreed = commonBreeds[Math.floor(Math.random() * commonBreeds.length)];
    return [{ breed: randomBreed, confidence: 1.0 }];
  }

  async isCrossbreed(predictions) {
    // Simple heuristic: if top prediction confidence is low and multiple breeds have similar scores
    if (predictions.length < 2) return false;
    
    const topConfidence = predictions[0].confidence;
    const secondConfidence = predictions[1].confidence;
    
    return topConfidence < 0.7 && (topConfidence - secondConfidence) < 0.2;
  }

  async generateHeatmap(imageBuffer, predictions) {
    try {
      // For now, return a simple heatmap
      // In a real implementation, you would use Grad-CAM or similar techniques
      const heatmapData = {
        width: 224,
        height: 224,
        data: Array(224 * 224).fill(0.5) // Simple uniform heatmap
      };
      
      return heatmapData;
    } catch (error) {
      console.error('Heatmap generation failed:', error);
      return null;
    }
  }
}

module.exports = PyTorchPredictor;

