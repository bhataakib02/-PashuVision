const fs = require('fs');
const path = require('path');

class ARService {
  constructor() {
    this.breedFeatures = this.loadBreedFeatures();
    this.overlayTemplates = this.loadOverlayTemplates();
  }

  loadBreedFeatures() {
    return {
      'gir': {
        name: 'Gir',
        features: {
          horns: 'Curved and thick, pointing forward',
          hump: 'Large and prominent',
          color: 'Red to reddish brown with white spots',
          size: 'Large frame, muscular build',
          ears: 'Large and drooping',
          eyes: 'Dark and expressive'
        },
        characteristics: [
          'Excellent milk producer',
          'Heat tolerant',
          'Disease resistant',
          'Good for tropical climate'
        ],
        overlayPoints: [
          { x: 0.3, y: 0.2, label: 'Horns', description: 'Curved and thick' },
          { x: 0.5, y: 0.15, label: 'Hump', description: 'Large and prominent' },
          { x: 0.4, y: 0.4, label: 'Body', description: 'Muscular build' },
          { x: 0.2, y: 0.6, label: 'Ears', description: 'Large and drooping' }
        ]
      },
      'sahiwal': {
        name: 'Sahiwal',
        features: {
          horns: 'Short and thick',
          hump: 'Medium size',
          color: 'Reddish brown',
          size: 'Medium to large frame',
          ears: 'Medium size',
          eyes: 'Alert and bright'
        },
        characteristics: [
          'High milk yield',
          'Good temperament',
          'Adaptable to various climates',
          'Long lactation period'
        ],
        overlayPoints: [
          { x: 0.3, y: 0.2, label: 'Horns', description: 'Short and thick' },
          { x: 0.5, y: 0.2, label: 'Hump', description: 'Medium size' },
          { x: 0.4, y: 0.4, label: 'Body', description: 'Medium to large frame' },
          { x: 0.2, y: 0.6, label: 'Ears', description: 'Medium size' }
        ]
      },
      'murrah': {
        name: 'Murrah Buffalo',
        features: {
          horns: 'Curved backward',
          hump: 'No hump',
          color: 'Jet black',
          size: 'Large and heavy',
          ears: 'Small and pointed',
          eyes: 'Small and bright'
        },
        characteristics: [
          'Highest milk producer among buffaloes',
          'High fat content in milk',
          'Good for commercial dairy',
          'Calm temperament'
        ],
        overlayPoints: [
          { x: 0.3, y: 0.2, label: 'Horns', description: 'Curved backward' },
          { x: 0.4, y: 0.4, label: 'Body', description: 'Large and heavy' },
          { x: 0.2, y: 0.6, label: 'Ears', description: 'Small and pointed' },
          { x: 0.6, y: 0.3, label: 'Color', description: 'Jet black' }
        ]
      }
    };
  }

