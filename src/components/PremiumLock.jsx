import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown } from 'lucide-react';

const PremiumLock = ({ user, children, title = "Premium 機能", blurAmount = "blur-md" }) => {
  const navigate = useNavigate();
  // user가 없거나(비로그인), plan이 'premium'이 아니면 잠금 처리
  // (admin은 프리패스)
  const isLocked = !user || (user.plan !== 'premium' && user.role !== 'admin');

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-[inherit]">
      {/* 1. 흐릿하게 보일 원본 컨텐츠 (클릭 방지) */}
      <div className={`pointer-events-none select-none opacity-60 ${blurAmount} transition duration-500`}>
        {children}
      </div>

      {/* 2. 잠금 오버레이 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/10 dark:bg-black/40 backdrop-blur-[2px]">
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl shadow-2xl text-center max-w-xs border border-white/20 transform transition hover:scale-105 duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg text-white">
            <Lock size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">
            この機能はプレミアム会員限定です。<br/>
            アップグレードして全ての分析を解除。
          </p>
          <button 
            onClick={() => navigate('/premium')}
            className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:shadow-xl transition"
          >
            <Crown size={16} className="text-yellow-400 dark:text-orange-600"/> 
            今すぐアップグレード
          </button>
        </div>
      </div>
    </div>
  );
};

// 👇 이 줄이 꼭 있어야 합니다!
export default PremiumLock;