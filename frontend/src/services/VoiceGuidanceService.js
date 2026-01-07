import { useState, useEffect, useRef } from 'react'

export default function VoiceGuidanceSystem() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [guidanceText, setGuidanceText] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [speechSynthesis, setSpeechSynthesis] = useState(null)
  const [language, setLanguage] = useState('en')
  const [voice, setVoice] = useState(null)
  const recognitionRef = useRef(null)
  const speechRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        console.log('🎤 Voice recognition started')
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log('🎤 Recognized:', transcript)
        handleVoiceCommand(transcript)
      }
      
      recognition.onerror = (event) => {
        console.error('🎤 Recognition error:', event.error)
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognition)
      recognitionRef.current = recognition
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis
      setSpeechSynthesis(synthesis)
      
      // Get available voices
      const loadVoices = () => {
        const voices = synthesis.getVoices()
        const hindiVoice = voices.find(v => v.lang.startsWith('hi'))
        const englishVoice = voices.find(v => v.lang.startsWith('en'))
        setVoice(language === 'hi' ? hindiVoice : englishVoice)
      }
      
      loadVoices()
      synthesis.onvoiceschanged = loadVoices
    }
  }, [language])

  const speak = (text, callback) => {
    if (!speechSynthesis || !voice) return

    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onend = () => {
      setIsSpeaking(false)
      if (callback) callback()
    }

    utterance.onerror = (event) => {
      console.error('🔊 Speech error:', event.error)
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
    speechRef.current = utterance
  }

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  const stopSpeaking = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      nextStep()
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      previousStep()
    } else if (lowerCommand.includes('repeat') || lowerCommand.includes('again')) {
      repeatCurrentStep()
    } else if (lowerCommand.includes('help')) {
      showHelp()
    } else if (lowerCommand.includes('stop') || lowerCommand.includes('exit')) {
      stopGuidance()
    } else {
      // Handle specific form commands
      handleFormCommand(command)
    }
  }

  const handleFormCommand = (command) => {
    // This would be implemented based on the current form context
    console.log('📝 Form command:', command)
  }

  const nextStep = () => {
    if (currentStep < guidanceSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      speakCurrentStep()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      speakCurrentStep()
    }
  }

  const repeatCurrentStep = () => {
    speakCurrentStep()
  }

  const speakCurrentStep = () => {
    const step = guidanceSteps[currentStep]
    const text = language === 'hi' ? step.hindiText : step.englishText
    speak(text)
  }

  const showHelp = () => {
    const helpText = language === 'hi' 
      ? 'आप "अगला", "पिछला", "दोहराएं", "मदद", या "रोकें" कह सकते हैं।'
      : 'You can say "next", "previous", "repeat", "help", or "stop".'
    speak(helpText)
  }

  const stopGuidance = () => {
    stopSpeaking()
    stopListening()
    setCurrentStep(0)
  }

  const startGuidance = (guidanceType) => {
    setCurrentStep(0)
    speakCurrentStep()
  }

  const guidanceSteps = [
    {
      englishText: 'Welcome to BreedAI voice guidance. Let\'s start by taking a photo of the animal.',
      hindiText: 'BreedAI वॉइस गाइडेंस में आपका स्वागत है। आइए पशु की फोटो लेकर शुरू करते हैं।'
    },
    {
      englishText: 'Position the animal so that its full body is visible in the camera frame.',
      hindiText: 'पशु को इस तरह रखें कि उसका पूरा शरीर कैमरे के फ्रेम में दिखे।'
    },
    {
      englishText: 'Make sure the lighting is good and the animal is not blurry.',
      hindiText: 'सुनिश्चित करें कि रोशनी अच्छी है और पशु धुंधला नहीं है।'
    },
    {
      englishText: 'Tap the camera button to capture the photo.',
      hindiText: 'फोटो कैप्चर करने के लिए कैमरा बटन पर टैप करें।'
    },
    {
      englishText: 'Great! Now let\'s enter the animal\'s details. Start with the ear tag number.',
      hindiText: 'बहुत बढ़िया! अब पशु का विवरण दर्ज करते हैं। कान टैग नंबर से शुरू करें।'
    },
    {
      englishText: 'Enter the animal\'s age in months.',
      hindiText: 'पशु की आयु महीनों में दर्ज करें।'
    },
    {
      englishText: 'Select the animal\'s gender from the dropdown.',
      hindiText: 'ड्रॉपडाउन से पशु का लिंग चुनें।'
    },
    {
      englishText: 'Enter the animal\'s weight in kilograms.',
      hindiText: 'पशु का वजन किलोग्राम में दर्ज करें।'
    },
    {
      englishText: 'Select the health status of the animal.',
      hindiText: 'पशु की स्वास्थ्य स्थिति चुनें।'
    },
    {
      englishText: 'Enter the owner\'s name and contact information.',
      hindiText: 'मालिक का नाम और संपर्क जानकारी दर्ज करें।'
    },
    {
      englishText: 'Review all the information and tap save to submit the record.',
      hindiText: 'सभी जानकारी की समीक्षा करें और रिकॉर्ड सबमिट करने के लिए सेव पर टैप करें।'
    }
  ]

  return {
    // State
    isListening,
    isSpeaking,
    currentStep,
    guidanceText,
    language,
    
    // Actions
    startListening,
    stopListening,
    startGuidance,
    stopGuidance,
    nextStep,
    previousStep,
    repeatCurrentStep,
    speak,
    setLanguage,
    
    // Voice guidance steps
    guidanceSteps,
    speakCurrentStep,
    
    // Voice command handlers
    handleVoiceCommand,
    handleFormCommand
  }
}

