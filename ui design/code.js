// ============================================================
// AGRICO – 50 SCREEN FIGMA UI GENERATOR  v2 (fixed)
// Only 2 files needed: code.js + manifest.json
// ============================================================

// ── Inline UI (plugin panel) ────────────────────────────────
const UI = `
<html>
<head>
<meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Inter,sans-serif;background:#f0f9f0;padding:18px;color:#1a2e1a}
  .logo{font-size:28px;text-align:center;margin-bottom:4px}
  h2{color:#2d7a2d;font-size:15px;text-align:center;margin-bottom:6px}
  p{font-size:11px;color:#555;margin-bottom:14px;line-height:1.5;text-align:center}
  button{width:100%;padding:11px;background:#2d7a2d;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer}
  button:disabled{opacity:.5;cursor:not-allowed}
  .bar-wrap{width:100%;height:7px;background:#c8ebc8;border-radius:4px;margin-top:10px;display:none;overflow:hidden}
  .bar{height:100%;background:#2d7a2d;border-radius:4px;width:0%;transition:width .25s}
  #msg{margin-top:10px;font-size:11px;color:#2d7a2d;text-align:center;min-height:16px}
</style>
</head>
<body>
  <div class="logo">🌾</div>
  <h2>Agrico – 50 Screen Generator</h2>
  <p>Generates all 50 mobile UI screens<br>for Agrico AI-Powered Agri App<br>(390×844px Android frames)</p>
  <button id="btn">🚀 Generate All 50 Screens</button>
  <div class="bar-wrap" id="bw"><div class="bar" id="bar"></div></div>
  <div id="msg"></div>
<script>
  document.getElementById('btn').addEventListener('click', function(){
    this.disabled = true;
    document.getElementById('bw').style.display = 'block';
    document.getElementById('msg').textContent = 'Starting...';
    parent.postMessage({ pluginMessage: { type: 'generate' } }, '*');
  });
  window.onmessage = function(e) {
    var m = e.data.pluginMessage;
    if (!m) return;
    if (m.type === 'progress') {
      document.getElementById('msg').textContent = m.text;
      document.getElementById('bar').style.width = ((m.i / 50) * 100) + '%';
    }
    if (m.type === 'done') {
      document.getElementById('bar').style.width = '100%';
      document.getElementById('msg').textContent = '🎉 All 50 screens generated!';
      document.getElementById('btn').disabled = false;
    }
    if (m.type === 'error') {
      document.getElementById('msg').textContent = '❌ ' + m.msg;
      document.getElementById('btn').disabled = false;
    }
  };
</script>
</body>
</html>
`;

figma.showUI(UI, { width: 320, height: 280, title: 'Agrico UI Generator' });

// ── Design Tokens ────────────────────────────────────────────
const C = {
  green:     {r:.176,g:.478,b:.176},
  gLight:    {r:.298,g:.686,b:.314},
  gPale:     {r:.910,g:.961,b:.910},
  white:     {r:1,g:1,b:1},
  offWhite:  {r:.976,g:.984,b:.976},
  dark:      {r:.102,g:.180,b:.102},
  dgray:     {r:.333,g:.333,b:.333},
  mgray:     {r:.600,g:.600,b:.600},
  lgray:     {r:.922,g:.922,b:.922},
  orange:    {r:1,g:.596,b:0},
  red:       {r:.957,g:.263,b:.212},
  blue:      {r:.129,g:.588,b:.953},
};
const W=390, H=844, COLS=5, GAP=60;

function h2r(hex){
  return {r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255};
}

// ── Primitive helpers ────────────────────────────────────────
async function loadFont(bold){
  try{ await figma.loadFontAsync({family:'Inter',style:bold?'Bold':'Regular'}); }
  catch(e){ await figma.loadFontAsync({family:'Roboto',style:bold?'Bold':'Regular'}); }
}

async function addText(frame, str, x, y, size, color, bold, maxW){
  if(!str && str!=='0') return;
  await loadFont(bold);
  const t = figma.createText();
  try{t.fontName={family:'Inter',style:bold?'Bold':'Regular'};}
  catch(e){t.fontName={family:'Roboto',style:bold?'Bold':'Regular'};}
  t.characters = String(str);
  t.fontSize = size;
  t.fills = [{type:'SOLID',color}];
  if(maxW){ t.textAutoResize='HEIGHT'; t.resize(maxW,40); }
  t.x=x; t.y=y;
  frame.appendChild(t);
  return t;
}

function addRect(frame, x, y, w, h, color, radius, opacity){
  const r=figma.createRectangle();
  r.x=x; r.y=y; r.resize(Math.max(w,1), Math.max(h,1));
  r.fills=[{type:'SOLID',color, opacity:opacity||1}];
  r.cornerRadius=radius||0;
  frame.appendChild(r);
  return r;
}

function addEllipse(frame, x, y, w, h, color, opacity){
  const e=figma.createEllipse();
  e.x=x; e.y=y; e.resize(Math.max(w,1),Math.max(h,1));
  e.fills=[{type:'SOLID',color,opacity:opacity||1}];
  frame.appendChild(e);
  return e;
}

function addLine(frame, x1, y1, x2, color, sw){
  const l=figma.createLine();
  l.x=x1; l.y=y1;
  l.resize(Math.max(x2-x1,1),1);
  l.strokes=[{type:'SOLID',color}];
  l.strokeWeight=sw||1;
  frame.appendChild(l);
  return l;
}

function addCard(frame, x, y, w, h){
  const r=addRect(frame,x,y,w,h,C.white,16);
  r.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:.08},offset:{x:0,y:4},radius:12,spread:0,visible:true,blendMode:'NORMAL'}];
  return r;
}

function addGrad(frame, h2){
  const g=addRect(frame,0,0,W,h2||180,C.green);
  g.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[0,1,0],[-1,0,1]],
    gradientStops:[{position:0,color:{...C.green,a:1}},{position:1,color:{...C.gLight,a:1}}]}];
  return g;
}

async function addStatusBar(f){
  addRect(f,0,0,W,44,C.green);
  await addText(f,'9:41',16,13,12,C.white,true);
  await addText(f,'WiFi  🔋',300,13,11,C.white,false);
}

async function addHeader(f, title, back){
  addRect(f,0,44,W,56,C.green);
  await addText(f, title, back===false?20:52, 57, 17, C.white, true, 280);
  if(back!==false) await addText(f,'‹',18,54,24,C.white,true);
}

async function addBottomNav(f, active){
  addRect(f,0,H-70,W,70,C.white);
  addLine(f,0,H-70,W,C.lgray);
  const tabs=[['🏠','Home'],['📊','Market'],['🌾','Crops'],['🔔','Alerts'],['👤','Profile']];
  for(let i=0;i<tabs.length;i++){
    const cx=39+i*78, isA=i===(active||0);
    addRect(f,cx-28,H-68,56,56,isA?C.gPale:C.white,28);
    await addText(f,tabs[i][0],cx-10,H-60,18,C.dark,false);
    await addText(f,tabs[i][1],cx-16,H-38,9,isA?C.green:C.mgray,isA);
  }
}

async function addRecChip(f,label,x,y){
  const bg={
    'SELL NOW':C.gLight,'STORE':C.orange,'MONITOR':C.blue,'PARTIAL SELL':C.green
  }[label]||C.green;
  addRect(f,x,y,label.length*9+24,32,bg,16);
  await addText(f,label,x+12,y+8,12,C.white,true);
}

function addBarChart(f,x,y,vals,labels,col){
  const bw=28,gap=8,maxV=Math.max(...vals),ch=80;
  vals.forEach((v,i)=>{
    const bh=Math.round((v/maxV)*ch)||4;
    addRect(f,x+i*(bw+gap),y+ch-bh,bw,bh,col||C.gLight,6);
    if(labels&&labels[i]){
      (async()=>{await addText(f,labels[i],x+i*(bw+gap),y+ch+4,8,C.mgray,false);})();
    }
  });
}

function addLineChart(f,x,y,pts,color){
  const w=300,h=80,col=color||C.green;
  addRect(f,x,y+h,w,1,C.lgray);
  for(let i=0;i<pts.length-1;i++){
    const x1=x+(i/(pts.length-1))*w, y1=y+h-pts[i]*h;
    const x2=x+((i+1)/(pts.length-1))*w, y2=y+h-pts[i+1]*h;
    const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy);
    if(len<1) continue;
    const seg=figma.createLine();
    seg.x=x1; seg.y=y1;
    seg.resize(len,1);
    seg.rotation=-Math.atan2(dy,dx)*180/Math.PI;
    seg.strokes=[{type:'SOLID',color:col}]; seg.strokeWeight=2.5;
    f.appendChild(seg);
    addEllipse(f,x1-3,y1-3,6,6,col);
  }
}

// ── Frame factory ────────────────────────────────────────────
async function makeFrame(name, idx){
  const f=figma.createFrame();
  f.name=`${String(idx+1).padStart(2,'0')} – ${name}`;
  f.resize(W,H);
  f.x=(idx%COLS)*(W+GAP);
  f.y=Math.floor(idx/COLS)*(H+GAP);
  f.fills=[{type:'SOLID',color:C.offWhite}];
  f.clipsContent=true;
  return f;
}

// ── 50 Screen builders ───────────────────────────────────────
async function s01(f){ // Splash
  addGrad(f,H);
  addEllipse(f,W/2-60,240,120,120,C.white,.15);
  addEllipse(f,W/2-80,200,160,160,C.white,.08);
  await addText(f,'🌾',W/2-24,270,48,C.white,false);
  await addText(f,'AGRICO',W/2-54,342,32,C.white,true);
  await addText(f,'AI-Powered Agri Intelligence',W/2-114,386,13,C.white,false);
  addEllipse(f,W/2-4,720,8,8,C.white,.6);
  addEllipse(f,W/2+14,720,8,8,C.white,.3);
  addEllipse(f,W/2+32,720,8,8,C.white,.3);
  await addText(f,'Powered by ML · NLP · AI',W/2-82,792,11,C.white,false);
}

