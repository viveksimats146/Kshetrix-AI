import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { Leaf, ArrowRight } from 'lucide-react';

export const SplashScreen = ({ onNext }) => {
  return (
    <div style={{ 
      height: '100%', 
      background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '150px', background: 'rgba(255,255,255,0.05)', filter: 'blur(40px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '200px', background: 'rgba(255,255,255,0.03)', filter: 'blur(60px)' }}></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ scale: 0, rotate: -45 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: 'spring', damping: 15 }}
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '40px', 
            background: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Leaf size={64} color="white" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'white', fontSize: '42px', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          Kshetrix-AI
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4 }}
          style={{ color: 'white', marginTop: '12px', fontSize: '16px', fontWeight: '500', opacity: 0.8 }}
        >
          AI-Powered Agri Intelligence
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ width: '100%', paddingBottom: '40px' }}
      >
        <button 
          onClick={onNext} 
          className="btn-primary" 
          style={{ 
            background: 'white', 
            color: '#1B4332', 
            border: 'none', 
            padding: '18px', 
            borderRadius: '16px', 
            fontSize: '18px', 
            fontWeight: '700', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
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
