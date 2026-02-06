import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, X, AlertCircle, TrendingUp, Loader2 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// ★ DB 연결 도구
import { supabase } from '../lib/supabase';

// 라인 차트용 색상 팔레트
const COLORS = ['#F97316', '#3B82F6']; // Orange, Blue

const ComparisonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ★ DB 데이터 상태 관리
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  // 1. DB에서 펀드 데이터 가져오기
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('funds')
          .select('*')
          .order('return_rate', { ascending: false });

        if (error) throw error;

        // DB 데이터를 비교 페이지 형식에 맞게 변환
        const formattedData = data.map(fund => ({
          id: fund.id,
          name: fund.name,
          type: fund.category,
          displayCode: fund.code,
          fee: Number(fund.fee || 0), 
          returnRate: Number(fund.return_rate || 0),
          risk: fund.risk_level,
          company: fund.company,
          netAssets: fund.net_assets
        }));

        setAllProducts(formattedData);
      } catch (err) {
        console.error('Error fetching comparison data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, []);

  // 2. 초기 선택값 설정 (★ 안전장치 추가: ID 불일치 해결)
  useEffect(() => {
    if (allProducts.length === 0) return;

    let targetIds = [];

    // (1) 넘어온 ID 확인
    if (location.state?.selectedFundIds) {
        // 메인 검색 페이지에서 선택해서 온 경우
        targetIds = location.state.selectedFundIds;
    }
    else if (location.state?.initialFundId) {
        // 상세 페이지에서 '비교하기' 눌러서 온 경우 -> 기존 선택 유지하며 추가
        targetIds = [...selectedIds, location.state.initialFundId];
    }

    // (2) ★ [핵심] DB에 진짜 존재하는 ID인지 검증 (DB 초기화로 인한 ID 불일치 방지)
    const validIds = targetIds.filter(id => allProducts.find(p => p.id === id));
    
    // 중복 제거 및 최대 2개 자르기
    const uniqueIds = [...new Set(validIds)].slice(0, 2);

    if (uniqueIds.length > 0) {
        setSelectedIds(uniqueIds);
    } else {
        // (3) 유효한 ID가 하나도 없으면(옛날 ID이거나 직접 접속) -> 상위 2개 자동 선택
        if (allProducts.length >= 2) {
            setSelectedIds([allProducts[0].id, allProducts[1].id]);
        }
    }
  }, [location.state, allProducts]); // selectedIds는 의존성에서 제외 (무한루프 방지)

  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      // 최대 2개 제한 체크
      if (selectedIds.length >= 2) {
        alert("比較できるのは最大2つまでです");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 라인 차트용 데이터 생성 (1년 추이 시뮬레이션)
  const trendData = useMemo(() => {
    if (selectedProducts.length === 0) return [];
    
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}ヶ月`);
    
    return months.map((month, idx) => {
        const point = { name: month };
        
        selectedProducts.forEach((p) => {
            const monthlyRate = p.returnRate / 12;
            const volatility = (Math.random() - 0.5) * 1.5; // 약간의 랜덤 변동성
            
            let simulatedReturn = (monthlyRate * (idx + 1)) + volatility;
            
            // 시작과 끝은 정확하게 맞춤
            if (idx === 0) simulatedReturn = monthlyRate;
            if (idx === 11) simulatedReturn = p.returnRate;

            point[p.name] = parseFloat(simulatedReturn.toFixed(2));
        });
        return point;
    });
  }, [selectedProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">比較データを準備中...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fadeIn bg-slate-50 min-h-screen font-sans">
      
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} className="text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-gray-900">ファンド比較</h1>
        <span className="ml-auto text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          {selectedIds.length} / 2 選択中
        </span>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* 1. 상품 선택 영역 */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 text-sm px-1 flex items-center gap-2">
            <span>👇 比較するファンドを選択</span>
            <span className="text-xs font-normal text-gray-400">(タップで追加/解除)</span>
          </h3>
          
          {/* 가로 스크롤 영역 (체크표시 잘림 해결된 스타일 유지: pt-4, pb-6) */}
          <div className="flex gap-4 overflow-x-auto pb-6 px-1 pt-4 scrollbar-hide">
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

        {/* 2. 상세 비교 테이블 및 차트 */}
        {selectedProducts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
              <TrendingUp className="text-orange-500"/>
              <h3 className="font-bold text-gray-900">詳細比較・分析</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* 테이블 영역 */}
                <div className="overflow-x-auto border-b lg:border-b-0 lg:border-r border-gray-100">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="bg-white text-gray-500 border-b border-gray-100">
                            <th className="p-4 w-24 bg-gray-50 font-medium whitespace-nowrap">比較項目</th>
                            {selectedProducts.map((p, idx) => (
                            <th key={p.id} className="p-4 min-w-[140px] font-bold text-gray-900 align-top">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        <div 
                                          className="w-3 h-3 rounded-full mt-1 mr-2" 
                                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                        ></div>
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

                {/* 라인 차트 영역 */}
                <div className="p-6 bg-white flex flex-col justify-center min-h-[350px]">
                    <h4 className="font-bold text-sm text-gray-500 mb-6 text-center">基準価額 推移 (1年シミュレーション)</h4>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="name" tick={{fontSize: 11, fill: '#6B7280'}} interval={1} />
                            <YAxis 
                                stroke="#9CA3AF" 
                                tick={{fontSize: 10}} 
                                label={{ value: '収益率(%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9CA3AF' }} 
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                            />
                            <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                            
                            {selectedProducts.map((p, idx) => (
                                <Line 
                                    key={p.id}
                                    type="monotone" 
                                    dataKey={p.name} 
                                    stroke={COLORS[idx % COLORS.length]} 
                                    strokeWidth={3}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        ※ 過去の実績に基づいたシミュレーションであり、将来の運用成果を保証するものではありません。
                    </p>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
             <div className="bg-gray-50 p-4 rounded-full mb-4">
                <AlertCircle className="text-gray-400" size={32} />
             </div>
             <p className="text-gray-600 font-bold text-lg mb-1">比較するファンドがありません</p>
             <p className="text-sm text-gray-400">上のリストから商品をタップして選択してください (最大2つ)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;