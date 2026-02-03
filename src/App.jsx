import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Home, BarChart2, PieChart, Users, Crown,
  TrendingUp, Lock, BookOpen, User, LogOut, Construction, Shield, Gift, Building2, Bot, X,
  Loader2, ChevronRight, Send, Moon, Sun, Mail 
} from 'lucide-react';

// ▼▼▼ Supabase 연결 ▼▼▼
import { supabase } from './lib/supabase';
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// 1. 데이터 파일 연결
import { INITIAL_USERS } from './data/mockData';

// 2. 컴포넌트 연결
import { NavItem } from './components/CommonUI';

// 3. 페이지 연결
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import CommunityPage from './pages/CommunityPage';
import MarketPage from './pages/MarketPage';
import LearningPage from './pages/LearningPage';
import FundPage from './pages/FundPage';
import FundDetailPage from './pages/FundDetailPage';
import FinancialComparisonPage from './pages/FinancialComparisonPage';
import AdminPage from './pages/AdminPage';
import Payment from './pages/Payment';

// 🚧 공사중 모드 스위치
const IS_MAINTENANCE_MODE = false;

// --- 🔑 Gemini API ---
const apiKey = ""; // API 키는 여기에
const GEMINI_MODEL = "gemini-2.0-flash-exp"; 

async function fetchGemini(prompt, systemInstruction = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
  };

  let delay = 1000;
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI分析結果を取得できませんでした。";
    } catch (error) {
      if (i === 2) return "現在AIサービスの接続が遅延しています。しばらく経ってからもう一度お試しください。";
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/* ================================================================================== */
/* 2. MODAL & AI COMPONENTS                                                         */
/* ================================================================================== */

// AI Advisor Chat
const AIAdvisorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'こんにちは！MoneyMart AIアドバイザーです。金融に関する質問があればどうぞ！' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetchGemini(userMsg, "당신은 일본 금융 시장에 정통한 전문가 AI입니다. 사용자에게 객관적이고 친절한 조언을 제공하세요. 일본어로 답변해주세요.");
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: '申し訳ありません。エラーが発生しました。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 h-[500px] rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col mb-4 overflow-hidden animate-fadeIn">
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3"><div className="bg-orange-500 p-2 rounded-xl"><Bot size={20}/></div><span className="font-black tracking-tight">AI Advisor</span></div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-orange-500 text-white font-bold' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-100 dark:border-slate-600 font-medium'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-slate-400 font-bold animate-pulse p-2">AIが入力中...</div>}
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleSend()} placeholder="質問を入力..." className="flex-1 bg-slate-50 dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium dark:text-white" />
            <button onClick={handleSend} className="bg-slate-900 dark:bg-orange-500 text-white p-3 rounded-xl hover:bg-black dark:hover:bg-orange-600 transition-colors"><Send size={18}/></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-orange-500 hover:bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
        {isOpen ? <X size={28}/> : <Bot size={28} className="group-hover:rotate-12 transition-transform"/>}
      </button>
    </div>
  );
};

// RiskAssessmentModal
const RiskAssessmentModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const questions = [
    { q: "あなたの年齢は？", options: [{ t: "20〜30代", s: 5 }, { t: "40〜50代", s: 3 }, { t: "60代以上", s: 1 }] },
    { q: "投資経験は？", options: [{ t: "未経験", s: 1 }, { t: "少しある", s: 3 }, { t: "豊富", s: 5 }] },
  ];

  const handleAnswer = (points) => {
    const newScore = score + points;
    if (step < questions.length - 1) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      let result = "バランス型";
      if (newScore <= 4) result = "安定重視型";
      else if (newScore >= 8) result = "積極運用型";
      onSave(result);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
        <div className="text-center mb-10"><h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">投資スタイル診断</h2><p className="text-slate-500 font-bold text-sm">Question {step + 1} / {questions.length}</p></div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center mb-8 text-slate-800 dark:text-slate-200">{questions[step].q}</h3>
          {questions[step].options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt.s)} className="w-full border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all text-left font-bold text-slate-600 dark:text-slate-300 flex justify-between group">{opt.t}<ChevronRight className="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity" /></button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================================================================================== */
