import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Wallet, Bell, RefreshCw, 
  TrendingUp, ShieldCheck, Trash2, X, Gift, Coins, Zap, CreditCard,
  AlertTriangle, Activity, Sliders // ★ 아이콘 추가
} from 'lucide-react';
import PremiumLock from '../components/PremiumLock'; // ★ PremiumLock import

const INITIAL_ASSETS = [
  { id: 1, name: '米国株 (Tesla)', buyPrice: 20000, currentPrice: 24800, qty: 10, color: '#EF4444' },
  { id: 2, name: '全世界株式', buyPrice: 15000, currentPrice: 14500, qty: 20, color: '#3B82F6' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'alert', msg: 'Netflixの決済日が近づいています (明日)', time: '1時間前', read: false },
  { id: 2, type: 'info', msg: '米国株が前日比 +5% 上昇しました', time: '3時間前', read: false },
  { id: 3, type: 'success', msg: '旅行資金の積立が完了しました', time: '昨日', read: true },
];

const INITIAL_CARDS = [
  { id: 1, name: 'Main Card', type: 'VISA', date: '毎月15日', dday: 3, color: 'from-slate-700 to-slate-900' },
  { id: 2, name: 'Shopping', type: 'AMEX', date: '毎月25日', dday: 13, color: 'from-orange-400 to-pink-500' },
];

const INITIAL_SUBS = [
  { id: 1, name: 'Netflix', price: 1490, date: '12日', icon: 'N' },
  { id: 2, name: 'YouTube Prem', price: 1280, date: '15日', icon: 'Y' },
];

const INITIAL_SAVINGS = [
  { id: 1, name: '旅行資金', bank: '新生銀行', target: 300000, current: 240000, date: '2026.04.20' },
];

const INITIAL_POINTS = [
  { id: 1, name: 'Rakuten', val: 5400, color: 'bg-blue-600', icon: 'R' },
  { id: 2, name: 'V-Point', val: 2100, color: 'bg-yellow-500', icon: 'V' },
];

const INITIAL_FURUSATO = { limit: 70000, donated: 45000 };

// --- [NEW] Debt Dashboard Component ---
const DebtDashboard = () => {
  const [rateHike, setRateHike] = useState(0); 
  
  const loanPrincipal = 30000000;
  const currentRate = 0.475; // %
  const currentPayment = 85000;
  
  // 시나리오 계산 (약식)
  const simulatedPayment = Math.round(currentPayment * (1 + (rateHike * 0.15))); 
  const increaseAmount = simulatedPayment - currentPayment;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg relative overflow-hidden">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-rose-500"/> 負債・リスク分析
          </h3>
          <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-1 rounded-lg">要注意</span>
       </div>

       {/* 1. 현재 부채 상태 (DSR 등) */}
       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
             <div className="text-xs text-slate-500 mb-1 font-bold">返済負担率 (DSR)</div>
             <div className="text-2xl font-black text-slate-900 dark:text-white">22.5<span className="text-sm font-medium text-slate-400">%</span></div>
             <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-500 h-full w-[22.5%]"></div>
             </div>
             <p className="text-[10px] text-green-600 mt-1 font-bold">適正範囲内です</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
             <div className="text-xs text-slate-500 mb-1 font-bold">金利タイプ比率</div>
             <div className="text-2xl font-black text-slate-900 dark:text-white">100<span className="text-sm font-medium text-slate-400">% 変動</span></div>
             <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full w-full"></div>
             </div>
             <p className="text-[10px] text-rose-500 mt-1 font-bold">金利上昇リスクあり</p>
          </div>
       </div>

       {/* 2. 미래 시나리오 시뮬레이션 */}
       <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
             <Sliders size={16} className="text-orange-400"/>
             <span className="font-bold text-sm">金利上昇シナリオ分析</span>
          </div>
          
          <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>現在 (+0%)</span>
                <span>+2.0%</span>
             </div>
             <input 
               type="range" min="0" max="2" step="0.5" 
               value={rateHike} onChange={(e) => setRateHike(Number(e.target.value))}
               className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
             />
             <div className="text-center mt-2 font-bold text-orange-400">
                もし金利が +{rateHike.toFixed(1)}% 上がったら...
             </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
             <div>
                <p className="text-xs text-slate-400">毎月の返済額</p>
                <p className="text-xl font-bold">¥{simulatedPayment.toLocaleString()}</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-400">負担増加額</p>
                <p className="text-xl font-bold text-rose-500">+¥{increaseAmount.toLocaleString()}</p>
             </div>
          </div>
          
          {rateHike > 1.0 && (
             <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl flex items-start gap-2 text-xs text-rose-200">
                <AlertTriangle size={14} className="mt-0.5 shrink-0"/>
                家計への影響が大きいため、固定金利への借り換え検討を推奨します。
             </div>
          )}
       </div>
    </div>
  );
};

