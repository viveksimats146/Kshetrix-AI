// Speech Helper to map App Languages to standard Speech Recognition Language Tags
export const getSpeechLanguageCode = (lang = 'English') => {
  const mapping = {
    'English': 'en-IN',
    'हिंदी': 'hi-IN',
    'తెలుగు': 'te-IN',
    'मराठी': 'mr-IN',
    'தமிழ்': 'ta-IN',
    'ಕన్నడ': 'kn-IN',
    'മലയാളം': 'ml-IN',
    'ਪੰਜਾਬੀ': 'pa-IN',
    'ଓଡ଼ିଆ': 'or-IN',
    'ગુજરાતી': 'gu-IN',
    'বাংলা': 'bn-IN'
  };
  return mapping[lang] || 'en-IN';
};
