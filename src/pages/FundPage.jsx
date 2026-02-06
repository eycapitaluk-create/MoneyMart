import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, Info, Check, Globe, DollarSign, Flag, BarChart2, 
  LayoutList, ScatterChart as ChartIcon, TrendingUp, Loader2, ChevronRight
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

import { supabase } from '../lib/supabase';
import PremiumLock from '../components/PremiumLock';

const FundPage = ({ user, myWatchlist, toggleWatchlist }) => { 
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  
  const [dbFunds, setDbFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedFundIds, setSelectedFundIds] = useState([]);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('funds')
          .select('*')
          .order('return_rate', { ascending: false });

        if (error) throw error;

        const formattedData = data.map(item => {
          const basePrice = item.base_price || 10000; 
          const changePrice = item.change_price || 0;
          const changePercent = basePrice !== 0 
            ? ((changePrice / basePrice) * 100).toFixed(2) 
            : '0.00';

          return {
            id: item.id,
            fundName: item.name,
            fundCode: item.code,
            category: item.category,
            managementCompany: item.company,
            trustFee: item.fee ? item.fee + '%' : '-',
            annualReturn: item.return_rate ? (item.return_rate > 0 ? '+' : '') + item.return_rate + '%' : '-',
            returnRate1Y: Number(item.return_rate || 0),
            riskLevel: item.risk_level || 3,
            aum: item.net_assets,
            basePrice: basePrice,
            prevComparison: changePrice,
            prevComparisonPercent: changePercent,
            minInvest: 100,
            isNew: false 
          };
        });

        setDbFunds(formattedData);
      } catch (error) {
        console.error('Error fetching funds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const filters = [
    { id: 'all', label: 'すべて', icon: Check },
    { id: 'domestic', label: '国内株式', icon: Flag },
    { id: 'global', label: '海外・全世界', icon: Globe },
    { id: 'lowcost', label: '低コスト', icon: DollarSign },
  ];

  const filteredFunds = useMemo(() => {
    let result = dbFunds;
    if (searchTerm) {
      result = result.filter(fund => 
        (fund.fundName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fund.fundCode || '').includes(searchTerm)
      );
    }
    if (activeFilter !== 'all') {
      if (activeFilter === 'domestic') result = result.filter(f => f.category?.includes('国内'));
      if (activeFilter === 'global') result = result.filter(f => f.category?.includes('海外') || f.category?.includes('外国') || f.category?.includes('全世界') || f.category?.includes('先進国'));
      if (activeFilter === 'lowcost') {
        result = result.filter(f => {
          const feeStr = String(f.trustFee || '100').replace('%', '');
          const fee = parseFloat(feeStr);
          return fee < 0.2; 
        });
      }
    }
    return result;
  }, [searchTerm, activeFilter, dbFunds]);

  const mapData = useMemo(() => filteredFunds.map(f => {
    return {
        id: f.id,
        x: (f.riskLevel || 3) + (Math.random() * 0.4 - 0.2), 
        y: f.returnRate1Y, 
        name: f.fundName,
        category: f.category,
        risk: f.riskLevel
    };
  }), [filteredFunds]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl text-xs z-50">
          <p className="font-bold mb-1 text-slate-900">{data.name}</p>
          <div className="flex gap-3 text-xs">
            <span className="text-slate-500">Risk Lv.{data.risk}</span>
            <span className={`font-bold ${data.y >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
              Return {data.y}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // 체크박스 클릭 핸들러 (비교함 담기/빼기)
  const handleCheckboxChange = (e, fundId) => {
    e.stopPropagation(); // ★ 중요: 상세 페이지 이동 방지
    if (selectedFundIds.includes(fundId)) {
        setSelectedFundIds(selectedFundIds.filter(id => id !== fundId));
    } else {
        if (selectedFundIds.length >= 2) { 
            alert("比較は最大2件まで選択可能です。");
            return;
        }
        setSelectedFundIds([...selectedFundIds, fundId]);
    }
  };

  const goToComparison = () => {
    if (selectedFundIds.length < 2) {
        alert("比較するには2つ以上のファンドを選択してください。");
        return;
    }
    navigate('/comparison', { state: { selectedFundIds } });
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">データを読み込んでいます...</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn bg-[#F9FAFB] min-h-screen font-sans pb-32">
      
      {/* Header & View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">ファンド検索</h1>
            <p className="text-slate-500 text-sm">全{dbFunds.length}件のファンドからAIが分析</p>
        </div>
        
        <div className="flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
          >
            <LayoutList size={16}/> リスト
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${viewMode === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
          >
            <ChartIcon size={16}/> リスクマップ
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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

      {/* --- Risk-Return Map View (Premium Locked) --- */}
      {viewMode === 'map' ? (
        <PremiumLock user={user} title="効率的フロンティア分析 (Beta)">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-200 shadow-lg mb-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                    <TrendingUp className="text-blue-500"/> リスク・リターン分布
                    </h3>
                    <div className="flex gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 優秀 (高リターン)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> 一般</span>
                    </div>
                </div>
                
                <div className="h-[400px] w-full bg-slate-50 rounded-2xl relative">
                    <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 z-0">Return (高)</div>
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 z-0">Risk (高)</div>
                    
                    <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" dataKey="x" name="Risk" unit="" tick={false} axisLine={false} domain={[0, 6]} />
                        <YAxis type="number" dataKey="y" name="Return" unit="%" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Funds" data={mapData} onClick={(d) => navigate(`/fund/${d.id}`)} className="cursor-pointer">
                        {mapData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.y > 10 && entry.x < 3 ? '#3b82f6' : '#94a3b8'} />
                        ))}
                        </Scatter>
                    </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                    ● 左上にあるほど「リスクが低く、リターンが高い」優秀なファンドです。
                </p>
            </div>
        </PremiumLock>
      ) : (
        /* --- List View --- */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
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
                const isPlus = (parseFloat(fund.prevComparisonPercent) || 0) >= 0;
                const riskLevel = fund.riskLevel || 3;
                const isHighRisk = riskLevel >= 4;
                const isSelected = selectedFundIds.includes(fund.id);
                const isWatchlisted = Array.isArray(myWatchlist) && myWatchlist.includes(fund.id);
                
                return (
                <div 
                    key={fund.id}
                    // ★ [수정] 카드 전체 클릭 시 상세 페이지 이동
                    onClick={() => navigate(`/fund/${fund.id}`)}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 items-center transition cursor-pointer group relative
                        ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'}`} 
                >
                    {fund.isNew && (
                        <div className="absolute top-0 left-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10 shadow-sm animate-pulse">
                            NEW
                        </div>
                    )}

                    {/* 1. Checkbox (Desktop) - 비교 선택용 */}
                    <div 
                        className="col-span-1 hidden md:flex justify-center items-center" 
                        onClick={(e) => e.stopPropagation()} // 부모 클릭 방지
                    >
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
                    
                    {/* Watchlist Button (Mobile) */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(fund.id);
                        }}
                        className="absolute right-0 top-0 md:hidden p-2 text-gray-400 z-10"
                    >
                        <Heart size={20} fill={isWatchlisted ? "#EF4444" : "none"} className={isWatchlisted ? "text-red-500" : ""} />
                    </button>

                    {/* Mobile Comparison Checkbox */}
                    <div className="md:hidden flex items-center mb-2" onClick={(e) => handleCheckboxChange(e, fund.id)}>
                        <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300'}`}>
                            {isSelected && <Check size={12} />}
                        </div>
                        <span className="text-xs text-gray-500 font-bold">比較リストに追加</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="pr-4">
                            <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {fund.fundName}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mb-2">
                                {fund.managementCompany}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">
                        {fund.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${isHighRisk ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        Risk Lv.{riskLevel}
                        </span>
                        
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
                    ¥{fund.minInvest?.toLocaleString()}
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
                    <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWatchlist(fund.id);
                            }}
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
      )}

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