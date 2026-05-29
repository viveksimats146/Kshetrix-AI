export const CROP_DATA = [
  { commodity: 'Wheat', price: 2300, trend: '+8.3%', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon' },
  { commodity: 'Tomato', price: 1250, trend: '+12.4%', state: 'Maharashtra', district: 'Satara', market: 'Patan' },
  { commodity: 'Potato', price: 810, trend: '-3.1%', state: 'Uttar Pradesh', district: 'Mainpuri', market: 'Bewar' },
  { commodity: 'Onion', price: 617, trend: '+2.5%', state: 'Rajasthan', district: 'Pratapgarh', market: 'Pratapgarh' },
  { commodity: 'Rice', price: 2545, trend: '+5.6%', state: 'Gujarat', district: 'Bhavnagar', market: 'Mahuva' },
];

export const PRICE_HISTORY = [
  { date: '01 May', price: 2100 },
  { date: '02 May', price: 2150 },
  { date: '03 May', price: 2120 },
  { date: '04 May', price: 2200 },
  { date: '05 May', price: 2250 },
  { date: '06 May', price: 2300 },
  { date: '07 May', price: 2350 },
];

export const PREDICTION_MODELS = [
  { name: 'Random Forest', accuracy: '91.4%', mae: 1.2, rmse: 1.8, r2: 0.91, color: '#2D6A4F' },
  { name: 'Linear Regression', accuracy: '84.7%', mae: 1.8, rmse: 2.4, r2: 0.84, color: '#219EBC' },
  { name: 'TF-IDF Similarity', score: 0.94, description: 'Market Similarity Score' }
];

export const RECOMMENDATIONS = {
  'SELL NOW': {
    title: 'Sell Now',
    color: '#2D6A4F',
    description: 'Prices are at a peak. Selling now will maximize your profit margins.',
    icon: '🟢'
  },
  'STORE': {
    title: 'Store Produce',
    color: '#FFB703',
    description: 'Prices are expected to rise significantly in the next 15-20 days.',
    icon: '🟡'
  },
  'MONITOR': {
    title: 'Monitor Market',
    color: '#219EBC',
    description: 'Market is volatile. Wait for a clearer trend before making a decision.',
    icon: '🔵'
  },
  'PARTIAL SELL': {
    title: 'Sell Partially',
    color: '#52B788',
    description: 'Sell 40% of your stock now to cover costs, store the rest for higher gains.',
    icon: '🟠'
  }
};
