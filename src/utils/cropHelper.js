export const getCropEmoji = (cropName) => {
  if (!cropName) return '🌱';
  const clean = cropName.toLowerCase();
  
  if (clean.includes('onion')) return '🧅';
  if (clean.includes('tomato')) return '🍅';
  if (clean.includes('wheat')) return '🌾';
  if (clean.includes('rice') || clean.includes('paddy')) return '🍚';
  if (clean.includes('potato')) return '🥔';
  if (clean.includes('garlic')) return '🧄';
  if (clean.includes('ginger')) return '🫚';
  if (clean.includes('apple')) return '🍎';
  if (clean.includes('banana')) return '🍌';
  if (clean.includes('mango')) return '🥭';
  if (clean.includes('cotton')) return '☁️';
  if (clean.includes('chilli') || clean.includes('chili')) return '🌶️';
  if (clean.includes('maize') || clean.includes('corn')) return '🌽';
  if (clean.includes('mustard')) return '🟡';
  if (clean.includes('groundnut') || clean.includes('peanut')) return '🥜';
  if (clean.includes('coconut')) return '🥥';
  
  // New Fruits
  if (clean.includes('orange') || clean.includes('citrus')) return '🍊';
  if (clean.includes('grape')) return '🍇';
  if (clean.includes('papaya')) return '🍈';
  if (clean.includes('pomegranate')) return '🍎';
  if (clean.includes('pineapple')) return '🍍';
  if (clean.includes('watermelon')) return '🍉';
  if (clean.includes('guava')) return '🍏';
  
  // New Vegetables & Greens
  if (clean.includes('cabbage') || clean.includes('cauliflower') || clean.includes('spinach') || clean.includes('greens') || clean.includes('okra') || clean.includes('bhindi')) return '🥬';
  if (clean.includes('brinjal') || clean.includes('eggplant')) return '🍆';
  if (clean.includes('carrot') || clean.includes('radish')) return '🥕';
  if (clean.includes('pea') || clean.includes('beans')) return '🫛';
  if (clean.includes('pumpkin')) return '🎃';
  
  // Spices & Extras
  if (clean.includes('black pepper') || clean.includes('pepper')) return '⚫';
  if (clean.includes('cardamom')) return '🟢';
  if (clean.includes('turmeric')) return '🟡';
  if (clean.includes('coriander') || clean.includes('mint') || clean.includes('fennel')) return '🌿';
  if (clean.includes('cumin')) return '🧂';
  if (clean.includes('clove')) return '🫚';
  
  // Grains, Cash Crops, Oilseeds & Beverages
  if (clean.includes('barley') || clean.includes('jowar') || clean.includes('bajra') || clean.includes('ragi') || clean.includes('millet')) return '🌾';
  if (clean.includes('sugarcane')) return '🎋';
  if (clean.includes('soybean') || clean.includes('pulse') || clean.includes('gram') || clean.includes('chana') || clean.includes('arhar') || clean.includes('urad') || clean.includes('moong')) return '🫘';
  if (clean.includes('coffee')) return '☕';
  if (clean.includes('tea')) return '🍵';
  if (clean.includes('sunflower')) return '🌻';

  return '🌱';
};