async function s02(f){ // Welcome
  addGrad(f,420);
  await addText(f,'🌾',W/2-24,120,48,C.white,false);
  await addText(f,'Welcome to Agrico',W/2-112,196,22,C.white,true);
  await addText(f,'Smart decisions for better profits',W/2-132,228,13,C.white,false);
  addCard(f,20,440,W-40,340);
  await addText(f,'🌱  AI Price Predictions',44,466,14,C.dark,true);
  await addText(f,'Accurate crop price forecasts using ML.',44,490,12,C.mgray,false,280);
  await addText(f,'📈  Market Intelligence',44,538,14,C.dark,true);
  await addText(f,'Analyze trends and find best markets.',44,560,12,C.mgray,false,280);
  await addText(f,'💡  Smart Recommendations',44,608,14,C.dark,true);
  await addText(f,'Know when to sell, store or monitor.',44,630,12,C.mgray,false,280);
  addRect(f,20,692,W-40,52,C.green,26);
  await addText(f,'Get Started',W/2-40,706,16,C.white,true);
  addRect(f,20,758,W-40,44,C.gPale,22);
  await addText(f,'I already have an account',W/2-84,770,13,C.green,true);
}

async function s03(f){ // Login
  addGrad(f,220);
  await addText(f,'🌾 AGRICO',W/2-46,80,22,C.white,true);
  await addText(f,'Sign in to your account',W/2-84,114,13,C.white,false);
  addCard(f,20,200,W-40,520);
  await addText(f,'Welcome Back!',36,228,20,C.dark,true);
  await addText(f,'Enter your credentials to continue',36,256,12,C.mgray,false);
  await addText(f,'Phone Number / Email',36,300,12,C.dgray,true);
  addRect(f,36,318,W-72,48,C.lgray,10);
  await addText(f,'📱  9876543210',50,332,13,C.dark,false);
  await addText(f,'Password',36,380,12,C.dgray,true);
  addRect(f,36,398,W-72,48,C.lgray,10);
  await addText(f,'🔒  ••••••••',50,412,13,C.dark,false);
  await addText(f,'Forgot Password?',248,458,12,C.green,false);
  addRect(f,36,490,W-72,52,C.green,26);
  await addText(f,'Login',W/2-22,504,16,C.white,true);
  addLine(f,36,562,W-36,C.lgray);
  await addText(f,'Or continue with',W/2-54,550,11,C.mgray,false);
  addRect(f,36,576,140,48,C.lgray,10);
  await addText(f,'🌐  Google',60,590,13,C.dark,false);
  addRect(f,W-176,576,140,48,C.lgray,10);
  await addText(f,'☎  OTP Login',W-168,590,13,C.dark,false);
  await addText(f,"Don't have an account?  Sign Up",W/2-98,662,12,C.green,false);
}

async function s04(f){ // Signup
  addGrad(f,200);
  await addText(f,'Create Account',W/2-70,80,22,C.white,true);
  await addText(f,'Join thousands of smart farmers',W/2-112,112,13,C.white,false);
  addCard(f,20,184,W-40,580);
  const flds=[['Full Name','👤  Ramesh Kumar'],['Phone','📱  9876543210'],['Email','✉  ramesh@gmail.com'],['State','📍  Maharashtra'],['Password','🔒  ••••••••'],['Confirm Password','🔒  ••••••••']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],36,208+i*76,12,C.dgray,true);
    addRect(f,36,226+i*76,W-72,44,C.lgray,10);
    await addText(f,flds[i][1],50,240+i*76,12,C.mgray,false);
  }
  addRect(f,36,692,W-72,52,C.green,26);
  await addText(f,'Create Account',W/2-54,706,16,C.white,true);
  await addText(f,'Already have an account?  Login',W/2-90,756,12,C.green,false);
}

async function s05(f){ // Forgot Password
  addGrad(f,200);
  await addText(f,'Forgot Password',W/2-74,80,22,C.white,true);
  addCard(f,20,184,W-40,400);
  await addText(f,'🔐',W/2-18,214,36,C.green,false);
  await addText(f,'Reset Your Password',W/2-86,270,18,C.dark,true);
  await addText(f,"Enter your registered phone number and we'll send a 6-digit OTP.",W/2-142,298,12,C.mgray,false,300);
  await addText(f,'Phone Number',36,354,12,C.dgray,true);
  addRect(f,36,372,W-72,48,C.lgray,10);
  await addText(f,'📱  +91 Enter mobile number',50,388,12,C.mgray,false);
  addRect(f,36,440,W-72,52,C.green,26);
  await addText(f,'Send OTP',W/2-32,454,16,C.white,true);
  await addText(f,'Back to Login',W/2-44,512,13,C.green,false);
}

async function s06(f){ // OTP
  addGrad(f,200);
  await addText(f,'OTP Verification',W/2-76,80,22,C.white,true);
  addCard(f,20,184,W-40,440);
  await addText(f,'📲',W/2-18,214,36,C.green,false);
  await addText(f,'Enter Verification Code',W/2-96,270,18,C.dark,true);
  await addText(f,'Sent to +91 987-654-3210',W/2-76,298,12,C.mgray,false);
  const digits=['4','8','2','1','',''];
  for(let i=0;i<6;i++){
    addRect(f,24+i*58,336,48,60,C.gPale,12);
    await addText(f,digits[i],24+i*58+16,352,22,C.dark,true);
  }
  addRect(f,36,424,W-72,52,C.green,26);
  await addText(f,'Verify OTP',W/2-38,438,16,C.white,true);
  await addText(f,"Didn't receive?  Resend OTP (28s)",W/2-110,494,12,C.green,false);
}

async function s07(f){ // Intro 1
  addGrad(f,460);
  addEllipse(f,W/2-90,80,180,180,C.white,.12);
  await addText(f,'📊',W/2-26,160,56,C.white,false);
  await addText(f,'Smart Price Predictions',W/2-106,272,20,C.white,true);
  await addText(f,'AI-powered forecasting using\nRandom Forest & Linear Regression.',W/2-132,306,13,C.white,false,280);
  addCard(f,20,478,W-40,280);
  await addText(f,'How it works:',36,500,14,C.green,true);
  const pts=['📥  Collects historical mandi data','🤖  Processes with ML algorithms','📈  Predicts future price trends','💰  Shows profit-maximizing advice'];
  for(let i=0;i<pts.length;i++) await addText(f,pts[i],36,530+i*38,13,C.dark,false,300);
  await addText(f,'● ○ ○',W/2-22,782,16,C.green,false);
  addRect(f,W-92,H-82,72,40,C.green,20);
  await addText(f,'Next →',W-84,H-70,13,C.white,true);
}

async function s08(f){ // Intro 2
  addGrad(f,460);
  addEllipse(f,W/2-90,80,180,180,C.white,.12);
  await addText(f,'🏪',W/2-26,160,56,C.white,false);
  await addText(f,'Market Intelligence',W/2-80,272,20,C.white,true);
  await addText(f,'Analyze thousands of mandis using\nTF-IDF and Cosine Similarity.',W/2-132,306,13,C.white,false,280);
  addCard(f,20,478,W-40,260);
  await addText(f,'Market Features:',36,500,14,C.green,true);
  const pts=['🗺  Compare 500+ markets across India','📉  View daily, weekly, monthly trends','🔍  Find similar profitable markets','⚡  Real-time price alerts'];
  for(let i=0;i<pts.length;i++) await addText(f,pts[i],36,530+i*38,13,C.dark,false,300);
  await addText(f,'○ ● ○',W/2-22,782,16,C.green,false);
  addRect(f,W-92,H-82,72,40,C.green,20);
  await addText(f,'Next →',W-84,H-70,13,C.white,true);
}

async function s09(f){ // Intro 3
  addGrad(f,460);
  addEllipse(f,W/2-90,80,180,180,C.white,.12);
  await addText(f,'💡',W/2-26,160,56,C.white,false);
  await addText(f,'Personalized Recommendations',W/2-142,272,20,C.white,true,280);
  await addText(f,'Advice tailored to your crop,\nlocation and market conditions.',W/2-132,314,13,C.white,false,280);
  addCard(f,20,478,W-40,260);
  await addText(f,'Recommendation Types:',36,500,14,C.green,true);
  const pts=['🟢  SELL NOW – Best time to sell','🟡  STORE – Wait for better price','🔵  MONITOR – Track market closely','🟠  PARTIAL SELL – Split your stock'];
  for(let i=0;i<pts.length;i++) await addText(f,pts[i],36,530+i*38,13,C.dark,false,300);
  await addText(f,'○ ○ ●',W/2-22,782,16,C.green,false);
  addRect(f,36,H-82,W-72,50,C.green,25);
  await addText(f,"Let's Get Started 🚀",W/2-66,H-70,15,C.white,true);
}

async function s10(f){ // Profile Setup
  await addStatusBar(f);
  await addHeader(f,'Set Up Your Profile',false);
  addEllipse(f,W/2-44,140,88,88,C.gPale);
  await addText(f,'👤',W/2-20,160,36,C.green,false);
  addRect(f,W/2+18,198,28,28,C.green,14);
  await addText(f,'✎',W/2+22,202,14,C.white,false);
  const flds=[['Full Name','Ramesh Kumar'],['Age','42'],['Phone','9876543210'],['Village','Nashik'],['District','Nashik'],['State','Maharashtra'],['Language','Marathi']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],20,250+i*62,12,C.dgray,true);
    addRect(f,20,268+i*62,W-40,42,C.lgray,10);
    await addText(f,flds[i][1],36,280+i*62,13,C.dark,false);
  }
  addRect(f,20,H-82,W-40,52,C.green,26);
  await addText(f,'Save & Continue',W/2-58,H-68,15,C.white,true);
}

