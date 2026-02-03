import React, { useState, useEffect } from 'react';
import { 
  Lock, Trash2, Shield, TrendingUp, Landmark, Crown, Check 
} from 'lucide-react';
import { FUNDS_DATA } from '../data/mockData'; // 데이터 가져오기

// 1. 네비게이션 아이템
export const NavItem = ({ icon, text, active, locked, onClick }) => (
  <div onClick={locked ? undefined : onClick} className={`flex items-center gap-2 py-4 px-2 cursor-pointer border-b-2 transition-colors relative group whitespace-nowrap ${active ? 'border-orange-500 text-orange-600 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
    {icon} <span>{text}</span> {locked && <Lock size={12} className="text-slate-300 dark:text-slate-600 ml-1"/>}
  </div>
);

// 2. 뱃지
export const Badge = ({ text, color }) => (
  <span className={`inline-block px-3 py-1 bg-${color}-100 text-${color}-600 dark:bg-${color}-900 dark:text-${color}-300 rounded-full text-xs font-bold mb-3`}>{text}</span>
);

// 3. 도넛 차트
export const SimpleDonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  if (total === 0) return <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto flex items-center justify-center text-xs text-slate-400">No Data</div>;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full overflow-visible">
        {data.map((item, index) => {
          if (item.value === 0) return null;
          const sliceAngle = (item.value / total) * 2 * Math.PI;
          const x1 = Math.cos(currentAngle);
          const y1 = Math.sin(currentAngle);
          const x2 = Math.cos(currentAngle + sliceAngle);
          const y2 = Math.sin(currentAngle + sliceAngle);
          const largeArc = sliceAngle > Math.PI ? 1 : 0;
          const path = Math.abs(sliceAngle - 2 * Math.PI) < 0.001 
            ? `M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0`
            : `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`;
          currentAngle += sliceAngle;
          return <path key={index} d={path} fill={item.color} stroke="transparent" />;
        })}
        <circle cx="0" cy="0" r="0.6" className="fill-white dark:fill-slate-800 transition-colors duration-300" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] text-slate-400 font-bold">Total</span>
        <span className="text-sm font-black text-slate-800 dark:text-white">¥{(total/10000).toFixed(0)}万</span>
      </div>
    </div>
  );
};

// 4. 막대 차트
export const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.amount)) || 1;
  return (
    <div className="flex items-end gap-2 h-32 mt-4 px-2 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
          <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-t-sm relative flex items-end overflow-hidden h-full">
             <div style={{height: `${(d.amount / max) * 100}%`, width: '100%'}} className="bg-green-400 dark:bg-green-500 rounded-t-sm transition-all duration-500 hover:bg-green-300 absolute bottom-0"></div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{d.month}月</span>
        </div>
      ))}
    </div>
  )
};

// 5. 삭제 확인 모달
export const DeleteConfirmationModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center border border-slate-100 dark:border-slate-700">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={24} /></div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">削除しますか？</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">この操作は取り消せません。</p>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">削除</button>
        <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">キャンセル</button>
      </div>
    </div>
  </div>
);

// 6. 롤링 배너
export const RollingAdBanner = () => {
  const ads = [
    { title: "ソニー損保", desc: "ネット割引最大。ロードサービス充実", bg: "from-orange-50 to-white", border: "border-orange-200", iconColor: "bg-orange-100", icon: Shield, tag: "人気" },
    { title: "eMAXIS Slim", desc: "業界最低水準の運用コスト", bg: "from-green-50 to-white", border: "border-green-200", iconColor: "bg-green-100", icon: TrendingUp, tag: "注目" },
    { title: "SBI証券", desc: "手数料0円革命。NISA口座数No.1", bg: "from-blue-50 to-white", border: "border-blue-200", iconColor: "bg-blue-100", icon: Landmark, tag: "厳選" }
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % ads.length), 4000); return () => clearInterval(t); }, []);
  const ad = ads[idx];
  return (
    <div className={`h-full rounded-2xl shadow-sm border ${ad.border} bg-gradient-to-r ${ad.bg} p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 dark:bg-none dark:bg-slate-800 dark:border-slate-700`}>
      <span className="absolute top-4 left-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold px-2 py-1 rounded shadow-sm z-20 dark:text-white">{ad.tag}</span>
      <div className="relative z-10 mt-8">
        <div className={`w-14 h-14 ${ad.iconColor} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}><ad.icon className="w-7 h-7 text-slate-700" /></div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ad.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{ad.desc}</p>
      </div>
      <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white w-full py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition relative z-10">詳細を見る</button>
    </div>
  );
};

// 7. 추천 펀드 광고
export const FeaturedFundsAd = ({ onFundClick }) => {
  const featured = FUNDS_DATA.slice(0, 3); 
  return (
    <div className="bg-[#FFF8F0] dark:bg-slate-800 border border-[#FFE4C4] dark:border-slate-700 rounded-lg p-5 mb-6 relative shadow-sm transition-colors duration-300">
      <div className="absolute top-0 right-0 bg-[#F06529] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">AD</div>
      <h3 className="text-[#A05E2B] dark:text-orange-400 font-bold mb-4 flex items-center gap-2"><Crown className="w-5 h-5 fill-[#A05E2B] dark:fill-orange-400" /> 厳選ファンド</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {featured.map(fund => (
          <div key={`ad-${fund.id}`} onClick={() => onFundClick(fund.id)} className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/50 transition cursor-pointer flex flex-col justify-between">
            <div><h4 className="font-bold text-gray-800 dark:text-white text-sm mb-3 h-10 line-clamp-2 leading-snug group-hover:text-[#F06529] dark:group-hover:text-orange-400">{fund.name}</h4><div className="flex justify-between items-stretch gap-2 text-center mb-4"><div className="bg-green-50 dark:bg-green-900/30 px-2 py-2 rounded flex-1 flex flex-col justify-center"><div className="text-[10px] text-gray-500 dark:text-slate-400 mb-0.5">年間リターン</div><div className="font-bold text-green-600 dark:text-green-400 text-sm">{fund.return.toFixed(2)}%</div></div><div className="bg-blue-50 dark:bg-blue-900/30 px-2 py-2 rounded flex-1 flex flex-col justify-center"><div className="text-[10px] text-gray-500 dark:text-slate-400 mb-0.5">信託報酬</div><div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{fund.fee.toFixed(2)}%</div></div></div></div>
            <button className="w-full border border-[#F06529] text-[#F06529] dark:border-orange-500 dark:text-orange-400 bg-white dark:bg-slate-800 text-xs font-bold py-2 rounded hover:bg-[#FFF8F0] dark:hover:bg-slate-600 transition">詳細を見る</button>
          </div>
        ))}
      </div>
    </div>
  );
};