  loadOverlayTemplates() {
    return {
      'breed_identification': {
        name: 'Breed Identification Guide',
        elements: [
          {
            type: 'text',
            content: 'Look for these key features:',
            position: { x: 0.1, y: 0.1 },
            style: { fontSize: 16, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' }
          },
          {
            type: 'arrow',
            start: { x: 0.3, y: 0.2 },
            end: { x: 0.4, y: 0.3 },
            label: 'Horns',
            style: { color: '#00ff00', thickness: 3 }
          },
          {
            type: 'circle',
            center: { x: 0.5, y: 0.15 },
            radius: 0.05,
            label: 'Hump',
            style: { color: '#ff0000', thickness: 2 }
          }
        ]
      },
      'health_check': {
        name: 'Health Check Guide',
        elements: [
          {
            type: 'text',
            content: 'Health indicators to check:',
            position: { x: 0.1, y: 0.1 },
            style: { fontSize: 16, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' }
          },
          {
            type: 'rectangle',
            topLeft: { x: 0.2, y: 0.3 },
            bottomRight: { x: 0.8, y: 0.7 },
            label: 'Body Condition',
            style: { color: '#ffff00', thickness: 2 }
          },
          {
            type: 'arrow',
            start: { x: 0.3, y: 0.6 },
            end: { x: 0.4, y: 0.7 },
            label: 'Check for swelling',
            style: { color: '#ff6600', thickness: 3 }
          }
        ]
      },
      'vaccination_guide': {
        name: 'Vaccination Guide',
        elements: [
          {
            type: 'text',
            content: 'Vaccination injection points:',
            position: { x: 0.1, y: 0.1 },
            style: { fontSize: 16, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' }
          },
          {
            type: 'circle',
            center: { x: 0.3, y: 0.4 },
            radius: 0.03,
            label: 'Neck injection site',
            style: { color: '#00ff00', thickness: 2 }
          },
          {
            type: 'circle',
            center: { x: 0.7, y: 0.5 },
            radius: 0.03,
            label: 'Hip injection site',
            style: { color: '#00ff00', thickness: 2 }
          }
        ]
      }
    };
  }

  generateBreedOverlay(breed, confidence) {
    const breedData = this.breedFeatures[breed.toLowerCase()];
    if (!breedData) {
      return this.generateGenericOverlay();
    }

    const overlay = {
      type: 'breed_identification',
      breed: breedData.name,
      confidence: confidence,
      elements: [
        {
          type: 'text',
          content: `Identified: ${breedData.name} (${Math.round(confidence * 100)}% confidence)`,
          position: { x: 0.1, y: 0.05 },
          style: {
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: 'rgba(0,150,0,0.8)',
            padding: 10,
            borderRadius: 5
          }
        }
      ]
    };

    // Add feature points
    breedData.overlayPoints.forEach(point => {
      overlay.elements.push({
        type: 'circle',
        center: { x: point.x, y: point.y },
        radius: 0.02,
        label: point.label,
        description: point.description,
        style: {
          color: '#ff0000',
          thickness: 3,
          fillColor: 'rgba(255,0,0,0.3)'
        }
      });

      overlay.elements.push({
        type: 'text',
        content: `${point.label}: ${point.description}`,
        position: { x: point.x + 0.05, y: point.y },
        style: {
          fontSize: 12,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 5
        }
      });
    });

    // Add characteristics
    overlay.elements.push({
      type: 'text',
      content: 'Key Characteristics:',
      position: { x: 0.1, y: 0.8 },
      style: {
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 5
      }
    });

    breedData.characteristics.forEach((char, index) => {
      overlay.elements.push({
        type: 'text',
        content: `• ${char}`,
        position: { x: 0.1, y: 0.85 + (index * 0.03) },
        style: {
          fontSize: 12,
          color: '#ffff00',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 3
        }
      });
    });

    return overlay;
  }

  generateHealthOverlay(healthData) {
    const overlay = {
      type: 'health_check',
      healthScore: healthData.overallHealthScore,
      diseases: healthData.diseases,
      elements: [
        {
          type: 'text',
          content: `Health Score: ${Math.round(healthData.overallHealthScore * 100)}%`,
          position: { x: 0.1, y: 0.05 },
          style: {
            fontSize: 18,
            color: healthData.overallHealthScore > 0.7 ? '#00ff00' : '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 10,
            borderRadius: 5
          }
        }
      ]
    };

    // Add disease indicators
    healthData.diseases.forEach((disease, index) => {
      overlay.elements.push({
        type: 'warning',
        content: `⚠️ ${disease.type.toUpperCase()}`,
        position: { x: 0.1, y: 0.15 + (index * 0.08) },
        style: {
          fontSize: 14,
          color: '#ff0000',
          backgroundColor: 'rgba(255,0,0,0.3)',
          padding: 8,
          borderRadius: 5
        }
      });

      overlay.elements.push({
        type: 'text',
        content: `Severity: ${disease.severity} (${Math.round(disease.confidence * 100)}%)`,
        position: { x: 0.1, y: 0.18 + (index * 0.08) },
        style: {
          fontSize: 12,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 5
        }
      });
    });

    // Add recommendations
    overlay.elements.push({
      type: 'text',
      content: 'Recommendations:',
      position: { x: 0.1, y: 0.7 },
      style: {
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 5
      }
    });

    healthData.recommendations.slice(0, 3).forEach((rec, index) => {
      overlay.elements.push({
        type: 'text',
        content: `• ${rec}`,
        position: { x: 0.1, y: 0.75 + (index * 0.04) },
        style: {
          fontSize: 12,
          color: '#ffff00',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 3
        }
      });
    });

    return overlay;
  }

  generateVaccinationOverlay(animal, vaccinationSchedule) {
    const overlay = {
      type: 'vaccination_guide',
      animalId: animal.id,
      schedule: vaccinationSchedule,
      elements: [
        {
          type: 'text',
          content: `Vaccination Guide for ${animal.predictedBreed}`,
          position: { x: 0.1, y: 0.05 },
          style: {
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,150,0.8)',
            padding: 10,
            borderRadius: 5
          }
        }
      ]
    };

    // Add injection sites
    const injectionSites = [
      { x: 0.3, y: 0.4, label: 'Neck (Preferred)' },
      { x: 0.7, y: 0.5, label: 'Hip (Alternative)' }
    ];

    injectionSites.forEach(site => {
      overlay.elements.push({
        type: 'circle',
        center: { x: site.x, y: site.y },
        radius: 0.03,
        label: site.label,
        style: {
          color: '#00ff00',
          thickness: 3,
          fillColor: 'rgba(0,255,0,0.3)'
        }
      });

      overlay.elements.push({
        type: 'text',
        content: site.label,
        position: { x: site.x + 0.05, y: site.y },
        style: {
          fontSize: 12,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 5
        }
      });
    });

    // Add vaccination schedule
    if (vaccinationSchedule && vaccinationSchedule.length > 0) {
      overlay.elements.push({
        type: 'text',
        content: 'Upcoming Vaccinations:',
        position: { x: 0.1, y: 0.7 },
        style: {
          fontSize: 14,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 5
        }
      });

      vaccinationSchedule.slice(0, 3).forEach((vaccine, index) => {
        overlay.elements.push({
          type: 'text',
          content: `• ${vaccine.name} - ${vaccine.dueDate}`,
          position: { x: 0.1, y: 0.75 + (index * 0.04) },
          style: {
            fontSize: 12,
            color: '#ffff00',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 3
          }
        });
      });
    }

    return overlay;
  }

  generateGenericOverlay() {
    return {
      type: 'generic_guide',
      elements: [
        {
          type: 'text',
          content: 'Point camera at animal for breed identification',
          position: { x: 0.1, y: 0.1 },
          style: {
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 10,
            borderRadius: 5
          }
        },
        {
          type: 'rectangle',
          topLeft: { x: 0.2, y: 0.3 },
          bottomRight: { x: 0.8, y: 0.7 },
          label: 'Animal Detection Area',
          style: {
            color: '#00ff00',
            thickness: 2,
            fillColor: 'rgba(0,255,0,0.1)'
          }
        }
      ]
    };
  }

  generateTrainingOverlay(trainingType) {
    const trainingGuides = {
      'breed_identification': {
        title: 'Breed Identification Training',
        steps: [
          'Look at the animal\'s horns shape and size',
          'Check the hump size and position',
          'Observe the body color and patterns',
          'Note the ear size and shape',
          'Consider the overall body frame'
        ]
      },
      'health_assessment': {
        title: 'Health Assessment Training',
        steps: [
          'Check body condition score',
          'Look for signs of illness',
          'Observe animal behavior',
          'Check for external parasites',
          'Assess mobility and posture'
        ]
      },
      'vaccination_procedure': {
        title: 'Vaccination Procedure Training',
        steps: [
          'Prepare vaccination equipment',
          'Identify injection site',
          'Clean the injection area',
          'Administer vaccine properly',
          'Record vaccination details'
        ]
      }
    };

    const guide = trainingGuides[trainingType] || trainingGuides['breed_identification'];
    
    const overlay = {
      type: 'training_guide',
      trainingType: trainingType,
      title: guide.title,
      elements: [
        {
          type: 'text',
          content: guide.title,
          position: { x: 0.1, y: 0.05 },
          style: {
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,150,0.8)',
            padding: 10,
            borderRadius: 5
          }
        }
      ]
    };

    guide.steps.forEach((step, index) => {
      overlay.elements.push({
        type: 'text',
        content: `${index + 1}. ${step}`,
        position: { x: 0.1, y: 0.15 + (index * 0.06) },
        style: {
          fontSize: 14,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 8,
          borderRadius: 3
        }
      });
    });

    return overlay;
  }

  getSupportedOverlayTypes() {
    return [
      'breed_identification',
      'health_check',
      'vaccination_guide',
      'training_guide',
      'generic_guide'
    ];
  }

  getBreedList() {
    return Object.keys(this.breedFeatures).map(breed => ({
      key: breed,
      name: this.breedFeatures[breed].name,
      features: this.breedFeatures[breed].features
    }));
  }
}

module.exports = ARService;
