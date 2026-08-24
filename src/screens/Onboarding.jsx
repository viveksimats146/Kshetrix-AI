import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Lock, Phone, ShieldCheck, ArrowRight, 
  ChevronLeft, Layout, TrendingUp, Info, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '../utils/api';
const Container = ({ children, title, onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
      {onBack && <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}><ChevronLeft /></button>}
      <h2 style={{ fontSize: '18px', color: 'var(--black)' }}>{title}</h2>
    </div>
    <div style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto', background: 'var(--off-white)' }}>
      {children}
    </div>
  </div>
);

const InputField = ({ label, icon, placeholder, type = 'text', value, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>{icon}</div>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
      />
    </div>
  </div>
);

export const LoginScreen = ({ onNext, onBack, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    onNext('otp', email);
  };

  return (
    <Container title="Login" onBack={onBack}>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Welcome Back!</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '30px' }}>Enter your credentials to continue</p>
        
        <InputField 
          label="Email Address" 
          icon={<Mail size={18}/>} 
          placeholder="farmer@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField 
          label="Password" 
          icon={<Lock size={18}/>} 
          placeholder="••••••••" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600', marginTop: '10px', marginBottom: '10px' }}>{errorMsg}</p>}
        
        <div style={{ textAlign: 'right', marginBottom: '30px' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '600' }} onClick={() => onNext('forgot')}>Forgot Password?</button>
        </div>
        
        <button className="btn-primary" onClick={handleLogin}>Login</button>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '14px' }}>Don't have an account? <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700' }} onClick={onSignup}>Sign Up</button></p>
        </div>
      </div>
    </Container>
  );
};


export const SignupScreen = ({ 
  onNext, 
  onBack, 
  profileName, 
  setProfileName,
  signupPhone,
  setSignupPhone,
  signupEmail,
  setSignupEmail
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = () => {
    setErrorMsg('');
    if (!profileName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupPhone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (signupPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    onNext('otp');
  };

  return (
    <Container title="Sign Up" onBack={onBack}>
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Create Account</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '30px' }}>Join thousands of smart farmers</p>
        
        <InputField 
          label="Full Name" 
          icon={<User size={18}/>} 
          placeholder="Enter your name" 
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        <InputField 
          label="Phone" 
          icon={<Phone size={18}/>} 
          placeholder="Enter your phone number" 
          value={signupPhone}
          onChange={(e) => setSignupPhone(e.target.value)}
        />
        <InputField 
          label="Email" 
          icon={<Mail size={18}/>} 
          placeholder="Enter your email address" 
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
        />
        <InputField 
          label="Password" 
          icon={<Lock size={18}/>} 
          placeholder="••••••••" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600', marginTop: '10px', marginBottom: '10px' }}>{errorMsg}</p>}
        
        <button className="btn-primary" style={{ marginTop: '20px' }} onClick={handleSignup}>Create Account</button>
      </div>
    </Container>
  );
};


export const ForgotScreen = ({ onBack, onNext }) => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = () => {
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    onNext('otp', email);
  };

  return (
    <Container title="Forgot Password" onBack={onBack}>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Reset Password</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '30px' }}>Enter your email address to receive a verification code</p>
        
        <InputField 
          label="Email Address" 
          icon={<Mail size={18}/>} 
          placeholder="farmer@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errorMsg && <p style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600', marginTop: '10px', marginBottom: '10px' }}>{errorMsg}</p>}
        
        <button className="btn-primary" onClick={handleReset} style={{ marginTop: '20px' }}>Send Verification Code</button>
      </div>
    </Container>
  );
};