async function s11(f){ // Farm Details
  await addStatusBar(f);
  await addHeader(f,'Farm Details');
  const flds=[['Farm Name','Green Valley Farm'],['Area (Acres)','5.5'],['Irrigation','Drip Irrigation'],['Soil Type','Black Cotton Soil'],['Main Crop','Wheat'],['Secondary Crop','Onion'],['Farming Type','Organic / Traditional']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],20,134+i*66,12,C.dgray,true);
    addRect(f,20,152+i*66,W-40,42,C.lgray,10);
    await addText(f,flds[i][1],36,164+i*66,13,C.dark,false);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Save Farm Details',W/2-62,H-76,15,C.white,true);
}

async function s12(f){ // Crop Preferences
  await addStatusBar(f);
  await addHeader(f,'Crop Preferences');
  await addText(f,'Select crops you grow or track',20,116,12,C.mgray,false);
  const crops=[['🌾','Wheat'],['🌾','Rice'],['🧅','Onion'],['🍅','Tomato'],['🥔','Potato'],['🌽','Maize'],['🫘','Soybean'],['🧅','Garlic'],['🍋','Lemon'],['🌿','Cotton'],['🥜','Groundnut'],['🌿','Sugarcane']];
  crops.forEach((c,i)=>{
    const cx=20+(i%3)*122, cy=140+(Math.floor(i/3))*100, sel=[0,2,3,4].includes(i);
    addRect(f,cx,cy,112,80,sel?C.gPale:C.lgray,14);
    if(sel) addRect(f,cx+2,cy+2,108,76,C.white,12);
    (async()=>{
      await addText(f,c[0],cx+40,cy+12,28,C.dark,false);
      await addText(f,c[1],cx+14,cy+52,12,sel?C.green:C.dgray,sel);
      if(sel){ addRect(f,cx+86,cy+6,20,20,C.green,10); await addText(f,'✓',cx+90,cy+7,12,C.white,true); }
    })();
  });
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Save Preferences',W/2-60,H-76,15,C.white,true);
}

async function s13(f){ // Language
  await addStatusBar(f);
  await addHeader(f,'Select Language',false);
  const langs=[['Hindi','हिंदी'],['English','English'],['Marathi','मराठी'],['Tamil','தமிழ்'],['Telugu','తెలుగు'],['Kannada','ಕನ್ನಡ'],['Punjabi','ਪੰਜਾਬੀ'],['Bengali','বাংলা'],['Gujarati','ગુજરાતી']];
  for(let i=0;i<langs.length;i++){
    addCard(f,20,140+i*66,W-40,56);
    await addText(f,langs[i][0],44,152+i*66,15,C.dark,true);
    await addText(f,langs[i][1],44,170+i*66,11,C.mgray,false);
    addRect(f,W-52,152+i*66,24,24,i<2?C.green:C.lgray,12);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Continue',W/2-32,H-76,15,C.white,true);
}

async function s14(f){ // Edit Profile
  await addStatusBar(f);
  await addHeader(f,'Edit Profile');
  addCard(f,20,60,W-40,140);
  addEllipse(f,W/2-44,74,88,88,C.gPale);
  await addText(f,'👤',W/2-20,94,36,C.green,false);
  await addText(f,'Ramesh Kumar',W/2-66,172,16,C.dark,true);
  await addText(f,'Nashik, Maharashtra',W/2-64,194,12,C.mgray,false);
  const flds=[['Full Name','Ramesh Kumar'],['Phone','9876543210'],['Email','ramesh@farm.in'],['Village','Nashik'],['State','Maharashtra']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],20,220+i*68,12,C.dgray,true);
    addRect(f,20,238+i*68,W-40,44,C.lgray,10);
    await addText(f,flds[i][1],36,252+i*68,13,C.dark,false);
    await addText(f,'✎',W-46,252+i*68,14,C.green,false);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Save Changes',W/2-46,H-76,15,C.white,true);
}

async function s15(f){ // Main Dashboard
  addGrad(f,220);
  await addText(f,'Good Morning, Ramesh 👋',20,56,18,C.white,true);
  await addText(f,'Today: 08 May 2026',20,82,12,C.white,false);
  await addText(f,'🔔',W-46,56,22,C.white,false);
  const cards=[['💰','₹42.5/kg','Wheat Today'],['📈','▲ 8.3%','Price Trend'],['🏪','Nashik','Best Market']];
  cards.forEach((c,i)=>{
    addCard(f,20+i*118,110,108,88);
    (async()=>{
      await addText(f,c[0],36+i*118,122,22,C.green,false);
      await addText(f,c[1],22+i*118,152,13,C.dark,true);
      await addText(f,c[2],22+i*118,170,10,C.mgray,false);
    })();
  });
  addCard(f,20,218,W-40,120);
  await addText(f,'Price Trend – Wheat',36,234,14,C.dark,true);
  addLineChart(f,36,248,[.3,.45,.4,.6,.55,.7,.8]);
  await addText(f,'Live Market Prices',36,358,14,C.dark,true);
  const rows=[['Wheat','₹42.5','▲ 8.3%',true],['Onion','₹28.0','▼ 3.1%',false],['Tomato','₹35.2','▲ 12.4%',true],['Rice','₹38.9','▲ 5.6%',true]];
  rows.forEach((r,i)=>{
    addCard(f,20,380+i*68,W-40,58);
    (async()=>{
      await addText(f,r[0],36,392+i*68,14,C.dark,true);
      await addText(f,r[1],W/2-20,392+i*68,14,C.dark,true);
      await addText(f,r[2],W-92,392+i*68,13,r[3]?C.gLight:C.red,true);
      await addText(f,'Nashik Mandi',36,410+i*68,11,C.mgray,false);
    })();
  });
  await addBottomNav(f,0);
}

async function s16(f){ // Analytics
  await addStatusBar(f);
  await addHeader(f,'Analytics Dashboard',false);
  const kpis=[['Total Crops','5 Active',C.green],['Avg Price','₹38.4/kg',C.blue],['Profit Est.','₹1,24,500',C.gLight],['Markets','12 Active',C.orange]];
  kpis.forEach((k,i)=>{
    const cx=20+(i%2)*186, cy=130+(Math.floor(i/2))*100;
    addCard(f,cx,cy,176,88);
    (async()=>{
      addRect(f,cx+12,cy+12,4,40,k[2]);
      await addText(f,k[0],cx+24,cy+16,12,C.mgray,false);
      await addText(f,k[1],cx+24,cy+38,18,C.dark,true);
    })();
  });
  addCard(f,20,348,W-40,130);
  await addText(f,'Monthly Revenue (₹ 000s)',36,362,13,C.dark,true);
  addBarChart(f,36,392,[42,58,35,72,65,88],['Jan','Feb','Mar','Apr','May','Jun']);
  addCard(f,20,496,W-40,130);
  await addText(f,'Crop-wise Price Index',36,510,13,C.dark,true);
  addBarChart(f,36,540,[.8,.6,.9,.5,.7,.85],['Wheat','Rice','Onion','Potato','Maize','Tomato'],C.blue);
  addCard(f,20,638,W-40,80);
  await addText(f,'AI Insight: Wheat prices likely to rise 11% next week.',36,652,12,C.dark,false,300);
  await addBottomNav(f,1);
}

async function s17(f){ // Market Summary
  await addStatusBar(f);
  await addHeader(f,'Market Summary',false);
  addCard(f,20,60,W-40,80);
  await addText(f,'📍 Nashik, Maharashtra',36,76,14,C.dark,true);
  await addText(f,'8 May 2026 · 47 Active Markets',36,100,11,C.mgray,false);
  await addText(f,'Top Movers Today',20,160,15,C.dark,true);
  const movers=[['🌾 Wheat','₹42.5','▲ 8.3%',true],['🧅 Onion','₹28.0','▼ 3.1%',false],['🍅 Tomato','₹35.2','▲ 12.4%',true],['🥔 Potato','₹22.0','▼ 5.0%',false],['🌿 Cotton','₹68.0','▲ 4.2%',true]];
  movers.forEach((m,i)=>{
    addCard(f,20,184+i*70,W-40,60);
    (async()=>{
      await addText(f,m[0],36,198+i*70,14,C.dark,true);
      await addText(f,m[1]+'/kg',36,218+i*70,11,C.mgray,false);
      addRect(f,W-92,196+i*70,72,26,m[3]?C.gPale:h2r('#ffebee'),13);
      await addText(f,m[2],W-86,202+i*70,12,m[3]?C.green:C.red,true);
    })();
  });
  addCard(f,20,544,W-40,110);
  await addText(f,'Market Activity',36,560,13,C.dark,true);
  addBarChart(f,36,590,[65,80,45,90,70],['Mon','Tue','Wed','Thu','Fri']);
  await addBottomNav(f,1);
}

async function s18(f){ // Notifications
  await addStatusBar(f);
  await addHeader(f,'Notifications',false);
  const notifs=[
    ['🟢','Price Alert','Wheat price hit ₹44/kg in Pune Mandi','2 min ago',C.gPale],
    ['🔵','AI Prediction','Tomato prices expected to rise 15% next week','14 min ago',h2r('#e3f2fd')],
    ['🟡','Market Update','Nashik onion arrivals increased by 20%','1 hr ago',h2r('#fff8e1')],
    ['🔴','Urgent Alert','Heavy rain forecast may affect Potato prices','2 hr ago',h2r('#ffebee')],
    ['🟢','Best Market','Lasalgaon offers ₹3.2 more/kg for Onion','3 hr ago',C.gPale],
    ['🔵','Scheme Alert','PM-KISAN 18th installment released today','5 hr ago',h2r('#e3f2fd')],
    ['🟡','Storage Tip','Ideal humidity for Onion storage: 65–70%','1 day ago',h2r('#fff8e1')],
    ['⚫','System','Profile updated successfully','2 days ago',C.lgray],
  ];
  for(let i=0;i<notifs.length;i++){
    const n=notifs[i];
    addCard(f,20,60+i*88,W-40,78);
    addRect(f,20,60+i*88,W-40,78,n[4],12,.6);
    await addText(f,n[0],36,76+i*88,20,C.dark,false);
    await addText(f,n[1],62,72+i*88,13,C.dark,true);
    await addText(f,n[2],62,90+i*88,11,C.dgray,false,270);
    await addText(f,n[3],W-86,72+i*88,10,C.mgray,false);
  }
}

