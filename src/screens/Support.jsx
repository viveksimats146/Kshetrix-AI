import React from 'react';
import { ChevronLeft, HelpCircle, Phone, Mail, FileText, Globe, Shield } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'white', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const FAQScreen = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Frequently Asked Questions" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { q: "How does the price prediction work?", a: "We use machine learning models trained on 10+ years of historical mandi data, weather patterns, and market trends to forecast prices." },
        { q: "Is the app available in Marathi?", a: "Yes, you can change the language to Marathi, Hindi, or English in the Language Settings." },
        { q: "How do I upload a diseased leaf photo?", a: "Go to Education > Pest Identification and click on 'Open Camera'." }
      ].map((faq, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} /> {faq.q}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--gray-medium)', lineHeight: '1.5', paddingLeft: '28px' }}>{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export const ContactSupport = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Contact Support" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <p style={{ fontSize: '14px', color: 'var(--gray-medium)', marginBottom: '20px', textAlign: 'center' }}>Our support team is available Mon-Sat, 9 AM to 6 PM.</p>
      
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--primary-pale)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Phone size={24} /></div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Toll Free Helpline</h4>
          <p style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>1800-123-4567</p>
        </div>
      </div>
      
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--info-pale)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}><Mail size={24} /></div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Email Support</h4>
          <p style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>help@kshetrix.ai</p>
        </div>
      </div>

      <div className="card">
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '15px' }}>Send us a message</h4>
        <textarea placeholder="Describe your issue..." style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--gray-light)', height: '120px', marginBottom: '15px', resize: 'none', fontFamily: 'inherit' }}></textarea>
        <button className="btn-primary">Submit Ticket</button>
      </div>
    </div>
  </div>
);

export const AboutKshetrixAI = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
    <Header title="About Kshetrix-AI" onBack={onBack} />
    <div style={{ flex: 1, padding: '40px 20px', overflowY: 'auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '10px' }}>🌱</div>
      <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Kshetrix-AI</h2>
      <p style={{ fontSize: '14px', color: 'var(--gray-medium)', marginBottom: '30px' }}>Version 2.1.4 (Build 842)</p>
      
      <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--gray-dark)', marginBottom: '30px', textAlign: 'left' }}>
        Kshetrix-AI is a next-generation agricultural intelligence platform designed to empower farmers with data-driven insights. By combining satellite imagery, machine learning, and real-time market data, we help you maximize yield and profits.
      </p>

      <div style={{ background: '#F8F9FA', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Made with ❤️ in India</h4>
        <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>© 2026 Kshetrix Technologies Pvt. Ltd.<br/>All rights reserved.</p>
      </div>
    </div>
  </div>
);

export const LanguageSelection = ({ onBack, currentLang, onChangeLang }) => {
  const languages = [
    { lang: "English", sub: "System Default" },
    { lang: "हिंदी", sub: "Hindi" },
    { lang: "मराठी", sub: "Marathi" },
    { lang: "ગુજરાતી", sub: "Gujarati" },
    { lang: "தமிழ்", sub: "Tamil" },
    { lang: "తెలుగు", sub: "Telugu" },
    { lang: "বাংলা", sub: "Bengali" },
    { lang: "ಕನ್ನಡ", sub: "Kannada" },
    { lang: "മലയാളം", sub: "Malayalam" },
    { lang: "ਪੰਜਾਬੀ", sub: "Punjabi" },
    { lang: "ଓଡ଼ିଆ", sub: "Odia" }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Select Language" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {languages.map((l, i) => {
          const isSelected = currentLang === l.lang || (l.lang === 'English' && currentLang === 'System Default');
          return (
            <div 
              key={i} 
              onClick={() => onChangeLang(l.lang)}
              className="card" 
              style={{ 
                marginBottom: '10px', 
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--gray-light)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{l.lang}</h4>
                <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{l.sub}</p>
              </div>
              {isSelected ? (
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
              ) : (
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', border: '2px solid var(--gray-light)' }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PrivacyPolicy = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
    <Header title="Privacy Policy" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-dark)' }}>
      <Shield size={32} color="var(--primary)" style={{ marginBottom: '20px' }} />
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>1. Data Collection</h3>
      <p style={{ marginBottom: '20px' }}>We collect location data and crop preferences to provide accurate weather and price predictions. This data is encrypted and securely stored.</p>
      
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>2. Third-Party Sharing</h3>
      <p style={{ marginBottom: '20px' }}>We do not sell your personal data to third parties. Anonymized crop data may be used for machine learning model improvements.</p>
      
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>3. User Rights</h3>
      <p style={{ marginBottom: '20px' }}>You have the right to request deletion of your account and all associated data from our servers at any time via the Settings menu.</p>
    </div>
  </div>
);

export const TermsOfService = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
    <Header title="Terms of Service" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-dark)' }}>
      <FileText size={32} color="var(--info)" style={{ marginBottom: '20px' }} />
      <p style={{ marginBottom: '20px' }}>Last updated: May 15, 2026</p>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Usage Limitations</h3>
      <p style={{ marginBottom: '20px' }}>The AI price predictions provided by Kshetrix-AI are forecasts based on historical data. They should be used as advisory tools only. Kshetrix-AI is not liable for financial losses incurred due to market volatility.</p>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Account Security</h3>
      <p style={{ marginBottom: '20px' }}>Users are responsible for maintaining the confidentiality of their OTPs and account credentials.</p>
    </div>
  </div>
);
