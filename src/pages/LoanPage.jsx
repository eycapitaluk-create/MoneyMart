import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine 
} from 'recharts';
import { 
  CreditCard, Home, AlertTriangle, ArrowRight, RefreshCw, ShieldCheck, 
  TrendingUp, Activity, Lock 
} from 'lucide-react';

const LoanPage = () => {
  // --------------------------------------------------------------------------
  // 1. 부채 구조 데이터 (Mock)
  // --------------------------------------------------------------------------
  const debtData = [
    { name: '住宅ローン', value: 3500, color: '#3b82f6' }, // 주담대 (파랑)
    { name: '自動車ローン', value: 200, color: '#10b981' }, // 자동차 (초록)
    { name: 'カードローン', value: 50, color: '#ef4444' }, // 카드론 (빨강 - 위험)
  ];
  const totalDebt = 3750; // 총 부채 (만엔)

  // DSR (총부채원리금상환비율) - 게이지 차트용 데이터
  const dsrValue = 28; // 현재 DSR 28%
  const dsrData = [
    { name: 'Safe', value: 30, color: '#10b981' },
    { name: 'Caution', value: 15, color: '#f59e0b' },
    { name: 'Danger', value: 55, color: '#ef4444' },
  ];

  // --------------------------------------------------------------------------
  // 2. 갈아타기 진단 (Refinancing) 상태
  // --------------------------------------------------------------------------
  const [loanAmount, setLoanAmount] = useState(3000); // 잔액 (만엔)
  const [remainYears, setRemainYears] = useState(20); // 잔여 기간
  const [currentRate, setCurrentRate] = useState(4.5); // 현재 금리
  const [newRate, setNewRate] = useState(3.8); // 갈아탈 금리
  const [refinanceResult, setRefinanceResult] = useState(null);

  useEffect(() => {
    // 원리금균등상환 계산 로직 (PMT 공식 간소화)
    const calcPayment = (rate) => {
      const r = rate / 100 / 12;
      const n = remainYears * 12;
      return (loanAmount * 10000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };

    const currentMonthly = calcPayment(currentRate);
    const newMonthly = calcPayment(newRate);
    
    setRefinanceResult({
      monthlySave: Math.round(currentMonthly - newMonthly),
      totalSave: Math.round((currentMonthly - newMonthly) * remainYears * 12)
    });
  }, [loanAmount, remainYears, currentRate, newRate]);

  // --------------------------------------------------------------------------
  // 3. 스트레스 테스트 (Future Scenario) 상태
  // --------------------------------------------------------------------------
  const [rateRise, setRateRise] = useState(0.5); // 금리 상승폭
  const [incomeDrop, setIncomeDrop] = useState(0); // 소득 감소폭
  const baseMonthlyPayment = 120000; // 현재 월 상환액 (가정)
  
  // 금리 상승에 따른 이자 증가분 (단순 계산)
  const stressedPayment = baseMonthlyPayment * (1 + (rateRise * 0.1)); 
  const currentIncome = 500000; // 월소득 50만엔
  const stressedIncome = currentIncome * (1 - (incomeDrop / 100));
  
  const stressChartData = [
    { name: '現在', payment: baseMonthlyPayment, limit: currentIncome * 0.3 }, // DSR 30% 기준선
    { name: 'ストレス後', payment: stressedPayment, limit: stressedIncome * 0.3 },
  ];

  // --------------------------------------------------------------------------
  // 4. 대출 가능 진단 (Eligibility) - 신호등 UI
  // --------------------------------------------------------------------------
  const [userIncome, setUserIncome] = useState(450); // 연소득
  const [workYears, setWorkYears] = useState(3); // 근속년수
  const [eligibility, setEligibility] = useState({ status: 'green', msg: '審査通過の可能性が高いです' });

  useEffect(() => {
    if (userIncome >= 400 && workYears >= 2) {
      setEligibility({ status: 'green', msg: '審査通過の可能性が高いです (Aランク)', color: 'bg-green-500' });
    } else if (userIncome >= 300 && workYears >= 1) {
      setEligibility({ status: 'yellow', msg: '条件付きで承認の可能性があります (Bランク)', color: 'bg-yellow-400' });
    } else {
      setEligibility({ status: 'red', msg: '審査通過が難しい状況です (Cランク)', color: 'bg-red-500' });
    }
  }, [userIncome, workYears]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32">
      
      {/* 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <ShieldCheck className="text-orange-500" /> ローン・負債管理
        </h1>
        <p className="text-slate-500 dark:text-gray-400">
          現在の負債状況を可視化し、最適な借り換えプランと将来のリスクを診断します。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. 부채 구조 & DSR 대시보드 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <Activity size={20} className="text-blue-500"/> 負債ポートフォリオ
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* 도넛 차트 (부채 구성) */}
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={debtData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {debtData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}万円`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400 font-bold">総負債</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{totalDebt.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400">万円</span>
              </div>
            </div>

            {/* DSR 게이지 (반원 느낌) */}
            <div className="text-center w-full md:w-1/2">
               <div className="mb-2 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500">DSR (返済負担率)</span>
                  <span className={`text-2xl font-black ${dsrValue > 35 ? 'text-red-500' : 'text-green-500'}`}>{dsrValue}%</span>
               </div>
               {/* 커스텀 게이지 바 */}
               <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: '30%' }}></div> {/* 안전구간 */}
                  <div className="h-full bg-yellow-400" style={{ width: '15%' }}></div> {/* 주의구간 */}
                  <div className="h-full bg-red-500" style={{ width: '55%' }}></div> {/* 위험구간 */}
               </div>
               {/* 현재 위치 포인터 */}
               <div className="relative w-full h-2 mt-1">
                  <div className="absolute top-0 -translate-x-1/2 transition-all duration-500" style={{ left: `${dsrValue}%` }}>
                     <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800 dark:border-b-white"></div>
                  </div>
               </div>
               <p className="text-xs text-gray-400 mt-2 text-left">
                  ※ 一般的に30~35%を超えると<br/>審査が厳しくなります。
               </p>
            </div>
          </div>
        </div>

        {/* 2. 갈아타기 진단 (Interactive) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <RefreshCw size={20} className="text-orange-500"/> 借り換えシミュレーション
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">ローン残高 (万円)</label>
                    <input type="number" value={loanAmount} onChange={e=>setLoanAmount(Number(e.target.value))} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-white outline-none border border-slate-600 focus:border-orange-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">残存期間 (年)</label>
                    <input type="number" value={remainYears} onChange={e=>setRemainYears(Number(e.target.value))} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-white outline-none border border-slate-600 focus:border-orange-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">現在の金利 (%)</label>
                    <input type="number" value={currentRate} onChange={e=>setCurrentRate(Number(e.target.value))} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-red-400 outline-none border border-slate-600 focus:border-red-500"/>
                 </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">借り換え金利 (%)</label>
                    <input type="number" value={newRate} onChange={e=>setNewRate(Number(e.target.value))} className="w-full bg-slate-700/50 rounded-lg p-2 font-bold text-green-400 outline-none border border-slate-600 focus:border-green-500"/>
                 </div>
              </div>

              {/* 결과 카드 */}
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
           {/* 배경 데코 */}
           <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
        </div>

        {/* 3. 미래 시나리오 분석 (Stress Test) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <TrendingUp size={20} className="text-purple-500"/> 将来シナリオ分析 (Stress Test)
           </h2>
           
           <div className="space-y-6 mb-6">
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-gray-300">
                    <span>金利上昇シナリオ</span>
                    <span className="text-red-500">+{rateRise}%</span>
                 </div>
                 <input 
                    type="range" min="0" max="3" step="0.1" 
                    value={rateRise} onChange={e=>setRateRise(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                 />
              </div>
              <div>
                 <div className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-gray-300">
                    <span>収入減少シナリオ</span>
                    <span className="text-blue-500">-{incomeDrop}%</span>
                 </div>
                 <input 
                    type="range" min="0" max="50" step="5" 
                    value={incomeDrop} onChange={e=>setIncomeDrop(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
              </div>
           </div>

           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stressChartData} layout="vertical" margin={{left: 0}}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                    <Tooltip formatter={(val)=>`¥${val.toLocaleString()}`} cursor={{fill: 'transparent'}}/>
                    <Bar dataKey="payment" name="返済額" barSize={20} fill="#64748b" radius={[0,4,4,0]}>
                       <Cell fill="#94a3b8" />
                       <Cell fill="#ef4444" /> {/* 스트레스 상황은 빨간색 */}
                    </Bar>
                    {/* 소득 대비 한계선 (DSR 30%) */}
                    <ReferenceLine x={currentIncome * 0.3} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: '安全圏', fontSize: 10, fill:'#10b981' }} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <p className="text-xs text-gray-400 mt-2 text-center">
              緑の点線を超えると家計への負担が「危険」レベルになります。
           </p>
        </div>

        {/* 4. 대출 가능 진단 (Eligibility - 신호등 UI) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <Lock size={20} className="text-emerald-500"/> 住宅ローン審査シミュレーター
           </h2>

           <div className="flex gap-4 mb-8">
              <div className="flex-1">
                 <label className="text-xs text-gray-500 font-bold block mb-1">前年度年収 (万円)</label>
                 <input type="number" value={userIncome} onChange={e=>setUserIncome(Number(e.target.value))} className="w-full p-3 bg-gray-50 dark:bg-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"/>
              </div>
              <div className="flex-1">
                 <label className="text-xs text-gray-500 font-bold block mb-1">勤続年数 (年)</label>
                 <input type="number" value={workYears} onChange={e=>setWorkYears(Number(e.target.value))} className="w-full p-3 bg-gray-50 dark:bg-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"/>
              </div>
           </div>

           {/* 신호등 UI */}
           <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex gap-3">
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all shadow-inner ${eligibility.status === 'green' ? 'bg-green-500 scale-110 shadow-green-500/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all shadow-inner ${eligibility.status === 'yellow' ? 'bg-yellow-400 scale-110 shadow-yellow-400/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
                 <div className={`w-10 h-10 rounded-full border-4 border-gray-300 dark:border-slate-700 transition-all shadow-inner ${eligibility.status === 'red' ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-gray-300 dark:bg-slate-800'}`}></div>
              </div>
              <div className="flex-1 text-right">
                 <p className="text-sm font-bold text-slate-900 dark:text-white">判定結果</p>
                 <p className={`text-xs font-bold mt-1 ${
                    eligibility.status === 'green' ? 'text-green-600' : 
                    eligibility.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                 }`}>
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