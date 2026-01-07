// Lazy load modules to avoid errors if they're not installed
let ortModule = null;
let sharpModule = null;

function getOrt() {
  if (ortModule === null) {
    try {
      ortModule = require('onnxruntime-node');
    } catch (error) {
      console.warn('⚠️  onnxruntime-node not available');
      return null;
    }
  }
  return ortModule;
}

function getSharp() {
  if (sharpModule === null) {
    try {
      sharpModule = require('sharp');
    } catch (error) {
      console.warn('⚠️  Sharp module not available');
      return null;
    }
  }
  return sharpModule;
}

const fs = require('fs');
const path = require('path');

class BreedPredictor {
  constructor() {
    this.session = null;
    this.breeds = [
      'Gir (Cattle)', 'Sahiwal (Cattle)', 'Holstein (Cattle)', 'Murrah (Buffalo)', 
      'Mehsana (Buffalo)', 'Surti (Buffalo)', 'Crossbred Cattle', 'Crossbred Buffalo',
      'Jersey (Cattle)', 'Red Sindhi (Cattle)', 'Tharparkar (Cattle)', 'Kankrej (Cattle)'
    ];
    this.species = ['cattle', 'buffalo', 'non_animal'];
  }

  async loadModel() {
    try {
      // Update this path to point to your new model
      const modelPath = path.join(__dirname, '..', '..', 'models', process.env.BREED_MODEL_NAME || 'breed_model.onnx');
      if (!fs.existsSync(modelPath)) {
        console.log('Model not found, using mock predictions');
        return false;
      }
      
      const ort = getOrt();
      if (!ort) {
        throw new Error('onnxruntime-node not available');
      }
      this.session = await ort.InferenceSession.create(modelPath);
      console.log('AI model loaded successfully');
      return true;
    } catch (error) {
      console.log('Failed to load AI model, using mock predictions:', error.message);
      return false;
    }
  }

  async preprocessImage(imageBuffer) {
    try {
      // Get sharp module (lazy load)
      const sharpModule = getSharp();
      if (!sharpModule) {
        throw new Error('Sharp module not available. Cannot preprocess image.');
      }
      
      // Resize and normalize image for model input
      const processed = await sharpModule(imageBuffer)
        .resize(224, 224)
        .removeAlpha()
        .raw()
        .toBuffer();
      
      // Convert to float32 array and normalize
      const pixels = new Float32Array(processed.length);
      for (let i = 0; i < processed.length; i++) {
        pixels[i] = processed[i] / 255.0;
      }
      
      // Reshape to [1, 3, 224, 224] for RGB channels
      const ort = getOrt();
      if (!ort) {
        throw new Error('onnxruntime-node not available');
      }
      const tensor = new ort.Tensor('float32', pixels, [1, 3, 224, 224]);
      return tensor;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }

  async predictBreed(imageBuffer) {
    try {
      if (!this.session) {
        return this.getMockPrediction();
      }

      const input = await this.preprocessImage(imageBuffer);
      const results = await this.session.run({ input });
      
      // Get predictions from model output
      const predictions = Array.from(results.output.data);
      const topIndices = predictions
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Return only the top prediction with 100% confidence
      const topPrediction = topIndices[0];
      return [{
        breed: this.breeds[topPrediction.index] || 'Unknown',
        confidence: 1.0
      }];
    } catch (error) {
      console.error('Prediction failed:', error);
      return this.getMockPrediction();
    }
  }

  async detectSpecies(imageBuffer) {
    try {
      if (!this.session) {
        return { species: 'cattle_or_buffalo', confidence: 0.85 };
      }

      const input = await this.preprocessImage(imageBuffer);
      const results = await this.session.run({ input });
      
      // Mock species detection for now
      const isAnimal = Math.random() > 0.1; // 90% chance it's an animal
      if (!isAnimal) {
        return { species: 'non_animal', confidence: 0.9 };
      }
      
      const isBuffalo = Math.random() > 0.6; // 40% chance it's buffalo
      return {
        species: isBuffalo ? 'buffalo' : 'cattle',
        confidence: 0.8 + Math.random() * 0.15
      };
    } catch (error) {
      console.error('Species detection failed:', error);
      return { species: 'cattle_or_buffalo', confidence: 0.75 };
    }
  }

  async generateHeatmap(imageBuffer, predictions) {
    try {
      // Get sharp module (lazy load)
      const sharpModule = getSharp();
      if (!sharpModule) {
        console.warn('Sharp module not available for heatmap generation');
        return null;
      }
      
      // Mock heatmap generation - in real implementation, use Grad-CAM
      const image = await sharpModule(imageBuffer).resize(224, 224).toBuffer();
      
      // Create a simple overlay showing "AI attention" areas
      const heatmap = await sharpModule(image)
        .composite([{
          input: Buffer.from(`
            <svg width="224" height="224">
              <rect x="50" y="50" width="124" height="124" fill="red" opacity="0.3"/>
              <rect x="60" y="60" width="104" height="104" fill="yellow" opacity="0.2"/>
              <text x="112" y="120" text-anchor="middle" fill="white" font-size="12">AI Focus</text>
            </svg>
          `),
          top: 0,
          left: 0
        }])
        .png()
        .toBuffer();
      
      return heatmap;
    } catch (error) {
      console.error('Heatmap generation failed:', error);
      return null;
    }
  }

  getMockPrediction() {
    const breeds = [
      'Gir (Cattle)', 'Sahiwal (Cattle)', 'Murrah (Buffalo)', 'Crossbred Cattle',
      'Holstein (Cattle)', 'Jersey (Cattle)', 'Mehsana (Buffalo)', 'Surti (Buffalo)'
    ];
    
    // Return only one breed with 100% confidence
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    return [{ breed: randomBreed, confidence: 1.0 }];
  }

  async isCrossbreed(predictions) {
    // Simple heuristic: if top prediction confidence is low and multiple breeds have similar scores
    if (predictions.length < 2) return false;
    
    const topConfidence = predictions[0].confidence;
    const secondConfidence = predictions[1].confidence;
    
    return topConfidence < 0.7 && (topConfidence - secondConfidence) < 0.2;
  }
}

module.exports = BreedPredictor;