async function s19(f){ // Weather
  await addStatusBar(f);
  addGrad(f,220);
  await addText(f,'⛅',20,56,36,C.white,false);
  await addText(f,'Weather Dashboard',68,68,18,C.white,true);
  await addText(f,'📍 Nashik, Maharashtra',20,100,12,C.white,false);
  await addText(f,'32°C',W-92,56,36,C.white,true);
  const wx=[['💧','Humidity','68%'],['💨','Wind','12 km/h'],['🌧','Rainfall','8mm'],['☀','UV Index','7 High']];
  wx.forEach((w,i)=>{
    addCard(f,20+(i%2)*186,234+(Math.floor(i/2))*100,176,88);
    (async()=>{
      await addText(f,w[0],36+(i%2)*186,250+(Math.floor(i/2))*100,26,C.green,false);
      await addText(f,w[1],70+(i%2)*186,248+(Math.floor(i/2))*100,11,C.mgray,false);
      await addText(f,w[2],70+(i%2)*186,268+(Math.floor(i/2))*100,16,C.dark,true);
    })();
  });
  addCard(f,20,450,W-40,100);
  await addText(f,'🌾  Crop Impact Forecast',36,466,14,C.dark,true);
  await addText(f,'Moderate rainfall. Wheat: Minor · Onion: Check storage · Tomato: Favorable.',36,488,12,C.dgray,false,300);
  addCard(f,20,562,W-40,80);
  await addText(f,'⚠  Alert: Heavy wind advisory on 25 May.',36,580,13,C.orange,true);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const icons=['⛅','🌧','☀','⛅','🌧','☀','☀'];
  const temps=['31','29','33','30','28','32','34'];
  for(let i=0;i<7;i++){
    addCard(f,20+i*52,656,44,80);
    await addText(f,days[i],26+i*52,662,9,C.mgray,false);
    await addText(f,icons[i],28+i*52,676,16,C.dark,false);
    await addText(f,temps[i]+'°',26+i*52,700,11,C.dark,true);
  }
  await addBottomNav(f,3);
}

async function s20(f){ // Recent Activity
  await addStatusBar(f);
  await addHeader(f,'Recent Activity',false);
  const acts=[
    ['📊','Price Check','Checked Wheat price in Nashik','2 min ago'],
    ['💡','Recommendation','Got SELL NOW for Tomato (Pune)','14 min ago'],
    ['🔍','Market Search','Searched Onion markets in Maharashtra','1 hr ago'],
    ['📈','Prediction','Ran price prediction for Rice (Jun 2026)','3 hr ago'],
    ['🔔','Alert Set','Set ₹45/kg alert for Wheat','5 hr ago'],
    ['📋','Report View','Viewed Monthly Trend Report – May','1 day ago'],
    ['🌾','Crop Added','Added Maize to tracking list','2 days ago'],
    ['👤','Profile','Updated farm area details','3 days ago'],
  ];
  for(let i=0;i<acts.length;i++){
    const a=acts[i];
    addCard(f,20,60+i*86,W-40,76);
    addEllipse(f,36,74+i*86,40,40,C.gPale);
    await addText(f,a[0],46,82+i*86,20,C.green,false);
    await addText(f,a[1],86,72+i*86,13,C.dark,true);
    await addText(f,a[2],86,90+i*86,11,C.mgray,false,240);
    await addText(f,a[3],W-92,78+i*86,10,C.mgray,false);
  }
}

async function s21(f){ // Prediction Input
  await addStatusBar(f);
  addGrad(f,160);
  await addText(f,'Price Prediction',20,58,20,C.white,true);
  await addText(f,'Get AI-powered price forecast',20,86,12,C.white,false);
  addCard(f,20,140,W-40,580);
  await addText(f,'Enter Prediction Details',36,162,16,C.dark,true);
  await addText(f,'Fill all fields for accurate results',36,184,12,C.mgray,false);
  const flds=[['State','Maharashtra ▾'],['District','Nashik ▾'],['Market / Mandi','Lasalgaon ▾'],['Commodity','Onion ▾'],['Quantity (Quintals)','50'],['Target Date','15 June 2026']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],36,210+i*72,12,C.dgray,true);
    addRect(f,36,228+i*72,W-72,46,C.gPale,10);
    await addText(f,flds[i][1],52,244+i*72,13,C.dark,false);
  }
  addRect(f,36,648,W-72,52,C.green,26);
  await addText(f,'🔮 Predict Price',W/2-54,662,16,C.white,true);
  await addBottomNav(f,2);
}

