// src/pages/FundPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, Check, BarChart2, X } from 'lucide-react'; // 아이콘 추가

// 데이터 가져오기
import { funds } from '../data/mockData';

const FundPage = ({ myWatchlist = [], toggleWatchlist }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // ★ 비교함 상태 (선택된 펀드 코드들)
  const [compareList, setCompareList] = useState([]);

  const filters = [
    { id: 'ALL', label: 'すべて' },
    { id: 'Domestic', label: '🇯🇵 国内株式' },
    { id: 'US', label: '🇺🇸 米国株式' },
    { id: 'Global', label: '🌏 全世界株式' },
    { id: 'LowFee', label: '💰 低コスト' },
  ];

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = 
      fund.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.fundCode.includes(searchTerm) ||
      (fund.shortCode && fund.shortCode.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LowFee') return fund.trustFee <= 0.2;
    return fund.category.includes(activeFilter);
  });

  const handleRowClick = (fundCode) => {
    navigate(`/fund/${fundCode}`);
  };

  const handleHeartClick = (e, fundCode) => {
    e.stopPropagation();
    if (toggleWatchlist) toggleWatchlist(fundCode);
  };

  // ★ 비교함 담기/빼기 토글
  const toggleCompare = (e, fundCode) => {
    e.stopPropagation();
    if (compareList.includes(fundCode)) {
      setCompareList(compareList.filter(id => id !== fundCode));
    } else {
      if (compareList.length >= 3) {
        alert("比較できるのは最大3つまでです (최대 3개)");
        return;
      }
      setCompareList([...compareList, fundCode]);
    }
  };

  // ★ 비교 페이지로 이동
  // src/pages/FundPage.jsx 안의 goToComparePage 함수 수정

  // ★ 비교 페이지로 이동 (수정됨: 배열 전체 전송)
  const goToComparePage = () => {
    if (compareList.length > 0) {
        // 기존: { initialFundId: compareList[0] }  <- 하나만 보냄 (버그)
        // 수정: { selectedFundIds: compareList }   <- 배열 전체 보냄 (해결!)
        navigate('/comparison', { state: { selectedFundIds: compareList } });
    }
  };


  // 리스크 뱃지 UI
  const getRiskBadge = (level) => {
    let colorClass = 'bg-gray-400';
    if (level >= 5) colorClass = 'bg-red-600';
    else if (level === 4) colorClass = 'bg-orange-500';
    else if (level === 3) colorClass = 'bg-yellow-500';
    else if (level <= 2) colorClass = 'bg-green-500';

    return (
      <div className="flex items-center justify-center">
        <span className={`${colorClass} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm`}>
          {level}
        </span>
        <span className="text-xs text-gray-500 hidden md:inline-block font-medium">
            {level >= 4 ? 'High' : level === 3 ? 'Mid' : 'Low'}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-slate-900 min-h-screen animate-fadeIn transition-colors pb-32">
      
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">ファンド検索</h1>
        
        {/* 검색 및 필터 */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex items-center focus-within:ring-2 focus-within:ring-orange-500 transition-all">
            <div className="pl-4 pr-3 text-gray-400 dark:text-gray-500"><Search size={20} /></div>
            <input 
              type="text"
              placeholder="ファンド名、銘柄コード(JP...) で検索"
              className="flex-1 outline-none text-gray-900 dark:text-white placeholder-gray-400 bg-transparent font-bold h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {/* 필터 버튼들 (기존 코드 유지) */}
             <div className="flex items-center gap-2 pr-4">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 whitespace-nowrap mr-2"><SlidersHorizontal size={14}/> フィルター:</span>
                {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFilter === filter.id ? 'bg-gray-900 text-white border-gray-900 dark:bg-orange-500 dark:border-orange-500 shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'}`}
                >
                    {activeFilter === filter.id && <Check size={14} className="inline mr-1" strokeWidth={3}/>}
                    {filter.label}
                </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 펀드 리스트 테이블 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-700">
              <tr className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-5 w-12 text-center">Watch</th>
                <th className="p-5 w-12 text-center text-orange-600">比較</th> {/* ★ 비교 컬럼 추가 */}
                <th className="p-5">ファンド名 / カテゴリー</th>
                <th className="p-5 text-right text-orange-600 dark:text-orange-400">年間リターン</th>
                <th className="p-5 text-right">信託報酬</th>
                <th className="p-5 text-right">最低投資額</th>
                <th className="p-5 text-right">純資産(AUM)</th>
                <th className="p-5 text-right">基準価額 / 前日比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredFunds.length > 0 ? (
                filteredFunds.map((fund) => {
                  const isPlus = fund.prevComparison > 0;
                  const textColor = isPlus ? 'text-red-500' : fund.prevComparison < 0 ? 'text-blue-500' : 'text-gray-500';
                  const sign = isPlus ? '+' : '';
                  const isWatched = myWatchlist.includes(fund.fundCode);
                  const isComparing = compareList.includes(fund.fundCode); // 비교함 담겼는지

                  return (
                    <tr 
                      key={fund.fundCode} 
                      onClick={() => handleRowClick(fund.fundCode)}
                      className={`cursor-pointer transition-colors group ${isComparing ? 'bg-orange-50 dark:bg-orange-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
                    >
                      {/* 1. Watch Button */}
                      <td className="p-5 text-center">
                        <button 
                            onClick={(e) => handleHeartClick(e, fund.fundCode)}
                            className={`p-2 rounded-full transition-all transform active:scale-90 ${isWatched ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'text-gray-300 hover:text-pink-400 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                        >
                             <Heart size={20} fill={isWatched ? "currentColor" : "none"} strokeWidth={isWatched ? 0 : 2} />
                        </button>
                      </td>

                      {/* 2. Compare Checkbox (★ 신규 기능) */}
                      <td className="p-5 text-center">
                        <button 
                            onClick={(e) => toggleCompare(e, fund.fundCode)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isComparing ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 text-transparent hover:border-orange-400'}`}
                        >
                             <Check size={16} strokeWidth={4} />
                        </button>
                      </td>

                      {/* 3. Info */}
                      <td className="p-5">
                        <div className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-orange-600 transition-colors truncate max-w-[240px]">
                            {fund.fundName}
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded">
                             {fund.category}
                           </span>
                           <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fund.riskLevel >= 4 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             Risk Lv.{fund.riskLevel}
                           </span>
                        </div>
                      </td>

                      {/* Data Columns */}
                      <td className="p-5 text-right font-black text-orange-600 dark:text-orange-400 text-base">{fund.return1y}%</td>
                      <td className="p-5 text-right font-medium text-gray-700 dark:text-gray-300">{fund.trustFee}%</td>
                      <td className="p-5 text-right font-medium text-gray-700 dark:text-gray-300">¥{fund.minInvestment.toLocaleString()}</td>
                      <td className="p-5 text-right font-medium text-gray-700 dark:text-gray-300">{fund.netAssets}</td>
                      <td className="p-5 text-right">
                        <div className="font-bold text-gray-900 dark:text-white">¥{fund.basePrice.toLocaleString()}</div>
                        <div className={`text-xs font-bold ${textColor}`}>
                          {sign}{Math.abs(fund.prevComparison)} ({sign}{Math.abs(fund.prevComparisonPercent)}%)
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-500 dark:text-gray-400">
                    検索結果が見つかりません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* ★ 하단 플로팅 비교 바 (Floating Comparison Bar) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-slideUp">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                        {compareList.length}
                    </div>
                    <div>
                        <p className="font-bold text-sm">商品が選択されました</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">最大3つまで比較可能</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCompareList([])}
                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white dark:hover:text-gray-700 transition"
                    >
                        クリア
                    </button>
                    <button 
                        onClick={goToComparePage}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg"
                    >
                        <BarChart2 size={16}/> 比較する
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="mt-4 text-right text-xs text-gray-400 font-medium">
        ※ 基準日: 2026.02.02 | 表示データはシミュレーションです。
      </div>
    </div>
  );
};

export default FundPage;