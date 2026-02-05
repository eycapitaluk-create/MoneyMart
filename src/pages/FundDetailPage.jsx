// src/pages/FundDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ★ 수정됨: 더 이상 COMPOSED_ASSET 등을 부르지 않습니다. funds만 가져옵니다.
import { funds } from '../data/mockData';

const FundDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    // mockData에서 fundCode로 펀드 찾기 (Quick 데이터 기반)
    const foundFund = funds.find(f => f.fundCode === id);
    setFund(foundFund);
  }, [id]);

  if (!fund) {
    return <div className="p-8 text-center text-gray-500">ファンド情報を読み込み中... (ID: {id})</div>;
  }

  const isPlus = fund.prevComparison > 0;
  const textColor = isPlus ? 'text-red-500' : fund.prevComparison < 0 ? 'text-blue-500' : 'text-gray-700';
  const sign = isPlus ? '▲' : fund.prevComparison < 0 ? '▼' : '';

  // AI 분석 전망에 따른 아이콘/색상
  const getOutlookBadge = (outlook) => {
    if (outlook === 'positive') return <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">↗ ポジティブ (Positive)</span>;
    if (outlook === 'neutral') return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">→ ニュートラル (Neutral)</span>;
    return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">↘ ネガティブ (Negative)</span>;
  };

  // 비교함 담기 핸들러
  const handleAddToCompare = () => {
      // 비교 페이지로 이동하며 현재 펀드 ID 전달
      navigate('/comparison', { state: { initialFundId: fund.fundCode } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 animate-fadeIn">
        
      {/* 1. 상단 헤더 영역 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-sm mb-4 hover:text-orange-500 flex items-center">
            ← リストに戻る
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex gap-2 text-xs text-gray-500 mb-2 font-mono">
                <span>{fund.shortCode}</span> | <span>{fund.fundCode}</span> | <span>{fund.managementCompany}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{fund.fundName}</h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-extrabold text-gray-900">¥{fund.basePrice.toLocaleString()}</span>
                <span className={`text-lg font-medium ${textColor}`}>
                  {sign}{Math.abs(fund.prevComparison)} ({sign}{Math.abs(fund.prevComparisonPercent)}%)
                </span>
                <span className="text-xs text-gray-400">基準日: {fund.baseDate}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button 
                onClick={handleAddToCompare}
                className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition text-sm flex items-center justify-center gap-2"
               >
                <span>⇄</span> 比較リストに追加
              </button>
              <button 
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`flex-1 md:flex-none px-6 py-3 font-bold rounded-lg transition text-sm flex items-center justify-center gap-2 shadow-sm
                  ${isWatchlisted ? 'bg-gray-100 text-gray-700 border border-gray-300' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
              >
                <span>{isWatchlisted ? '♥' : '♡'}</span> {isWatchlisted ? '登録解除' : 'ウォッチリスト'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 메인 콘텐츠 영역 (2단 레이아웃) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽 2/3: 탭 콘텐츠 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* 탭 메뉴 */}
           <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-4">
            {['overview', 'chart', 'portfolio'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm focus:outline-none border-b-2 transition-colors ${
                        activeTab === tab 
                        ? 'border-orange-500 text-orange-600 font-bold' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab === 'overview' && '概要・ポイント'}
                    {tab === 'chart' && 'チャート'}
                    {tab === 'portfolio' && '構成銘柄'}
                </button>
            ))}
           </div>
           
           {/* 탭 내용 컨테이너 */}
           <div className="bg-white rounded-b-xl p-6 shadow-sm border border-t-0 border-gray-200">
             
             {/* Tab 1: 개요 */}
             {activeTab === 'overview' && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ファンドの特徴</h3>
                    <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{fund.description}</p>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-4">基本情報</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="text-gray-500 mb-1">カテゴリー</div>
                            <div className="font-semibold">{fund.category}</div>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="text-gray-500 mb-1">リスクレベル (1-5)</div>
                            <div className="font-semibold flex items-center">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${fund.riskLevel >=4 ? 'bg-red-500': fund.riskLevel ===3 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                Level {fund.riskLevel}
                            </div>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="text-gray-500 mb-1">純資産総額</div>
                            <div className="font-semibold">{fund.netAssets}</div>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="text-gray-500 mb-1">信託報酬 (税込)</div>
                            <div className="font-semibold">{fund.trustFee}%</div>
                        </div>
                    </div>
                </div>
             )}

             {/* Tab 2: 차트 (Placeholder) */}
             {activeTab === 'chart' && (
                 <div className="h-96 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                     <span className="text-5xl mb-4">📊</span>
                     <p className="font-medium">インタラクティブチャート準備中</p>
                     <p className="text-sm mt-2">期間別収益率およびベンチマーク比較機能を提供する予定です。</p>
                 </div>
             )}

            {/* Tab 3: 구성 종목 */}
             {activeTab === 'portfolio' && (
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">組入上位銘柄 (Top Holdings)</h3>
                    <p className="text-sm text-gray-500 mb-4">※ 最新の運用報告書基準のデータです。</p>
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">銘柄名</th>
                                    <th className="px-6 py-3 text-right">コード</th>
                                    <th className="px-6 py-3 text-right">比率 (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {fund.topHoldings ? fund.topHoldings.map((holding, index) => (
                                    <tr key={index} className="bg-white hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {index + 1}. {holding.name}
                                        </th>
                                        <td className="px-6 py-4 text-right font-mono">
                                            {holding.code}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">
                                            {holding.weight}%
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="3" className="p-4 text-center">データがありません。</td></tr>}
                            </tbody>
                        </table>
                    </div>
                 </div>
             )}

           </div>
        </div>

        {/* 오른쪽 1/3: AI 분석 서비스 (핵심 기능) */}
        <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm border border-blue-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md text-white">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">MoneyMart AI Insight</h2>
                        <p className="text-xs text-blue-600 font-medium">AIベースの投資分析レポート</p>
                    </div>
                </div>

                {fund.aiAnalysis ? (
                    <>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                             <h3 className="font-bold text-gray-800">AI要約</h3>
                             {getOutlookBadge(fund.aiAnalysis.Outlook)}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                            "{fund.aiAnalysis.summary}"
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">主な投資ポイント</h3>
                        <ul className="space-y-3">
                            {fund.aiAnalysis.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-gray-700 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6 text-xs text-gray-400 text-center">
                        ※ 本AI分析は過去のデータに基づくシミュレーションであり、将来の収益を保証するものではありません。
                    </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        AI分析データを読み込めません。
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default FundDetailPage;