async function s22(f){ // Select State
  await addStatusBar(f);
  await addHeader(f,'Select State');
  addRect(f,20,60,W-40,44,C.lgray,22);
  await addText(f,'🔍  Search state...',36,74,13,C.mgray,false);
  const states=['Andhra Pradesh','Bihar','Gujarat','Haryana','Karnataka','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
  for(let i=0;i<states.length;i++){
    addCard(f,20,120+i*56,W-40,48);
    await addText(f,'📍',36,134+i*56,16,C.green,false);
    await addText(f,states[i],62,134+i*56,14,C.dark,i===6);
    if(i===6){ addRect(f,W-52,132+i*56,24,24,C.green,12); await addText(f,'✓',W-48,134+i*56,13,C.white,true); }
  }
}

async function s23(f){ // Select District
  await addStatusBar(f);
  await addHeader(f,'Select District');
  addRect(f,20,60,W-40,44,C.lgray,22);
  await addText(f,'🔍  Search district...',36,74,13,C.mgray,false);
  await addText(f,'Maharashtra',20,120,12,C.green,true);
  const dists=['Ahmednagar','Aurangabad','Dhule','Jalgaon','Kolhapur','Latur','Mumbai','Nagpur','Nashik','Nanded','Pune','Satara','Solapur'];
  for(let i=0;i<dists.length;i++){
    addCard(f,20,140+i*56,W-40,48);
    await addText(f,'🏘',36,154+i*56,16,C.green,false);
    await addText(f,dists[i],62,154+i*56,14,C.dark,i===8);
    if(i===8){ addRect(f,W-52,152+i*56,24,24,C.green,12); await addText(f,'✓',W-48,154+i*56,13,C.white,true); }
  }
}

async function s24(f){ // Select Market
  await addStatusBar(f);
  await addHeader(f,'Select Market');
  addRect(f,20,60,W-40,44,C.lgray,22);
  await addText(f,'🔍  Search market / mandi...',36,74,13,C.mgray,false);
  await addText(f,'Nashik District – 8 Markets',20,120,12,C.mgray,false);
  const mkts=[["Lasalgaon","Asia's largest onion market","⭐ 4.8"],['Nashik APMC','General produce mandi','⭐ 4.5'],['Manmad','Wheat & cereals hub','⭐ 4.3'],['Niphad','Tomato specialty market','⭐ 4.6'],['Sinnar','Mixed produce market','⭐ 4.1'],['Igatpuri','Hill region fresh produce','⭐ 3.9']];
  for(let i=0;i<mkts.length;i++){
    addCard(f,20,140+i*86,W-40,76);
    await addText(f,'🏪',36,154+i*86,24,C.green,false);
    await addText(f,mkts[i][0],70,154+i*86,14,C.dark,true);
    await addText(f,mkts[i][1],70,174+i*86,11,C.mgray,false,240);
    await addText(f,mkts[i][2],W-74,160+i*86,11,C.orange,false);
    if(i===0){ addRect(f,W-52,152,24,24,C.green,12); await addText(f,'✓',W-48,154,13,C.white,true); }
  }
}

async function s25(f){ // Select Commodity
  await addStatusBar(f);
  await addHeader(f,'Select Commodity');
  addRect(f,20,60,W-40,44,C.lgray,22);
  await addText(f,'🔍  Search crop / commodity...',36,74,13,C.mgray,false);
  const cats=[['Vegetables','🧅 Onion · 🍅 Tomato · 🥔 Potato · 🧄 Garlic'],['Cereals','🌾 Wheat · 🌾 Rice · 🌽 Maize · 🫘 Bajra'],['Pulses','🫘 Soybean · 🫘 Tur Dal · 🫘 Urad Dal'],['Fruits','🍋 Lemon · 🍇 Grapes · 🍌 Banana'],['Cash Crops','🌿 Cotton · 🌿 Sugarcane · 🥜 Groundnut']];
  for(let i=0;i<cats.length;i++){
    await addText(f,cats[i][0],20,126+i*120,13,C.green,true);
    addCard(f,20,144+i*120,W-40,90);
    await addText(f,cats[i][1],36,160+i*120,13,C.dark,false,310);
    addRect(f,W-52,164+i*120,24,24,i===0?C.green:C.lgray,12);
    if(i===0) await addText(f,'✓',W-48,166+i*120,13,C.white,true);
  }
}

async function s26(f){ // Loading
  addGrad(f,H);
  addEllipse(f,W/2-70,180,140,140,C.white,.12);
  addEllipse(f,W/2-90,160,180,180,C.white,.06);
  await addText(f,'🔮',W/2-26,218,48,C.white,false);
  await addText(f,'Analyzing Market Data...',W/2-106,308,18,C.white,true);
  const steps=['✅  Loading historical price data','✅  Applying Random Forest model','⏳  Running Linear Regression','○  Calculating TF-IDF similarity','○  Generating recommendation'];
  for(let i=0;i<steps.length;i++) await addText(f,steps[i],W/2-126,368+i*42,13,C.white,false);
  addRect(f,60,592,W-120,8,C.white,4,.3);
  addRect(f,60,592,(W-120)*.6,8,C.white,4,.9);
  await addText(f,'60% Complete',W/2-40,610,12,C.white,false);
}

async function s27(f){ // Prediction Result
  await addStatusBar(f);
  addGrad(f,200);
  await addText(f,'Price Prediction Result',20,56,18,C.white,true);
  await addText(f,'Onion · Lasalgaon · Maharashtra',20,84,12,C.white,false);
  addCard(f,20,180,W-40,160);
  await addText(f,'Predicted Price',36,200,13,C.mgray,false);
  await addText(f,'₹34.80 / kg',36,224,32,C.green,true);
  await addText(f,'Current: ₹28.00/kg  |  ▲ +24.3% growth',36,270,13,C.gLight,true);
  addRect(f,W-112,198,82,28,C.gPale,14);
  await addText(f,'Conf. 87%',W-108,204,11,C.green,true);
  addCard(f,20,356,W-40,80);
  await addText(f,'Low: ₹31.2',36,380,13,C.red,false);
  await addText(f,'Predicted: ₹34.8',W/2-40,380,13,C.green,true);
  await addText(f,'High: ₹38.5',W-102,380,13,C.gLight,false);
  addRect(f,36,404,W-72,8,C.lgray,4);
  addRect(f,36,404,(W-72)*.65,8,C.green,4);
  addCard(f,20,452,W-40,100);
  await addText(f,'AI Recommendation',36,468,13,C.dark,true);
  await addRecChip(f,'SELL NOW',36,494);
  await addText(f,'Best time to sell within 7–10 days.',180,498,11,C.mgray,false,160);
  addCard(f,20,564,W-40,80);
  await addText(f,'Accuracy: 91.4%  |  Random Forest + Linear Regression',36,584,11,C.mgray,false,310);
  await addText(f,'Data Points: 4,820  |  Updated: Today',36,604,11,C.mgray,false,310);
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'View Full Analysis →',W/2-64,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s28(f){ // Price Trend
  await addStatusBar(f);
  await addHeader(f,'Price Trend – Onion');
  const tabs=['1W','1M','3M','6M','1Y'];
  for(let i=0;i<tabs.length;i++){
    addRect(f,20+i*70,64,60,28,i===1?C.green:C.lgray,14);
    await addText(f,tabs[i],36+i*70,72,12,i===1?C.white:C.dgray,i===1);
  }
  addCard(f,20,104,W-40,180);
  await addText(f,'₹34.80 / kg',36,120,24,C.green,true);
  await addText(f,'▲ +24.3% this month',36,152,13,C.gLight,false);
  addLineChart(f,36,164,[.3,.38,.35,.5,.48,.6,.55,.7,.82]);
  addCard(f,20,300,W-40,100);
  await addText(f,'Statistics – Last 30 Days',36,316,13,C.dark,true);
  const stats=[['Min','₹22.5'],['Max','₹36.2'],['Avg','₹29.8'],['Volatility','Medium']];
  for(let i=0;i<stats.length;i++){
    await addText(f,stats[i][0],36+i*84,344,11,C.mgray,false);
    await addText(f,stats[i][1],36+i*84,362,12,C.dark,true);
  }
  addCard(f,20,414,W-40,80);
  await addText(f,'Forecast: Prices likely to peak ₹38–40/kg in next 2 weeks.',36,430,12,C.dark,false,300);
  addBarChart(f,20,520,[28,30,24,32,35,38,34,40,36,42],undefined,C.gLight);
  await addText(f,'Daily price movement (₹/kg)',20,636,11,C.mgray,false);
  await addBottomNav(f,1);
}

async function s29(f){ // Accuracy
  await addStatusBar(f);
  await addHeader(f,'Model Accuracy');
  await addText(f,'AI Model Performance Comparison',20,108,13,C.mgray,false);
  const models=[['Random Forest','91.4%',.914,C.green],['Linear Regression','84.7%',.847,C.blue],['TF-IDF Cosine','88.2%',.882,C.orange],['Sentence Embedding','89.5%',.895,C.gLight]];
  for(let i=0;i<models.length;i++){
    const m=models[i];
    addCard(f,20,128+i*116,W-40,104);
    await addText(f,m[0],36,144+i*116,14,C.dark,true);
    await addText(f,m[1]+' Accuracy',36,166+i*116,13,m[3],true);
    addRect(f,36,192+i*116,W-112,10,C.lgray,5);
    addRect(f,36,192+i*116,(W-112)*m[2],10,m[3],5);
    await addText(f,'MAE: 1.2  RMSE: 1.8  R²: '+m[2].toFixed(2),36,210+i*116,10,C.mgray,false);
  }
  addCard(f,20,596,W-40,80);
  await addText(f,'Best Model: Random Forest (91.4%)',36,616,13,C.green,true);
  await addText(f,'Recommended for crop price forecasting',36,636,11,C.mgray,false);
  await addBottomNav(f,2);
}

async function s30(f){ // Market Monitoring
  await addStatusBar(f);
  await addHeader(f,'Market Monitoring');
  await addText(f,'Live market analysis for your crops',20,108,12,C.mgray,false);
  const mkts=[['Lasalgaon','₹28.5','▲ 6.2%',true],['Nashik APMC','₹27.8','▲ 4.8%',true],['Pune Market','₹26.5','▲ 3.1%',true],['Mumbai APMC','₹29.2','▲ 8.1%',true],['Manmad','₹25.8','▼ 2.3%',false],['Niphad','₹27.0','▲ 5.5%',true]];
  for(let i=0;i<mkts.length;i++){
    const m=mkts[i];
    addCard(f,20,126+i*84,W-40,74);
    await addText(f,m[0],36,140+i*84,14,C.dark,true);
    await addText(f,'Onion',36,160+i*84,11,C.mgray,false);
    await addText(f,m[1],W-122,140+i*84,14,C.dark,true);
    await addText(f,m[2],W-74,160+i*84,12,m[3]?C.green:C.red,true);
  }
  addCard(f,20,H-200,W-40,80);
  await addText(f,'TF-IDF Cosine Similarity: Lasalgaon & Mumbai score: 0.94',36,H-182,12,C.mgray,false,310);
  await addBottomNav(f,1);
}

async function s31(f){ // Profit Loss
  await addStatusBar(f);
  await addHeader(f,'Profit / Loss Analysis');
  addCard(f,20,60,W-40,110);
  await addText(f,'Total Estimated Profit',36,78,13,C.mgray,false);
  await addText(f,'₹ 1,24,500',36,102,30,C.green,true);
  await addText(f,'50 quintals · Onion · Lasalgaon',36,140,11,C.mgray,false);
  addRect(f,W-92,80,62,28,C.gPale,14);
  await addText(f,'▲ 24.3%',W-88,86,11,C.green,true);
  addCard(f,20,188,W-40,160);
  await addText(f,'P&L Breakdown',36,206,14,C.dark,true);
  const items=[['Gross Revenue','₹1,74,000',C.green],['Transport Cost','₹8,500',C.red],['Market Fee','₹3,200',C.orange],['Storage Cost','₹0',C.mgray],['Net Profit','₹1,24,500',C.green]];
  for(let i=0;i<items.length;i++){
    addLine(f,36,230+i*24,W-36,C.lgray);
    await addText(f,items[i][0],36,234+i*24,12,C.dgray,false);
    await addText(f,items[i][1],W-92,234+i*24,12,items[i][2],true);
  }
  addCard(f,20,368,W-40,130);
  await addText(f,'Profit Trend (Last 6 Months)',36,384,13,C.dark,true);
  addBarChart(f,36,420,[.65,.78,.72,.91,.85,.96]);
  addCard(f,20,512,W-40,80);
  await addText(f,'Best Market: Mumbai APMC · ₹31.2/kg · Save ₹6,500 more',36,532,12,C.green,false,310);
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'View Recommendations',W/2-72,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s32(f){ // Sell Now
  await addStatusBar(f);
  addGrad(f,240);
  await addText(f,'💰 SELL NOW',20,56,24,C.white,true);
  await addText(f,'Best opportunity detected!  Confidence: 91%',20,88,13,C.white,false);
  addCard(f,20,220,W-40,150);
  await addText(f,'Why Sell Now?',36,238,15,C.dark,true);
  const pts=['📈  Price at 6-month high (₹34.8/kg)','🏪  High demand in Mumbai & Pune markets','🌧  Pre-monsoon price drop expected soon','✅  Model confidence: 91.4%'];
  for(let i=0;i<pts.length;i++) await addText(f,pts[i],36,262+i*32,12,C.dark,false,300);
  addCard(f,20,388,W-40,120);
  await addText(f,'Top Markets to Sell',36,404,14,C.dark,true);
  const mkts=[['Mumbai APMC','₹34.8','▲ Best'],['Lasalgaon','₹33.5','▲ Good'],['Pune APMC','₹32.0','▲ Fair']];
  for(let i=0;i<mkts.length;i++){
    await addText(f,mkts[i][0],36,428+i*28,12,C.dark,false);
    await addText(f,mkts[i][1],W/2,428+i*28,12,C.green,true);
    await addText(f,mkts[i][2],W-82,428+i*28,11,C.gLight,false);
  }
  addCard(f,20,524,W-40,80);
  await addText(f,'🚛 Book transport 2 days ahead. Cost: ₹3,200 for 5 tons.',36,544,12,C.dark,false,300);
  addRect(f,20,H-100,W-40,52,C.green,26);
  await addText(f,'Connect with Buyer',W/2-64,H-86,15,C.white,true);
  addRect(f,20,H-40,W-40,30,C.gPale,15);
  await addText(f,'Save Recommendation',W/2-70,H-32,12,C.green,true);
  await addBottomNav(f,2);
}

async function s33(f){ // Store
  await addStatusBar(f);
  addGrad(f,200);
  addRect(f,0,0,W,200,C.orange,0,.85);
  await addText(f,'📦 STORE YOUR CROP',20,56,22,C.white,true);
  await addText(f,'Wait for better prices  |  Confidence: 84%',20,86,13,C.white,false);
  addCard(f,20,186,W-40,150);
  await addText(f,'Why Store Now?',36,204,15,C.dark,true);
  const pts=['📉  Current price below seasonal average','⏳  Price expected to rise 18% in 3 weeks','🌾  Post-harvest supply glut in markets','📊  Historical: prices rise after 21 days'];
  for(let i=0;i<pts.length;i++) await addText(f,pts[i],36,228+i*32,12,C.dark,false,300);
  addCard(f,20,350,W-40,110);
  await addText(f,'Storage Guidelines',36,366,14,C.dark,true);
  const guide=[['Humidity','65–70%'],['Temp','10–15°C'],['Ventilation','High'],['Duration','30 days']];
  for(let i=0;i<guide.length;i++){
    await addText(f,guide[i][0],36+(i%2)*156,392+(Math.floor(i/2))*26,11,C.mgray,false);
    await addText(f,guide[i][1],106+(i%2)*156,392+(Math.floor(i/2))*26,12,C.dark,true);
  }
  addCard(f,20,476,W-40,80);
  await addText(f,'⚠ Risk: Beyond 30 days increases spoilage. Monitor weekly.',36,496,12,C.dark,false,300);
  addRect(f,20,H-90,W-40,52,C.orange,26);
  await addText(f,'Find Storage Near Me',W/2-68,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s34(f){ // Monitor
  await addStatusBar(f);
  addGrad(f,200);
  addRect(f,0,0,W,200,C.blue,0,.85);
  await addText(f,'🔍 MONITOR MARKET',20,56,22,C.white,true);
  await addText(f,'Mixed signals – wait and watch',20,86,14,C.white,false);
  addCard(f,20,186,W-40,140);
  await addText(f,'Market Signals',36,202,15,C.dark,true);
  const signals=[['Price Direction','Uncertain ↔'],['Market Volume','Moderate'],['AI Confidence','68% – Low'],['Trend','Sideways']];
  for(let i=0;i<signals.length;i++){
    await addText(f,signals[i][0],36,226+i*28,12,C.dgray,false);
    await addText(f,signals[i][1],W-112,226+i*28,12,C.dark,true);
  }
  addCard(f,20,342,W-40,120);
  await addText(f,'What to Watch',36,358,14,C.dark,true);
  const watch=['📡  Check prices daily at 10 AM','📊  Monitor arrival tonnage','🌧  Watch weather forecast','📰  Track government policy news'];
  for(let i=0;i<watch.length;i++) await addText(f,watch[i],36,382+i*24,12,C.dark,false,300);
  addCard(f,20,478,W-40,80);
  await addText(f,'Alert when price crosses ₹32/kg or volume changes 15%.',36,498,12,C.mgray,false,300);
  addRect(f,20,H-90,W-40,52,C.blue,26);
  await addText(f,'Set Price Alert',W/2-50,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s35(f){ // Partial Sell
  await addStatusBar(f);
  addGrad(f,200);
  await addText(f,'⚖ PARTIAL SELL',20,56,22,C.white,true);
  await addText(f,'Split your stock for maximum profit',20,86,14,C.white,false);
  addCard(f,20,186,W-40,130);
  await addText(f,'Suggested Split – Total: 50 Quintals',36,204,13,C.dark,true);
  addRect(f,36,230,W-72,18,C.lgray,9);
  addRect(f,36,230,(W-72)*.6,18,C.green,9);
  await addText(f,'Sell Now: 30 Q (60%)',36,256,12,C.green,true);
  await addText(f,'Store: 20 Q (40%)',W-132,256,12,C.orange,true);
  addCard(f,20,332,W-40,130);
  await addText(f,'Expected Returns',36,348,14,C.dark,true);
  const ret=[['Immediate Sale (30Q)','₹74,400'],['Stored Sale (20Q)','₹70,200'],['Total Expected','₹1,44,600'],['vs Sell All Now','Save ₹20,600']];
  for(let i=0;i<ret.length;i++){
    await addText(f,ret[i][0],36,370+i*24,12,C.dgray,false);
    await addText(f,ret[i][1],W-122,370+i*24,12,i===3?C.green:C.dark,i===3);
  }
  addCard(f,20,480,W-40,100);
  await addText(f,'Markets for Immediate Sale',36,496,13,C.dark,true);
  const sell=[['Mumbai APMC','₹34.8/kg'],['Lasalgaon','₹33.5/kg']];
  for(let i=0;i<sell.length;i++){
    await addText(f,sell[i][0],36,520+i*28,12,C.dark,false);
    await addText(f,sell[i][1],W/2,520+i*28,12,C.green,true);
    addRect(f,W-66,516+i*28,46,20,C.green,10);
    await addText(f,'NOW',W-62,520+i*28,10,C.white,true);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Accept Strategy',W/2-54,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s36(f){ // Rec Detail
  await addStatusBar(f);
  await addHeader(f,'Recommendation Detail');
  addCard(f,20,60,W-40,90);
  await addText(f,'🧅 Onion · Lasalgaon · May 2026',36,76,13,C.dark,true);
  await addRecChip(f,'SELL NOW',36,104);
  await addText(f,'Generated: Today 10:32 AM',W-172,106,10,C.mgray,false);
  await addText(f,'AI Analysis Summary',20,168,15,C.dark,true);
  addCard(f,20,192,W-40,200);
  const pts=['Price is at a 6-month high of ₹34.80/kg','Demand from metros (Mumbai, Delhi) is strong','Low arrivals at major mandis (down 22%)','Post-monsoon correction likely in 3 weeks','Model agreement: RF 91%, LR 89%, Emb 88%'];
  for(let i=0;i<pts.length;i++){
    addRect(f,36,210+i*34,6,6,C.green,3);
    await addText(f,pts[i],50,206+i*34,12,C.dark,false,290);
  }
  await addText(f,'Similar Past Recommendations',20,408,15,C.dark,true);
  const hist=[['Mar 2026 · Onion','SELL NOW','▲ 22%'],['Jan 2026 · Onion','SELL NOW','▲ 18%']];
  for(let i=0;i<hist.length;i++){
    addCard(f,20,432+i*86,W-40,76);
    await addText(f,hist[i][0],36,446+i*86,13,C.dark,true);
    await addRecChip(f,hist[i][1],36,464+i*86);
    await addText(f,'Gain: '+hist[i][2],W-112,448+i*86,12,C.green,true);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Act on Recommendation',W/2-78,H-76,15,C.white,true);
  await addBottomNav(f,2);
}

async function s37(f){ // Similar Markets
  await addStatusBar(f);
  await addHeader(f,'Similar Markets');
  await addText(f,'Markets similar to Lasalgaon (Cosine Similarity)',20,108,11,C.mgray,false);
  const mkts=[['Mumbai APMC','0.97','₹34.8'],['Pune Market','0.94','₹33.2'],['Nashik APMC','0.91','₹32.8'],['Solapur APMC','0.87','₹31.5'],['Manmad','0.83','₹30.2'],['Niphad','0.79','₹29.8']];
  for(let i=0;i<mkts.length;i++){
    addCard(f,20,126+i*86,W-40,76);
    await addText(f,mkts[i][0],36,140+i*86,14,C.dark,true);
    await addText(f,'Onion Market',36,160+i*86,11,C.mgray,false);
    addRect(f,W-132,138+i*86,92,24,C.gPale,12);
    await addText(f,'Sim: '+mkts[i][1],W-128,144+i*86,11,C.green,true);
    await addText(f,mkts[i][2]+'/kg',W-66,160+i*86,12,C.dark,true);
  }
  await addBottomNav(f,1);
}

async function s38(f){ // Best Market Nearby
  await addStatusBar(f);
  await addHeader(f,'Best Market Nearby');
  addRect(f,20,60,W-40,180,C.gPale,14);
  await addText(f,'🗺',W/2-18,80,36,C.green,false);
  await addText(f,'[ Map View – Maharashtra ]',W/2-84,130,12,C.mgray,false);
  await addText(f,'📍 Lasalgaon (Your Location)',W/2-90,152,11,C.dark,true);
  await addText(f,'Showing top 5 markets within 150 km',20,255,12,C.mgray,false);
  const mkts=[['Lasalgaon','0 km','₹28.5/kg','📍 Your Market'],['Nashik APMC','22 km','₹27.8/kg','⭐ Best nearby'],['Niphad','31 km','₹27.0/kg','🟢 Good'],['Manmad','45 km','₹25.8/kg','🔵 Average'],['Chalisgaon','68 km','₹26.2/kg','🔵 Average']];
  for(let i=0;i<mkts.length;i++){
    addCard(f,20,276+i*80,W-40,70);
    await addText(f,mkts[i][0],36,290+i*80,14,C.dark,true);
    await addText(f,mkts[i][1]+' · '+mkts[i][3],36,312+i*80,11,C.mgray,false);
    await addText(f,mkts[i][2],W-92,292+i*80,14,C.green,true);
  }
  await addBottomNav(f,1);
}

async function s39(f){ // History
  await addStatusBar(f);
  await addHeader(f,'History');
  const hist=[['May 2026','Onion · Sell Now','▲ +24.3%',true],['Apr 2026','Tomato · Store','▲ +18.1%',true],['Mar 2026','Wheat · Monitor','NEUTRAL',null],['Feb 2026','Onion · Sell Now','▲ +22%',true],['Jan 2026','Potato · Store','▼ -5.1%',false],['Dec 2025','Rice · Sell Now','▲ +9.2%',true],['Nov 2025','Onion · Partial Sell','▲ +14%',true],['Oct 2025','Tomato · Sell Now','▲ +31%',true]];
  for(let i=0;i<hist.length;i++){
    const h=hist[i];
    addCard(f,20,60+i*86,W-40,76);
    await addText(f,h[0],36,74+i*86,13,C.mgray,false);
    await addText(f,h[1],36,96+i*86,13,C.dark,true);
    const bg=h[2]===null?C.lgray:h[3]?C.gPale:h2r('#ffebee');
    const tc=h[2]===null?C.mgray:h[3]?C.green:C.red;
    addRect(f,W-132,76+i*86,112,24,bg,12);
    await addText(f,h[2],W-128,80+i*86,10,tc,true);
  }
}

async function s40(f){ // Search
  await addStatusBar(f);
  await addHeader(f,'Search Commodities');
  addRect(f,20,60,W-40,48,C.lgray,24);
  await addText(f,'🔍  Search crop, market, price...',36,76,13,C.mgray,false);
  await addText(f,'Trending Searches',20,126,14,C.dark,true);
  const trending=['🧅 Onion prices today','🌾 Wheat prediction June','🍅 Tomato Pune market','🥔 Potato storage tips','📈 Best selling crop 2026'];
  for(let i=0;i<trending.length;i++){
    addRect(f,20,148+i*44,W-40,36,C.lgray,18);
    await addText(f,trending[i],36,158+i*44,13,C.dark,false);
  }
  await addText(f,'Popular Crops Today',20,370,14,C.dark,true);
  const pops=[['🧅','Onion','₹28.5'],['🌾','Wheat','₹42.5'],['🍅','Tomato','₹35.2'],['🥔','Potato','₹22.0'],['🌽','Maize','₹19.8'],['🫘','Soya','₹55.0']];
  pops.forEach((p,i)=>{
    const cx=20+(i%3)*122, cy=394+(Math.floor(i/3))*80;
    addCard(f,cx,cy,112,70);
    (async()=>{
      await addText(f,p[0],cx+14,cy+10,22,C.green,false);
      await addText(f,p[1],cx+42,cy+12,13,C.dark,false);
      await addText(f,p[2],cx+42,cy+32,12,C.green,true);
    })();
  });
  await addBottomNav(f,2);
}

async function s41(f){ // Daily Prices
  await addStatusBar(f);
  await addHeader(f,'Daily Prices',false);
  await addText(f,'08 May 2026 · Maharashtra',20,110,12,C.mgray,false);
  await addText(f,'Commodity',20,136,11,C.mgray,true);
  await addText(f,'Today',W/2-22,136,11,C.mgray,true);
  await addText(f,'Yesterday',W-102,136,11,C.mgray,true);
  addLine(f,20,152,W-20,C.lgray);
  const rows=[['🌾 Wheat','₹42.5','₹41.2','▲ 3.2%',true],['🧅 Onion','₹28.5','₹26.8','▲ 6.3%',true],['🍅 Tomato','₹35.2','₹33.0','▲ 6.7%',true],['🥔 Potato','₹22.0','₹23.1','▼ 4.8%',false],['🌽 Maize','₹19.8','₹19.5','▲ 1.5%',true],['🫘 Soybean','₹55.0','₹54.2','▲ 1.5%',true],['🧄 Garlic','₹88.0','₹92.0','▼ 4.3%',false],['🥜 Groundnut','₹62.0','₹60.5','▲ 2.5%',true]];
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    addCard(f,20,158+i*74,W-40,64);
    await addText(f,r[0],36,172+i*74,14,C.dark,true);
    await addText(f,r[1]+'/kg',36,194+i*74,11,C.green,false);
    await addText(f,r[2]+'/kg',W-122,178+i*74,12,C.mgray,false);
    await addText(f,r[3],W-62,178+i*74,12,r[4]?C.green:C.red,true);
  }
  await addBottomNav(f,1);
}

async function s42(f){ // Weekly
  await addStatusBar(f);
  await addHeader(f,'Weekly Trends');
  const tabs=['This Week','Last Week','2 Wks Ago'];
  for(let i=0;i<tabs.length;i++){
    addRect(f,20+i*116,64,106,28,i===0?C.green:C.lgray,14);
    await addText(f,tabs[i],32+i*116,72,11,i===0?C.white:C.dgray,i===0);
  }
  addCard(f,20,104,W-40,140);
  await addText(f,'Onion – Weekly Price Movement',36,120,13,C.dark,true);
  addLineChart(f,36,140,[.45,.52,.48,.6,.58,.72,.75]);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for(let i=0;i<days.length;i++) await addText(f,days[i],36+i*44,228,8,C.mgray,false);
  await addText(f,'Commodity Week Summary',20,262,14,C.dark,true);
  const rows=[['Wheat','₹42.5','▲ 5.2%',true],['Onion','₹28.5','▲ 6.3%',true],['Tomato','₹35.2','▲ 4.1%',true],['Potato','₹22.0','▼ 2.8%',false],['Maize','₹19.8','▲ 1.9%',true]];
  for(let i=0;i<rows.length;i++){
    addCard(f,20,284+i*70,W-40,60);
    await addText(f,rows[i][0],36,296+i*70,14,C.dark,true);
    await addText(f,rows[i][1],W/2-22,296+i*70,14,C.dark,true);
    await addText(f,rows[i][2],W-82,298+i*70,13,rows[i][3]?C.green:C.red,true);
  }
  await addBottomNav(f,1);
}

async function s43(f){ // Monthly
  await addStatusBar(f);
  await addHeader(f,'Monthly Trends');
  await addText(f,'May 2026 – Maharashtra Markets',20,108,12,C.mgray,false);
  addCard(f,20,126,W-40,160);
  await addText(f,'Onion Monthly Chart',36,142,13,C.dark,true);
  addBarChart(f,36,172,[.63,.74,.69,.80,.86,.91,.83,.97,.89,.100],['W1','W2','W3','W4','W5']);
  addCard(f,20,300,W-40,100);
  await addText(f,'Monthly Summary',36,318,13,C.dark,true);
  const stats=[['Opening (May 1)','₹22.0/kg'],['Closing (May 8)','₹28.5/kg'],['Monthly High','₹34.8/kg'],['Monthly Low','₹20.5/kg'],['Net Change','▲ +29.5%']];
  for(let i=0;i<stats.length;i++){
    await addText(f,stats[i][0],36,338+i*18,11,C.mgray,false);
    await addText(f,stats[i][1],W-122,338+i*18,11,i===4?C.green:C.dark,i===4);
  }
  await addText(f,'3-Month Comparison',20,414,14,C.dark,true);
  addCard(f,20,436,W-40,130);
  addBarChart(f,36,466,[.55,.72,.88],undefined,C.green);
  const months=['Mar','Apr','May'];
  for(let i=0;i<months.length;i++) await addText(f,months[i],52+i*100,562,11,C.mgray,false);
  await addText(f,'Annual Price Trend (2025–2026)',20,580,14,C.dark,true);
  addCard(f,20,602,W-40,110);
  addLineChart(f,36,632,[.4,.45,.38,.5,.55,.48,.62,.58,.7,.65,.78,.88]);
  const months2=['J','F','M','A','M','J','J','A','S','O','N','D'];
  for(let i=0;i<months2.length;i++) await addText(f,months2[i],36+i*26,714,9,C.mgray,false);
  await addBottomNav(f,1);
}

async function s44(f){ // Compare Markets
  await addStatusBar(f);
  await addHeader(f,'Compare Markets');
  await addText(f,'Select up to 3 markets to compare',20,108,12,C.mgray,false);
  const mkts=[['Lasalgaon','₹28.5','▲ 6.3%',true],['Nashik APMC','₹27.8','▲ 4.8%',true],['Mumbai APMC','₹29.2','▲ 8.1%',true],['Pune Market','₹26.5','▲ 3.1%',false],['Solapur','₹25.8','▼ 2.3%',false]];
  for(let i=0;i<mkts.length;i++){
    const m=mkts[i];
    addCard(f,20,126+i*72,W-40,62);
    addRect(f,36,138+i*72,28,28,m[3]?C.green:C.lgray,6);
    if(m[3]) await addText(f,'✓',40,142+i*72,14,C.white,true);
    await addText(f,m[0],74,136+i*72,14,C.dark,true);
    await addText(f,m[1]+'/kg  '+m[2],74,156+i*72,11,C.mgray,false);
  }
  addCard(f,20,494,W-40,200);
  await addText(f,'Price Comparison Chart',36,512,13,C.dark,true);
  addBarChart(f,36,542,[.85,.82,.90],['Lasalgaon','Nashik','Mumbai']);
  const legend=[['Lasalgaon',C.green],['Nashik',C.blue],['Mumbai',C.orange]];
  for(let i=0;i<legend.length;i++){
    addRect(f,36+i*110,664,10,10,legend[i][1],5);
    await addText(f,legend[i][0],50+i*110,664,10,C.mgray,false);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'View Detailed Comparison',W/2-84,H-76,15,C.white,true);
  await addBottomNav(f,1);
}

async function s45(f){ // Price Alert
  await addStatusBar(f);
  await addHeader(f,'Price Alert Setup');
  addCard(f,20,60,W-40,380);
  await addText(f,'Create New Alert',36,80,16,C.dark,true);
  const flds=[['Commodity','Onion ▾'],['Market','Lasalgaon ▾'],['Alert Type','Price Crosses ▾'],['Target Price (₹/kg)','32.00'],['Alert Direction','Above ▾']];
  for(let i=0;i<flds.length;i++){
    await addText(f,flds[i][0],36,106+i*58,12,C.dgray,true);
    addRect(f,36,124+i*58,W-72,42,C.gPale,10);
    await addText(f,flds[i][1],52,138+i*58,13,C.dark,false);
  }
  addCard(f,20,458,W-40,140);
  await addText(f,'Notification Method',36,476,14,C.dark,true);
  const notif=[['📱 SMS','ON'],['🔔 Push Notification','ON'],['📧 Email','OFF'],['📞 Call','OFF']];
  for(let i=0;i<notif.length;i++){
    await addText(f,notif[i][0],36,502+i*28,13,C.dark,false);
    addRect(f,W-72,500+i*28,44,22,notif[i][1]==='ON'?C.green:C.lgray,11);
    await addText(f,notif[i][1],W-62,506+i*28,10,notif[i][1]==='ON'?C.white:C.mgray,true);
  }
  await addText(f,'Active Alerts (2)',20,612,14,C.dark,true);
  const alerts=['Onion > ₹35/kg (Lasalgaon)','Wheat > ₹45/kg (Nashik)'];
  for(let i=0;i<alerts.length;i++){
    addCard(f,20,636+i*64,W-40,54);
    await addText(f,'🔔 '+alerts[i],36,650+i*64,12,C.dark,false);
    addRect(f,W-82,648+i*64,56,22,C.gPale,11);
    await addText(f,'Active',W-78,653+i*64,10,C.green,true);
  }
  addRect(f,20,H-90,W-40,52,C.green,26);
  await addText(f,'Save Alert',W/2-36,H-76,15,C.white,true);
  await addBottomNav(f,3);
}

async function s46(f){ // Chatbot
  await addStatusBar(f);
  addGrad(f,100);
  await addText(f,'🤖 Agrico AI Assistant',20,56,18,C.white,true);
  await addText(f,'Ask anything about crops & markets',20,82,11,C.white,false);
  const msgs=[
    {me:false,t:'Hello Ramesh! How can I help you today?'},
    {me:true, t:'What is the best time to sell my Onion crop?'},
    {me:false,t:'Onion prices in Lasalgaon are at a 6-month high (₹28.5/kg). Recommendation: SELL NOW. Prices may fall 15% post-monsoon.'},
    {me:true, t:'Which market gives best price?'},
    {me:false,t:'Mumbai APMC offers ₹34.8/kg today. Transport ~₹3,200. Net advantage: ₹4,200 for 5 tons.'},
    {me:true, t:'Thank you!'},
  ];
  for(let i=0;i<msgs.length;i++){
    const m=msgs[i];
    const bw=220, bx=m.me?W-bw-20:20, by=116+i*80;
    addRect(f,bx,by,bw,60,m.me?C.green:C.white,16);
    await addText(f,m.t,bx+14,by+10,11,m.me?C.white:C.dark,false,bw-28);
  }
  addRect(f,20,H-72,W-76,52,C.lgray,26);
  await addText(f,'Type your question...',36,H-52,13,C.mgray,false);
  addRect(f,W-60,H-72,50,52,C.green,26);
  await addText(f,'➤',W-46,H-52,20,C.white,false);
}

async function s47(f){ // Voice
  addGrad(f,H);
  addEllipse(f,W/2-80,160,160,160,C.white,.10);
  addEllipse(f,W/2-100,140,200,200,C.white,.06);
  addEllipse(f,W/2-120,120,240,240,C.white,.04);
  await addText(f,'🎙',W/2-22,198,48,C.white,false);
  await addText(f,'Voice Search',W/2-60,284,22,C.white,true);
  await addText(f,'"What is the price of Onion in Nashik?"',W/2-132,320,14,C.white,false,280);
  await addText(f,'Listening...  🎤',W/2-54,460,14,C.white,false);
  addCard(f,40,530,W-80,130);
  await addText(f,'Result:',56,548,13,C.green,true);
  await addText(f,'Onion price in Nashik:',56,570,13,C.dark,false);
  await addText(f,'₹27.8 / kg',56,594,28,C.green,true);
  await addText(f,'▲ 4.8% from yesterday',56,630,12,C.gLight,false);
  addRect(f,80,700,W-160,50,C.white,25,.2);
  await addText(f,'Tap mic to ask again',W/2-66,718,13,C.white,false);
}

async function s48(f){ // Govt Schemes
  await addStatusBar(f);
  await addHeader(f,'Government Schemes',false);
  await addText(f,'Agricultural support & subsidies for farmers',20,108,12,C.mgray,false);
  const schemes=[
    ['🏦','PM-KISAN','₹6,000/yr direct transfer','Active – Next: Jun 2026'],
    ['🌾','PM Fasal Bima','Crop insurance scheme','Enroll by: 31 May 2026'],
    ['💰','MSP 2026','Min. support price list','Wheat: ₹2,275/qtl'],
    ['🚿','PM Sinchai Yojana','Irrigation subsidy 75%','Apply at: district office'],
    ['🌱','Kisan Credit Card','Credit up to ₹3 Lakhs','0% interest for 1 year'],
    ['📡','eNAM Portal','Online mandi trading','nashik.enam.gov.in'],
  ];
  for(let i=0;i<schemes.length;i++){
    const s=schemes[i];
    addCard(f,20,126+i*96,W-40,86);
    addEllipse(f,36,138+i*96,48,48,C.gPale);
    await addText(f,s[0],54,152+i*96,22,C.green,false);
    await addText(f,s[1],96,140+i*96,14,C.dark,true);
    await addText(f,s[2],96,160+i*96,11,C.mgray,false,240);
    await addText(f,s[3],96,178+i*96,10,C.green,false,240);
  }
  await addBottomNav(f,4);
}

async function s49(f){ // Settings
  await addStatusBar(f);
  await addHeader(f,'Settings',false);
  addCard(f,20,60,W-40,100);
  addEllipse(f,36,76,60,60,C.gPale);
  await addText(f,'👤',56,92,28,C.green,false);
  await addText(f,'Ramesh Kumar',106,80,16,C.dark,true);
  await addText(f,'9876543210 · Nashik, MH',106,102,11,C.mgray,false);
  addRect(f,W-62,90,40,28,C.green,14);
  await addText(f,'Edit',W-58,96,11,C.white,true);
  const groups=[
    ['Preferences',[['🌐 Language','Marathi'],['🔔 Notifications','ON'],['🌙 Dark Mode','OFF'],['📍 Location','Nashik']]],
    ['Data & AI',[['🔮 Auto Predictions','ON'],['📊 Data Source','AGMARKNET'],['🤖 Model','Random Forest'],['💾 Cache','256 MB']]],
    ['Account',[['🔒 Change Password',''],['📧 Email','ramesh@farm.in'],['📱 Phone','987*****10'],['🗑 Delete Account','']]],
  ];
  let y=178;
  for(let g=0;g<groups.length;g++){
    await addText(f,groups[g][0],20,y,13,C.green,true);
    y+=22;
    addCard(f,20,y,W-40,groups[g][1].length*48+8);
    for(let j=0;j<groups[g][1].length;j++){
      await addText(f,groups[g][1][j][0],36,y+12+j*48,13,C.dark,false);
      if(groups[g][1][j][1]) await addText(f,groups[g][1][j][1],W-80,y+12+j*48,12,C.mgray,false);
      await addText(f,'›',W-34,y+12+j*48,18,C.lgray,false);
      if(j<groups[g][1].length-1) addLine(f,36,y+8+(j+1)*48,W-36,C.lgray);
    }
    y+=groups[g][1].length*48+8+16;
  }
  await addBottomNav(f,4);
}

async function s50(f){ // Logout
  addRect(f,0,0,W,H,C.dark,0,.5);
  addCard(f,40,H/2-160,W-80,320);
  await addText(f,'👋',W/2-18,H/2-140,36,C.green,false);
  await addText(f,'Logout?',W/2-42,H/2-96,22,C.dark,true);
  await addText(f,'Are you sure you want to log out of Agrico?\nYour data and preferences will be saved.',W/2-130,H/2-64,13,C.mgray,false,260);
  addRect(f,56,H/2+80,W-112,52,C.red,26);
  await addText(f,'Yes, Logout',W/2-46,H/2+94,16,C.white,true);
  addRect(f,56,H/2+144,W-112,52,C.gPale,26);
  await addText(f,'Cancel – Stay in App',W/2-72,H/2+158,15,C.green,true);
}

// ── Screen registry ──────────────────────────────────────────
const SCREENS = [
  ['Splash Screen',s01],['Welcome Screen',s02],['Login Screen',s03],['Signup Screen',s04],
  ['Forgot Password',s05],['OTP Verification',s06],['Intro Screen 1',s07],['Intro Screen 2',s08],
  ['Intro Screen 3',s09],['Farmer Profile Setup',s10],['Add Farm Details',s11],['Crop Preferences',s12],
  ['Language Selection',s13],['Edit Profile',s14],['Main Dashboard',s15],['Analytics Dashboard',s16],
  ['Market Summary Dashboard',s17],['Notifications Dashboard',s18],['Weather Alerts Dashboard',s19],
  ['Recent Activity Dashboard',s20],['Crop Price Prediction Input',s21],['Select State',s22],
  ['Select District',s23],['Select Market',s24],['Select Commodity',s25],['Prediction Loading',s26],
  ['Prediction Result',s27],['Price Trend Graph',s28],['Accuracy Comparison',s29],
  ['Market Monitoring Result',s30],['Profit Loss Analysis',s31],['Sell Now Recommendation',s32],
  ['Store Crop Recommendation',s33],['Monitor Market Recommendation',s34],['Sell Partially Recommendation',s35],
  ['Recommendation Detail',s36],['Similar Markets',s37],['Best Market Nearby',s38],
  ['Historical Recommendation',s39],['Commodity Search',s40],['Daily Prices',s41],
  ['Weekly Trends',s42],['Monthly Trends',s43],['Compare Markets',s44],['Price Alert Setup',s45],
  ['AI Chatbot Assistant',s46],['Voice Search',s47],['Government Schemes',s48],
  ['Settings',s49],['Logout Confirmation',s50],
];

// ── Message handler ──────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'generate') return;
  try {
    for (let i = 0; i < SCREENS.length; i++) {
      const frame = await makeFrame(SCREENS[i][0], i);
      await SCREENS[i][1](frame);
      figma.ui.postMessage({ type: 'progress', text: `✅ ${i+1}/50: ${SCREENS[i][0]}`, i: i+1 });
    }
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
    figma.ui.postMessage({ type: 'done' });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', msg: e.message || String(e) });
  }
};