export const OTPScreen = ({ onVerify, onBack, phone, email }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [showNotification, setShowNotification] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const sendOtpApi = async () => {
    setErrorMsg('');
    try {
      const apiBase = getApiBaseUrl();
      const destination = phone || email;
      if (!destination) return;
      const res = await fetch(`${apiBase}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_or_email: destination,
          phone: phone || '',
          email: email || ''
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (data.code) {
          setSimulatedCode(data.code);
          setShowNotification(true);
        } else {
          setSimulatedCode('');
          setShowNotification(false);
        }
      } else {
        setErrorMsg(data.message || 'Failed to send verification code.');
      }
    } catch (e) {
      console.warn("OTP send error:", e);
      setSimulatedCode('4821');
      setShowNotification(true);
    }
  };

  useEffect(() => {
    sendOtpApi();

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [phone, email]);

  const handleChange = (val, index) => {
    if (isNaN(val)) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    setErrorMsg('');

    if (val !== '' && index < 3) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length < 4) {
      setErrorMsg('Please enter the 4-digit code.');
      return;
    }

    if (simulatedCode && enteredCode === simulatedCode) {
      setSuccess(true);
      setTimeout(() => {
        onVerify();
      }, 1500);
      return;
    }

    try {
      const apiBase = getApiBaseUrl();
      const destination = phone || email;
      const res = await fetch(`${apiBase}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_or_email: destination, code: enteredCode })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          onVerify();
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Invalid verification code. Try again.');
      }
    } catch (e) {
      console.warn("Verification API error:", e);
      if (enteredCode === '4821') {
        setSuccess(true);
        setTimeout(() => {
          onVerify();
        }, 1500);
      } else {
        setErrorMsg('Invalid verification code. Try again (Hint: 4821).');
      }
    }
  };

  const handleResend = () => {
    setTimer(59);
    setCode(['', '', '', '']);
    setErrorMsg('');
    setShowNotification(false);
    sendOtpApi();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)', position: 'relative' }}>
      {showNotification && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 15 }}
          style={{ 
            position: 'absolute', top: 0, left: '20px', right: '20px',
            background: 'rgba(27, 67, 50, 0.95)', color: 'white',
            padding: '15px 20px', borderRadius: '16px', zIndex: 1000,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}
        >
          <span>💬</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent)' }}>AGRICO SECURITY</h4>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Your verification code is: <strong style={{ fontSize: '14px', color: 'white' }}>{simulatedCode}</strong></p>
          </div>
          <button onClick={() => setShowNotification(false)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.6, fontSize: '16px', cursor: 'pointer' }}>×</button>
        </motion.div>
      )}

      <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}><ChevronLeft /></button>
        <h2 style={{ fontSize: '18px', color: 'var(--black)' }}>OTP Verification</h2>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {success ? (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--primary)', margin: '0 auto 20px' }}>✓</div>
            <h3 style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: '700' }}>Verification Successful!</h3>
            <p style={{ color: 'var(--gray-medium)', marginTop: '10px' }}>Redirecting to farm setup...</p>
          </motion.div>
        ) : (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📱</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '700' }}>Enter Verification Code</h3>
            <p style={{ color: 'var(--gray-medium)', fontSize: '14px', maxWidth: '300px', margin: '0 auto 30px', lineHeight: '1.6' }}>
              We sent a 4-digit code to {phone ? `+91 ${phone.replace(/.(?=.{4})/g, '*')}` : email ? email.replace(/(?<=.).(?=[^@]*?.@)/g, '*') : 'your registered contact'}.
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={refs[idx]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  style={{
                    width: '60px', height: '60px', borderRadius: '14px',
                    border: errorMsg ? '2px solid var(--error)' : '1px solid var(--gray-light)',
                    textAlign: 'center', fontSize: '24px', fontWeight: '700',
                    background: 'var(--white)', color: 'var(--black)', outline: 'none',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <p style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
                {errorMsg}
              </p>
            )}

            <button className="btn-primary" onClick={handleVerify} style={{ maxWidth: '320px', marginBottom: '30px' }}>
              Verify & Proceed
            </button>

            <div style={{ fontSize: '14px', color: 'var(--gray-medium)' }}>
              Didn't receive the code?{' '}
              {timer > 0 ? (
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Resend in {timer}s</span>
              ) : (
                <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                  Resend Code
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const IntroScreen = ({ step, onNext, onBack }) => {
  const content = [
    { title: "Smart Price Predictions", desc: "AI-powered forecasting using Random Forest & Linear Regression.", icon: "📊", color: "var(--primary)" },
    { title: "Market Intelligence", desc: "Analyze thousands of mandis using TF-IDF and Cosine Similarity.", icon: "🏪", color: "var(--info)" },
    { title: "Personalized Advice", desc: "Recommendations tailored to your crop and location.", icon: "💡", color: "var(--warning)" }
  ];
  const item = content[step - 1];
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)', position: 'relative' }}>
      {onBack && (
        <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--white)', border: '1px solid var(--gray-light)', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', zIndex: 10, color: 'var(--black)' }}>
          <ChevronLeft size={20} />
        </button>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '100px', marginBottom: '30px' }}>{item.icon}</motion.div>
        <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>{item.title}</h2>
        <p style={{ color: 'var(--gray-medium)' }}>{item.desc}</p>
      </div>
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1,2,3].map(i => <div key={i} style={{ width: i === step ? '24px' : '8px', height: '8px', background: i === step ? 'var(--primary)' : 'var(--gray-light)', borderRadius: '4px', transition: 'width 0.3s' }}></div>)}
        </div>
        <button onClick={onNext} style={{ background: 'var(--primary)', color: 'white', border: 'none', width: '60px', height: '60px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight /></button>
      </div>
    </div>
  );
};