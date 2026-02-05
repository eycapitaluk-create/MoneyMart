import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Wallet, Plus, Check, Edit2, Trash2, Clock, 
  PieChart as PieIcon, Utensils, Calculator, Save, TrendingUp, DollarSign, Crown, Target // Target 아이콘 추가
} from 'lucide-react';
// ▼▼▼ Supabase 연결 ▼▼▼
import { supabase } from '../lib/supabase';

// --- 1. 차트 색상 ---
const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

// --- 2. TradingView 시장 위젯 ---
const MarketWidget = () => {
  const container = useRef();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "light", "dateRange": "12M", "showChart": true, "locale": "ja", "largeChartUrl": "", "isTransparent": true, "showSymbolLogo": true, "showFloatingTooltip": false, "width": "100%", "height": "100%", 
      "tabs": [{ "title": "指数 & 為替", "symbols": [{ "s": "FOREXCOM:SPXUSD", "d": "S&P 500" }, { "s": "INDEX:NKY", "d": "Nikkei 225" }, { "s": "FX:USDJPY", "d": "USD/JPY" }] }]
    });
    if (container.current) { container.current.innerHTML = ''; container.current.appendChild(script); }
  }, []);
  return <div className="tradingview-widget-container h-full min-h-[300px]" ref={container}></div>;
};

