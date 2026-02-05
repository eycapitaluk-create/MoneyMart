import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, X, AlertCircle, BarChart2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import { funds } from '../data/realData';

const ComparisonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 데이터 변환
  const allProducts = funds.map(fund => {
     const parsePercent = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.replace('%', '').replace(',', ''));
     };

     return {
        id: fund.id,
        name: fund.fundName,
        type: fund.category,
        // ✅ 수정: 화면에 보여줄 코드는 'shortCode'(4자리)를 우선 사용
        // shortCode가 없으면 fundCode를 쓰고, 그것도 없으면 공란
        displayCode: fund.shortCode || fund.fundCode || '', 
        fee: parsePercent(fund.trustFee),
        returnRate: parsePercent(fund.annualReturn || fund.prevComparisonPercent),
        risk: fund.riskLevel,
        company: fund.managementCompany,
        netAssets: fund.aum
     };
  });

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (location.state) {
        if (location.state.selectedFundIds) {
            setSelectedIds(location.state.selectedFundIds);
        }
        else if (location.state.initialFundId) {
            setSelectedIds(prev => {
                if (prev.includes(location.state.initialFundId)) return prev;
                if (prev.length >= 3) return [location.state.initialFundId, ...prev.slice(0, 2)];
                return [...prev, location.state.initialFundId];
            });
        }
    } else {
        if (allProducts.length >= 2) {
            setSelectedIds([allProducts[0].id, allProducts[1].id]);
        }
    }
  }, [location.state]);

  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("比較できるのは最大3つまでです");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparisonData = selectedProducts.map(p => ({
    name: p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name,
    '手数料(%)': p.fee,
    '騰落率(%)': p.returnRate
  }));

  return (
    <div className="pb-20 animate-fadeIn bg-slate-50 min-h-screen font-sans">
      
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} className="text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-gray-900">ファンド比較</h1>
        <span className="ml-auto text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          {selectedIds.length} / 3 選択中
        </span>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* 1. 상품 선택 영역 */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 text-sm px-1 flex items-center gap-2">
            <span>👇 比較するファンドを選択</span>
            <span className="text-xs font-normal text-gray-400">(タップで追加/解除)</span>
          </h3>
          
          <div className="flex gap-4 overflow-x-auto pb-6 px-1 scrollbar-hide">
            {allProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => toggleSelection(product.id)}
                className={`
                  min-w-[180px] w-[180px] p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between h-40 shadow-sm flex-shrink-0
                  ${selectedIds.includes(product.id) 
                    ? 'bg-orange-50 border-orange-500 shadow-md transform -translate-y-1' 
                    : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow'}
                `}
              >
                {selectedIds.includes(product.id) && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1 shadow-sm z-10">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold truncate max-w-[70%]">
                        {product.type}
                    </span>
                    {/* ✅ 카드 우측 상단에 짧은 코드 표시 */}
                    {product.displayCode && (
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            {product.displayCode}
                        </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 break-keep">
                    {product.name}
                  </h4>
                </div>
                
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] text-gray-400">手数料</span>
                     <span className="font-bold text-gray-700 text-xs">{product.fee}%</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-400">年間リターン</span>
                     <span className={`font-bold text-sm ${product.returnRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                       {product.returnRate}%
                     </span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 상세 비교 테이블 */}
        {selectedProducts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
              <BarChart2 className="text-orange-500"/>
              <h3 className="font-bold text-gray-900">詳細比較・分析</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="overflow-x-auto border-b lg:border-b-0 lg:border-r border-gray-100">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="bg-white text-gray-500 border-b border-gray-100">
                            <th className="p-4 w-24 bg-gray-50 font-medium whitespace-nowrap">比較項目</th>
                            {selectedProducts.map(p => (
                            <th key={p.id} className="p-4 min-w-[140px] font-bold text-gray-900 align-top">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        {/* ✅ 테이블 헤더에도 짧은 코드 표시 */}
                                        {p.displayCode && (
                                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded inline-block mb-1">
                                                {p.displayCode}
                                            </span>
                                        )}
                                        <button onClick={() => toggleSelection(p.id)} className="text-gray-300 hover:text-red-500 shrink-0 ml-auto">
                                            <X size={16}/>
                                        </button>
                                    </div>
                                    <span className="line-clamp-2 leading-snug">{p.name}</span>
                                </div>
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="p-4 font-bold text-gray-500 bg-gray-50">運用会社</td>
                            {selectedProducts.map(p => (
                            <td key={p.id} className="p-4 text-xs text-gray-600 break-keep">{p.company}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-gray-500 bg-gray-50">手数料</td>
                            {selectedProducts.map(p => (
                            <td key={p.id} className={`p-4 font-bold ${p.fee <= 0.1 ? 'text-green-600' : 'text-gray-700'}`}>
                                {p.fee}%
                                {p.fee <= 0.1 && <span className="block text-[10px] text-green-500 font-normal">🔥 低コスト</span>}
                            </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-gray-500 bg-gray-50">年間リターン</td>
                            {selectedProducts.map(p => (
                            <td key={p.id} className={`p-4 font-bold ${p.returnRate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {p.returnRate > 0 ? '+' : ''}{p.returnRate}%
                            </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-gray-500 bg-gray-50">純資産総額</td>
                            {selectedProducts.map(p => (
                            <td key={p.id} className="p-4 text-gray-700 text-xs">{p.netAssets}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold text-gray-500 bg-gray-50">リスク</td>
                            {selectedProducts.map(p => (
                            <td key={p.id} className="p-4">
                                <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${i < p.risk ? (p.risk >=4 ? 'bg-red-500' : p.risk===3 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                                ))}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 block">Level {p.risk}</span>
                            </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-white flex flex-col justify-center min-h-[300px]">
                    <h4 className="font-bold text-sm text-gray-500 mb-6 text-center">コスト vs リターン (可視化)</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="name" tick={{fontSize: 11, fill: '#6B7280'}} interval={0} />
                            <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{fontSize: 10}} label={{ value: '手数料(%)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#EF4444" tick={{fontSize: 10}} label={{ value: 'リターン(%)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                cursor={{fill: '#F9FAFB'}}
                            />
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                            <Bar yAxisId="left" dataKey="手数料(%)" name="手数料 (低いほど良い)" fill="#3B82F6" barSize={40} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="騰落率(%)" name="リターン (高いほど良い)" fill="#EF4444" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
             <div className="bg-gray-50 p-4 rounded-full mb-4">
                <AlertCircle className="text-gray-400" size={32} />
             </div>
             <p className="text-gray-600 font-bold text-lg mb-1">比較するファンドがありません</p>
             <p className="text-sm text-gray-400">上のリストから商品をタップして選択してください (最大3つ)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;