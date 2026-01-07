import { useState } from 'react'
import Header from '../components/Header.jsx'

export default function HelpSection() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [selectedTutorial, setSelectedTutorial] = useState(null)

  const faqs = [
    {
      id: 'registration',
      category: 'Animal Registration',
      question: 'How do I register a new animal?',
      answer: 'To register a new animal: 1) Tap "Record New" from dashboard, 2) Take a clear photo of the animal, 3) Enter ear tag number, 4) Select breed from AI suggestions, 5) Fill in animal details (age, gender, weight), 6) Enter owner information, 7) Review and submit.',
      tags: ['registration', 'new animal', 'photo']
    },
    {
      id: 'photo-quality',
      category: 'Photo Quality',
      question: 'What makes a good animal photo?',
      answer: 'A good animal photo should: 1) Show the full body of the animal, 2) Have good lighting (avoid shadows), 3) Be clear and not blurry, 4) Show the animal from the side profile, 5) Include distinctive features like horns, ears, and markings.',
      tags: ['photo', 'quality', 'camera']
    },
    {
      id: 'ai-prediction',
      category: 'AI Prediction',
      question: 'How accurate is the AI breed prediction?',
      answer: 'Our AI achieves 85-90% accuracy for common breeds. Accuracy depends on photo quality, animal pose, and breed characteristics visibility. The system shows confidence percentage - green (high confidence), yellow (medium), red (low confidence).',
      tags: ['ai', 'prediction', 'accuracy']
    },
    {
      id: 'offline-mode',
      category: 'Offline Mode',
      question: 'Can I work without internet?',
      answer: 'Yes! The app works offline. Your data is stored locally and automatically syncs when internet is restored. You can register animals, take photos, and fill forms offline. A red "Offline" indicator shows when you\'re offline.',
      tags: ['offline', 'sync', 'internet']
    },
    {
      id: 'voice-input',
      category: 'Voice Features',
      question: 'How do I use voice input?',
      answer: 'Tap the microphone icon in text fields to enable voice input. Speak clearly in Hindi or English. The app will convert your speech to text. Voice guidance provides step-by-step instructions for complex tasks.',
      tags: ['voice', 'speech', 'input']
    },
    {
      id: 'supervisor-review',
      category: 'Supervisor Review',
      question: 'What happens after I submit an animal record?',
      answer: 'Your record goes to "Pending Review" status. A supervisor will review your submission, check photo quality, verify breed prediction, and either approve, reject, or request corrections. You\'ll get notifications about the status.',
      tags: ['supervisor', 'review', 'approval']
    },
    {
      id: 'qr-scanning',
      category: 'QR Scanning',
      question: 'How do I scan QR codes?',
      answer: 'Tap "Scan QR" from dashboard, point camera at QR code, and wait for detection. If QR scanning isn\'t supported, you can manually enter the animal ID. QR codes help quickly identify existing animals.',
      tags: ['qr', 'scan', 'camera']
    },
    {
      id: 'gps-location',
      category: 'Location Services',
      question: 'Why does the app need my location?',
      answer: 'Location is used to: 1) Tag animal records with GPS coordinates, 2) Show your coverage area on maps, 3) Help supervisors track field work, 4) Enable location-based analytics. Location is only used for legitimate purposes.',
      tags: ['gps', 'location', 'privacy']
    },
    {
      id: 'data-privacy',
      category: 'Privacy & Security',
      question: 'Is my data secure?',
      answer: 'Yes! We use: 1) End-to-end encryption for data transmission, 2) Secure authentication (JWT tokens), 3) Role-based access control, 4) Regular security audits, 5) Compliance with data protection regulations.',
      tags: ['privacy', 'security', 'data']
    },
    {
      id: 'troubleshooting',
      category: 'Troubleshooting',
      question: 'The app is not working properly. What should I do?',
      answer: 'Try these steps: 1) Restart the app, 2) Check internet connection, 3) Clear app cache, 4) Update to latest version, 5) Contact support with specific error details. Most issues are resolved by restarting the app.',
      tags: ['troubleshooting', 'error', 'support']
    }
  ]

  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started with BreedAI',
      duration: '5 minutes',
      difficulty: 'Beginner',
      description: 'Learn the basics of using BreedAI for animal registration',
      steps: [
        {
          title: 'Download and Install',
          content: 'Download BreedAI from the app store and complete the installation process.',
          image: '/tutorials/install.png'
        },
        {
          title: 'Create Account',
          content: 'Register with your mobile number and complete OTP verification.',
          image: '/tutorials/register.png'
        },
        {
          title: 'Complete Profile',
          content: 'Fill in your profile details including village, district, and state.',
          image: '/tutorials/profile.png'
        },
        {
          title: 'First Animal Registration',
          content: 'Register your first animal using the step-by-step guide.',
          image: '/tutorials/first-animal.png'
        }
      ]
    },
    {
      id: 'photo-capture',
      title: 'Perfect Animal Photography',
      duration: '8 minutes',
      difficulty: 'Intermediate',
      description: 'Master the art of taking high-quality animal photos for AI recognition',
      steps: [
        {
          title: 'Camera Setup',
          content: 'Ensure good lighting and stable camera position. Avoid shadows and glare.',
          image: '/tutorials/camera-setup.png'
        },
        {
          title: 'Animal Positioning',
          content: 'Position the animal so its full body is visible. Side profile works best.',
          image: '/tutorials/positioning.png'
        },
        {
          title: 'Focus and Clarity',
          content: 'Tap to focus on the animal. Ensure the image is sharp and clear.',
          image: '/tutorials/focus.png'
        },
        {
          title: 'Quality Check',
          content: 'Review the photo for blur, darkness, or other quality issues.',
          image: '/tutorials/quality-check.png'
        }
      ]
    },
    {
      id: 'ai-features',
      title: 'Using AI Features Effectively',
      duration: '10 minutes',
      difficulty: 'Intermediate',
      description: 'Learn how to use AI breed prediction effectively',
      steps: [
        {
          title: 'Breed Prediction',
          content: 'Understand how AI analyzes animal features to predict breed.',
          image: '/tutorials/breed-prediction.png'
        },
        {
          title: 'Confidence Levels',
          content: 'Learn to interpret confidence percentages and when to trust AI suggestions.',
          image: '/tutorials/confidence.png'
        },
        {
          title: 'Manual Override',
          content: 'Know when and how to override AI suggestions with manual input.',
          image: '/tutorials/manual-override.png'
        }
      ]
    },
    {
      id: 'supervisor-workflow',
      title: 'Supervisor Review Process',
      duration: '12 minutes',
      difficulty: 'Advanced',
      description: 'Complete guide for supervisors on reviewing and managing submissions',
      steps: [
        {
          title: 'Accessing Pending Reviews',
          content: 'Navigate to the review section and view pending submissions.',
          image: '/tutorials/pending-reviews.png'
        },
        {
          title: 'Detailed Review',
          content: 'Examine photos, AI predictions, and field worker details.',
          image: '/tutorials/detailed-review.png'
        },
        {
          title: 'Approval Process',
          content: 'Approve, reject, or flag submissions based on quality and accuracy.',
          image: '/tutorials/approval.png'
        },
        {
          title: 'Team Management',
          content: 'Monitor team performance and provide feedback to field workers.',
          image: '/tutorials/team-management.png'
        }
      ]
    },
    {
      id: 'offline-sync',
      title: 'Offline Mode and Data Sync',
      duration: '6 minutes',
      difficulty: 'Beginner',
      description: 'Learn how to work offline and sync data when connected',
      steps: [
        {
          title: 'Offline Indicators',
          content: 'Recognize when you\'re offline and what features are available.',
          image: '/tutorials/offline-indicator.png'
        },
        {
          title: 'Offline Data Entry',
          content: 'Continue registering animals and entering data without internet.',
          image: '/tutorials/offline-entry.png'
        },
        {
          title: 'Automatic Sync',
          content: 'Data automatically syncs when internet connection is restored.',
          image: '/tutorials/auto-sync.png'
        },
        {
          title: 'Sync Status',
          content: 'Monitor sync status and resolve any sync conflicts.',
          image: '/tutorials/sync-status.png'
        }
      ]
    }
  ]

  const videoTutorials = [
    {
      id: 'demo-registration',
      title: 'Complete Animal Registration Demo',
      duration: '15:30',
      thumbnail: '/videos/registration-demo.jpg',
      description: 'Watch a complete walkthrough of registering an animal from start to finish'
    },
    {
      id: 'photo-techniques',
      title: 'Professional Animal Photography',
      duration: '12:45',
      thumbnail: '/videos/photo-techniques.jpg',
      description: 'Learn professional techniques for capturing high-quality animal photos'
    },
    {
      id: 'ai-explained',
      title: 'Understanding AI Predictions',
      duration: '18:20',
      thumbnail: '/videos/ai-explained.jpg',
      description: 'Deep dive into how AI breed prediction works and how to interpret results'
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues and Solutions',
      duration: '10:15',
      thumbnail: '/videos/troubleshooting.jpg',
      description: 'Solutions to common problems and troubleshooting techniques'
    }
  ]

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const categories = [...new Set(faqs.map(faq => faq.category))]

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>❓ Help & Support</h1>
            <div className="row" style={{ gap: 8 }}>
              <button 
                className="btn" 
                onClick={() => window.open('mailto:support@breedai.com')}
              >
                📧 Contact Support
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="row" style={{ alignItems: 'center', gap: 12 }}>
              <input
                className="input"
                type="text"
                placeholder="Search help articles, FAQs, or tutorials..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn secondary">🔍 Search</button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="row" style={{ marginTop: 16, gap: 8 }}>
            <button 
              className={`btn ${activeTab === 'faq' ? '' : 'secondary'}`}
              onClick={() => setActiveTab('faq')}
            >
              📋 FAQs
            </button>
            <button 
              className={`btn ${activeTab === 'tutorials' ? '' : 'secondary'}`}
              onClick={() => setActiveTab('tutorials')}
            >
              📚 Tutorials
            </button>
            <button 
              className={`btn ${activeTab === 'videos' ? '' : 'secondary'}`}
              onClick={() => setActiveTab('videos')}
            >
              🎥 Video Guides
            </button>
            <button 
              className={`btn ${activeTab === 'contact' ? '' : 'secondary'}`}
              onClick={() => setActiveTab('contact')}
            >
              📞 Contact
            </button>
          </div>

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>Frequently Asked Questions</h2>
              
              {/* Category Filter */}
              <div className="row" style={{ gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <button 
                  className="btn secondary"
                  onClick={() => setSearchQuery('')}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    className="btn secondary"
                    onClick={() => setSearchQuery(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="stack" style={{ gap: 12 }}>
                {filteredFAQs.map(faq => (
                  <div key={faq.id} className="card" style={{ 
                    border: expandedFAQ === faq.id ? '2px solid var(--color-primary-green)' : '1px solid #e0e0e0',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-primary-blue)', fontWeight: '600' }}>
                          {faq.category}
                        </div>
                        <h4 style={{ margin: '4px 0' }}>{faq.question}</h4>
                      </div>
                      <div style={{ fontSize: '24px', color: 'var(--color-text-muted)' }}>
                        {expandedFAQ === faq.id ? '−' : '+'}
                      </div>
                    </div>
                    
                    {expandedFAQ === faq.id && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e0e0e0' }}>
                        <p style={{ marginBottom: 12 }}>{faq.answer}</p>
                        <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                          {faq.tags.map(tag => (
                            <span key={tag} className="badge" style={{ fontSize: '10px' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutorials Section */}
          {activeTab === 'tutorials' && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>Step-by-Step Tutorials</h2>
              
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {tutorials.map(tutorial => (
                  <div key={tutorial.id} className="card" style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedTutorial(tutorial)}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4>{tutorial.title}</h4>
                      <div className="badge" style={{ 
                        backgroundColor: tutorial.difficulty === 'Beginner' ? '#4CAF50' : 
                                        tutorial.difficulty === 'Intermediate' ? '#FF9800' : '#F44336'
                      }}>
                        {tutorial.difficulty}
                      </div>
                    </div>
                    
                    <p style={{ color: 'var(--color-text-muted)', margin: '8px 0' }}>
                      {tutorial.description}
                    </p>
                    
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        ⏱️ {tutorial.duration}
                      </span>
                      <button className="btn outline" style={{ fontSize: '12px' }}>
                        Start Tutorial →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tutorial Detail Modal */}
              {selectedTutorial && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div className="card" style={{ 
                    maxWidth: '600px', 
                    maxHeight: '80vh', 
                    overflow: 'auto',
                    margin: '20px'
                  }}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>{selectedTutorial.title}</h3>
                      <button 
                        className="btn secondary"
                        onClick={() => setSelectedTutorial(null)}
                      >
                        ✕ Close
                      </button>
                    </div>
                    
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
                      {selectedTutorial.description}
                    </p>
                    
                    <div className="stack" style={{ gap: 16 }}>
                      {selectedTutorial.steps.map((step, index) => (
                        <div key={index} className="card" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary-green)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h5 style={{ margin: '0 0 8px 0' }}>{step.title}</h5>
                              <p style={{ margin: 0, fontSize: '14px' }}>{step.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
                      <button className="btn" style={{ fontSize: '14px' }}>
                        🎯 Start This Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Guides Section */}
          {activeTab === 'videos' && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>Video Tutorials</h2>
              
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {videoTutorials.map(video => (
                  <div key={video.id} className="card" style={{ cursor: 'pointer' }}>
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      backgroundImage: `url(${video.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        ▶️
                      </div>
                    </div>
                    
                    <h4 style={{ marginBottom: 8 }}>{video.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: 12 }}>
                      {video.description}
                    </p>
                    
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        ⏱️ {video.duration}
                      </span>
                      <button className="btn outline" style={{ fontSize: '12px' }}>
                        Watch Video →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>Contact Support</h2>
              
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: 16 }}>📧</div>
                  <h4>Email Support</h4>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
                    Get detailed help via email
                  </p>
                  <button 
                    className="btn"
                    onClick={() => window.open('mailto:support@breedai.com')}
                  >
                    support@breedai.com
                  </button>
                </div>
                
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: 16 }}>📞</div>
                  <h4>Phone Support</h4>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
                    Call us for immediate assistance
                  </p>
                  <button 
                    className="btn"
                    onClick={() => window.open('tel:+91-800-123-4567')}
                  >
                    +91-800-123-4567
                  </button>
                </div>
                
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: 16 }}>💬</div>
                  <h4>Live Chat</h4>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
                    Chat with our support team
                  </p>
                  <button className="btn">Start Chat</button>
                </div>
              </div>
              
              <div className="card" style={{ marginTop: 16, backgroundColor: '#e3f2fd' }}>
                <h4>📋 Before Contacting Support</h4>
                <div className="stack" style={{ gap: 8 }}>
                  <div>• Check the FAQ section above</div>
                  <div>• Try restarting the app</div>
                  <div>• Clear app cache and data</div>
                  <div>• Update to the latest version</div>
                  <div>• Note down the exact error message</div>
                  <div>• Include your device model and OS version</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