/* MAIN APP COMPONENT                                                                 */
/* ================================================================================== */
const App = () => {
  // --- State ---
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedFundId, setSelectedFundId] = useState(null); 
  const [allUsers, setAllUsers] = useState(INITIAL_USERS);
  
  const [myPortfolio, setMyPortfolio] = useState([]); 
  const [myWatchlist, setMyWatchlist] = useState([]); 
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(IS_MAINTENANCE_MODE); 
  const [comparisonCategory, setComparisonCategory] = useState('card');
  const [darkMode, setDarkMode] = useState(false);

  // --- Login Inputs State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // --- Effects ---
  // 1. 관리자 모드 체크
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' && isMaintenance) {
      const password = prompt("管理者パスワードを入力してください (1234)");
      if (password === '1234') setIsMaintenance(false);
    }
  }, []);

  // 2. Supabase 세션 체크 (자동 로그인)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkAndSaveUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAndSaveUser(session.user);
      } else {
        setUser(null);
        setActiveTab('home');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // --- Functions ---

  // ▼▼▼ 유저 DB 확인 및 저장 (등급 적용) ▼▼▼
  const checkAndSaveUser = async (authUser) => {
    if (!authUser) return;
    const email = authUser.email;
    const name = authUser.user_metadata.full_name || authUser.user_metadata.name || email.split('@')[0];
    const avatar = name.charAt(0).toUpperCase();

    // 1. Supabase DB에서 유저 정보(등급 포함) 가져오기
    const { data: dbUser } = await supabase
      .from('users')
      .select('plan, role')
      .eq('id', authUser.id)
      .single();

    // 2. 등급 결정 (DB 값이 있으면 그걸 사용, 대소문자 무시)
    const currentPlan = dbUser?.plan ? dbUser.plan.toLowerCase() : 'free';
    const currentRole = dbUser?.role || (email.includes('admin') ? 'admin' : 'user');

    // 3. 앱 상태 업데이트
    setUser({ 
      id: authUser.id,
      name, 
      email, 
      avatar, 
      plan: currentPlan, // ★ DB에서 가져온 등급 사용
      role: currentRole,
      provider: authUser.app_metadata.provider || 'email'
    });

    // 4. DB에 접속 기록 저장 (등급은 덮어쓰지 않음)
    const { error } = await supabase.from('users').upsert({ 
      id: authUser.id,
      email: email,
      name: name,
      last_login: new Date().toISOString()
      // plan, role은 업데이트하지 않음 (기존 값 유지)
    }, { onConflict: 'id' });

    if (error) console.error("DB Save Error:", error);
  };

  // 이메일 로그인/가입 함수
  const handleEmailAuth = async () => {
    if (!email || !password) return alert("メールアドレスとパスワードを入力してください。");
    setIsLoading(true);
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      setIsLoginModalOpen(false);
      if (isSignUp) alert("登録に成功しました！");
    } catch (error) {
      alert("エラー: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 함수
  const handleLogin = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      alert("Login Error: " + error.message);
    } finally {
      setIsLoading(false);
      setIsLoginModalOpen(false);
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => { 
    await supabase.auth.signOut();
    setUser(null); 
    setMyPortfolio([]); 
    setMyWatchlist([]); 
    setActiveTab('home'); 
  };

  const addToPortfolio = (entry) => { setMyPortfolio(prev => [...prev, { ...entry, id: Date.now() }]); alert("ポートフォリオに追加しました！"); };
  const toggleWatchlist = (fundId) => { if (!user) { setIsLoginModalOpen(true); return; } if (myWatchlist.includes(fundId)) { setMyWatchlist(prev => prev.filter(id => id !== fundId)); } else { setMyWatchlist(prev => [...prev, fundId]); } };
  const goToFundDetail = (fundId) => { setSelectedFundId(fundId); setActiveTab('fund-detail'); window.scrollTo(0, 0); };
  const handleAdminAccess = () => { 
    if (user?.role === 'admin') { setActiveTab('admin'); window.scrollTo(0,0); }
    else { alert("管理者権限が必要です。"); }
  };
  const handleSaveRiskProfile = (result) => { if (user) { setUser(prev => ({ ...prev, riskProfile: result })); alert(`診断結果「${result}」をマイページに保存しました。`); } else { alert(`あなたは「${result}」です。\nログインすると結果を保存できます。`); setIsLoginModalOpen(true); } setIsRiskModalOpen(false); };

  const handleNavClick = (tab, category = null) => {
      setActiveTab(tab);
      if (category) setComparisonCategory(category);
      window.scrollTo(0,0);
  }

  if (isMaintenance) return <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white"><Construction size={48} className="mb-4 text-orange-500"/><h1 className="text-3xl font-bold">Coming Soon</h1></div>;

  // --- Render ---
  return (
    <div className={darkMode ? "dark" : ""}>
    <div className="bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 relative pb-12 min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 sticky top-0 z-40 shadow-sm border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}><div className="text-orange-500"><Search className="w-6 h-6 transform -scale-x-100" strokeWidth={3} /></div><span className="text-2xl font-bold text-orange-500 tracking-tighter">MoneyMart</span></div>
          <div className="flex items-center gap-4 text-sm font-medium">
            
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (<div className="flex items-center gap-3 animate-fadeIn"><button onClick={() => setActiveTab('mypage')} className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${activeTab === 'mypage' ? 'bg-orange-100 text-orange-700 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><User size={18} /> マイページ</button><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-900 dark:bg-orange-500`}>{user.avatar}</div><button onClick={handleLogout} className="text-slate-400 hover:text-red-500 ml-1"><LogOut size={20} /></button></div>) : (<button onClick={() => setIsLoginModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm">ログイン</button>)}
          </div>
        </div>
        <div className="border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-white dark:bg-slate-900"><div className="max-w-7xl mx-auto px-4 flex space-x-8 text-sm md:text-base font-medium whitespace-nowrap">
            <NavItem icon={<Home size={18} />} text="ホーム" active={activeTab === 'home'} onClick={() => handleNavClick('home')} />
            <NavItem icon={<BarChart2 size={18} />} text="ファンド" active={activeTab === 'fund' || activeTab === 'fund-detail'} onClick={() => handleNavClick('fund')} />
            <NavItem icon={<PieChart size={18} />} text="金融商品比較" active={activeTab === 'compare'} onClick={() => handleNavClick('compare', 'card')} />
            <NavItem icon={<TrendingUp size={18} />} text="マーケット" active={activeTab === 'market'} onClick={() => handleNavClick('market')} />
            <NavItem icon={<Users size={18} />} text="コミュニティ" active={activeTab === 'community'} onClick={() => handleNavClick('community')} />
            <NavItem icon={<BookOpen size={18} />} text="学ぶ・ツール" active={activeTab === 'learn'} onClick={() => handleNavClick('learn')} />
            <NavItem icon={user?.plan === 'premium' ? <Crown size={18} className="text-yellow-500" /> : <Lock size={18} />} text="プレミアム" active={activeTab === 'premium' || activeTab === 'payment'} onClick={() => handleNavClick('premium')} />
        </div></div>
      </header>

      {/* Main Content */}
      <main className="bg-white dark:bg-slate-900">
        {activeTab === 'home' ? <HomePage onNavigate={(page) => setActiveTab(page)} setIsLoginModalOpen={setIsLoginModalOpen} user={user} openRiskModal={() => setIsRiskModalOpen(true)} /> : 
         activeTab === 'fund' ? <FundPage onFundClick={goToFundDetail} user={user} myWatchlist={myWatchlist} toggleWatchlist={toggleWatchlist} addToPortfolio={addToPortfolio} openLogin={() => setIsLoginModalOpen(true)} /> : 
         activeTab === 'fund-detail' ? <FundDetailPage fundId={selectedFundId} onBack={() => setActiveTab('fund')} /> : 
         activeTab === 'compare' ? <FinancialComparisonPage defaultCategory={comparisonCategory} /> : 
         activeTab === 'market' ? <MarketPage /> : 
         activeTab === 'community' ? <CommunityPage /> :
         activeTab === 'learn' ? <LearningPage /> :
         activeTab === 'premium' ? <Payment /> : 
         activeTab === 'payment' ? <Payment /> : 
         activeTab === 'mypage' ? <MyPage user={user} portfolio={myPortfolio} watchlist={myWatchlist} setPortfolio={setMyPortfolio} setWatchlist={setMyWatchlist} /> : 
         activeTab === 'admin' ? <AdminPage users={allUsers} /> : 
         <div className="py-20 text-center text-slate-500">準備中のページです</div>}
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center relative transition-colors">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24}/></button>
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
              <User className="text-orange-600 dark:text-orange-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {isSignUp ? "アカウント作成" : "おかえりなさい"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">MoneyMartへようこそ</p>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 mb-1 block">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm dark:text-white font-bold outline-none focus:ring-2 focus:ring-orange-500" placeholder="hello@moneymart.jp" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 mb-1 block">Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm dark:text-white font-bold outline-none focus:ring-2 focus:ring-orange-500" placeholder="••••••" />
              </div>
              
              <button onClick={handleEmailAuth} className="w-full bg-slate-900 hover:bg-black dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg mt-2">
                {isLoading ? <Loader2 className="animate-spin"/> : <span className="flex items-center gap-2"><Mail size={16}/> {isSignUp ? "登録する" : "ログイン"}</span>}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
               <div className="grid grid-cols-3 gap-2 mb-4">
                  <button onClick={() => handleLogin('google')} className="bg-white border border-slate-200 p-2 rounded-xl hover:bg-slate-50 flex justify-center"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/></button>
                  <button onClick={() => handleLogin('line')} className="bg-[#06C755] p-2 rounded-xl hover:opacity-90 flex justify-center text-white font-bold text-xs items-center">LINE</button>
                  <button onClick={() => handleLogin('yahoo')} className="bg-[#FF0033] p-2 rounded-xl hover:opacity-90 flex justify-center text-white font-bold text-xs items-center">Yahoo</button>
               </div>
              <button onClick={()=>setIsSignUp(!isSignUp)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-bold transition">
                {isSignUp ? "すでにアカウントをお持ちですか？ ログイン" : "アカウントをお持ちでないですか？ 新規登録"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk Modal */}
      {isRiskModalOpen && <RiskAssessmentModal onClose={() => setIsRiskModalOpen(false)} onSave={handleSaveRiskProfile} />}

      {/* Footer */}
      <section className="py-8 bg-black text-slate-500 border-t border-slate-800"><div className="container mx-auto px-6"><div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-medium mb-6">{[{i:Shield,t:"SSL暗号化通信"},{i:Lock,t:"個人情報保護"},{i:Building2,t:"独立系FP監修"},{i:Gift,t:"東京発・日本特化"}].map((x,i)=>(<div key={i} className="flex items-center gap-2"><x.i className="w-4 h-4 text-slate-400"/><span>{x.t}</span></div>))}</div><div className="mb-6 px-4 py-4 bg-slate-900 border border-slate-800 rounded-lg text-[10px] md:text-xs text-slate-500 text-center leading-relaxed"><p><strong>免責事項：</strong>本サイトは金融商品の情報提供を目的としており、特定の金融商品の推奨、勧誘を目的としたものではありません。投資に関する最終決定は、お客様ご自身の判断と責任において行われるようお願いいたします。</p></div><div className="flex justify-between items-end border-t border-slate-800 pt-6"><div className="text-xs text-slate-600">© 2026 MoneyMart. All rights reserved.</div><button onClick={handleAdminAccess} className="flex items-center gap-1 text-slate-700 hover:text-slate-400 text-xs transition-colors"><Lock size={10} /> 管理者ページ</button></div></div></section>
       
      <AIAdvisorChat />
    </div>
    </div>
  );
};

export default App;