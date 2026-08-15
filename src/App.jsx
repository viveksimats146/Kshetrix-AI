// Kshetrix-AI Main Application Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Import Screens
import { SplashScreen, WelcomeScreen } from './screens/BasicScreens';
import { LoginScreen, SignupScreen, IntroScreen, OTPScreen } from './screens/Onboarding';
import { ProfileSetup, CropPreferences } from './screens/Profile';
import { MainDashboard } from './screens/Dashboard';
import { PredictionInput, PredictionLoading, PredictionResult } from './screens/Prediction';
import { AnalyticsDashboard, MarketMonitoring, ProfitLossAnalysis } from './screens/AdvancedFeatures';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { WeatherDashboard, GovtSchemes, SettingsScreen, AIChatbot } from './screens/UtilityScreens';
import { FarmerForum, ExpertQA, SuccessStories, MarketNewsFeed } from './screens/Community';
import { TransportFinder, ColdStorageFinder, InventoryManager, OrderTracking } from './screens/Logistics';
import { LoanApplication, ExpenseTracker, RevenueDashboard, InsuranceStatus } from './screens/Finance';
import { VideoTutorials, ArticleReader, CropCalendar, PestIdentification } from './screens/Education';
import { FAQScreen, ContactSupport, AboutKshetrixAI, LanguageSelection, PrivacyPolicy, TermsOfService } from './screens/Support';
import { CropDeepDive, MandiDetails, MarketComparison, PriceAlertSetup, UserActivityLog, ReferralProgram } from './screens/ExtendedFeatures';
import { translate } from './utils/translations';
import { supabase } from './services/supabaseClient';

export const WALLPAPERS = {
  none: '',
  forest: '/wallpapers/forest.jpg',
  ocean: '/wallpapers/ocean.jpg',
  mountains: '/wallpapers/mountains.jpg',
  sunset: '/wallpapers/sunset.jpg',
  meadow: '/wallpapers/meadow.jpg',
  aurora: '/wallpapers/aurora.jpg',
  blossoms: '/wallpapers/blossoms.jpg',
  tropical: '/wallpapers/tropical.jpg',
  ruby: '/wallpapers/ruby.jpg',
  jungle: '/wallpapers/jungle.jpg',
  autumn: '/wallpapers/autumn.jpg',
  custom: '/wallpapers/custom.jpg'
};

import { 
  Mail, Lock, Phone, ShieldCheck, ArrowRight, 
  ChevronLeft, Layout, TrendingUp, Info, User,
  Home, BarChart2, Leaf, Bell, Sparkles
} from 'lucide-react';