// Voice guidance for specific forms
export const AnimalRegistrationGuidance = {
  steps: [
    {
      englishText: 'Step 1: Take a clear photo of the animal',
      hindiText: 'चरण 1: पशु की स्पष्ट फोटो लें',
      action: 'photo_capture'
    },
    {
      englishText: 'Step 2: Enter the ear tag number',
      hindiText: 'चरण 2: कान टैग नंबर दर्ज करें',
      action: 'ear_tag_input'
    },
    {
      englishText: 'Step 3: Select the breed from AI suggestions',
      hindiText: 'चरण 3: AI सुझावों से नस्ल चुनें',
      action: 'breed_selection'
    },
    {
      englishText: 'Step 4: Enter animal details',
      hindiText: 'चरण 4: पशु का विवरण दर्ज करें',
      action: 'animal_details'
    },
    {
      englishText: 'Step 5: Enter owner information',
      hindiText: 'चरण 5: मालिक की जानकारी दर्ज करें',
      action: 'owner_info'
    },
    {
      englishText: 'Step 6: Review and submit',
      hindiText: 'चरण 6: समीक्षा करें और सबमिट करें',
      action: 'review_submit'
    }
  ]
}

export const HealthCheckGuidance = {
  steps: [
    {
      englishText: 'Step 1: Observe the animal\'s behavior',
      hindiText: 'चरण 1: पशु के व्यवहार का निरीक्षण करें',
      action: 'behavior_observation'
    },
    {
      englishText: 'Step 2: Check for visible symptoms',
      hindiText: 'चरण 2: दिखाई देने वाले लक्षणों की जांच करें',
      action: 'symptom_check'
    },
    {
      englishText: 'Step 3: Take photos of any abnormalities',
      hindiText: 'चरण 3: किसी भी असामान्यता की फोटो लें',
      action: 'abnormality_photos'
    },
    {
      englishText: 'Step 4: Record health observations',
      hindiText: 'चरण 4: स्वास्थ्य अवलोकन दर्ज करें',
      action: 'health_recording'
    },
    {
      englishText: 'Step 5: Schedule follow-up if needed',
      hindiText: 'चरण 5: यदि आवश्यक हो तो फॉलो-अप शेड्यूल करें',
      action: 'followup_schedule'
    }
  ]
}

export const VaccinationGuidance = {
  steps: [
    {
      englishText: 'Step 1: Check vaccination schedule',
      hindiText: 'चरण 1: टीकाकरण कार्यक्रम की जांच करें',
      action: 'schedule_check'
    },
    {
      englishText: 'Step 2: Prepare vaccination record',
      hindiText: 'चरण 2: टीकाकरण रिकॉर्ड तैयार करें',
      action: 'record_preparation'
    },
    {
      englishText: 'Step 3: Administer vaccination',
      hindiText: 'चरण 3: टीकाकरण प्रशासित करें',
      action: 'vaccination_admin'
    },
    {
      englishText: 'Step 4: Record vaccination details',
      hindiText: 'चरण 4: टीकाकरण विवरण दर्ज करें',
      action: 'vaccination_recording'
    },
    {
      englishText: 'Step 5: Schedule next vaccination',
      hindiText: 'चरण 5: अगला टीकाकरण शेड्यूल करें',
      action: 'next_vaccination'
    }
  ]
}


