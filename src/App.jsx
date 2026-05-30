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

import { 
  Mail, Lock, Phone, ShieldCheck, ArrowRight, 
  ChevronLeft, Layout, TrendingUp, Info, User,
  Home, BarChart2, Leaf, Bell
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [predictionResult, setPredictionResult] = useState(null);
  const [formData, setFormData] = useState({ state: 'Maharashtra', district: 'Nashik', commodity: 'Onion' });
  const [theme, setTheme] = useState(localStorage.getItem('agrico_theme') || 'green');
  const [language, setLanguage] = useState(localStorage.getItem('agrico_lang') || 'English');
  const [profileName, setProfileName] = useState(localStorage.getItem('agrico_profile_name') || 'Ramesh Kumar');
  const [profileState, setProfileState] = useState(localStorage.getItem('agrico_profile_state') || 'Maharashtra');
  const [profileDistrict, setProfileDistrict] = useState(localStorage.getItem('agrico_profile_district') || 'Nashik');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  useEffect(() => {
    localStorage.setItem('agrico_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agrico_lang', language);
  }, [language]);

  // Load profile from Supabase on mount
  useEffect(() => {
    const loadProfile = async () => {
      const profileId = localStorage.getItem('agrico_profile_id');
      if (!profileId) return;
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
        }
      } catch (err) {
        console.warn("Failed to load profile from Supabase:", err.message);
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

  const handleSaveProfile = async (targetScreen) => {
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
    } catch (e) {
      console.warn("Failed saving profile to Supabase, continuing locally:", e.message);
    }
    navigate(targetScreen);
  };

  const navigate = (screen) => setCurrentScreen(screen);

  const handlePredict = (data) => {
    setPredictionResult(data);
    setFormData({ state: data.state, district: data.district, commodity: data.commodity });
    navigate('prediction-result');
  };

  const handlePredictionComplete = (result) => {
    setPredictionResult(result);
    if (result) {
      setFormData({ state: result.state || formData.state, district: result.district || formData.district, commodity: result.commodity || formData.commodity });
    }
    navigate('prediction-result');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen onNext={() => navigate('welcome')} />;
      case 'welcome': return <WelcomeScreen onNext={() => navigate('intro1')} onLogin={() => navigate('login')} onBack={() => navigate('splash')} />;
      
      // Onboarding
      case 'intro1': return <IntroScreen step={1} onNext={() => navigate('intro2')} onBack={() => navigate('welcome')} />;
      case 'intro2': return <IntroScreen step={2} onNext={() => navigate('intro3')} onBack={() => navigate('intro1')} />;
      case 'intro3': return <IntroScreen step={3} onNext={() => navigate('profile-setup')} onBack={() => navigate('intro2')} />;
      case 'login': return <LoginScreen onNext={(s) => navigate(s)} onSignup={() => navigate('signup')} onBack={() => navigate('welcome')} />;
      case 'signup': return (
        <SignupScreen 
          onNext={(s) => navigate(s)} 
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
          onVerify={() => navigate('profile-setup')} 
          onBack={() => navigate('signup')} 
          phone={signupPhone} 
          email={signupEmail} 
        />
      );
      
      // Profile Setup
      case 'profile-setup': return <ProfileSetup onNext={() => handleSaveProfile('crop-prefs')} onBack={() => navigate('intro3')} profileName={profileName} setProfileName={setProfileName} profileState={profileState} setProfileState={setProfileState} profileDistrict={profileDistrict} setProfileDistrict={setProfileDistrict} currentLang={language} />;
      case 'edit-profile': return <ProfileSetup onNext={() => handleSaveProfile('settings')} onBack={() => navigate('settings')} profileName={profileName} setProfileName={setProfileName} profileState={profileState} setProfileState={setProfileState} profileDistrict={profileDistrict} setProfileDistrict={setProfileDistrict} currentLang={language} />;
      case 'crop-prefs': return <CropPreferences onNext={() => navigate('dashboard')} onBack={() => navigate('profile-setup')} />;
      
      // Dashboard & Intelligence
      case 'dashboard': return <MainDashboard onNav={(id) => navigate(id)} onBack={() => navigate('login')} profileName={profileName} currentLang={language} selectedCrop={formData.commodity} />;
      case 'analytics': return <AnalyticsDashboard onBack={() => navigate('dashboard')} />;
      case 'market-monitor': return <MarketMonitoring onBack={() => navigate('dashboard')} />;
      case 'profit-loss': return <ProfitLossAnalysis onBack={() => navigate('dashboard')} />;
      
      // Prediction Flow
      case 'crops':
      case 'prediction-input': return <PredictionInput onPredict={handlePredict} onBack={() => navigate('dashboard')} currentLang={language} />;
      case 'prediction-loading': return <PredictionLoading formData={predictionResult} onComplete={(res) => {
        setPredictionResult(prev => ({ ...prev, result: res }));
        navigate('prediction-result');
      }} />;
      case 'prediction-result': return <PredictionResult result={predictionResult?.result} onBack={() => navigate('prediction-input')} onDetails={() => navigate('profit-loss')} currentLang={language} />;
      
      // Utilities
      case 'schemes': return <GovtSchemes onBack={() => navigate('dashboard')} />;
      case 'settings': return <SettingsScreen onBack={() => navigate('profile')} theme={theme} setTheme={setTheme} onNavigate={navigate} language={language} />;
      case 'chatbot': return <AIChatbot onBack={() => navigate('dashboard')} />;
      case 'alerts': return <WeatherDashboard onBack={() => navigate('dashboard')} state={formData.state} district={formData.district} commodity={formData.commodity} />;
      
      // Community
      case 'forum': return <FarmerForum onBack={() => navigate('dashboard')} />;
      case 'expert-qa': return <ExpertQA onBack={() => navigate('dashboard')} />;
      case 'stories': return <SuccessStories onBack={() => navigate('dashboard')} />;
      case 'news': return <MarketNewsFeed onBack={() => navigate('dashboard')} />;
      
      // Logistics
      case 'transport': return <TransportFinder onBack={() => navigate('dashboard')} />;
      case 'storage': return <ColdStorageFinder onBack={() => navigate('dashboard')} />;
      case 'inventory': return <InventoryManager onBack={() => navigate('dashboard')} />;
      case 'tracking': return <OrderTracking onBack={() => navigate('dashboard')} />;
      
      // Finance
      case 'loans': return <LoanApplication onBack={() => navigate('dashboard')} />;
      case 'expenses': return <ExpenseTracker onBack={() => navigate('dashboard')} />;
      case 'revenue': return <RevenueDashboard onBack={() => navigate('dashboard')} />;
      case 'insurance': return <InsuranceStatus onBack={() => navigate('dashboard')} />;
      
      // Education
      case 'videos': return <VideoTutorials onBack={() => navigate('dashboard')} />;
      case 'articles': return <ArticleReader onBack={() => navigate('dashboard')} />;
      case 'calendar': return <CropCalendar onBack={() => navigate('dashboard')} />;
      case 'pests': return <PestIdentification onBack={() => navigate('dashboard')} />;
      
      // Support
      case 'faq': return <FAQScreen onBack={() => navigate('settings')} />;
      case 'support': return <ContactSupport onBack={() => navigate('settings')} />;
      case 'about': return <AboutKshetrixAI onBack={() => navigate('settings')} />;
      case 'language': return <LanguageSelection onBack={() => navigate('settings')} currentLang={language} onChangeLang={setLanguage} />;
      case 'privacy': return <PrivacyPolicy onBack={() => navigate('settings')} />;
      case 'terms': return <TermsOfService onBack={() => navigate('settings')} />;
      
      // Extended Features
      case 'crop-detail': return <CropDeepDive onBack={() => navigate('dashboard')} commodity={formData.commodity} state={formData.state} district={formData.district} />;
      case 'mandi-detail': return <MandiDetails onBack={() => navigate('market-monitor')} defaultState={profileState} defaultDistrict={profileDistrict} />;
      case 'compare': return <MarketComparison onBack={() => navigate('analytics')} />;
      case 'alert-setup': return <PriceAlertSetup onBack={() => navigate('alerts')} />;
      case 'notification-settings': return <PriceAlertSetup onBack={() => navigate('settings')} />;
      case 'activity': return <UserActivityLog onBack={() => navigate('profile')} />;
      case 'referral': return <ReferralProgram onBack={() => navigate('profile')} />;
      
      case 'profile': return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('dashboard')} style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 style={{ fontSize: '18px' }}>My Profile</h2>
          </div>
          <div style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary-pale)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
            <h2 style={{ marginTop: '15px' }}>{profileName}</h2>
            <p style={{ color: 'var(--gray-medium)' }}>{profileDistrict}, {profileState}</p>
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <div className="card" onClick={() => navigate('edit-profile')}>{translate('accountDetails', language)}</div>
              <div className="card" onClick={() => navigate('schemes')}>{translate('pmKisan', language)}</div>
              <div className="card" onClick={() => navigate('settings')}>{translate('settings', language)}</div>
              <div className="card" onClick={() => navigate('welcome')} style={{ color: 'var(--error)' }}>Logout</div>
            </div>
          </div>
        </div>
      );

      default: return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('dashboard')} style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 style={{ fontSize: '18px' }}>Optimization</h2>
          </div>
          <div style={{ flex: 1, padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px' }}>🚧</div>
            <h2 style={{ marginTop: '20px' }}>Screen: {currentScreen}</h2>
            <p style={{ color: 'var(--gray-medium)', margin: '10px 0 30px' }}>Module Optimization in Progress.</p>
            <button onClick={() => setCurrentScreen('dashboard')} className="btn-primary">Return to Dashboard</button>
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
        position: 'absolute', bottom: 0, width: '100%', background: 'rgba(255, 255, 255, 0.9)', 
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

  return (
    <div className="mobile-container" data-theme={theme}>
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


    </div>
  );
}