const resizeImage = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 150;
      const MAX_HEIGHT = 150;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [predictionResult, setPredictionResult] = useState(null);
  const [formData, setFormData] = useState({ state: 'Maharashtra', district: 'Nashik', commodity: 'Onion', date: new Date().toISOString().split('T')[0] });
  const [theme, setTheme] = useState(localStorage.getItem('agrico_theme') || 'classic');
  const [language, setLanguage] = useState(localStorage.getItem('agrico_lang') || 'English');
  const [profileName, setProfileName] = useState(localStorage.getItem('agrico_profile_name') || '');
  const [profileState, setProfileState] = useState(localStorage.getItem('agrico_profile_state') || '');
  const [profileDistrict, setProfileDistrict] = useState(localStorage.getItem('agrico_profile_district') || '');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [otpTargetScreen, setOtpTargetScreen] = useState('dashboard');
  const [otpBackScreen, setOtpBackScreen] = useState('login');
  const [cameFromOnboarding, setCameFromOnboarding] = useState(false);
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('agrico_profile_photo') || '');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [wallpaper, setWallpaper] = useState(localStorage.getItem('agrico_wallpaper') || 'none');
  const [customWallpaper, setCustomWallpaper] = useState(localStorage.getItem('agrico_custom_wallpaper') || '');

  useEffect(() => {
    localStorage.setItem('agrico_custom_wallpaper', customWallpaper);
  }, [customWallpaper]);

  useEffect(() => {
    localStorage.setItem('agrico_profile_photo', profilePhoto);
  }, [profilePhoto]);

  useEffect(() => {
    localStorage.setItem('agrico_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agrico_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('agrico_wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    if (wallpaper && wallpaper !== 'none') {
      const isDarkBackground = ['forest', 'ocean', 'mountains', 'sunset', 'aurora', 'ruby', 'jungle', 'autumn', 'custom'].includes(wallpaper);
      document.documentElement.style.setProperty('--white', isDarkBackground ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.85)');
      document.documentElement.style.setProperty('--off-white', 'transparent');
      document.documentElement.style.setProperty('--gray-light', isDarkBackground ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)');
      if (isDarkBackground) {
        document.documentElement.style.setProperty('--black', '#F8F9FA');
        document.documentElement.style.setProperty('--gray-dark', '#E9ECEF');
      } else {
        document.documentElement.style.setProperty('--black', '#1B4332');
        document.documentElement.style.setProperty('--gray-dark', '#495057');
      }
    } else {
      document.documentElement.style.removeProperty('--white');
      document.documentElement.style.removeProperty('--off-white');
      document.documentElement.style.removeProperty('--gray-light');
      document.documentElement.style.removeProperty('--black');
      document.documentElement.style.removeProperty('--gray-dark');
    }
  }, [wallpaper, theme]);

  // Load profile from database on mount
  useEffect(() => {
    const loadProfile = async () => {
      const profileId = localStorage.getItem('agrico_profile_id');
      if (!profileId) return;
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiBase}/get-profile?id=${profileId}`);
        if (!res.ok) throw new Error("Backend profile fetch failed");
        const data = await res.json();
        if (data && data.name) {
          setProfileName(data.name);
          setProfileState(data.state);
          setProfileDistrict(data.district);
          if (data.email) setSignupEmail(data.email);
          if (data.phone) setSignupPhone(data.phone);
          if (data.photo) setProfilePhoto(data.photo);
          return;
        }
      } catch (err) {
        console.warn("Failed to load profile from backend database, calling Supabase client fallback:", err.message);
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        if (error) throw error;
        if (data) {
          setProfileName(data.name);
          setProfileState(data.state);
          setProfileDistrict(data.district);
          if (data.photo) setProfilePhoto(data.photo);
        }
      } catch (err) {
        console.warn("Failed fallback loading profile from Supabase:", err.message);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('agrico_profile_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('agrico_profile_state', profileState);
  }, [profileState]);

  useEffect(() => {
    localStorage.setItem('agrico_profile_district', profileDistrict);
  }, [profileDistrict]);

  useEffect(() => {
    localStorage.setItem('agrico_profile_phone', signupPhone);
  }, [signupPhone]);

  useEffect(() => {
    localStorage.setItem('agrico_profile_email', signupEmail);
  }, [signupEmail]);

  const handleSaveProfile = async (targetScreen) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const profileId = localStorage.getItem('agrico_profile_id');
      const payload = {
        id: profileId || null,
        name: profileName,
        state: profileState,
        district: profileDistrict,
        email: signupEmail || (loginPhoneOrEmail.includes('@') ? loginPhoneOrEmail : ''),
        phone: signupPhone || (loginPhoneOrEmail.includes('@') ? '' : loginPhoneOrEmail),
        photo: profilePhoto || null
      };

      const res = await fetch(`${apiBase}/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success' && data.id) {
        localStorage.setItem('agrico_profile_id', data.id);
      }
    } catch (e) {
      console.warn("Failed saving profile to backend database, calling Supabase client as fallback:", e.message);
      try {
        const profileId = localStorage.getItem('agrico_profile_id');
        const payload = {
          name: profileName,
          state: profileState,
          district: profileDistrict,
          updated_at: new Date().toISOString()
        };

        if (profileId) {
          const { error } = await supabase
            .from('profiles')
            .update(payload)
            .eq('id', profileId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('profiles')
            .insert([payload])
            .select();
          if (error) throw error;
          if (data && data.length > 0) {
            localStorage.setItem('agrico_profile_id', data[0].id);
          }
        }
      } catch (err) {
        console.warn("Failed fallback saving profile to Supabase:", err.message);
      }
    }
    navigate(targetScreen);
  };

  const handlePhotoUpload = async (photoBase64) => {
    setProfilePhoto(photoBase64);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const profileId = localStorage.getItem('agrico_profile_id');
      const payload = {
        id: profileId || null,
        name: profileName,
        state: profileState,
        district: profileDistrict,
        email: signupEmail,
        phone: signupPhone,
        photo: photoBase64
      };
      const res = await fetch(`${apiBase}/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success' && data.id) {
        localStorage.setItem('agrico_profile_id', data.id);
      }
    } catch (e) {
      console.warn("Failed saving profile photo to DB:", e.message);
    }
  };

  const [screenHistory, setScreenHistory] = useState([localStorage.getItem('agrico_logged_in') === 'true' ? 'dashboard' : 'welcome']);

  const navigate = (screen) => {
    const tabScreens = ['dashboard', 'analytics', 'crops', 'alerts', 'profile'];
    if (tabScreens.includes(screen)) {
      setScreenHistory([screen]);
    } else {
      setScreenHistory(prev => [...prev, screen]);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handlePredict = (data) => {
    setPredictionResult(data);
    setFormData({ state: data.state, district: data.district, commodity: data.commodity, date: data.date });
    navigate('prediction-result');
  };

  const handlePredictionComplete = (result) => {
    setPredictionResult(result);
    if (result) {
      setFormData({ state: result.state || formData.state, district: result.district || formData.district, commodity: result.commodity || formData.commodity });
    }
    navigate('prediction-result');
  };

  const handleLoginNext = (screen, phoneOrEmail) => {
    if (screen === 'otp') {
      setOtpTargetScreen('profile-setup');
      setOtpBackScreen('login');
      setCameFromOnboarding(true);
      setLoginPhoneOrEmail(phoneOrEmail);
      navigate('otp');
    } else {
      navigate(screen);
    }
  };

  const handleSignupNext = (screen) => {
    if (screen === 'otp') {
      setOtpTargetScreen('profile-setup');
      setOtpBackScreen('signup');
      setCameFromOnboarding(true);
      navigate('otp');
    } else {
      navigate(screen);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen onNext={() => navigate(localStorage.getItem('agrico_logged_in') === 'true' ? 'dashboard' : 'login')} />;
      case 'welcome': return <WelcomeScreen onNext={() => navigate('intro1')} onLogin={() => navigate('login')} onBack={() => navigate('splash')} />;
      
      // Onboarding
      case 'intro1': return <IntroScreen step={1} onNext={() => navigate('intro2')} onBack={() => navigate('welcome')} />;
      case 'intro2': return <IntroScreen step={2} onNext={() => navigate('intro3')} onBack={() => navigate('intro1')} />;
      case 'intro3': return <IntroScreen step={3} onNext={() => navigate('profile-setup')} onBack={() => navigate('intro2')} />;
      case 'login': return <LoginScreen onNext={handleLoginNext} onSignup={() => navigate('signup')} onBack={() => navigate('splash')} />;
      case 'signup': return (
        <SignupScreen 
          onNext={handleSignupNext} 
          onBack={() => navigate('login')} 
          profileName={profileName} 
          setProfileName={setProfileName} 
          signupPhone={signupPhone} 
          setSignupPhone={setSignupPhone} 
          signupEmail={signupEmail} 
          setSignupEmail={setSignupEmail} 
        />
      );
      case 'otp': return (
        <OTPScreen 
          onVerify={() => {
            localStorage.setItem('agrico_logged_in', 'true');
            navigate(otpTargetScreen);
          }} 
          onBack={() => navigate(otpBackScreen)} 
          phone={otpBackScreen === 'login' ? loginPhoneOrEmail : signupPhone} 
          email={otpBackScreen === 'login' ? '' : signupEmail} 
        />
      );
      
      // Profile Setup
      case 'profile-setup': return <ProfileSetup onNext={() => handleSaveProfile('crop-prefs')} onBack={() => navigate(otpBackScreen === 'login' ? 'welcome' : 'intro3')} profileName={profileName} setProfileName={setProfileName} profileState={profileState} setProfileState={setProfileState} profileDistrict={profileDistrict} setProfileDistrict={setProfileDistrict} currentLang={language} />;
      case 'edit-profile': return <ProfileSetup onNext={() => handleSaveProfile('profile')} onBack={goBack} profileName={profileName} setProfileName={setProfileName} profileState={profileState} setProfileState={setProfileState} profileDistrict={profileDistrict} setProfileDistrict={setProfileDistrict} currentLang={language} />;
      case 'crop-prefs': return <CropPreferences onNext={() => navigate('dashboard')} onBack={() => navigate('profile-setup')} />;
      
      // Dashboard & Intelligence
      case 'dashboard': return <MainDashboard onNav={(id) => navigate(id)} onBack={cameFromOnboarding ? () => navigate('crop-prefs') : null} profileName={profileName} currentLang={language} selectedCrop={formData.commodity} />;
      case 'analytics': return <AnalyticsDashboard onBack={goBack} selectedCrop={formData.commodity} />;
      case 'market-monitor': return <MarketMonitoring onBack={goBack} />;
      case 'profit-loss': return <ProfitLossAnalysis onBack={goBack} predictionResult={predictionResult} selectedCrop={formData.commodity} />;
      
      // Prediction Flow
      case 'crops':
      case 'prediction-input': return <PredictionInput onPredict={handlePredict} onBack={goBack} currentLang={language} formData={formData} setFormData={setFormData} />;
      case 'prediction-loading': return <PredictionLoading formData={predictionResult} currentLang={language} onComplete={(res) => {
        setPredictionResult(prev => ({ ...prev, result: res }));
        navigate('prediction-result');
      }} />;
      case 'prediction-result': return <PredictionResult result={predictionResult} onBack={goBack} onDetails={() => navigate('profit-loss')} currentLang={language} />;
      
      // Utilities
      case 'schemes': return <GovtSchemes onBack={goBack} />;
      case 'settings': return <SettingsScreen onBack={goBack} theme={theme} setTheme={setTheme} wallpaper={wallpaper} setWallpaper={setWallpaper} customWallpaper={customWallpaper} setCustomWallpaper={setCustomWallpaper} onNavigate={navigate} language={language} />;
      case 'chatbot': return <AIChatbot onBack={goBack} currentLang={language} />;
      case 'alerts': return <WeatherDashboard onBack={goBack} state={formData.state} district={formData.district} commodity={formData.commodity} date={formData.date} />;
      
      // Community
      case 'forum': return <FarmerForum onBack={goBack} />;
      case 'expert-qa': return <ExpertQA onBack={goBack} />;
      case 'stories': return <SuccessStories onBack={goBack} />;
      case 'news': return <MarketNewsFeed onBack={goBack} />;
      
      // Logistics
      case 'transport': return <TransportFinder onBack={goBack} />;
      case 'storage': return <ColdStorageFinder onBack={goBack} />;
      case 'inventory': return <InventoryManager onBack={goBack} />;
      case 'tracking': return <OrderTracking onBack={goBack} />;
      
      // Finance
      case 'loans': return <LoanApplication onBack={goBack} />;
      case 'expenses': return <ExpenseTracker onBack={goBack} />;
      case 'revenue': return <RevenueDashboard onBack={goBack} />;
      case 'insurance': return <InsuranceStatus onBack={goBack} />;
      
      // Education
      case 'videos': return <VideoTutorials onBack={goBack} />;
      case 'articles': return <ArticleReader onBack={goBack} />;
      case 'calendar': return <CropCalendar onBack={goBack} />;
      case 'pests': return <PestIdentification onBack={goBack} />;
      
      // Support
      case 'faq': return <FAQScreen onBack={goBack} />;
      case 'support': return <ContactSupport onBack={goBack} />;
      case 'about': return <AboutKshetrixAI onBack={goBack} />;
      case 'language': return <LanguageSelection onBack={goBack} currentLang={language} onChangeLang={setLanguage} />;
      case 'privacy': return <PrivacyPolicy onBack={goBack} />;
      case 'terms': return <TermsOfService onBack={goBack} />;
      
      // Extended Features
      case 'crop-detail': return <CropDeepDive onBack={goBack} commodity={formData.commodity} state={formData.state} district={formData.district} />;
      case 'mandi-detail': return <MandiDetails onBack={goBack} defaultState={profileState || 'Maharashtra'} defaultDistrict={profileDistrict || 'Nashik'} />;
      case 'compare': return <MarketComparison onBack={goBack} />;
      case 'alert-setup': return <PriceAlertSetup onBack={goBack} defaultState={formData.state || 'Maharashtra'} defaultDistrict={formData.district || 'Nashik'} />;
      case 'notification-settings': return <PriceAlertSetup onBack={goBack} defaultState={formData.state || 'Maharashtra'} defaultDistrict={formData.district || 'Nashik'} />;
      case 'activity': return <UserActivityLog onBack={goBack} />;
      case 'referral': return <ReferralProgram onBack={goBack} />;
      
      case 'profile': {
        const handleFileChange = (e) => {
          const file = e.target.files[0];
          if (file) {
            resizeImage(file, (resizedBase64) => {
              handlePhotoUpload(resizedBase64);
            });
          }
        };

        return (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Hidden file inputs for camera and gallery */}
            <input 
              type="file" 
              accept="image/*" 
              capture="user" 
              id="cameraInput" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            <input 
              type="file" 
              accept="image/*" 
              id="galleryInput" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />

            <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={goBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h2 style={{ fontSize: '18px' }}>My Profile</h2>
            </div>
            <div style={{ flex: 1, padding: '20px', textAlign: 'center', position: 'relative' }}>
              <div 
                onClick={() => setShowPhotoModal(true)} 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '45px', 
                  background: 'var(--primary-pale)', 
                  margin: '0 auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '32px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-md)'
                }}
                title="Change Profile Photo"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Farmer Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>👤</span>
                )}
                {/* Upload overlay indicator */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '24px',
                  background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700'
                }}>
                  EDIT
                </div>
              </div>
              
              <h2 style={{ marginTop: '15px' }}>{profileName || 'Farmer Profile'}</h2>
              <p style={{ color: 'var(--gray-medium)' }}>{profileDistrict && profileState ? `${profileDistrict}, ${profileState}` : 'Register details to complete setup'}</p>
              <div style={{ marginTop: '30px', textAlign: 'left' }}>
                <div className="card" onClick={() => navigate('edit-profile')}>{translate('accountDetails', language)}</div>
                <div className="card" onClick={() => navigate('schemes')}>{translate('pmKisan', language)}</div>
                <div className="card" onClick={() => navigate('settings')}>{translate('settings', language)}</div>
                <div className="card" onClick={() => { localStorage.removeItem('agrico_logged_in'); setCameFromOnboarding(false); navigate('welcome'); }} style={{ color: 'var(--error)' }}>Logout</div>
              </div>
            </div>

            {/* Upload Modal Bottom-Sheet */}
            {showPhotoModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex',
                alignItems: 'flex-end', justifyContent: 'center'
              }} onClick={() => setShowPhotoModal(false)}>
                <div style={{
                  width: '100%', maxWidth: '450px', background: 'var(--white)',
                  borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                  padding: '25px 20px', display: 'flex', flexDirection: 'column',
                  gap: '15px', pointerEvents: 'auto',
                  boxShadow: '0 -8px 24px rgba(0,0,0,0.15)'
                }} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--black)', textAlign: 'center', marginBottom: '5px' }}>Upload Profile Photo</h3>
                  
                  <button onClick={() => {
                    setShowPhotoModal(false);
                    document.getElementById('cameraInput').click();
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                    borderRadius: '12px', background: 'var(--gray-light)', border: 'none',
                    fontSize: '15px', fontWeight: '600', color: 'var(--black)', cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    📸 Take Photo using Camera
                  </button>

                  <button onClick={() => {
                    setShowPhotoModal(false);
                    document.getElementById('galleryInput').click();
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                    borderRadius: '12px', background: 'var(--gray-light)', border: 'none',
                    fontSize: '15px', fontWeight: '600', color: 'var(--black)', cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    🖼️ Choose from Gallery
                  </button>

                  {profilePhoto && (
                    <button onClick={() => {
                      setShowPhotoModal(false);
                      handlePhotoUpload('');
                    }} style={{
                      display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                      borderRadius: '12px', background: 'rgba(255, 75, 75, 0.1)', border: 'none',
                      fontSize: '15px', fontWeight: '600', color: 'var(--error)', cursor: 'pointer',
                      textAlign: 'left'
                    }}>
                      🗑️ Remove Photo
                    </button>
                  )}

                  <button onClick={() => setShowPhotoModal(false)} style={{
                    padding: '15px', borderRadius: '12px', background: 'none', border: '1px solid var(--gray-light)',
                    fontSize: '15px', fontWeight: '600', color: 'var(--gray-medium)', cursor: 'pointer',
                    marginTop: '10px'
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }

      default: return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('dashboard')} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 style={{ fontSize: '18px' }}>Optimization</h2>
          </div>
          <div style={{ flex: 1, padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px' }}>🚧</div>
            <h2 style={{ marginTop: '20px' }}>Screen: {currentScreen}</h2>
            <p style={{ color: 'var(--gray-medium)', margin: '10px 0 30px' }}>Module Optimization in Progress.</p>
            <button onClick={() => navigate('dashboard')} className="btn-primary">Return to Dashboard</button>
          </div>
        </div>
      );
    }
  };

  const GlobalBottomNav = () => {
    const mainScreens = ['dashboard', 'analytics', 'crops', 'alerts', 'profile'];
    if (!mainScreens.includes(currentScreen) && currentScreen !== 'prediction-input') return null;

    const activeTab = currentScreen === 'prediction-input' ? 'crops' : currentScreen;

    return (
      <div style={{ 
        position: 'absolute', bottom: 0, width: '100%', background: 'var(--white)', 
        backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-around', 
        padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 15px))', 
        borderTop: '1px solid var(--gray-light)', zIndex: 1000,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
        pointerEvents: 'auto'
      }}>
        {[
          { id: 'dashboard', icon: <Home />, label: translate('home', language) },
          { id: 'analytics', icon: <BarChart2 />, label: translate('market', language) },
          { id: 'crops', icon: <Leaf />, label: translate('crops', language) },
          { id: 'alerts', icon: <Bell />, label: translate('alerts', language) },
          { id: 'profile', icon: <User />, label: translate('profile', language) }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => navigate(item.id)}
            style={{ 
              background: 'none', border: 'none', color: activeTab === item.id ? 'var(--primary)' : 'var(--gray-medium)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px', fontSize: '10px', cursor: 'pointer', flex: 1, height: '60px', padding: '0'
            }}
          >
            <div style={{ pointerEvents: 'none' }}>{item.icon}</div>
            <span style={{ fontWeight: activeTab === item.id ? '700' : '500', pointerEvents: 'none' }}>{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const nonLoggedScreens = [
    'splash', 'welcome', 'login', 'signup', 'otp', 
    'intro1', 'intro2', 'intro3', 'profile-setup', 'crop-prefs',
    'dashboard', 'chatbot', 'prediction-loading'
  ];
  const showGlobalAiButton = !nonLoggedScreens.includes(currentScreen);

  return (
    <div className="mobile-container" data-theme={theme} style={{
      backgroundImage: wallpaper !== 'none' ? `url(${WALLPAPERS[wallpaper]})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: wallpaper === 'none' ? 'var(--off-white)' : 'transparent',
      color: 'var(--black)',
      transition: 'background 0.5s ease',
      position: 'relative'
    }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <GlobalBottomNav />

      {showGlobalAiButton && (
        <button 
          onClick={() => navigate('chatbot')} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1010,
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: currentScreen === 'prediction-result' ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, var(--primary-pale), #D8F3DC)',
            color: currentScreen === 'prediction-result' ? 'white' : 'var(--primary)',
            border: currentScreen === 'prediction-result' ? 'none' : '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: currentScreen === 'prediction-result' ? 'none' : '0 4px 12px rgba(45, 106, 79, 0.15)',
            cursor: 'pointer',
            padding: 0
          }}
          title={translate('aiAssistant', language)}
        >
          <Sparkles size={20} />
        </button>
      )}
    </div>
  );
}
