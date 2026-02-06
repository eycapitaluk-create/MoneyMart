import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 font-sans transition-colors">
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

          {/* 3. 서포트 (수정됨: 문의하기 삭제, 시스템현황 링크 연결) */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">サポート</h3>
            <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="/help" className="hover:text-orange-500 transition">ヘルプセンター (FAQ)</Link></li>
              {/* 문의하기(Contact) 삭제됨 -> 챗봇 이용 유도 */}
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
            <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-4">
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
};

export default Footer;