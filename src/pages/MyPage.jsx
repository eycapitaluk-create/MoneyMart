import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Wallet, Bell, RefreshCw, 
  TrendingUp, ShieldCheck, Trash2, X, Gift, Coins, Zap, CreditCard,
  AlertTriangle, Activity, Sliders, Loader2, Heart, PlusCircle, Edit2
} from 'lucide-react';

import { supabase } from '../lib/supabase';
// PremiumLock import 삭제 (더 이상 안 씀)

// --- Debt Dashboard (이제 누구나 볼 수 있음) ---
const DebtDashboard = () => {
  const [rateHike, setRateHike] = useState(0); 
  const currentPayment = 85000;
  const simulatedPayment = Math.round(currentPayment * (1 + (rateHike * 0.15))); 
  const increaseAmount = simulatedPayment - currentPayment;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg relative overflow-hidden mb-8">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-rose-500"/> 負債・リスク分析
          </h3>
          {/* 무료 개방 알림 배지 */}
          <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">Free Beta</span>
       </div>
       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
             <div className="text-xs text-slate-500 mb-1 font-bold">返済負担率 (DSR)</div>
             <div className="text-2xl font-black text-slate-900 dark:text-white">22.5<span className="text-sm font-medium text-slate-400">%</span></div>
             <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-green-500 h-full w-[22.5%]"></div></div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
             <div className="text-xs text-slate-500 mb-1 font-bold">金利タイプ比率</div>
             <div className="text-2xl font-black text-slate-900 dark:text-white">100<span className="text-sm font-medium text-slate-400">% 変動</span></div>
             <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-rose-500 h-full w-full"></div></div>
          </div>
       </div>
       <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4"><Sliders size={16} className="text-orange-400"/><span className="font-bold text-sm">金利上昇シナリオ分析</span></div>
          <div className="mb-6">
             <div className="flex justify-between text-xs text-slate-400 mb-2"><span>現在 (+0%)</span><span>+2.0%</span></div>
             <input type="range" min="0" max="2" step="0.5" value={rateHike} onChange={(e) => setRateHike(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"/>
             <div className="text-center mt-2 font-bold text-orange-400">もし金利が +{rateHike.toFixed(1)}% 上がったら...</div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
             <div><p className="text-xs text-slate-400">毎月の返済額</p><p className="text-xl font-bold">¥{simulatedPayment.toLocaleString()}</p></div>
             <div className="text-right"><p className="text-xs text-slate-400">負担増加額</p><p className="text-xl font-bold text-rose-500">+¥{increaseAmount.toLocaleString()}</p></div>
          </div>
       </div>
    </div>
  );
};

export default function MyPage({ user }) {
  const navigate = useNavigate();
  
  const [assets, setAssets] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [points, setPoints] = useState([]);
  const [subs, setSubs] = useState([]);
  const [furusato, setFurusato] = useState({ limit: 70000, donated: 0 });
  const [furusatoId, setFurusatoId] = useState(null);
  const [notifications, setNotifications] = useState([]); 

  const [monthlyBudget, setMonthlyBudget] = useState(100000);
  const [currentSpent, setCurrentSpent] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const totalPoint = points.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const unreadCount = notifications.filter(n => !n.is_read).length; 

  const fetchAllData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);

      const { data: profile } = await supabase.from('profiles').select('monthly_budget').eq('id', user.id).single();
      if (profile) setMonthlyBudget(profile.monthly_budget || 100000);

      const { data: pfData } = await supabase.from('portfolios').select(`id, amount, quantity, buy_price, funds (id, name, base_price)`).eq('user_id', user.id);
      const formattedAssets = (pfData || []).map((item, idx) => {
        const qty = Number(item.quantity || 0);
        const curPrice = item.funds?.base_price || 0;
        const buyPrice = Number(item.buy_price || 0);
        
        const currentVal = Math.floor(qty * curPrice); 
        const principal = Number(item.amount);
        const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        
        return {
          id: item.id, fundId: item.funds?.id, name: item.funds?.name,
          principal, 
          currentVal, 
          profit: currentVal - principal, 
          qty, buyPrice, color: colors[idx % 5]
        };
      });
      setAssets(formattedAssets);

      const { data: wlData } = await supabase.from('watchlists').select(`id, funds(id, name, code, category, return_rate)`).eq('user_id', user.id);
      setWatchlist((wlData || []).map(i => ({...i.funds, id: i.funds.id})));

      const { data: ptData } = await supabase.from('points').select('*').eq('user_id', user.id);
      setPoints(ptData || []);
      const { data: subData } = await supabase.from('subscriptions').select('*').eq('user_id', user.id);
      setSubs(subData || []);

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { data: expData } = await supabase.from('expenses').select('amount').eq('user_id', user.id).gte('created_at', firstDay);
      const totalSpent = (expData || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
      setCurrentSpent(totalSpent);

      const { data: taxData } = await supabase.from('tax_savings').select('*').eq('user_id', user.id).single();
      if (taxData) {
        setFurusato({ limit: Number(taxData.limit_amount), donated: Number(taxData.donated_amount) });
        setFurusatoId(taxData.id);
      } else {
        const { data: newTax } = await supabase.from('tax_savings').insert({ user_id: user.id, limit_amount: 70000, donated_amount: 0 }).select().single();
        if(newTax) { setFurusato({ limit: 70000, donated: 0 }); setFurusatoId(newTax.id); }
      }

      const { data: notiData } = await supabase.from('notifications')
        .select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setNotifications(notiData || []);

    } catch (e) {
      console.error("Data load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const { totalAsset, totalProfit, profitRate, chartData } = useMemo(() => {
    let currentTotal = 0, investTotal = 0;
    const data = assets.map(item => {
      currentTotal += item.currentVal;
      investTotal += item.principal;
      return { name: item.name, value: item.currentVal, color: item.color };
    });
    const profit = currentTotal - investTotal;
    const rate = investTotal > 0 ? (profit / investTotal) * 100 : 0;
    return { totalAsset: currentTotal, totalProfit: profit, profitRate: rate.toFixed(1), chartData: data };
  }, [assets]);

  const handleDelete = async (table, id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'portfolios') setAssets(prev => prev.filter(i => i.id !== id));
      if (table === 'points') setPoints(prev => prev.filter(i => i.id !== id));
      if (table === 'subscriptions') setSubs(prev => prev.filter(i => i.id !== id));
    } catch (e) { alert("削除エラーが発生しました"); }
  };

  const handleReadNoti = async () => {
    try {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch(e) { console.error(e); }
  };

  const createTestNotification = async () => {
      const msgs = [
          { type: 'alert', msg: '米国株が急落しています (-2.5%)' },
          { type: 'success', msg: '配当金が入金されました (¥3,200)' },
          { type: 'info', msg: '今月の予算目標を達成しました！' }
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      
      await supabase.from('notifications').insert({
          user_id: user.id,
          type: randomMsg.type,
          message: randomMsg.msg,
          is_read: false
      });
      fetchAllData(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
        if (modalType === 'budget_edit') {
            const newBudget = Number(fd.get('amount'));
            await supabase.from('profiles').update({ monthly_budget: newBudget }).eq('id', user.id);
            setMonthlyBudget(newBudget);
        }
        else if (modalType === 'expense') {
            const amt = Number(fd.get('amount'));
            await supabase.from('expenses').insert({ user_id: user.id, amount: amt, category: 'general' });
            setCurrentSpent(prev => prev + amt);
        }
        else if (modalType === 'point') {
            await supabase.from('points').insert({ user_id: user.id, name: fd.get('name'), amount: Number(fd.get('amount')) });
            fetchAllData();
        }
        else if (modalType === 'sub') {
            await supabase.from('subscriptions').insert({ 
                user_id: user.id, name: fd.get('name'), price: Number(fd.get('price')), payment_date: Number(fd.get('date')) 
            });
            fetchAllData();
        }
        else if (modalType === 'furusato') {
            const addAmount = Number(fd.get('amount'));
            const newTotal = furusato.donated + addAmount;
            await supabase.from('tax_savings').update({ donated_amount: newTotal }).eq('id', furusatoId);
            setFurusato(prev => ({ ...prev, donated: newTotal }));
        }
        setModalType(null);
    } catch (e) { alert("保存に失敗しました"); }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">データを同期中...</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-40 font-sans min-h-screen text-slate-800 dark:text-white animate-fadeIn">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10 relative">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">MoneyMart</h1>
          <p className="text-lg text-slate-500 font-medium">
            {user ? `${user.name}様` : 'ゲスト様'}の資産ポートフォリオ
          </p>
        </div>
        
        <div className="relative">
          <button onClick={() => setIsNotiOpen(!isNotiOpen)} className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-105 transition active:scale-95">
            <Bell size={28} className="text-slate-600 dark:text-slate-300"/>
            {unreadCount > 0 && <span className="absolute top-2 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
          </button>
          {isNotiOpen && (
            <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-fadeIn origin-top-right">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg">お知らせ ({unreadCount})</h3>
                <button onClick={handleReadNoti} className="text-sm text-blue-500 font-bold hover:underline">すべて既読にする</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? notifications.map(noti => (
                  <div key={noti.id} className={`p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex gap-3 ${!noti.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!noti.is_read ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <p className={`text-sm ${!noti.is_read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>{noti.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(noti.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                )) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        新しいお知らせはありません<br/>
                        <button onClick={createTestNotification} className="mt-2 text-xs text-blue-400 underline">テスト通知を作成</button>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition duration-1000"></div>
             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
               <div className="bg-white/20 p-5 rounded-full text-5xl shadow-inner backdrop-blur-md animate-[bounce_3s_infinite]">🦅</div>
               <div className="flex-1 w-full text-center md:text-left">
                 <div className="inline-block bg-indigo-900/30 px-4 py-1 rounded-full text-sm font-bold text-indigo-200 mb-3 border border-indigo-400/30">MoneyMart AI アシスタント</div>
                 <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">今月の予算管理</h2>
                 <div className="flex justify-between items-end mb-2">
                    <p className="opacity-90">現在 <span className="font-bold text-xl">{Math.round((currentSpent/monthlyBudget)*100)}%</span> 消費中</p>
                    <button onClick={() => setModalType('budget_edit')} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition">
                        目標: ¥{monthlyBudget.toLocaleString()} <Edit2 size={10}/>
                    </button>
                 </div>
                 <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden mb-3 ring-1 ring-white/10">
                   <div style={{ width: `${Math.min((currentSpent/monthlyBudget)*100, 100)}%` }} className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000"></div>
                 </div>
                 <div className="flex justify-between text-sm font-medium opacity-90 mb-4">
                   <span>支出: ¥{currentSpent.toLocaleString()}</span>
                   <span>残り: ¥{(monthlyBudget - currentSpent).toLocaleString()}</span>
                 </div>
                 <button onClick={() => setModalType('expense')} className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition shadow-lg">+ 今日の支出を記録</button>
               </div>
             </div>
          </div>

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
              <button onClick={() => navigate('/funds')} className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition">
                + 資産追加
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="w-64 h-64 flex-shrink-0 relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold border-4 border-dashed border-slate-200 rounded-full">No Data</div>
                )}
              </div>
              
              <div className="flex-1 w-full space-y-4">
                {assets.length > 0 ? assets.map((item) => (
                  <div key={item.id} onClick={() => navigate(`/fund/${item.fundId}`)} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <span className="text-lg font-bold text-slate-800 dark:text-white block line-clamp-1">{item.name}</span>
                        <span className="text-xs text-slate-500 font-bold">
                            {item.qty.toLocaleString()} 口  |  取得単価 ¥{item.buyPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <span className="block text-xl font-bold text-slate-900 dark:text-white">¥{item.currentVal.toLocaleString()}</span>
                        <span className={`text-sm font-bold ${item.profit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                          {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString()}
                        </span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete('portfolios', item.id); }} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl">
                    資産がありません。
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 자물쇠(PremiumLock) 제거된 Debt Dashboard 바로 렌더링 */}
          <DebtDashboard />

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="text-red-500" fill="currentColor"/> 気になるファンド
                </h3>
             </div>
             {watchlist.length > 0 ? (
                 <div className="grid gap-4">
                     {watchlist.map(item => (
                         <div key={item.id} onClick={() => navigate(`/fund/${item.id}`)} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl cursor-pointer hover:bg-orange-50 transition border border-transparent hover:border-orange-200">
                             <div>
                                 <span className="text-[10px] bg-white dark:bg-slate-600 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-500 mb-1 inline-block">{item.category}</span>
                                 <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                             </div>
                             <div className="text-right">
                                 <span className="text-xs text-slate-400 block">年間リターン</span>
                                 <span className={`font-bold ${item.returnRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                     {item.returnRate > 0 ? '+' : ''}{item.returnRate}%
                                 </span>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className="text-center py-8 text-slate-400">登録されたファンドがありません</div>
             )}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-8">
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

           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Coins size={24} className="text-yellow-500"/> ポイ活資産</h3>
                <span className="text-sm text-slate-400">Total: {totalPoint}P</span>
              </div>
              <div className="space-y-3">
                {points.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-black shadow-sm">P</div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="font-bold text-slate-900 dark:text-white">{p.amount.toLocaleString()} P</span>
                       <button onClick={() => handleDelete('points', p.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setModalType('point')} className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">+ ポイント追加</button>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3"><RefreshCw size={24} className="text-green-500"/> 固定費・サブスク</h3>
              </div>
              <div className="space-y-4">
                 {subs.map((sub) => (
                   <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-700 shadow-sm">{sub.name[0]}</div>
                         <div>
                            <p className="font-bold text-lg text-slate-800 dark:text-white">{sub.name}</p>
                            <p className="text-sm text-slate-400">毎月 {sub.payment_date}日</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <p className="font-bold text-lg text-slate-800 dark:text-white">¥{sub.price.toLocaleString()}</p>
                         <button onClick={() => handleDelete('subscriptions', sub.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={20}/></button>
                      </div>
                   </div>
                 ))}
                 <button onClick={() => setModalType('sub')} className="w-full py-4 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">+ 固定費を追加</button>
              </div>
           </div>
        </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black dark:text-white">
                 {modalType === 'expense' && '支出を記録'}
                 {modalType === 'budget_edit' && '目標予算を設定'}
                 {modalType === 'furusato' && '寄付を記録'}
                 {modalType === 'point' && 'ポイント追加'}
                 {modalType === 'sub' && '固定費追加'}
               </h3>
               <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               {(modalType === 'expense' || modalType === 'furusato' || modalType === 'budget_edit') && (
                 <>
                    <label className="block text-xs font-bold text-slate-500 ml-1 mb-1">
                        {modalType === 'budget_edit' ? '新しい月予算' : '金額'}
                    </label>
                    <input required name="amount" type="number" placeholder="¥" className="w-full border p-4 rounded-2xl text-2xl font-bold bg-slate-50 dark:bg-slate-700 dark:text-white" autoFocus/>
                 </>
               )}

               {modalType === 'point' && (
                 <>
                   <input required name="name" type="text" placeholder="ポイント名 (例: 楽天)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="amount" type="number" placeholder="ポイント数" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                 </>
               )}

               {modalType === 'sub' && (
                 <>
                   <input required name="name" type="text" placeholder="サービス名 (例: Netflix)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="price" type="number" placeholder="月額 (¥)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
                   <input required name="date" type="number" min="1" max="31" placeholder="支払日 (1~31日)" className="w-full border p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 dark:text-white"/>
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