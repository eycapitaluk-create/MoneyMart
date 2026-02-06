import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. 이메일 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // 로그인 성공 시 메인으로 이동
      navigate('/');
      
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg("メールアドレスまたはパスワードが正しくありません。");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 소셜 로그인 처리 (Google, Line, Yahoo 등)
  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin, // 로그인 후 돌아올 주소
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Social login error:", error);
      setErrorMsg(`${provider}ログインに失敗しました。`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">MoneyMart</h1>
          <p className="text-slate-500 text-sm">
            資産形成の第一歩を、ここから。
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Social Login Buttons (일본 선호도 순) */}
        <div className="space-y-3 mb-8">
            {/* LINE (일본 필수) */}
            <button 
                onClick={() => handleSocialLogin('line')}
                className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" className="w-5 h-5 invert brightness-0"/>
                LINEでログイン
            </button>

            {/* Google */}
            <button 
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                Googleでログイン
            </button>

            {/* Yahoo! JAPAN (OpenID Connect 필요 - 여기선 아이콘만 배치) */}
            {/* 참고: Supabase 기본 제공자가 아닌 경우 설정이 복잡할 수 있어 일단 버튼만 둡니다 */}
            <button 
                onClick={() => handleSocialLogin('yahoo')} // Supabase 'yahoo'는 미국 야후입니다. (일본 야후는 별도 설정 필요)
                className="w-full bg-[#FF0033] hover:bg-[#e6002e] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
            >
                <span className="font-black text-lg">Y!</span> Yahoo! JAPANID
            </button>
        </div>

        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400">または メールアドレス</span></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20}/>
            <input 
              type="email" 
              placeholder="メールアドレス" 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20}/>
            <input 
              type="password" 
              placeholder="パスワード" 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-orange-500">パスワードをお忘れですか？</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin"/> : <>ログイン <ArrowRight size={20}/></>}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          アカウントをお持ちでないですか？{' '}
          <Link to="/signup" className="text-orange-500 font-bold hover:underline">
            新規登録 (無料)
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;