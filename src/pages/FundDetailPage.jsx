import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, TrendingUp, Info, Calculator, 
  JapaneseYen, // 엔화 아이콘
  CheckCircle, Loader2, X, Download, Sparkles 
} from 'lucide-react';

import { supabase } from '../lib/supabase';
// PremiumLock import 제거

// --- [Investment Simulation Component] ---
const SimulationCard = ({ returnRate }) => {
  const [amount, setAmount] = useState(50000); 
  const [year, setYear] = useState(10); 

  const r = (returnRate || 5.0) / 100 / 12; 
  const n = year * 12;
  const futureValue = amount * ((Math.pow(1 + r, n) - 1) / r);
  const totalInvested = amount * n;
  const profit = futureValue - totalInvested;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-20"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-2 bg-white/10 rounded-lg"><Calculator className="text-orange-400" size={20}/></div>
        <div>
            <h3 className="font-bold text-lg leading-none">積立シミュレーション</h3>
            <p className="text-[10px] text-slate-400">年率 {returnRate}% で計算</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
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

// --- [Main Page Component] ---
const FundDetailPage = ({ user }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(10000);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    const fetchFundDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('funds')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        const basePrice = data.base_price || 15000;
        const changePrice = data.change_price || 150;
        const changePercent = basePrice !== 0 
            ? ((changePrice / basePrice) * 100).toFixed(2) 
            : '0.00';

        const formattedFund = {
          id: data.id,
          fundName: data.name,
          fundCode: data.code,
          category: data.category,
          managementCompany: data.company,
          trustFee: data.fee,
          returnRate1Y: Number(data.return_rate),
          riskLevel: data.risk_level,
          aum: data.net_assets,
          basePrice: basePrice,
          prevComparison: changePrice,
          prevComparisonPercent: changePercent,
          
          description: "このファンドは、中長期的な値上がり益の獲得を目指して運用を行います。主として、国内外の株式および債券に分散投資を行い、リスクの低減を図りながら、安定的な収益の確保を目指します。",
          
          aiAnalysis: {
            outlook: data.return_rate > 20 ? 'positive' : 'neutral',
            summary: "AIアルゴリズムによる分析の結果、このファンドは現在割安圏にあり、今後6ヶ月間で緩やかな上昇トレンドを描く可能性が高いと予測されます。",
            keyPoints: [
              "直近3ヶ月の資金流入が継続中",
              "シャープレシオが同カテゴリー平均を上回る",
              "主要構成銘柄の業績見通しが良好"
            ]
          },
          topHoldings: [
            { name: "Apple Inc.", code: "AAPL", weight: "5.8%" },
            { name: "Microsoft Corp.", code: "MSFT", weight: "5.2%" },
            { name: "Amazon.com", code: "AMZN", weight: "3.4%" },
            { name: "NVIDIA Corp.", code: "NVDA", weight: "3.1%" },
            { name: "Alphabet Inc.", code: "GOOGL", weight: "2.1%" }
          ]
        };

        setFund(formattedFund);
      } catch (err) {
        console.error("Error loading fund:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFundDetail();
  }, [id]);

  // 매수 핸들러
  const handlePurchase = async () => {
    if (!user) {
        alert("購入するにはログインが必要です。");
        return;
    }
    
    try {
        setIsBuying(true);
        
        const currentPrice = fund.basePrice; 
        const quantity = parseFloat((purchaseAmount / currentPrice).toFixed(4));

        const { error } = await supabase
            .from('portfolios')
            .insert({
                user_id: user.id,
                fund_id: fund.id,
                amount: purchaseAmount, 
                buy_price: currentPrice, 
                quantity: quantity,      
                profit_loss: 0           
            });

        if (error) throw error;

        alert(`「${fund.fundName}」を ¥${purchaseAmount.toLocaleString()} 購入しました！\n(取得単価: ¥${currentPrice.toLocaleString()}, 数量: ${quantity})`);
        setIsPurchaseModalOpen(false);
        navigate('/mypage'); 

    } catch (err) {
        console.error("Purchase error details:", err);
        alert("購入処理に失敗しました。");
    } finally {
        setIsBuying(false);
    }
  };

  if (loading || !fund) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 bg-gray-50">
        <Loader2 className="animate-spin text-orange-500 mb-2" size={32}/>
        <p className="font-bold">ファンド情報を読み込んでいます...</p>
      </div>
    );
  }

  const isPlus = fund.prevComparison >= 0;
  const textColor = isPlus ? 'text-red-500' : 'text-blue-500';
  const sign = isPlus ? '+' : '';

  const getOutlookBadge = (outlook) => {
    if (outlook === 'positive') return <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">↗ ポジティブ</span>;
    if (outlook === 'neutral') return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">→ ニュートラル</span>;
    return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">↘ ネガティブ</span>;
  };

  const handleAddToCompare = () => {
      navigate('/comparison', { state: { initialFundId: fund.id } });
  };

  // 예상 수량 계산 (렌더링용)
  const estimatedQty = fund.basePrice > 0 ? (purchaseAmount / fund.basePrice).toFixed(2) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-32 animate-fadeIn font-sans relative">
      
      {/* 1. 상단 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-sm mb-4 hover:text-orange-500 flex items-center transition-colors">
            <ArrowLeft size={16} className="mr-1"/> 戻る
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex gap-2 text-xs text-gray-500 mb-2 font-mono">
                {fund.fundCode && <span className="bg-gray-100 px-1 rounded">{fund.fundCode}</span>}
                <span>{fund.managementCompany}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">{fund.fundName}</h1>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  ¥{fund.basePrice.toLocaleString()}
                </span>
                <span className={`text-lg font-bold ${textColor}`}>
                  {sign}{fund.prevComparison} ({sign}{fund.prevComparisonPercent}%)
                </span>
                <span className="text-xs text-gray-400">基準日: 2026/02/06</span>
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
        
        {/* 왼쪽 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
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
             {activeTab === 'overview' && (
                <div className="animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">ファンドの特徴</h3>
                    <p className="text-gray-700 leading-loose mb-8 whitespace-pre-line text-sm md:text-base">
                      {fund.description || "詳細情報がありません。"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-orange-500 pl-3">基本情報</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <InfoCard title="カテゴリー" value={fund.category} />
                        <InfoCard title="純資産総額" value={fund.aum} />
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
             
             {activeTab === 'chart' && (
                 <div className="h-80 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 animate-fadeIn">
                     <TrendingUp className="text-4xl mb-2 opacity-50" size={48} />
                     <p className="font-bold">チャート準備中</p>
                 </div>
             )}

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

        {/* 오른쪽 1/3: AI Insight & Simulation (전면 개방) */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* 1. 알림 토글 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
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

            {/* 2. 적립 시뮬레이션 */}
            <SimulationCard returnRate={fund.returnRate1Y} />

            {/* 3. AI 분석 리포트 (자물쇠 해제됨) */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-violet-100 relative overflow-hidden">
                {/* 상단 뱃지 추가 */}
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    Free Beta
                </div>

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Sparkles size={20} fill="currentColor"/>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">AI Insight</h2>
                        <p className="text-xs text-violet-600 font-bold">投資分析レポート</p>
                    </div>
                </div>

                {fund.aiAnalysis ? (
                    <div>
                        <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-gray-700">AIの見解</h3>
                                    {getOutlookBadge(fund.aiAnalysis.outlook)}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed bg-violet-50 p-3 rounded-lg border border-violet-100">
                                {fund.aiAnalysis.summary}
                                </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">投資ポイント</h3>
                            <ul className="space-y-2">
                                {fund.aiAnalysis.keyPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                        <span className="text-violet-500 font-bold mt-0.5">✓</span>
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
        </div>

      </div>

      {/* CTA Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-40 md:static md:bg-transparent md:border-none md:p-0">
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4">
              <button className="bg-slate-100 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition">
                  <Download size={20}/> 目論見書
              </button>
              <button 
                onClick={() => setIsPurchaseModalOpen(true)}
                className="bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition shadow-lg shadow-orange-200"
              >
                  <JapaneseYen size={20}/> 購入・積立
              </button>
          </div>
      </div>

      {/* 매수 모달 */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
                <button 
                    onClick={() => setIsPurchaseModalOpen(false)} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={24}/>
                </button>
                
                <h3 className="text-xl font-black text-slate-900 mb-2">購入金額を入力</h3>
                <p className="text-sm text-slate-500 mb-6">{fund.fundName}</p>
                
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">投資金額</label>
                    <div className="relative">
                        <JapaneseYen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                        <input 
                            type="number" 
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-2xl font-black text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                {/* 예상 수량 계산 표시 */}
                <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">基準価額</span>
                        <span className="text-slate-900 font-bold">¥{fund.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">概算買付口数</span>
                        <span className="text-orange-500 font-black text-lg">
                            {estimatedQty} <span className="text-xs text-slate-400 ml-1">口</span>
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[10000, 30000, 50000, 100000].map(amt => (
                        <button 
                            key={amt}
                            onClick={() => setPurchaseAmount(amt)}
                            className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 whitespace-nowrap"
                        >
                            ¥{amt.toLocaleString()}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handlePurchase}
                    disabled={isBuying}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition text-lg flex items-center justify-center gap-2"
                >
                    {isBuying ? <Loader2 className="animate-spin"/> : '注文を確定する'}
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <div className="text-gray-400 text-xs mb-1">{title}</div>
    <div className="font-bold text-gray-900">{value}</div>
  </div>
);

export default FundDetailPage;