// --- 3. 시뮬레이터 팝업 ---
const SimulatorModal = ({ onClose }) => {
  const [initial, setInitial] = useState(100);
  const [monthly, setMonthly] = useState(5);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(5);
  const [result, setResult] = useState(null);

  const calculate = () => {
    let total = initial * 10000;
    let invested = initial * 10000;
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    for (let i = 0; i < months; i++) {
      total = (total + monthly * 10000) * (1 + monthlyRate);
      invested += monthly * 10000;
    }
    setResult({ total: Math.round(total), invested, profit: Math.round(total - invested) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative transition-colors">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24}/></button>
        <div className="text-center mb-8"><h2 className="text-2xl font-black text-slate-900 dark:text-white">資産形成シミュレーター</h2></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="text-xs font-bold text-slate-500 block mb-1">初期投資 (万円)</label><input type="number" value={initial} onChange={e=>setInitial(Number(e.target.value))} className="w-full bg-slate-50 border p-3 rounded-xl font-bold"/></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">毎月の積立 (万円)</label><input type="number" value={monthly} onChange={e=>setMonthly(Number(e.target.value))} className="w-full bg-slate-50 border p-3 rounded-xl font-bold"/></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">期間 (年)</label><input type="number" value={years} onChange={e=>setYears(Number(e.target.value))} className="w-full bg-slate-50 border p-3 rounded-xl font-bold"/></div>
          <div><label className="text-xs font-bold text-slate-500 block mb-1">想定年利 (%)</label><input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))} className="w-full bg-slate-50 border p-3 rounded-xl font-bold"/></div>
        </div>
        {result ? (<div className="bg-slate-900 text-white rounded-2xl p-6 text-center"><h3 className="text-4xl font-black mb-4">¥{(result.total / 10000).toFixed(0)}<span className="text-xl">万円</span></h3></div>) : (<button onClick={calculate} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">計算する</button>)}
      </div>
    </div>
  );
};

// --- 4. 메인 마이페이지 ---
const MyPage = ({ user }) => {
  // --- Data State ---
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [expiryItems, setExpiryItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [points, setPoints] = useState(0); 
  const [monthlyTarget, setMonthlyTarget] = useState(100000);

  // --- UI State ---
  const [isSimModalOpen, setIsSimModalOpen] = useState(false); 
  const [editingPoint, setEditingPoint] = useState(false);
  const [tempPoint, setTempPoint] = useState(0);

  // --- Modal & Form State ---
  const [isAddPortModalOpen, setIsAddPortModalOpen] = useState(false);
  const [isAddExpiryModalOpen, setIsAddExpiryModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [assetForm, setAssetForm] = useState({ name: '', buyPrice: '', currentPrice: '', amount: '', date: '', regionType: 'global' });
  const [expiryForm, setExpiryForm] = useState({ name: '', type: 'point', date: '', memo: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });

  // ▼▼▼ 데이터 불러오기 ▼▼▼
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      
      const { data: assets } = await supabase.from('assets').select('*').eq('user_id', user.id);
      if (assets) {
        setPortfolioItems(assets.map(item => ({
          id: item.id, name: item.name, buyPrice: item.price, currentPrice: item.price, amount: item.amount, date: item.created_at?.split('T')[0], type: item.type, regionType: 'global'
        })));
      }
      const { data: expData } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (expData) setExpenses(expData);
      const { data: expiryData } = await supabase.from('expiries').select('*').eq('user_id', user.id).order('date', { ascending: true });
      if (expiryData) setExpiryItems(expiryData);
    };
    fetchAllData();
  }, [user]);

  // --- 계산 로직 ---
  const totalInvestment = portfolioItems.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalCurrentValue = portfolioItems.reduce((acc, item) => {
    const buyPrice = Number(item.buyPrice) || 1; 
    const quantity = Number(item.amount) / buyPrice;
    return acc + (quantity * Number(item.currentPrice));
  }, 0);
  const totalProfit = totalCurrentValue - totalInvestment;

  const chartData = useMemo(() => {
    const data = {};
    portfolioItems.forEach(item => {
      const buyPrice = Number(item.buyPrice) || 1;
      const quantity = Number(item.amount) / buyPrice;
      const val = quantity * Number(item.currentPrice);
      if(data[item.regionType]) data[item.regionType] += val;
      else data[item.regionType] = val;
    });
    const mapping = { 'global': { label: '全世界', color: '#3B82F6' }, 'north-america': { label: '米国', color: '#EF4444' }, 'japan': { label: '国内', color: '#F59E0B' }, 'emerging': { label: '新興国', color: '#10B981' }, 'other': { label: 'その他', color: '#6B7280' } };
    if (Object.keys(data).length === 0) return [{ name: 'データなし', value: 1, fill: '#CBD5E1' }];
    return Object.keys(data).map(key => ({ name: mapping[key]?.label || key, value: data[key], fill: mapping[key]?.color || '#CBD5E1' }));
  }, [portfolioItems]);

  const trendData = [
    { month: '8月', value: 0 }, { month: '9月', value: 0 }, { month: '10月', value: 0 }, { month: '11月', value: 0 }, { month: '12月', value: totalCurrentValue * 0.9 }, { month: '1月', value: totalCurrentValue }, 
  ];

  const monthlyExpense = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  const progressPercent = Math.min((monthlyExpense / monthlyTarget) * 100, 100);

  const checkAlert = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  };

  const handleEditTarget = () => {
    const newTarget = prompt("목표 지출 금액을 입력하세요 (엔)", monthlyTarget);
    if (newTarget && !isNaN(newTarget)) setMonthlyTarget(Number(newTarget));
  };

  const openModal = (type, item = null) => {
    setEditingItem(item);
    if (type === 'portfolio') { setAssetForm(item ? {...item} : { name: '', buyPrice: '', currentPrice: '', amount: '', date: '', regionType: 'global' }); setIsAddPortModalOpen(true); }
    else if (type === 'expiry') { setExpiryForm(item ? {...item} : { name: '', type: 'point', date: '', memo: '' }); setIsAddExpiryModalOpen(true); }
    else if (type === 'expense') { setExpenseForm(item ? {...item} : { title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] }); setIsAddExpenseModalOpen(true); }
  };

  const deleteItem = async (type, id) => {
    if(!confirm("本当に削除しますか？")) return;
    let tableName = '';
    if (type === 'portfolio') tableName = 'assets';
    if (type === 'expense') tableName = 'expenses';
    if (type === 'expiry') tableName = 'expiries';
    if (tableName) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) alert("削除失敗: " + error.message);
      else {
        if(type==='portfolio') setPortfolioItems(prev => prev.filter(item => item.id !== id));
        if(type==='expense') setExpenses(prev => prev.filter(item => item.id !== id));
        if(type==='expiry') setExpiryItems(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  const handleSavePortfolio = async () => {
    if (!user) return;
    const newAssetData = { user_id: user.id, name: assetForm.name, price: Number(assetForm.currentPrice), amount: Number(assetForm.amount), type: 'stock' };
    const { data, error } = await supabase.from('assets').insert([newAssetData]).select();
    if (!error && data) {
      const savedItem = data[0];
      setPortfolioItems(prev => [...prev, { id: savedItem.id, name: savedItem.name, buyPrice: savedItem.price, currentPrice: savedItem.price, amount: savedItem.amount, date: savedItem.created_at.split('T')[0], type: savedItem.type, regionType: 'global' }]);
      setIsAddPortModalOpen(false);
    } else { alert("Error: " + error.message); }
  };

  const handleSaveExpiry = async () => {
    if (!user) return;
    const newData = { user_id: user.id, ...expiryForm };
    const { data, error } = await supabase.from('expiries').insert([newData]).select();
    if (!error && data) { setExpiryItems(prev => [...prev, data[0]]); setIsAddExpiryModalOpen(false); } else { alert("Error: " + error.message); }
  };

  const handleSaveExpense = async () => {
    if (!user) return;
    const newData = { user_id: user.id, title: expenseForm.title, amount: Number(expenseForm.amount), category: expenseForm.category, date: expenseForm.date };
    const { data, error } = await supabase.from('expenses').insert([newData]).select();
    if (!error && data) { setExpenses(prev => [data[0], ...prev]); setIsAddExpenseModalOpen(false); } else { alert("Error: " + error.message); }
  };

  const isPremium = user?.plan === 'premium';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-40 animate-fadeIn min-h-screen">
      
      {/* 1. 프로필 섹션 (프리미엄이면 황금색, 아니면 주황색) */}
      <div className={`flex flex-col md:flex-row items-center gap-8 mb-8 p-8 rounded-[2.5rem] shadow-xl transition-colors relative overflow-hidden ${isPremium ? 'bg-slate-900 text-white border border-yellow-500/30' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}>
        
        {/* 프리미엄일 때만 나오는 황금 배경 효과 */}
        {isPremium && <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>}

        <div className={`w-24 h-24 rounded-full font-black text-3xl flex items-center justify-center shadow-lg z-10 ${isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white ring-4 ring-yellow-500/20' : 'bg-slate-900 dark:bg-black text-white'}`}>
          {user?.avatar || 'G'}
        </div>
        
        <div className="text-center md:text-left z-10">
          <h2 className={`text-3xl font-black mb-1 ${isPremium ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{user?.name || 'ゲスト'}</h2>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center mb-2">
            {/* ★★★ 등급 표시 배지 ★★★ */}
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
              isPremium 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'
            }`}>
              {isPremium ? <Crown size={12} fill="currentColor"/> : null}
              {isPremium ? 'Premium Plan' : 'Free Plan'}
            </span>

            {/* ★★★ 리스크 프로필 표시 (여기 추가됨!) ★★★ */}
            {user?.riskProfile && (
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-slate-200 dark:border-slate-600">
                <Target size={12} className="text-blue-500"/>
                {user.riskProfile}
              </span>
            )}

            <button onClick={()=>setIsSimModalOpen(true)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 transition ml-1">
               <Calculator size={10}/> Simulator
            </button>
          </div>
        </div>
        
        <div className="flex-1 md:text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700 flex justify-around md:justify-end gap-8 z-10">
           <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Assets</p><p className={`text-3xl font-black ${isPremium ? 'text-white' : 'text-slate-900 dark:text-white'}`}>¥{Math.round(totalCurrentValue).toLocaleString()}</p></div>
           <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Profit</p><p className={`text-3xl font-black ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalProfit >= 0 ? '+' : ''}¥{Math.round(totalProfit).toLocaleString()}</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 2. 자산 섹션 (좌측) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 도넛 차트 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors">
            <div className="w-48 h-48 relative flex-shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                     {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                   </Pie>
                   <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} contentStyle={{backgroundColor:'#1e293b', border:'none', borderRadius:'10px', color:'white'}} />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><PieIcon size={18} className="text-orange-500"/> 資産配分 (地域別)</h3>
               <div className="grid grid-cols-2 gap-3">
                 {chartData.map((d, i) => (
                   <div key={i} className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: d.fill}}></span><span className="text-slate-600 dark:text-slate-300 font-medium">{d.name}</span></div>
                     <span className="font-bold text-slate-900 dark:text-white">¥{Math.round(d.value).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          
          {/* 자산 리스트 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 dark:text-white">保有資産一覧</h3><button onClick={()=>openModal('portfolio')} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition">+ 追加</button></div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead><tr className="text-slate-400 border-b border-slate-50 dark:border-slate-700"><th className="pb-2 font-bold pl-2">銘柄</th><th className="pb-2 font-bold text-right">評価額</th><th className="pb-2 font-bold text-right pr-2">損益</th><th className="pb-2 font-bold text-right">操作</th></tr></thead>
                  <tbody>
                    {portfolioItems.length > 0 ? portfolioItems.map(item => {
                      const qty = item.buyPrice > 0 ? Number(item.amount) / Number(item.buyPrice) : 0;
                      const currentVal = qty * Number(item.currentPrice);
                      const profit = currentVal - Number(item.amount);
                      return (
                        <tr key={item.id} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                          <td className="py-3 pl-2"><div className="font-bold text-slate-700 dark:text-slate-200">{item.name}</div></td>
                          <td className="py-3 text-right font-medium text-slate-900 dark:text-slate-200">¥{Math.round(currentVal).toLocaleString()}</td>
                          <td className={`py-3 text-right pr-2 font-bold ${profit>=0?'text-green-500':'text-red-500'}`}>{profit>=0?'+':''}¥{Math.round(profit).toLocaleString()}</td>
                          <td className="py-3 text-right">
                             <button onClick={()=>openModal('portfolio', item)} className="p-1 text-slate-400 hover:text-blue-500"><Edit2 size={14}/></button>
                             <button onClick={()=>deleteItem('portfolio', item.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr><td colSpan="4" className="py-4 text-center text-slate-400">データがありません。追加してください。</td></tr>
                    )}
                  </tbody>
                </table>
            </div>
          </div>

          {/* 자산 추이 그래프 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><TrendingUp size={18} className="text-purple-500"/> 資産推移</h3></div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                   <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs>
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} />
                   <YAxis hide domain={['dataMin - 100000', 'dataMax + 100000']} />
                   <CartesianGrid vertical={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                   <Tooltip contentStyle={{backgroundColor:'#1e293b', borderRadius:'12px', border:'none', color:'white'}} itemStyle={{color:'white'}} formatter={(value) => [`¥${value.toLocaleString()}`, "総資産"]}/>
                   <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. 우측 사이드바 */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
          {/* A. 지출 카드 */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex-shrink-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2"><Wallet size={18} className="text-green-400"/> 家計簿・支出</h3><button onClick={()=>openModal('expense')} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><Plus size={16}/></button></div>
             <div className="mb-6">
                 <div className="flex justify-between items-end mb-1"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target</p><button onClick={handleEditTarget} className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-white transition">¥{monthlyTarget.toLocaleString()} <Edit2 size={10}/></button></div>
                 <div className="flex items-baseline gap-1 mb-2"><span className="text-3xl font-black text-white">¥{monthlyExpense.toLocaleString()}</span><span className="text-xs text-slate-400">/ ¥{monthlyTarget.toLocaleString()}</span></div>
                 <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 bg-green-500`} style={{width: `${progressPercent}%`}}></div></div>
             </div>
             <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
               {expenses.length > 0 ? expenses.map(ex => (
                 <div key={ex.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition group">
                   <div className="flex items-center gap-3"><div className="bg-slate-800 p-1.5 rounded-md text-slate-300"><Utensils size={14}/></div><div><p className="text-xs font-bold">{ex.title}</p><p className="text-[9px] text-slate-400">{ex.date}</p></div></div>
                   <div className="text-right">
                      <span className="font-bold text-xs block">-¥{Number(ex.amount).toLocaleString()}</span>
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>deleteItem('expense', ex.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={10}/></button></div>
                   </div>
                 </div>
               )) : <div className="text-center text-xs text-slate-500 py-4">支出データなし</div>}
             </div>
          </div>

          {/* B. 포인트 카드 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group flex-shrink-0 transition-colors">
              <div className="flex justify-between items-start mb-2">
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 rounded-lg"><DollarSign size={20} /></div>
                 {editingPoint ? <div className="flex gap-1"><input type="number" value={tempPoint} onChange={e=>setTempPoint(Number(e.target.value))} className="w-20 border-b border-orange-500 text-right font-bold bg-transparent dark:text-white"/><button onClick={()=>{setPoints(tempPoint); setEditingPoint(false);}} className="text-green-500"><Check size={16}/></button></div> : <button onClick={()=>{setTempPoint(points); setEditingPoint(true);}} className="text-slate-300 hover:text-slate-600 dark:hover:text-white p-1"><Edit2 size={14}/></button>}
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">保有ポイント</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{points.toLocaleString()} <span className="text-sm text-slate-400">P</span></h3>
              <div className="absolute -bottom-6 -right-6 text-orange-500/10 transform rotate-12 group-hover:scale-110 transition"><DollarSign size={100}/></div>
          </div>

          {/* C. 위젯 */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[300px] relative transition-colors">
             <MarketWidget />
          </div>

          {/* D. 만기 관리 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0 transition-colors">
             <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Clock size={18} className="text-red-500"/> 期限管理</h3><button onClick={()=>openModal('expiry')} className="text-xs text-slate-400 font-bold hover:text-slate-600 dark:hover:text-white">+ 追加</button></div>
             <div className="space-y-3">
               {expiryItems.length > 0 ? expiryItems.map(item => {
                 const isUrgent = checkAlert(item.date);
                 return (
                 <div key={item.id} className={`p-3 rounded-xl border flex justify-between items-center group transition-colors ${isUrgent ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900' : 'bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600'}`}>
                   <div>
                     <div className="flex items-center gap-2 mb-1"><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.type==='point'?'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300':'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'}`}>{item.type==='point'?'P':'保険'}</span><span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span></div>
                     <p className="text-[10px] text-slate-400 dark:text-slate-400">{item.memo}</p>
                   </div>
                   <div className="text-right">
                      <p className={`text-xs font-black ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.date}</p>
                      <div className="flex gap-2 justify-end mt-1"><button onClick={()=>deleteItem('expiry', item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={12}/></button></div>
                   </div>
                 </div>
               )}) : <div className="text-center text-xs text-slate-500 py-4">データなし</div>}
             </div>
          </div>
        </div>
      </div>
      
      {/* Modals (생략 없이 유지) */}
      {isSimModalOpen && <SimulatorModal onClose={() => setIsSimModalOpen(false)} />}
      
      {/* Portfolio Modal */}
      {isAddPortModalOpen && <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl transition-colors"><h3 className="text-xl font-black mb-6 dark:text-white">{editingItem ? '資産を編集' : '資産を追加'}</h3><div className="space-y-4"><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">資産名</label><input type="text" value={assetForm.name} onChange={e=>setAssetForm({...assetForm, name:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">地域</label><select value={assetForm.regionType} onChange={e=>setAssetForm({...assetForm, regionType:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"><option value="global">全世界</option><option value="north-america">米国</option><option value="japan">日本</option><option value="emerging">新興国</option><option value="other">その他</option></select></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">購入単価</label><input type="number" value={assetForm.buyPrice} onChange={e=>setAssetForm({...assetForm, buyPrice:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">現在単価</label><input type="number" value={assetForm.currentPrice} onChange={e=>setAssetForm({...assetForm, currentPrice:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div></div><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">投資総額</label><input type="number" value={assetForm.amount} onChange={e=>setAssetForm({...assetForm, amount:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div></div><div className="flex gap-3 mt-8"><button onClick={handleSavePortfolio} className="flex-1 bg-slate-900 hover:bg-black dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">保存</button><button onClick={()=>setIsAddPortModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">キャンセル</button></div></div></div>}
      
      {/* Expense Modal */}
      {isAddExpenseModalOpen && <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl transition-colors"><h3 className="text-lg font-black mb-4 dark:text-white">{editingItem ? '支出を編集' : '支出を記録'}</h3><div className="space-y-3"><input type="text" placeholder="項目名" value={expenseForm.title} onChange={e=>setExpenseForm({...expenseForm, title:e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/><input type="number" placeholder="金額" value={expenseForm.amount} onChange={e=>setExpenseForm({...expenseForm, amount:e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/><div className="flex gap-2 overflow-x-auto pb-2">{['food','transport','shopping','utility'].map(cat => (<button key={cat} onClick={()=>setExpenseForm({...expenseForm, category: cat})} className={`p-2 rounded-lg border ${expenseForm.category===cat?'bg-slate-900 text-white border-slate-900 dark:bg-orange-500 dark:border-orange-500':'bg-white dark:bg-slate-700 text-slate-400 dark:border-slate-600'}`}><Utensils size={14}/></button>))}</div><input type="date" value={expenseForm.date} onChange={e=>setExpenseForm({...expenseForm, date:e.target.value})} className="w-full border p-3 rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"/></div><button onClick={handleSaveExpense} className="w-full bg-slate-900 hover:bg-black dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 transition">保存</button><button onClick={()=>setIsAddExpenseModalOpen(false)} className="w-full text-slate-400 font-bold text-xs mt-3">キャンセル</button></div></div>}
      
      {/* Expiry Modal */}
      {isAddExpiryModalOpen && <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"><div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl transition-colors"><h3 className="text-xl font-black mb-6 dark:text-white">{editingItem ? '期限を編集' : '期限を追加'}</h3><div className="space-y-4"><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">名称</label><input type="text" value={expiryForm.name} onChange={e=>setExpiryForm({...expiryForm, name:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">日付</label><input type="date" value={expiryForm.date} onChange={e=>setExpiryForm({...expiryForm, date:e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-sm"/></div><div><label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">種類</label><div className="flex gap-2"><button onClick={()=>setExpiryForm({...expiryForm, type:'point'})} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${expiryForm.type==='point'?'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-300':'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-slate-400'}`}>ポイント</button><button onClick={()=>setExpiryForm({...expiryForm, type:'insurance'})} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${expiryForm.type==='insurance'?'bg-purple-50 border-purple-500 text-purple-600 dark:bg-purple-900 dark:text-purple-300':'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-slate-400'}`}>保険</button></div></div></div><div className="flex gap-3 mt-8"><button onClick={handleSaveExpiry} className="flex-1 bg-slate-900 hover:bg-black dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">保存</button><button onClick={()=>setIsAddExpiryModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">キャンセル</button></div></div></div>}

    </div>
  );
};

export default MyPage;