// ★ user prop 추가 (App.js에서 내려줘야 함)
export default function MoneyMartFinal({ user, watchlist }) {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [subs, setSubs] = useState(INITIAL_SUBS);
  const [savings, setSavings] = useState(INITIAL_SAVINGS);
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [furusato, setFurusato] = useState(INITIAL_FURUSATO);
  
  const [budget, setBudget] = useState(100000);
  const [spent, setSpent] = useState(65000);

  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalPoint = points.reduce((acc, cur) => acc + cur.val, 0);

  const { totalAsset, totalProfit, profitRate, chartData } = useMemo(() => {
    let currentTotal = 0;
    let investTotal = 0;
    const data = assets.map(item => {
      const itemVal = item.currentPrice * item.qty;
      currentTotal += itemVal;
      investTotal += item.buyPrice * item.qty;
      return { name: item.name, value: itemVal, color: item.color };
    });
    const profit = currentTotal - investTotal;
    const rate = investTotal > 0 ? (profit / investTotal) * 100 : 0;
    return { totalAsset: currentTotal, totalProfit: profit, profitRate: rate.toFixed(1), chartData: data };
  }, [assets]);

  const handleReadNoti = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setIsNotiOpen(false);
  };

  const handleDelete = (type, id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    if (type === 'asset') setAssets(prev => prev.filter(i => i.id !== id));
    if (type === 'card') setCards(prev => prev.filter(i => i.id !== id));
    if (type === 'sub') setSubs(prev => prev.filter(i => i.id !== id));
    if (type === 'saving') setSavings(prev => prev.filter(i => i.id !== id));
    if (type === 'point') setPoints(prev => prev.filter(i => i.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    
    if (modalType === 'asset') {
      const newItem = {
        id: Date.now(),
        name: fd.get('name'),
        buyPrice: Number(fd.get('buyPrice')),
        currentPrice: Number(fd.get('currentPrice')),
        qty: Number(fd.get('qty')),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setAssets([...assets, newItem]);
    }
    if (modalType === 'expense') {
      setSpent(prev => prev + Number(fd.get('amount')));
    }
    if (modalType === 'furusato') {
      setFurusato(prev => ({ ...prev, donated: prev.donated + Number(fd.get('amount')) }));
    }
    if (modalType === 'point') {
      setPoints([...points, { id: Date.now(), name: fd.get('name'), val: Number(fd.get('val')), color: 'bg-purple-500', icon: 'P' }]);
    }
    if (modalType === 'saving') {
      const dateStr = fd.get('date').replace(/-/g, '.'); 
      setSavings([...savings, {
        id: Date.now(),
        name: fd.get('name'),
        bank: fd.get('bank'),
        target: Number(fd.get('target')),
        current: Number(fd.get('current')),
        date: dateStr
      }]);
    }
    if (modalType === 'card') {
      setCards([...cards, {
        id: Date.now(),
        name: fd.get('name'),
        type: 'CARD',
        date: `毎月${fd.get('date')}日`,
        dday: 30,
        color: 'from-indigo-500 to-purple-600'
      }]);
    }
    if (modalType === 'sub') {
      setSubs([...subs, {
        id: Date.now(),
        name: fd.get('name'),
        price: Number(fd.get('price')),
        date: `${fd.get('date')}日`,
        icon: fd.get('name').charAt(0).toUpperCase()
      }]);
    }
    setModalType(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-40 font-sans min-h-screen text-slate-800 dark:text-white animate-fadeIn">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-start mb-10 relative">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">MoneyMart</h1>
          <p className="text-lg text-slate-500 font-medium">{user ? `${user.name}様` : 'ゲスト様'}の資産ポートフォリオ</p>
        </div>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotiOpen(!isNotiOpen)}
            className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-105 transition active:scale-95"
          >
            <Bell size={28} className="text-slate-600 dark:text-slate-300"/>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {isNotiOpen && (
            <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-fadeIn origin-top-right">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg">お知らせ ({unreadCount})</h3>
                <button onClick={handleReadNoti} className="text-sm text-blue-500 font-bold hover:underline">すべて既読にする</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? notifications.map(noti => (
                  <div key={noti.id} className={`p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex gap-3 ${!noti.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!noti.read ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <p className={`text-sm ${!noti.read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>{noti.msg}</p>
                      <p className="text-xs text-slate-400 mt-1">{noti.time}</p>
                    </div>
                  </div>
                )) : <div className="p-8 text-center text-slate-400 text-sm">新しいお知らせはありません</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* [Left Column] */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* A. MoneyMon */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition duration-1000"></div>
             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
               <div className="bg-white/20 p-5 rounded-full text-5xl shadow-inner backdrop-blur-md animate-[bounce_3s_infinite]">🦅</div>
               <div className="flex-1 w-full text-center md:text-left">
                 <div className="inline-block bg-indigo-900/30 px-4 py-1 rounded-full text-sm font-bold text-indigo-200 mb-3 border border-indigo-400/30">MoneyMart AI アシスタント</div>
                 <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{user ? user.name : 'ゲスト'}様、今月の予算管理は順調です！</h2>
                 <p className="text-indigo-100 text-lg mb-6 opacity-90">
                   現在 <span className="font-bold text-white text-xl">{Math.round((spent/budget)*100)}%</span> 消費中。昨日に比べて支出ペースが落ち着いています。
                 </p>
                 <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden mb-3 ring-1 ring-white/10">
                   <div style={{ width: `${Math.min((spent/budget)*100, 100)}%` }} className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000"></div>
                 </div>
                 <div className="flex justify-between text-sm font-medium opacity-90 mb-4">
                   <span>支出: ¥{spent.toLocaleString()}</span>
                   <span>残り予算: ¥{(budget - spent).toLocaleString()}</span>
                 </div>
                 <button onClick={() => setModalType('expense')} className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition shadow-lg">+ 今日の支出を記録</button>
               </div>
             </div>
          </div>

          {/* B. Assets Portfolio */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl"><TrendingUp size={28}/></div>
                  <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">運用総資産</h3>
                </div>
                <p className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">¥ {totalAsset.toLocaleString()}</p>
                <p className={`text-lg font-bold mt-2 flex items-center gap-2 ${totalProfit >= 0 ? "text-red-500" : "text-blue-500"}`}>
                  {totalProfit >= 0 ? '▲' : '▼'} ¥{Math.abs(totalProfit).toLocaleString()} ({profitRate}%)
                </p>
              </div>
              <button onClick={() => setModalType('asset')} className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition">+ 資産入力</button>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="w-64 h-64 flex-shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-slate-400">Total</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">100%</span>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                {assets.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition group cursor-pointer border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <span className="text-lg font-bold text-slate-800 dark:text-white block">{item.name}</span>
                        <span className="text-sm text-slate-500">{item.qty}株保有</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <span className="block text-xl font-bold text-slate-900 dark:text-white">¥{(item.currentPrice * item.qty).toLocaleString()}</span>
                        <span className={`text-sm font-bold ${item.currentPrice >= item.buyPrice ? 'text-red-500' : 'text-blue-500'}`}>
                          {((item.currentPrice - item.buyPrice) * item.qty).toLocaleString()}
                        </span>
                      </div>
                      <button onClick={() => handleDelete('asset', item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* ★ [NEW] Debt Dashboard with Premium Lock */}
          <PremiumLock user={user} title="AI 負債・リスク分析">
            <DebtDashboard />
          </PremiumLock>

          {/* AI Analysis Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                  <Zap size={32} className="text-yellow-400" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    AI ポートフォリオ診断
                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full font-black">BETA</span>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    「米国株の比率が少し高めです。分散投資を検討しませんか？」<br/>
                    AIがあなたの資産状況を分析し、アドバイスを提供します。
                  </p>
                </div>
              </div>
              <button className="shrink-0 bg-white text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition shadow-md">
                詳細レポートを見る
              </button>
            </div>
          </div>

          {/* C. Savings & Maturity */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShieldCheck size={24} className="text-purple-500"/> 目標・満期管理</h3>
                <button onClick={() => setModalType('saving')} className="text-sm font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition">+ 追加</button>
             </div>
             <div className="space-y-4">
                {savings.map(sav => {
                  const rate = Math.round((sav.current / sav.target) * 100);
                  return (
                    <div key={sav.id} className="relative overflow-hidden bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800 group">
                       <div className="flex justify-between items-start z-10 relative mb-4">
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-purple-600">積立</span>
                                <span className="font-bold text-lg text-slate-800 dark:text-white">{sav.name}</span>
                             </div>
                             <p className="text-sm text-slate-500">{sav.bank} • {sav.date}</p>
                          </div>
                          <button onClick={() => handleDelete('saving', sav.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={20}/></button>
                       </div>
                       <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-2">
                             <span>現在 ¥{sav.current.toLocaleString()}</span>
                             <span>目標 ¥{sav.target.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-white dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                             <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${rate}%`}}></div>
                          </div>
                       </div>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>

        {/* [Right Column] */}
        <div className="xl:col-span-1 space-y-8">
           
           {/* 1. Furusato */}
           <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition duration-700"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">節税対策</span>
                      <h3 className="text-xl font-bold">ふるさと納税</h3>
                    </div>
                    <p className="text-emerald-100 text-sm">控除限度額まで、あと少しです！</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full text-2xl shadow-sm"><Gift /></div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black">あと ¥{(furusato.limit - furusato.donated).toLocaleString()}</span>
                    <span className="text-sm font-medium opacity-80">限度額 ¥{furusato.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-black/20 h-5 rounded-full overflow-hidden border border-white/10">
                    <div style={{ width: `${(furusato.donated/furusato.limit)*100}%` }} className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 shadow-[0_0_15px_rgba(253,224,71,0.5)] relative"></div>
                  </div>
                </div>
                <button onClick={() => setModalType('furusato')} className="w-full bg-white text-emerald-800 font-bold py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg">+ 寄付履歴を追加</button>
              </div>
           </div>

           {/* 2. Point Assets */}
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Coins size={24} className="text-yellow-500"/> ポイ活資産</h3>
                <span className="text-sm text-slate-400">Total</span>
              </div>
              <div className="text-center mb-6">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">¥ {totalPoint.toLocaleString()}<span className="text-lg text-slate-400 font-medium ml-1">相当</span></p>
              </div>
              <div className="space-y-3">
                {points.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${p.color} text-white flex items-center justify-center font-black shadow-md`}>{p.icon}</div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="font-bold text-slate-900 dark:text-white">{p.val.toLocaleString()} P</span>
                       <button onClick={() => handleDelete('point', p.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setModalType('point')} className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">+ ポイント追加</button>
              </div>
           </div>

           {/* 3. Digital Wallet */}
           <div>
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3"><Wallet size={24} className="text-blue-500"/> デジタル財布</h3>
                <button onClick={() => setModalType('card')} className="text-sm font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">+ 追加</button>
              </div>
              <div className="flex flex-col gap-4">
                 {cards.map(card => (
                   <div key={card.id} className={`w-full h-56 rounded-[2rem] bg-gradient-to-br ${card.color} p-8 text-white shadow-2xl relative transform hover:scale-[1.02] transition duration-300 cursor-pointer group`}>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-sm opacity-70 tracking-widest">{card.name}</span>
                        <button onClick={() => handleDelete('card', card.id)} className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="w-12 h-9 bg-yellow-500/20 rounded-md border border-yellow-500/40 backdrop-blur-sm mt-4 flex items-center justify-center">
                          <div className="w-8 h-5 border border-yellow-500/30 rounded-[2px]"></div>
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                         <div className="flex justify-between items-end">
                           <div>
                              <p className="text-xs opacity-60 mb-1 font-bold">PAYMENT</p>
                              <p className="text-xl font-bold flex items-center gap-2">{card.date} <span className="bg-red-500 text-xs px-2 py-0.5 rounded-md animate-pulse">あと{card.dday}日</span></p>
                           </div>
                           <CreditCard className="opacity-30" size={48}/>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* 4. Subscriptions */}
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3"><RefreshCw size={24} className="text-green-500"/> 固定費・サブスク</h3>
              </div>
              <div className="space-y-4">
                 {subs.map((sub) => (
                   <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center font-bold text-lg text-slate-700 shadow-sm">{sub.icon}</div>
                         <div>
                            <p className="font-bold text-lg text-slate-800 dark:text-white">{sub.name}</p>
                            <p className="text-sm text-slate-400">毎月 {sub.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <p className="font-bold text-lg text-slate-800 dark:text-white">¥{sub.price.toLocaleString()}</p>
                         <button onClick={() => handleDelete('sub', sub.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={20}/></button>
                      </div>
                   </div>
                 ))}
                 <button onClick={() => setModalType('sub')} className="w-full py-4 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">+ 固定費を追加</button>
              </div>
           </div>

        </div>
      </div>

      {/* --- Universal Modal --- */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black dark:text-white">
                 {modalType === 'asset' && '資産を追加'}
                 {modalType === 'expense' && '支出を記録'}
                 {modalType === 'furusato' && '寄付を記録'}
                 {modalType === 'point' && 'ポイント追加'}
                 {modalType === 'saving' && '目標・満期追加'}
                 {modalType === 'card' && 'カード追加'}
                 {modalType === 'sub' && '固定費追加'}
               </h3>
               <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
               {modalType === 'asset' && (
                 <>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">銘柄名</label>
                     <input required name="name" type="text" placeholder="例: Apple" className="w-full border p-4 rounded-2xl text-base bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div><label className="block text-xs font-bold text-slate-500 mb-1 ml-1">平均単価</label><input required name="buyPrice" type="number" placeholder="¥" className="w-full border p-4 rounded-2xl text-base bg-slate-50 dark:bg-slate-700 dark:text-white"/></div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1 ml-1">現在単価</label><input required name="currentPrice" type="number" placeholder="¥" className="w-full border p-4 rounded-2xl text-base bg-slate-50 dark:bg-slate-700 dark:text-white"/></div>
                   </div>
                   <div><label className="block text-xs font-bold text-slate-500 mb-1 ml-1">数量</label><input required name="qty" type="number" placeholder="株・口" className="w-full border p-4 rounded-2xl text-base bg-slate-50 dark:bg-slate-700 dark:text-white"/></div>
                 </>
               )}

               {(modalType === 'expense' || modalType === 'furusato') && (
                 <input required name="amount" type="number" placeholder="金額 (¥)" className="w-full border p-4 rounded-2xl text-2xl font-bold bg-slate-50 dark:bg-slate-700 dark:text-white" autoFocus/>
               )}

               {modalType === 'point' && (
                 <>
                   <input required name="name" type="text" placeholder="ポイント名" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="val" type="number" placeholder="ポイント数" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                 </>
               )}

               {modalType === 'saving' && (
                 <>
                   <input required name="name" type="text" placeholder="目標名" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="bank" type="text" placeholder="金融機関" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="target" type="number" placeholder="目標額 (¥)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <div className="grid grid-cols-2 gap-3">
                     <input required name="current" type="number" placeholder="現在額" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                     <input required name="date" type="date" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   </div>
                 </>
               )}

               {modalType === 'card' && (
                 <>
                   <input required name="name" type="text" placeholder="カード名" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="date" type="number" placeholder="支払日 (日)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                 </>
               )}

               {modalType === 'sub' && (
                 <>
                   <input required name="name" type="text" placeholder="サービス名" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="price" type="number" placeholder="月額 (¥)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="date" type="number" placeholder="支払日 (日)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                 </>
               )}

               <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-black transition text-lg">保存する</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}