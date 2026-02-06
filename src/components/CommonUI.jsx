import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BarChart2, TrendingUp, Users, BookOpen, Lock, 
  Menu, X, LogIn, Moon, Sun, User, LogOut, ShieldCheck, Landmark 
} from 'lucide-react';
import ChatBot from './ChatBot'; 

// 네비게이션 아이템 컴포넌트
const NavItem = ({ to, icon, text, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm font-bold transition-all rounded-lg whitespace-nowrap ${
      active 
        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' 
        : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export const Header = ({ darkMode, toggleDarkMode, user, handleLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', text: 'ホーム', icon: <Home size={18} /> },
    { path: '/funds', text: 'ファンド', icon: <BarChart2 size={18} /> },
    { path: '/market', text: 'マーケット', icon: <TrendingUp size={18} /> },
    { path: '/products', text: '金融商品比較', icon: <ShieldCheck size={18} /> }, 
    { path: '/community', text: 'コミュニティ', icon: <Users size={18} /> },
    { path: '/learn', text: '学ぶ・ツール', icon: <BookOpen size={18} /> },
    { path: '/premium', text: 'プレミアム', icon: <Lock size={18} /> },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-slate-800 h-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-8 group">
          <div className="bg-orange-500 text-white p-1.5 rounded-lg font-bold text-xl shadow-sm group-hover:bg-orange-600 transition">
            M
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter group-hover:text-orange-500 transition-colors">
            MoneyMart
          </span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <NavItem 
              key={link.path}
              to={link.path} 
              text={link.text} 
              icon={link.icon}
              active={location.pathname === link.path} 
            />
          ))}
        </nav>

        {/* 우측 유틸리티 (로그인/다크모드) */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto xl:ml-0">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 animate-fadeIn">
              <Link 
                to="/mypage"
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-full transition"
              >
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-black">
                    {user.avatar || <User size={14}/>}
                </div>
                <span>マイページ</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-50 dark:hover:bg-slate-800"
                title="ログアウト"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
                to="/login" 
                className="flex items-center gap-2 text-sm font-bold bg-gray-900 dark:bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-orange-600 transition shadow-sm"
            >
                <LogIn size={16} /> ログイン
            </Link>
          )}
        </div>

        {/* 모바일 메뉴 버튼 (햄버거) */}
        <div className="flex xl:hidden ml-auto items-center gap-2">
             <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
             <button 
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 absolute w-full shadow-xl z-50 animate-slideDown">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <NavItem 
                key={link.path}
                to={link.path}
                text={link.text}
                icon={link.icon}
                active={location.pathname === link.path}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
            <div className="border-t border-gray-100 dark:border-slate-800 pt-3 mt-2">
               {user ? (
                 <>
                    <Link to="/mypage" className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                        <User size={18}/> マイページ ({user.name})
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-3 text-sm font-bold text-red-500">
                        <LogOut size={18}/> ログアウト
                    </button>
                 </>
               ) : (
                 <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-orange-500 text-white py-3 rounded-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={18} /> ログイン
                 </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// ★ [수정됨] Footer: 문의하기 제거 & 시스템 현황 클릭 가능
export const Footer = () => (
  <footer className="bg-slate-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 pt-16 pb-12 mt-auto transition-colors font-sans">
    <div className="max-w-7xl mx-auto px-6">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        {/* 1. MoneyMart 정보 */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">MoneyMartについて</h3>
          <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <li><Link to="/about" className="hover:text-orange-500 transition">運営会社</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500 transition">利用規約</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-500 transition">プライバシーポリシー</Link></li>
            <li><Link to="/security" className="hover:text-orange-500 transition">セキュリティ宣言</Link></li>
          </ul>
        </div>

        {/* 2. 서비스 */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">サービス</h3>
          <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <li><Link to="/funds" className="hover:text-orange-500 transition">ファンド検索</Link></li>
            <li><Link to="/market" className="hover:text-orange-500 transition">マーケット情報</Link></li>
            <li><Link to="/products" className="hover:text-orange-500 transition">金融商品比較</Link></li>
            <li><Link to="/premium" className="hover:text-orange-500 transition">プレミアムプラン</Link></li>
          </ul>
        </div>

        {/* 3. 서포트 (수정됨) */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">サポート</h3>
          <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <li><Link to="/help" className="hover:text-orange-500 transition">ヘルプセンター (FAQ)</Link></li>
            {/* 문의하기(Contact) 삭제됨 -> 챗봇 유도 */}
            <li>
              <Link to="/status" className="flex items-center gap-2 hover:text-orange-500 transition">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                システム稼働状況
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. 회사 로고 및 위치 */}
        <div className="md:text-right">
          <div className="flex items-center gap-2 md:justify-end mb-4 opacity-80">
             <Landmark className="text-orange-500" size={24}/>
             <span className="text-xl font-black text-slate-900 dark:text-white">MoneyMart</span>
          </div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">MoneyMart Inc.</p>
          <p className="text-xs text-slate-400">Tokyo, Japan</p>
          <p className="text-[10px] text-slate-300 dark:text-slate-500 mt-4">
            © 2026 MoneyMart Inc. All rights reserved.
          </p>
        </div>

      </div>

      {/* 하단 경계선 및 추가 정보 */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-[10px] text-slate-400 leading-relaxed">
         <p>
           ※ 本サービスは金融商品の比較・情報提供を目的としており、特定の商品の勧誘を目的とするものではありません。<br/>
           ※ 投資に関する最終決定は、お客様ご自身の判断でなさるようお願いいたします。
         </p>
      </div>

    </div>
  </footer>
);

const CommonUI = ({ children, darkMode, toggleDarkMode, user, handleLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 font-sans text-gray-900 dark:text-gray-100 transition-colors relative">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} handleLogout={handleLogout} />
      
      <main className="flex-grow pt-4">
        {children}
      </main>
      
      <Footer />
      
      <ChatBot /> 
    </div>
  );
};

export default CommonUI;