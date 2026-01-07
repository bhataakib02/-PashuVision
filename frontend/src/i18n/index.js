import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.records': 'Records',
      'nav.new': 'New Record',
      'nav.profile': 'Profile',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      'nav.review': 'Review',
      'nav.scan': 'Scan',
      'nav.schemes': 'Schemes',
      'nav.analytics': 'Analytics',
      'nav.notifications': 'Notifications',
      'nav.bulk': 'Bulk Operations',
      'nav.realtime': 'Real-time',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.export': 'Export',
      'common.import': 'Import',

      // Login/Register
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.name': 'Name',
      'auth.role': 'Role',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.createAccount': 'Create Account',
      'auth.loginWithOTP': 'Login with OTP',
      'auth.requestOTP': 'Request OTP',
      'auth.verifyOTP': 'Verify OTP',
      'auth.otpCode': 'OTP Code',

      // Animal Records
      'animal.breed': 'Breed',
      'animal.owner': 'Owner Name',
      'animal.location': 'Location',
      'animal.age': 'Age (Months)',
      'animal.gender': 'Gender',
      'animal.status': 'Status',
      'animal.notes': 'Notes',
      'animal.images': 'Images',
      'animal.gps': 'GPS Location',
      'animal.capturedAt': 'Captured At',
      'animal.createdAt': 'Created At',
      'animal.pending': 'Pending',
      'animal.approved': 'Approved',
      'animal.rejected': 'Rejected',
      'animal.male': 'Male',
      'animal.female': 'Female',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.totalAnimals': 'Total Animals',
      'dashboard.pending': 'Pending',
      'dashboard.approved': 'Approved',
      'dashboard.rejected': 'Rejected',
      'dashboard.breedDistribution': 'Breed Distribution',

      // Notifications
      'notifications.title': 'Notifications & Reminders',
      'notifications.noNotifications': 'No notifications yet. Reminders are generated automatically based on animal records.',
      'notifications.vaccination': 'Vaccination',
      'notifications.health': 'Health Check',
      'notifications.pregnancy': 'Pregnancy Care',
      'notifications.high': 'High',
      'notifications.medium': 'Medium',
      'notifications.low': 'Low',
      'notifications.markRead': 'Mark Read',

      // Bulk Operations
      'bulk.title': 'Bulk Operations',
      'bulk.import': 'Import Animals',
      'bulk.export': 'Export Animals',
      'bulk.template': 'Download Template',
      'bulk.instructions': 'Instructions',
      'bulk.importDesc': 'Upload an Excel file to import multiple animal records at once.',
      'bulk.exportDesc': 'Download all animal records as an Excel file for backup or analysis.',

      // Analytics
      'analytics.title': 'Advanced Analytics Dashboard',
      'analytics.breedDistribution': 'Breed Distribution',
      'analytics.statusDistribution': 'Status Distribution',
      'analytics.monthlyActivity': 'Monthly Activity Trend',
      'analytics.ageDistribution': 'Age Group Distribution',
      'analytics.summaryStats': 'Summary Statistics',
      'analytics.topBreeds': 'Top Breeds',

      // Real-time
      'realtime.title': 'Real-time Updates',
      'realtime.connected': 'Connected',
      'realtime.disconnected': 'Disconnected',
      'realtime.waiting': 'Waiting for real-time updates...',
      'realtime.createApproveReject': 'Create, approve, or reject animals to see live updates'
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.dashboard': 'डैशबोर्ड',
      'nav.records': 'रिकॉर्ड',
      'nav.new': 'नया रिकॉर्ड',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.login': 'लॉगिन',
      'nav.logout': 'लॉगआउट',
      'nav.review': 'समीक्षा',
      'nav.map': 'मानचित्र',
      'nav.scan': 'स्कैन',
      'nav.schemes': 'योजनाएं',
      'nav.analytics': 'विश्लेषण',
      'nav.notifications': 'सूचनाएं',
      'nav.bulk': 'बल्क ऑपरेशन',
      'nav.realtime': 'रियल-टाइम',

      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.save': 'सेव',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएं',
      'common.edit': 'संपादित करें',
      'common.view': 'देखें',
      'common.search': 'खोजें',
      'common.filter': 'फिल्टर',
      'common.export': 'निर्यात',
      'common.import': 'आयात',

      // Login/Register
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.login': 'लॉगिन',
      'auth.register': 'रजिस्टर',
      'auth.name': 'नाम',
      'auth.role': 'भूमिका',
      'auth.forgotPassword': 'पासवर्ड भूल गए?',
      'auth.createAccount': 'खाता बनाएं',
      'auth.loginWithOTP': 'OTP से लॉगिन',
      'auth.requestOTP': 'OTP अनुरोध',
      'auth.verifyOTP': 'OTP सत्यापन',
      'auth.otpCode': 'OTP कोड',

      // Animal Records
      'animal.breed': 'नस्ल',
      'animal.owner': 'मालिक का नाम',
      'animal.location': 'स्थान',
      'animal.age': 'आयु (महीने)',
      'animal.gender': 'लिंग',
      'animal.status': 'स्थिति',
      'animal.notes': 'नोट्स',
      'animal.images': 'छवियां',
      'animal.gps': 'GPS स्थान',
      'animal.capturedAt': 'कैप्चर समय',
      'animal.createdAt': 'बनाया गया',
      'animal.pending': 'लंबित',
      'animal.approved': 'अनुमोदित',
      'animal.rejected': 'अस्वीकृत',
      'animal.male': 'नर',
      'animal.female': 'मादा',

      // Dashboard
      'dashboard.title': 'डैशबोर्ड',
      'dashboard.totalAnimals': 'कुल पशु',
      'dashboard.pending': 'लंबित',
      'dashboard.approved': 'अनुमोदित',
      'dashboard.rejected': 'अस्वीकृत',
      'dashboard.breedDistribution': 'नस्ल वितरण',

      // Notifications
      'notifications.title': 'सूचनाएं और अनुस्मारक',
      'notifications.noNotifications': 'अभी तक कोई सूचना नहीं। पशु रिकॉर्ड के आधार पर अनुस्मारक स्वचालित रूप से उत्पन्न होते हैं।',
      'notifications.vaccination': 'टीकाकरण',
      'notifications.health': 'स्वास्थ्य जांच',
      'notifications.pregnancy': 'गर्भावस्था देखभाल',
      'notifications.high': 'उच्च',
      'notifications.medium': 'मध्यम',
      'notifications.low': 'कम',
      'notifications.markRead': 'पढ़ा गया मार्क करें',

      // Bulk Operations
      'bulk.title': 'बल्क ऑपरेशन',
      'bulk.import': 'पशु आयात',
      'bulk.export': 'पशु निर्यात',
      'bulk.template': 'टेम्प्लेट डाउनलोड',
      'bulk.instructions': 'निर्देश',
      'bulk.importDesc': 'एक साथ कई पशु रिकॉर्ड आयात करने के लिए एक्सेल फाइल अपलोड करें।',
      'bulk.exportDesc': 'बैकअप या विश्लेषण के लिए सभी पशु रिकॉर्ड को एक्सेल फाइल के रूप में डाउनलोड करें।',

      // Analytics
      'analytics.title': 'उन्नत विश्लेषण डैशबोर्ड',
      'analytics.breedDistribution': 'नस्ल वितरण',
      'analytics.statusDistribution': 'स्थिति वितरण',
      'analytics.monthlyActivity': 'मासिक गतिविधि प्रवृत्ति',
      'analytics.ageDistribution': 'आयु समूह वितरण',
      'analytics.summaryStats': 'सारांश आंकड़े',
      'analytics.topBreeds': 'शीर्ष नस्लें',

      // Real-time
      'realtime.title': 'रियल-टाइम अपडेट',
      'realtime.connected': 'जुड़ा हुआ',
      'realtime.disconnected': 'डिस्कनेक्ट',
      'realtime.waiting': 'रियल-टाइम अपडेट की प्रतीक्षा...',
      'realtime.createApproveReject': 'लाइव अपडेट देखने के लिए पशु बनाएं, अनुमोदित करें या अस्वीकार करें'
    }
  },
  ur: {
    translation: {
      // Navigation
      'nav.dashboard': 'ڈیش بورڈ',
      'nav.records': 'ریکارڈز',
      'nav.new': 'نیا ریکارڈ',
      'nav.profile': 'پروفائل',
      'nav.login': 'لاگ ان',
      'nav.logout': 'لاگ آؤٹ',
      'nav.review': 'جائزہ',
      'nav.map': 'نقشہ',
      'nav.scan': 'سکین',
      'nav.schemes': 'اسکیمیں',
      'nav.analytics': 'تجزیات',
      'nav.notifications': 'اطلاعات',
      'nav.bulk': 'بلک آپریشنز',
      'nav.realtime': 'ریئل ٹائم',

      // Common
      'common.loading': 'لوڈ ہو رہا ہے...',
      'common.error': 'خرابی',
      'common.success': 'کامیابی',
      'common.save': 'محفوظ کریں',
      'common.cancel': 'منسوخ کریں',
      'common.delete': 'حذف کریں',
      'common.edit': 'ترمیم کریں',
      'common.view': 'دیکھیں',
      'common.search': 'تلاش کریں',
      'common.filter': 'فلٹر',
      'common.export': 'ایکسپورٹ',
      'common.import': 'امپورٹ',

      // Login/Register
      'auth.email': 'ای میل',
      'auth.password': 'پاس ورڈ',
      'auth.login': 'لاگ ان',
      'auth.register': 'رجسٹر',
      'auth.name': 'نام',
      'auth.role': 'کردار',
      'auth.forgotPassword': 'پاس ورڈ بھول گئے؟',
      'auth.createAccount': 'اکاؤنٹ بنائیں',
      'auth.loginWithOTP': 'OTP سے لاگ ان',
      'auth.requestOTP': 'OTP درخواست',
      'auth.verifyOTP': 'OTP تصدیق',
      'auth.otpCode': 'OTP کوڈ',

      // Animal Records
      'animal.breed': 'نسل',
      'animal.owner': 'مالک کا نام',
      'animal.location': 'مقام',
      'animal.age': 'عمر (مہینے)',
      'animal.gender': 'جنس',
      'animal.status': 'حالت',
      'animal.notes': 'نوٹس',
      'animal.images': 'تصاویر',
      'animal.gps': 'GPS مقام',
      'animal.capturedAt': 'کیپچر وقت',
      'animal.createdAt': 'بنایا گیا',
      'animal.pending': 'زیر التواء',
      'animal.approved': 'منظور شدہ',
      'animal.rejected': 'مسترد',
      'animal.male': 'نر',
      'animal.female': 'مادہ',

      // Dashboard
      'dashboard.title': 'ڈیش بورڈ',
      'dashboard.totalAnimals': 'کل جانور',
      'dashboard.pending': 'زیر التواء',
      'dashboard.approved': 'منظور شدہ',
      'dashboard.rejected': 'مسترد',
      'dashboard.breedDistribution': 'نسل کی تقسیم',

      // Notifications
      'notifications.title': 'اطلاعات اور یاد دہانیاں',
      'notifications.noNotifications': 'ابھی تک کوئی اطلاع نہیں۔ جانوروں کے ریکارڈ کی بنیاد پر یاد دہانیاں خودکار طور پر پیدا ہوتی ہیں۔',
      'notifications.vaccination': 'ٹیکہ کاری',
      'notifications.health': 'صحت کی جانچ',
      'notifications.pregnancy': 'حمل کی دیکھ بھال',
      'notifications.high': 'زیادہ',
      'notifications.medium': 'درمیانی',
      'notifications.low': 'کم',
      'notifications.markRead': 'پڑھا ہوا مارک کریں',

      // Bulk Operations
      'bulk.title': 'بلک آپریشنز',
      'bulk.import': 'جانور امپورٹ',
      'bulk.export': 'جانور ایکسپورٹ',
      'bulk.template': 'ٹیمپلیٹ ڈاؤن لوڈ',
      'bulk.instructions': 'ہدایات',
      'bulk.importDesc': 'ایک ساتھ کئی جانوروں کے ریکارڈ امپورٹ کرنے کے لیے ایکسل فائل اپ لوڈ کریں۔',
      'bulk.exportDesc': 'بیک اپ یا تجزیہ کے لیے تمام جانوروں کے ریکارڈ کو ایکسل فائل کے طور پر ڈاؤن لوڈ کریں۔',

      // Analytics
      'analytics.title': 'اعلی درجے کا تجزیاتی ڈیش بورڈ',
      'analytics.breedDistribution': 'نسل کی تقسیم',
      'analytics.statusDistribution': 'حالت کی تقسیم',
      'analytics.monthlyActivity': 'ماہانہ سرگرمی کا رجحان',
      'analytics.ageDistribution': 'عمر گروپ کی تقسیم',
      'analytics.summaryStats': 'خلاصہ اعداد و شمار',
      'analytics.topBreeds': 'اوپر کی نسلیں',

      // Real-time
      'realtime.title': 'ریئل ٹائم اپڈیٹس',
      'realtime.connected': 'جڑا ہوا',
      'realtime.disconnected': 'منقطع',
      'realtime.waiting': 'ریئل ٹائم اپڈیٹس کا انتظار...',
      'realtime.createApproveReject': 'لائیو اپڈیٹس دیکھنے کے لیے جانور بنائیں، منظور کریں یا مسترد کریں'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
