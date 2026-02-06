import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Loader2, User, Mail, Lock, CheckCircle, FileText, ChevronDown 
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { INITIAL_USERS } from './data/mockData';
import CommonUI from './components/CommonUI';
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
// ★ ProductPage (구 LoanPage)
import ProductPage from './pages/ProductPage';
// ★★★ [중요] RiskModal import
import RiskModal from './components/RiskModal';

const TERMS_TEXT = `
【利用規約】
第1条（目的）
本規約は、MoneyMart（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
(中略... スクロールテスト用)
第2条...
第3条...
以上
`;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [myPortfolio, setMyPortfolio] = useState([]); 
  const [myWatchlist, setMyWatchlist] = useState([]); 
  const [darkMode, setDarkMode] = useState(false);

  // 회원가입용 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [canAgree, setCanAgree] = useState(false); 
  const termsBoxRef = useRef(null); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkAndSaveUser(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) checkAndSaveUser(session.user);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginModalOpen(true);
      navigate('/'); 
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!isLoginModalOpen || !isSignUp) {
        setCanAgree(false);
        setAgreeTerms(false);
    }
  }, [isLoginModalOpen, isSignUp]);

  const handleScrollTerms = () => {
    if (termsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = termsBoxRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setCanAgree(true);
        }
    }
  };

  // src/App.jsx 내부 checkAndSaveUser 함수 수정

  const checkAndSaveUser = async (authUser) => {
    if (!authUser) return;
    const email = authUser.email;
    const name = authUser.user_metadata.full_name || authUser.user_metadata.name || email.split('@')[0];
    const avatar = name.charAt(0).toUpperCase();

    const { data: dbUser } = await supabase.from('users').select('plan, role, risk_profile').eq('id', authUser.id).single();
    
    setUser({ 
      id: authUser.id, name, email, avatar, 
      
      // 🚩 [수정] 개발 중에는 무조건 'premium'으로 설정해서 기능을 확인하세요!
      // 테스트가 끝나면: dbUser?.plan?.toLowerCase() || 'free' 로 되돌리세요.
      plan: 'premium', 
      
      role: dbUser?.role || (email.includes('admin') ? 'admin' : 'user'),
      riskProfile: dbUser?.risk_profile || null,
    });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return alert("メールアドレスとパスワードを入力してください。");
    
    if (isSignUp) {
        if (!name) return alert("お名前を入力してください。");
        if (!agreeTerms) return alert("利用規約に同意してください。");
    }

    setIsLoading(true);
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, password,
            options: { data: { full_name: name } }
          })
        : await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      setIsLoginModalOpen(false);
      setEmail(''); setPassword(''); setName(''); setAgreeTerms(false);
      if (isSignUp) alert("登録に成功しました！");
    } catch (e) { alert("エラー: " + e.message); }
    finally { setIsLoading(false); }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (e) { alert("ソーシャルログインエラー: " + e.message); }
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setUser(null); 
    setMyPortfolio([]);
    setMyWatchlist([]);
    navigate('/'); 
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <CommonUI darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} user={user} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={(path) => navigate(path)} user={user} openRiskModal={() => setIsRiskModalOpen(true)} />} />
          <Route path="/funds" element={<FundPage user={user} myWatchlist={myWatchlist} toggleWatchlist={(id) => { if(!user) setIsLoginModalOpen(true); else setMyWatchlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]) }} />} />
          
          {/* 👇 [수정됨] user 정보를 넘겨줘야 FundDetailPage 내부의 PremiumLock이 작동합니다! */}
          <Route path="/fund/:id" element={<FundDetailPage user={user} />} />
          
          <Route path="/comparison" element={<FinancialComparisonPage />} />
          <Route path="/mypage" element={<MyPage user={user} watchlist={myWatchlist} />} />
          <Route path="/market" element={<MarketPage />} />
          
          {/* 👇 [수정됨] user 정보를 넘겨줘야 ProductPage 내부의 PremiumLock이 작동합니다! */}
          <Route path="/products" element={<ProductPage user={user} />} />
          
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/learn" element={<LearningPage user={user} />} />
          <Route path="/premium" element={<Payment />} />
          <Route path="/admin" element={<AdminPage users={INITIAL_USERS} />} />
          <Route path="/login" element={<div/>} /> 
        </Routes>
      </CommonUI>
      
      <RiskModal 
        isOpen={isRiskModalOpen} 
        onClose={() => setIsRiskModalOpen(false)} 
      />

      {/* Login / Signup Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center relative transition-colors">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24}/></button>
            
            <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {isSignUp ? "アカウント作成" : "おかえりなさい"}
                </h3>
                <p className="text-sm text-slate-500">
                    {isSignUp ? "情報を入力して登録してください" : "MoneyMartへようこそ"}
                </p>
            </div>

            <div className="space-y-4 text-left">
              {isSignUp && (
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl pl-10 p-3 font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="お名前 (例: 山田 太郎)" />
                  </div>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl pl-10 p-3 font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="メールアドレス" />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl pl-10 p-3 font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="パスワード" />
              </div>

              {isSignUp && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1">
                              <FileText size={12}/> 利用規約
                          </span>
                          {!canAgree && (
                              <span className="text-[10px] text-orange-500 font-bold animate-pulse flex items-center gap-1">
                                  最後までスクロール <ChevronDown size={10}/>
                              </span>
                          )}
                      </div>
                      
                      <div 
                        ref={termsBoxRef}
                        onScroll={handleScrollTerms}
                        className="h-24 overflow-y-auto text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                      >
                          {TERMS_TEXT}
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="relative flex items-center">
                              <input 
                                type="checkbox" 
                                id="terms" 
                                disabled={!canAgree} 
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-orange-500 checked:bg-orange-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all"
                              />
                              <CheckCircle size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                          </div>
                          <label 
                            htmlFor="terms" 
                            className={`text-xs select-none leading-tight ${canAgree ? 'text-slate-700 dark:text-slate-300 cursor-pointer' : 'text-slate-400 cursor-not-allowed'}`}
                          >
                              利用規約に同意します
                          </label>
                      </div>
                  </div>
              )}

              <button 
                onClick={handleEmailAuth} 
                disabled={isSignUp && !agreeTerms}
                className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg mt-2
                    ${(isSignUp && !agreeTerms) 
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-900 hover:bg-black dark:bg-orange-500 dark:hover:bg-orange-600 text-white'}`
                }
              >
                {isLoading ? <Loader2 className="animate-spin"/> : (isSignUp ? "同意して登録" : "ログイン")}
              </button>
            </div>

            <div className="my-6 flex items-center gap-2">
                <div className="h-px bg-slate-100 dark:bg-slate-700 flex-1"></div>
                <span className="text-xs text-slate-400 font-bold">OR</span>
                <div className="h-px bg-slate-100 dark:bg-slate-700 flex-1"></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <button onClick={() => handleSocialLogin('google')} className="bg-white border border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl flex items-center justify-center transition">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/>
                </button>
                <button onClick={() => handleSocialLogin('line')} className="bg-[#06C755] hover:opacity-90 py-2.5 rounded-xl flex items-center justify-center transition text-white font-bold text-xs">
                    LINE
                </button>
                <button onClick={() => handleSocialLogin('yahoo')} className="bg-[#FF0033] hover:opacity-90 py-2.5 rounded-xl flex items-center justify-center transition text-white font-bold text-xs">
                    Yahoo
                </button>
            </div>

            <button onClick={()=>setIsSignUp(!isSignUp)} className="text-sm text-slate-500 dark:text-slate-400 font-bold hover:text-orange-500 transition">
                {isSignUp ? "すでにアカウントをお持ちの方は ログイン" : "アカウントをお持ちでない方は 新規登録"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;