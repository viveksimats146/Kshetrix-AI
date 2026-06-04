import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { Leaf, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const SplashScreen = ({ onNext }) => {
  return (
    <div style={{ 
      height: '100%', 
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E8F7EC 50%, #D8F3DC 100%)', 
      color: 'var(--black)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <motion.img 
          src={logoImg} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ 
            width: '100%', 
            maxWidth: '480px', 
            height: 'auto',
            objectFit: 'contain',
            mixBlendMode: 'multiply',
            padding: '10px'
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ width: '100%', paddingBottom: '24px' }}
      >
        <button 
          onClick={onNext} 
          className="btn-primary" 
          style={{ 
            padding: '18px', 
            borderRadius: '16px', 
            fontSize: '18px', 
            fontWeight: '700', 
            boxShadow: '0 8px 24px rgba(45, 106, 79, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Get Started <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
};

import { ChevronLeft } from 'lucide-react';

export const WelcomeScreen = ({ onNext, onLogin, onBack }) => (
  <div style={{ height: '100%', background: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
    {onBack && (
      <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'white', border: '1px solid var(--gray-light)', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}>
        <ChevronLeft size={20} />
      </button>
    )}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>👨‍🌾</div>
      <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Maximize Your Farm's Profit</h2>
      <p style={{ color: 'var(--gray-medium)' }}>Join Kshetrix-AI to get AI-driven price predictions and market insights.</p>
    </div>
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button className="btn-primary" onClick={onNext}>Get Started</button>
      <button style={{ background: 'var(--primary-pale)', color: 'var(--primary)', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: '700' }} onClick={onLogin}>I already have an account</button>
    </div>
  </div>
);
