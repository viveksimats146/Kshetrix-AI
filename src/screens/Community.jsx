import React from 'react';
import { ChevronLeft, MessageSquare, ThumbsUp, Share2, Award, Clock } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const FarmerForum = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Farmer Forum" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { author: "Suresh P.", time: "2h ago", text: "What is the best pesticide for early blight in tomatoes?", likes: 12, comments: 4 },
        { author: "Anil D.", time: "5h ago", text: "Onion prices in Lasalgaon are dropping today. Suggest holding stock for 2 days.", likes: 45, comments: 18 },
        { author: "Prakash G.", time: "1d ago", text: "Looking to rent a tractor in Nashik area for this weekend. Any leads?", likes: 8, comments: 2 }
      ].map((post, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '600' }}>{post.author}</span>
            <span style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{post.time}</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>{post.text}</p>
          <div style={{ display: 'flex', gap: '20px', color: 'var(--gray-dark)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}><ThumbsUp size={16} /> {post.likes}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}><MessageSquare size={16} /> {post.comments}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}><Share2 size={16} /></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ExpertQA = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Ask the Experts" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ background: 'var(--primary-pale)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <Award color="var(--primary)" size={24} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '13px', color: 'var(--primary-dark)', lineHeight: '1.5' }}>Get certified answers from agricultural scientists and veteran farmers.</p>
      </div>
      <button className="btn-primary" style={{ marginBottom: '25px' }}>Ask a Question</button>
      
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Trending Questions</h3>
      <div className="card" style={{ marginBottom: '15px', borderLeft: '4px solid var(--success)' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Soil preparation for Kharif Onion?</h4>
        <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginBottom: '10px' }}>Answered by Dr. Kulkarni (Agri Science Institute)</p>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Ensure deep ploughing and apply 20 tonnes of FYM per hectare at the time of last ploughing...</p>
      </div>
    </div>
  </div>
);

export const SuccessStories = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Success Stories" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { title: "Doubled Yield with AI", name: "Raju T.", crop: "Tomato", rev: "₹4L" },
        { title: "Smart Cold Storage Saved My Crop", name: "Vikram S.", crop: "Potato", rev: "₹2.5L" }
      ].map((story, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px', padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '120px', background: 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🌾</div>
          <div style={{ padding: '15px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>{story.title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>By {story.name} • {story.crop} Farmer</p>
            <div style={{ marginTop: '10px', background: 'var(--success-pale)', color: 'var(--success)', padding: '5px 10px', borderRadius: '8px', display: 'inline-block', fontSize: '12px', fontWeight: '700' }}>
              Revenue: {story.rev}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MarketNewsFeed = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Market News" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { title: "Govt announces new MSP for Wheat", time: "2 hours ago", src: "AgriNews" },
        { title: "Export duty on Onion reduced by 20%", time: "5 hours ago", src: "Market Watch" },
        { title: "Monsoon expected to be normal this year", time: "1 day ago", src: "Weather Dept" }
      ].map((news, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📰</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px', lineHeight: '1.4' }}>{news.title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--gray-medium)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={12} /> {news.time}</span>
              <span>• {news.src}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
