import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine 
} from 'recharts';
import { 
  Activity, ShieldCheck, TrendingUp, RefreshCw, Lock, RotateCcw
} from 'lucide-react';

const LoanPage = () => {
  // --------------------------------------------------------------------------
  // 1. 상태값 (State)
  // --------------------------------------------------------------------------
  const [homeLoan, setHomeLoan] = useState(3500); 
  const [carLoan, setCarLoan] = useState(200);
  const [cardLoan, setCardLoan] = useState(50);
  
  const [annualIncome, setAnnualIncome] = useState(550);
  const [monthlyRepayment, setMonthlyRepayment] = useState(13);

  // ★ 수정됨: 안전한 숫자 변환 함수 (빈 칸이면 0으로 계산하되, 입력창은 유지)
  const getNum = (val) => (val === '' ? 0 : Number(val));

  // --------------------------------------------------------------------------
  // 2. 실시간 계산 로직 (계산할 때는 0으로 취급)
  // --------------------------------------------------------------------------
  const totalDebt = getNum(homeLoan) + getNum(carLoan) + getNum(cardLoan);

  const debtData = [
    { name: '住宅ローン', value: getNum(homeLoan), color: '#3b82f6' },
    { name: '自動車ローン', value: getNum(carLoan), color: '#10b981' },
    { name: 'カードローン', value: getNum(cardLoan), color: '#ef4444' },
  ].filter(d => d.value > 0);

  const dsrValue = getNum(annualIncome) > 0 
    ? Math.round(((getNum(monthlyRepayment) * 12) / getNum(annualIncome)) * 100) 
    : 0;

  // --------------------------------------------------------------------------
  // 3. (기존) 갈아타기 & 스트레스 테스트 상태
  // --------------------------------------------------------------------------
  const [loanAmount, setRefinanceLoan] = useState(3000); 
  const [remainYears, setRemainYears] = useState(20);
  const [currentRate, setCurrentRate] = useState(4.5);
  const [newRate, setNewRate] = useState(3.8);
  const [refinanceResult, setRefinanceResult] = useState(null);

  useEffect(() => {
    const calcPayment = (rate) => {
      const r = getNum(rate) / 100 / 12;
      const n = getNum(remainYears) * 12;
      const amount = getNum(loanAmount) * 10000;
      if (amount === 0 || r === 0 || n === 0) return 0;
      return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };
    const currentMonthly = calcPayment(currentRate);
    const newMonthly = calcPayment(newRate);
    setRefinanceResult({
      monthlySave: Math.round(currentMonthly - newMonthly),
      totalSave: Math.round((currentMonthly - newMonthly) * getNum(remainYears) * 12)
    });
  }, [loanAmount, remainYears, currentRate, newRate]);

  // 스트레스 테스트
  const [rateRise, setRateRise] = useState(0.5);
  const [incomeDrop, setIncomeDrop] = useState(0);
  
  const basePayment = getNum(monthlyRepayment) * 10000; 
  const stressedPayment = basePayment * (1 + (rateRise * 0.1));
  const currentMonthlyIncome = (getNum(annualIncome) * 10000) / 12;
  const stressedIncome = currentMonthlyIncome * (1 - (incomeDrop / 100));
  
  const stressChartData = [
    { name: '現在', payment: basePayment, limit: currentMonthlyIncome * 0.3 },
    { name: 'ストレス後', payment: stressedPayment, limit: stressedIncome * 0.3 },
  ];

  // 신호등 진단
  const [eligibility, setEligibility] = useState({ status: 'green', msg: '' });
  const [workYears, setWorkYears] = useState(3);

  useEffect(() => {
    const income = getNum(annualIncome);
    const years = getNum(workYears);
    
    if (income >= 400 && years >= 2 && dsrValue <= 35) {
      setEligibility({ status: 'green', msg: '審査通過の可能性が高いです (Aランク)' });
    } else if (income >= 300 && dsrValue <= 40) {
      setEligibility({ status: 'yellow', msg: '条件付きで承認の可能性があります (Bランク)' });
    } else {
      setEligibility({ status: 'red', msg: '審査通過が難しい状況です (Cランク)' });
    }
  }, [annualIncome, workYears, dsrValue]);

  // ★ 핵심: 입력 핸들러 (빈 문자열 허용)
  const handleInput = (setter) => (e) => {
    const val = e.target.value;
    // 빈 칸이면 그대로 '' 저장, 아니면 숫자로 변환
    setter(val === '' ? '' : Number(val));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32">
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <ShieldCheck className="text-orange-500" /> ローン・負債管理
        </h1>
        <p className="text-slate-500 dark:text-gray-400">
          現在の数値を入力して、リアルタイムでリスクを診断します。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. 부채 시뮬레이터 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-blue-500"/> 負債シミュレーター
             </h2>
             <button onClick={()=>{setHomeLoan(3500); setCarLoan(200); setCardLoan(50); setAnnualIncome(550); setMonthlyRepayment(13);}} className="text-xs flex items-center gap-1 text-gray-400 hover:text-orange-500 transition">
                <RotateCcw size={12}/> リセット
             </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-8">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={debtData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {debtData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}万円`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 font-bold">総負債</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{totalDebt.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center w-full md:w-1/2">
               <div className="mb-2 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500">DSR (返済負担率)</span>
                  <span className={`text-2xl font-black ${dsrValue > 35 ? 'text-red-500' : dsrValue > 30 ? 'text-yellow-500' : 'text-green-500'}`}>{dsrValue}%</span>
               </div>
               <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex relative">
                  <div className="h-full bg-green-500" style={{ width: '30%' }}></div>
                  <div className="h-full bg-yellow-400" style={{ width: '10%' }}></div>
                  <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
               </div>
               <div className="relative w-full h-2 mt-1">
                  <div className="absolute top-0 -translate-x-1/2 transition-all duration-500" style={{ left: `${Math.min(dsrValue, 100)}%` }}>
                     <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800 dark:border-b-white"></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 block mb-1">住宅ローン (万円)</label>
                   <input type="number" value={homeLoan} onChange={handleInput(setHomeLoan)} className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-blue-500 text-sm outline-none focus:border-blue-500"/>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 block mb-1">年収 (万円)</label>
                   <input type="number" value={annualIncome} onChange={handleInput(setAnnualIncome)} className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-white text-sm outline-none focus:border-orange-500"/>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">その他ローン (車/カード)</label>
                    <div className="flex gap-2">
                        <input type="number" placeholder="車" value={carLoan} onChange={handleInput(setCarLoan)} className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-green-500 text-sm outline-none focus:border-green-500"/>
                        <input type="number" placeholder="カード" value={cardLoan} onChange={handleInput(setCardLoan)} className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-red-500 text-sm outline-none focus:border-red-500"/>
                    </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 block mb-1">月々の総返済額 (万円)</label>
                   <input type="number" value={monthlyRepayment} onChange={handleInput(setMonthlyRepayment)} className="w-full p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-white text-sm outline-none focus:border-orange-500"/>
                </div>
             </div>
          </div>
        </div>

        {/* 2. 갈아타기 진단 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <RefreshCw size={20} className="text-orange-500"/> 借り換えシミュレーション
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">ローン残高 (万円)</label>
                    <input type="number" value={loanAmount} onChange={handleInput(setRefinanceLoan)} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-white outline-none border border-slate-600 focus:border-orange-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">残存期間 (年)</label>
                    <input type="number" value={remainYears} onChange={handleInput(setRemainYears)} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-white outline-none border border-slate-600 focus:border-orange-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">現在の金利 (%)</label>
                    <input type="number" value={currentRate} onChange={handleInput(setCurrentRate)} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-red-400 outline-none border border-slate-600 focus:border-red-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">借り換え金利 (%)</label>
                    <input type="number" value={newRate} onChange={handleInput(setNewRate)} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-green-400 outline-none border border-slate-600 focus:border-green-500"/>
                 </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">月々の節約額</span>
                    <span className="text-xl font-black text-orange-400">¥{refinanceResult?.monthlySave.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-sm font-bold">総返済額の削減</span>
                    <span className="text-2xl font-black text-green-400">¥{Math.round(refinanceResult?.totalSave / 10000).toLocaleString()}万円</span>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
        </div>

        {/* 3. 미래 시나리오 분석 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <TrendingUp size={20} className="text-purple-500"/> ストレス・テスト (Stress Test)
           </h2>
           <div className="space-y-6 mb-6">
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-gray-300">
                    <span>金利上昇シナリオ (+{rateRise}%)</span>
                 </div>
                 <input type="range" min="0" max="3" step="0.1" value={rateRise} onChange={e=>setRateRise(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"/>
              </div>
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-gray-300">
                    <span>収入減少シナリオ (-{incomeDrop}%)</span>
                 </div>
                 <input type="range" min="0" max="50" step="5" value={incomeDrop} onChange={e=>setIncomeDrop(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
              </div>
           </div>
           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stressChartData} layout="vertical" margin={{left: 0}}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                    <Tooltip formatter={(val)=>`¥${val.toLocaleString()}`} cursor={{fill: 'transparent'}}/>
                    <Bar dataKey="payment" barSize={20} radius={[0,4,4,0]}>
                       <Cell fill="#94a3b8" />
                       <Cell fill="#ef4444" />
                    </Bar>
                    <ReferenceLine x={stressedIncome * 0.3} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: '危険ライン', fontSize: 10, fill:'#10b981' }} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 4. 대출 가능 진단 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <Lock size={20} className="text-emerald-500"/> 住宅ローン審査シミュレーター
           </h2>
           <div className="flex gap-4 mb-8">
              <div className="flex-1">
                 <label className="text-xs text-gray-500 font-bold block mb-1">年収 (万円)</label>
                 <input type="number" value={annualIncome} disabled className="w-full p-3 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-xl font-bold outline-none cursor-not-allowed"/>
              </div>
              <div className="flex-1">
                 <label className="text-xs text-gray-500 font-bold block mb-1">勤続年数 (年)</label>
                 <input type="number" value={workYears} onChange={handleInput(setWorkYears)} className="w-full p-3 bg-gray-50 dark:bg-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"/>
              </div>
           </div>

           <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex gap-3">
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all ${eligibility.status === 'green' ? 'bg-green-500 scale-110 shadow-lg shadow-green-500/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all ${eligibility.status === 'yellow' ? 'bg-yellow-400 scale-110 shadow-lg shadow-yellow-400/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all ${eligibility.status === 'red' ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
              </div>
              <div className="flex-1 text-right">
                 <p className="text-sm font-bold text-slate-900 dark:text-white">AI 判定結果</p>
                 <p className={`text-xs font-bold mt-1 ${eligibility.status === 'green' ? 'text-green-600' : eligibility.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {eligibility.msg}
                 </p>
              </div>
           </div>
           <button className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition">
              提携銀行の仮審査に申し込む
           </button>
        </div>

      </div>
    </div>
  );
};

export default LoanPage;