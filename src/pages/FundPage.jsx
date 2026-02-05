import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Info, Check, Globe, DollarSign, Flag, BarChart2 } from 'lucide-react';

// Import real data
import { funds } from '../data/realData';

const FundPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // State for selected fund IDs for comparison
  const [selectedFundIds, setSelectedFundIds] = useState([]);

  // ✅ 추가: 워치리스트 상태 관리 (localStorage 연동)
  const [watchListIds, setWatchListIds] = useState([]);

  // 초기 로드 시 localStorage에서 워치리스트 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('moneyMart_watchlist') || '[]');
    setWatchListIds(saved);
  }, []);

  const safeFunds = funds || [];

  const filters = [
    { id: 'all', label: 'すべて', icon: Check },
    { id: 'domestic', label: '国内株式', icon: Flag },
    { id: 'global', label: '海外・全世界', icon: Globe },
    { id: 'lowcost', label: '低コスト', icon: DollarSign },
  ];

  // Filtering logic
  const filteredFunds = useMemo(() => {
    let result = safeFunds;
    if (searchTerm) {
      result = result.filter(fund => 
        (fund.fundName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fund.fundCode || '').includes(searchTerm)
      );
    }
    if (activeFilter !== 'all') {
      if (activeFilter === 'domestic') result = result.filter(f => f.category?.includes('国内'));
      if (activeFilter === 'global') result = result.filter(f => f.category?.includes('海外') || f.category?.includes('外国') || f.category?.includes('全世界'));
      if (activeFilter === 'lowcost') {
        result = result.filter(f => {
          const fee = parseFloat((f.trustFee || '100').replace('%', ''));
          return fee < 0.2; 
        });
      }
    }
    return result;
  }, [searchTerm, activeFilter, safeFunds]);

  // Handler for toggling checkboxes (비교용)
  const handleCheckboxChange = (e, fundId) => {
    e.stopPropagation(); // Prevent row click event
    if (selectedFundIds.includes(fundId)) {
        setSelectedFundIds(selectedFundIds.filter(id => id !== fundId));
    } else {
        if (selectedFundIds.length >= 3) {
            alert("比較は最大3件まで選択可能です。"); // Alert for max 3 items
            return;
        }
        setSelectedFundIds([...selectedFundIds, fundId]);
    }
  };

  // ✅ 추가: 워치리스트 토글 핸들러 (하트 클릭)
  const toggleWatchlist = (e, fundId) => {
    e.stopPropagation();
    let newIds;
    if (watchListIds.includes(fundId)) {
        newIds = watchListIds.filter(id => id !== fundId);
    } else {
        newIds = [...watchListIds, fundId];
    }
    setWatchListIds(newIds);
    localStorage.setItem('moneyMart_watchlist', JSON.stringify(newIds));
  };

  // Handler to navigate to the comparison page
  const goToComparison = () => {
    if (selectedFundIds.length < 2) {
        alert("比較するには2つ以上のファンドを選択してください。");
        return;
    }
    navigate('/comparison', { state: { selectedFundIds } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn bg-[#F9FAFB] min-h-screen font-sans pb-24">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 mb-4">ファンド検索</h1>
        <div className="relative w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="ファンド名、銘柄コード(JP...) で検索" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-gray-700 placeholder-gray-400 outline-none text-base font-medium"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-gray-400 text-sm flex items-center mr-2">フィルター:</span>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all
              ${activeFilter === filter.id 
                ? 'bg-[#111827] text-white border-[#111827]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
            `}
          >
            {filter.id !== 'all' && <filter.icon size={14} className={activeFilter === filter.id ? 'text-white' : 'text-gray-500'} />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider items-center hidden md:grid">
          <div className="col-span-1 text-center">比較</div> 
          <div className="col-span-4 pl-2">ファンド名 / カテゴリー</div>
          <div className="col-span-2 text-center text-orange-600">年間リターン</div>
          <div className="col-span-1 text-center">信託報酬</div>
          <div className="col-span-1 text-center">最低投資額</div>
          <div className="col-span-1 text-right">純資産(AUM)</div>
          <div className="col-span-2 text-right">基準価額 / 前日比</div>
        </div>

        {/* Fund Items */}
        <div className="divide-y divide-gray-100">
          {filteredFunds.map((fund) => {
            const isPlus = (fund.prevComparison || 0) >= 0;
            const riskLevel = fund.riskLevel || 3;
            const isHighRisk = riskLevel >= 4;
            const isSelected = selectedFundIds.includes(fund.id);
            // ✅ 추가: 현재 펀드가 워치리스트에 있는지 확인
            const isWatchlisted = watchListIds.includes(fund.id);
            
            return (
              <div 
                key={fund.id}
                onClick={() => navigate(`/fund/${fund.id}`)}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 items-center transition cursor-pointer group
                    ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'}`} 
              >
                {/* 1. Checkbox (Desktop) */}
                <div className="col-span-1 hidden md:flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                   <div 
                     onClick={(e) => handleCheckboxChange(e, fund.id)}
                     className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors
                       ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 bg-white hover:border-orange-400'}`}
                   >
                      {isSelected && <Check size={16} strokeWidth={3} />}
                   </div>
                </div>

                {/* 2. Fund Info */}
                <div className="col-span-1 md:col-span-4 pl-0 md:pl-2 relative">
                   {/* Checkbox (Mobile) */}
                   <div className="md:hidden flex items-center mb-2" onClick={(e) => handleCheckboxChange(e, fund.id)}>
                      <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300'}`}>
                          {isSelected && <Check size={12} />}
                      </div>
                      <span className="text-xs text-gray-500 font-bold">比較リストに追加</span>
                   </div>

                   {/* ✅ 추가: Watchlist Button (Mobile - 우측 상단) */}
                   <button 
                     onClick={(e) => toggleWatchlist(e, fund.id)}
                     className="absolute right-0 top-0 md:hidden p-2 text-gray-400 z-10"
                   >
                     <Heart size={20} fill={isWatchlisted ? "#EF4444" : "none"} className={isWatchlisted ? "text-red-500" : ""} />
                   </button>

                  <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2 pr-8 md:pr-0">
                    {fund.fundName}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    {fund.fundNameEn || `${fund.managementCompany} Fund`}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">
                      {fund.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${isHighRisk ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      Risk Lv.{riskLevel}
                    </span>
                    
                    {/* ✅ 추가: Watchlist Indicator (Desktop - 뱃지 형태) */}
                    {isWatchlisted && (
                        <span className="hidden md:flex items-center text-red-500 bg-red-50 text-xs px-2 py-1 rounded font-bold border border-red-100">
                            <Heart size={10} fill="currentColor" className="mr-1" />
                            Watch
                        </span>
                    )}
                  </div>
                </div>

                {/* 3. Annual Return */}
                <div className="col-span-1 md:col-span-2 flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-400 text-xs">年間リターン</span>
                  <span className="text-xl font-black text-orange-500">
                    {fund.annualReturn}
                  </span>
                </div>

                {/* 4. Trust Fee */}
                <div className="col-span-1 hidden md:block text-center text-gray-700 font-medium text-sm">
                  {fund.trustFee}
                </div>

                {/* 5. Min Investment */}
                <div className="col-span-1 hidden md:block text-center text-gray-700 font-medium text-sm">
                  ¥{fund.minInvest}
                </div>

                {/* 6. AUM */}
                <div className="col-span-1 hidden md:block text-right text-gray-700 font-medium text-sm whitespace-nowrap">
                   {fund.aum}
                </div>

                {/* 7. Base Price */}
                <div className="col-span-1 md:col-span-2 flex justify-between md:block text-right">
                  <span className="md:hidden text-gray-400 text-xs">基準価額</span>
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      ¥{fund.basePrice.toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold mt-1 ${isPlus ? 'text-red-500' : 'text-blue-500'}`}>
                      {isPlus ? '+' : ''}{fund.prevComparison} ({fund.prevComparisonPercent}%)
                    </div>
                  </div>
                   {/* ✅ 추가: Watchlist Button (Desktop - 가격 아래쪽이나 적절한 곳에 배치) */}
                   <button 
                        onClick={(e) => toggleWatchlist(e, fund.id)}
                        className={`hidden md:inline-flex mt-2 items-center gap-1 text-xs px-2 py-1 rounded-full transition
                            ${isWatchlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <Heart size={12} fill={isWatchlisted ? "currentColor" : "none"} />
                        {isWatchlisted ? '登録済' : 'ウォッチ'}
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFunds.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Info size={48} className="mx-auto mb-4 opacity-30"/>
            <p>検索結果が見つかりませんでした。</p>
          </div>
        )}
      </div>

      {/* Floating Comparison Bar */}
      {selectedFundIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-4 animate-slideUp">
            <span className="font-bold text-sm">
                {selectedFundIds.length}件 選択中
            </span>
            <div className="h-4 w-px bg-gray-600"></div>
            <button 
                onClick={goToComparison}
                className="flex items-center gap-2 font-bold text-orange-400 hover:text-orange-300 transition"
            >
                <BarChart2 size={18} />
                比較する
            </button>
            <button 
                onClick={() => setSelectedFundIds([])} 
                className="ml-2 p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
            >
                <Search size={14} className="rotate-45" /> 
            </button>
        </div>
      )}
      
      <div className="text-right mt-4 text-xs text-gray-400">
        ※ データ提供: QUICK | 基準日: 2026.02.02
      </div>

    </div>
  );
};

export default FundPage;