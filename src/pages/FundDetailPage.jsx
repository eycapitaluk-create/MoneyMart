import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, TrendingUp, Info, Calculator, Download, CheckCircle 
} from 'lucide-react';
// ★ PremiumLock 컴포넌트 import
import PremiumLock from '../components/PremiumLock';
// 🛑 mockData 대신 realData 사용
import { funds } from '../data/realData';

// --- [NEW] Investment Simulation Component ---
const SimulationCard = ({ returnRate }) => {
  const [amount, setAmount] = useState(50000); // 기본 5만엔
  const [year, setYear] = useState(10); // 기본 10년

  // 월 복리 계산 로직
  // 연수익률(%) -> 월이율
  const r = (returnRate || 5.0) / 100 / 12; 
  const n = year * 12;
  // 적립식 복리 공식: FV = P * ((1+r)^n - 1) / r
  const futureValue = amount * ((Math.pow(1 + r, n) - 1) / r);
  const totalInvested = amount * n;
  const profit = futureValue - totalInvested;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-6">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-2 bg-white/10 rounded-lg"><Calculator className="text-orange-400" size={20}/></div>
        <div>
            <h3 className="font-bold text-lg leading-none">積立シミュレーション</h3>
            <p className="text-[10px] text-slate-400">年率 {returnRate}% で計算</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
         {/* 슬라이더: 금액 */}
         <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
               <span>毎月の積立額</span>
               <span className="font-bold text-white text-lg">¥{amount.toLocaleString()}</span>
            </div>
            <input 
              type="range" min="10000" max="300000" step="10000" 
              value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
         </div>
         {/* 슬라이더: 기간 */}
         <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
               <span>積立期間</span>
               <span className="font-bold text-white text-lg">{year}年</span>
            </div>
            <input 
              type="range" min="1" max="30" step="1" 
              value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
         </div>

         {/* 결과 표시 */}
         <div className="border-t border-slate-700 pt-4 mt-4">
            <div className="flex justify-between items-end mb-1">
               <span className="text-sm text-slate-300">予想評価額</span>
               <span className="text-3xl font-black text-orange-400">¥{Math.round(futureValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
               <span className="text-slate-500">元本 ¥{totalInvested.toLocaleString()}</span>
               <span className="text-green-400 font-bold">+¥{Math.round(profit).toLocaleString()}</span>
            </div>
         </div>
         
         <p className="text-[10px] text-slate-500 text-center">※ 過去の実績に基づいた単純計算であり、将来の成果を保証するものではありません。</p>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const FundDetailPage = ({ user }) => { // ★ user prop 추가 (PremiumLock용)
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  
  // ★ 알림 구독 상태
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const foundFund = funds.find(f => String(f.id) === String(id));
    setFund(foundFund);
  }, [id]);

  if (!fund) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p>ファンド情報を読み込んでいます...</p>
      </div>
    );
  }

  const prevComp = parseFloat(fund.prevComparison || 0);
  const isPlus = prevComp > 0;
  const textColor = isPlus ? 'text-red-500' : prevComp < 0 ? 'text-blue-500' : 'text-gray-700';
  const sign = isPlus ? '+' : '';

  const getOutlookBadge = (outlook) => {
    if (outlook === 'positive') return <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">↗ ポジティブ</span>;
    if (outlook === 'neutral') return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">→ ニュートラル</span>;
    return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">↘ ネガティブ</span>;
  };

  const handleAddToCompare = () => {
      navigate('/comparison', { state: { initialFundId: fund.id } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32 animate-fadeIn font-sans">
        
      {/* 1. 상단 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-sm mb-4 hover:text-orange-500 flex items-center transition-colors">
            <ArrowLeft size={16} className="mr-1"/> 戻る
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex gap-2 text-xs text-gray-500 mb-2 font-mono">
                {fund.shortCode && <span className="bg-gray-100 px-1 rounded">{fund.shortCode}</span>}
                <span>{fund.fundCode}</span> | <span>{fund.managementCompany}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">{fund.fundName}</h1>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  ¥{typeof fund.basePrice === 'number' ? fund.basePrice.toLocaleString() : fund.basePrice}
                </span>
                <span className={`text-lg font-bold ${textColor}`}>
                  {sign}{fund.prevComparison} ({sign}{fund.prevComparisonPercent}%)
                </span>
                <span className="text-xs text-gray-400">基準日: {fund.baseDate || '2026/02/02'}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
               <button 
                onClick={handleAddToCompare}
                className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition text-sm flex items-center justify-center gap-2"
               >
                比較する
              </button>
              <button 
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`flex-1 md:flex-none px-6 py-3 font-bold rounded-lg transition text-sm flex items-center justify-center gap-2 shadow-sm
                  ${isWatchlisted ? 'bg-gray-100 text-gray-700 border border-gray-300' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
              >
                <span>{isWatchlisted ? '♥' : '♡'}</span> ウォッチ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽 2/3: 상세 정보 (무료 공개) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* 탭 네비게이션 */}
           <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-4 overflow-x-auto">
            {['overview', 'chart', 'portfolio'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-bold text-sm focus:outline-none border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab 
                        ? 'border-orange-500 text-orange-600' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab === 'overview' && '概要・ポイント'}
                    {tab === 'chart' && 'チャート'}
                    {tab === 'portfolio' && '構成銘柄'}
                </button>
            ))}
           </div>
           
           <div className="bg-white rounded-b-xl p-6 shadow-sm border border-t-0 border-gray-200 min-h-[400px]">
             {/* Tab 1: 개요 */}
             {activeTab === 'overview' && (
                <div className="animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">ファンドの特徴</h3>
                    <p className="text-gray-700 leading-loose mb-8 whitespace-pre-line text-sm md:text-base">
                      {fund.description || "詳細情報がありません。"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">基本情報</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <InfoCard title="カテゴリー" value={fund.category} />
                        <InfoCard title="純資産総額" value={fund.aum || fund.netAssets} />
                        <InfoCard title="信託報酬 (税込)" value={`${fund.trustFee}%`} />
                        <InfoCard 
                          title="リスクレベル" 
                          value={
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${fund.riskLevel >= 4 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              Level {fund.riskLevel}
                            </div>
                          } 
                        />
                    </div>
                </div>
             )}
             
             {/* Tab 2: 차트 (준비중) */}
             {activeTab === 'chart' && (
                 <div className="h-80 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 animate-fadeIn">
                     <TrendingUp className="text-4xl mb-2 opacity-50" size={48} />
                     <p className="font-bold">チャート準備中</p>
                 </div>
             )}

             {/* Tab 3: 포트폴리오 */}
             {activeTab === 'portfolio' && (
                 <div className="animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">組入上位銘柄</h3>
                    {fund.topHoldings && fund.topHoldings.length > 0 ? (
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                          <table className="w-full text-sm text-left text-gray-600">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                  <tr>
                                      <th className="px-4 py-3">銘柄名</th>
                                      <th className="px-4 py-3 text-right">コード</th>
                                      <th className="px-4 py-3 text-right">比率 (%)</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {fund.topHoldings.map((holding, index) => (
                                      <tr key={index} className="bg-white hover:bg-gray-50">
                                          <td className="px-4 py-3 font-medium text-gray-900">{holding.name}</td>
                                          <td className="px-4 py-3 text-right font-mono text-xs">{holding.code}</td>
                                          <td className="px-4 py-3 text-right font-bold text-gray-900">{holding.weight}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg">構成銘柄データがありません。</div>
                    )}
                 </div>
             )}
           </div>
        </div>

        {/* 오른쪽 1/3: Premium Analysis (AI 분석 + 시뮬레이션 + 알림) */}
        <div className="lg:col-span-1">
            {/* ★★★ PremiumLock으로 우측 컬럼 전체 감싸기 ★★★ */}
            <PremiumLock user={user} title="AI分析 & シミュレーション">
                
                {/* 1. 알림 구독 버튼 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isNotified ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Bell size={20} fill={isNotified ? "currentColor" : "none"}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">変更通知を受け取る</p>
                            <p className="text-xs text-slate-500">基準価額やレポート更新</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsNotified(!isNotified)}
                        className={`w-12 h-7 rounded-full transition-colors relative ${isNotified ? 'bg-orange-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isNotified ? 'translate-x-5' : ''}`}></div>
                    </button>
                </div>

                {/* 2. 투자 시뮬레이션 (New) */}
                <SimulationCard returnRate={fund.returnRate1Y || 5.0} />

                {/* 3. AI 분석 리포트 (Existing) */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md text-white">
                            <span className="text-xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">AI Insight</h2>
                            <p className="text-xs text-blue-600 font-bold">投資分析レポート</p>
                        </div>
                    </div>

                    {fund.aiAnalysis ? (
                        <div>
                            <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-gray-700">AIの見解</h3>
                                        {getOutlookBadge(fund.aiAnalysis.outlook)}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    {fund.aiAnalysis.summary}
                                    </p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2">投資ポイント</h3>
                                <ul className="space-y-2">
                                    {fund.aiAnalysis.keyPoints.map((point, index) => (
                                        <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                            <span className="text-blue-500 font-bold mt-0.5">✓</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8 text-sm">AI分析データを準備中です。</div>
                    )}
                </div>
            </PremiumLock>
        </div>

      </div>
    </div>
  );
};

// InfoCard Component
const InfoCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <div className="text-gray-400 text-xs mb-1">{title}</div>
    <div className="font-bold text-gray-900">{value}</div>
  </div>
);

export default FundDetailPage;