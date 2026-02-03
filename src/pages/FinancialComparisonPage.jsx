import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ArrowUpDown, Check, X, ChevronRight, Info, 
  Landmark, CreditCard, Banknote, Shield, Home as HomeIcon, AlertCircle, Scale,
  Sparkles, Bot, Loader2
} from 'lucide-react';
import { FINANCIAL_PRODUCTS } from '../data/mockData';
import { Badge } from '../components/CommonUI';

// --- 🔑 Gemini API 설정 (App.jsx의 키를 여기에 넣어주세요) ---
const apiKey = ""; // ★★★ 여기에 API 키를 입력하세요! ★★★
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

async function fetchGemini(prompt) {
  if (!apiKey) return "APIキーが設定されていません。";
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "分析できませんでした。";
  } catch (error) {
    return "AIサービス接続エラーが発生しました。";
  }
}

// --- 비교 모달 (AI 분석 기능 추가됨) ---
const ProductComparisonModal = ({ category, selectedIds, onClose }) => {
  const categoryData = FINANCIAL_PRODUCTS[category] || [];
  const products = categoryData.filter(p => selectedIds.includes(p.id));
  
  // AI 상태 관리
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI 분석 실행 함수
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    const productData = JSON.stringify(products);
    const prompt = `
      あなたは日本の金融専門家です。以下の金融商品を比較分析してください。
      
      【データ】: ${productData}
      
      【依頼】:
      1. 各商品の主なメリットとデメリットを簡潔に比較してください。
      2. 「どのような人にどの商品がおすすめか」を具体的に提案してください。
      3. 専門用語を使わず、親しみやすいトーンで200文字以内でまとめてください。
    `;
    
    const result = await fetchGemini(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const renderRow = (label, key, highlightBest = false, formatter = (v) => v) => {
    let bestIndices = [];
    if (highlightBest && products.length > 0) {
       const values = products.map(p => {
         const val = p[key];
         if (typeof val === 'number') return val;
         const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
         return isNaN(num) ? -1 : num;
       });
       const isHighBetter = ['rate', 'bonus', 'coverage', 'limit'].includes(key); 
       const target = isHighBetter ? Math.max(...values) : Math.min(...values);
       if (target !== -1) bestIndices = values.map((v, i) => v === target ? i : -1).filter(i => i !== -1);
    }

    return (
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 sticky left-0 border-b border-slate-200 dark:border-slate-700 min-w-[120px] z-10 text-xs">{label}</td>
        {products.map((p, idx) => {
           const isBest = bestIndices.includes(idx);
           return (
            <td key={p.id} className={`p-4 border-b border-slate-100 dark:border-slate-700 text-center min-w-[180px] relative ${isBest ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
              {isBest && <span className="absolute top-1 right-1 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">BEST</span>}
              <span className="text-sm dark:text-white font-medium">{formatter(p[key])}</span>
            </td>
           );
        })}
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* 헤더 */}
        <div className="p-5 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2"><Scale className="text-orange-500"/> 商品比較レポート</h2>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"/></button>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* 좌측: 비교 테이블 (스크롤 가능) */}
          <div className="flex-1 overflow-auto p-4 custom-scrollbar border-r dark:border-slate-700">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-4 bg-slate-50 dark:bg-slate-800 sticky left-0 z-20 border-b dark:border-slate-700 text-slate-400 font-bold text-[10px] uppercase text-left w-32">Spec</th>
                  {products.map(p => (
                    <th key={p.id} className="p-6 border-b border-slate-100 dark:border-slate-700 min-w-[200px] bg-white dark:bg-slate-900 sticky top-0 z-10 text-center">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full font-bold mb-2 inline-block">{p.company || p.bank}</span>
                      <h3 className="font-black text-slate-900 dark:text-white text-base">{p.name}</h3>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {category === 'card' && (
                    <>
                      {renderRow('年会費', 'annualFeeText', false)}
                      {renderRow('還元率', 'rate', true, v => `${v}%`)}
                      {renderRow('特典', 'bonus', true, v => `${v.toLocaleString()}P`)}
                      {renderRow('ブランド', 'brand', false, v => v.join(', '))}
                      {renderRow('保険', 'insurance', false, v => v ? 'あり' : 'なし')}
                    </>
                  )}
                  {category === 'bank' && (
                     <>
                       {renderRow('金利', 'rate', true, v => `${v}%`)}
                       {renderRow('タイプ', 'type')}
                       {renderRow('期間', 'term')}
                       {renderRow('最低額', 'minAmount')}
                     </>
                  )}
                  {category === 'loan' && (
                     <>
                       {renderRow('金利', 'rate', true, v => `${v}%`)} 
                       {renderRow('限度額', 'limit', true)} 
                       {renderRow('審査', 'speed', true)}
                     </>
                  )}
                   {renderRow('特徴', 'desc', false, v => <p className="text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">{v}</p>)}
              </tbody>
            </table>
          </div>

          {/* 우측: AI 분석 패널 (고정) */}
          <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-800 p-6 flex flex-col shadow-inner overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg"><Bot size={20}/></div>
              <h3 className="font-black text-slate-800 dark:text-white">AI Analyst</h3>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm relative min-h-[200px]">
              {isAnalyzing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl z-10">
                  <Loader2 className="animate-spin text-indigo-500 mb-2" size={32}/>
                  <p className="text-xs font-bold text-slate-400 animate-pulse">データを分析中...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-xs font-bold text-indigo-500 mb-2 flex items-center gap-1"><Sparkles size={12}/> 分析完了</p>
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{aiAnalysis}</div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-2">
                  <p className="text-sm text-slate-400 font-bold mb-4">商品選びに迷っていますか？<br/>AIが最適な選択をサポートします。</p>
                  <button 
                    onClick={runAIAnalysis}
                    className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16}/> AI比較分析を開始
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-center text-slate-400 mt-4">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialComparisonPage = ({ defaultCategory = 'card' }) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [compareList, setCompareList] = useState([]); 
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (category) => {
    setActiveCategory(category);
    setCompareList([]); 
    setSearchTerm('');
  };

  const toggleCompare = (id) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(item => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert("比較は最大3つまでです。");
        return;
      }
      setCompareList(prev => [...prev, id]);
    }
  };

  const products = FINANCIAL_PRODUCTS[activeCategory] || [];
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.bank && p.bank.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.company && p.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 animate-fadeIn min-h-screen">
      
      <div className="flex overflow-x-auto gap-2 mb-8 py-2 no-scrollbar">
        {[
          { id: 'bank', label: '銀行・預金', icon: Landmark },
          { id: 'card', label: 'クレジットカード', icon: CreditCard },
          { id: 'loan', label: 'カードローン', icon: Banknote },
          { id: 'insurance', label: '保険', icon: Shield },
          { id: 'mortgage', label: '住宅ローン', icon: HomeIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeCategory === tab.id 
                ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900' 
                : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Search size={16}/> 検索</h3>
            <input 
              type="text" 
              placeholder="商品名、銀行名..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Filter size={16}/> 絞り込み</h3>
            <div className="space-y-3">
              {['ATM手数料優遇', 'ネット完結', '高金利', 'ポイント連携', '即日融資'].map((tag) => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-500 group-hover:border-orange-500 flex items-center justify-center transition-colors"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl border transition-all hover:shadow-lg group ${compareList.includes(product.id) ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-100 dark:border-slate-700'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge text={product.tags?.[0] || '注目'} color="orange" />
                      <Badge text={product.tags?.[1] || '人気'} color="blue" />
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{product.bank || product.company}</div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{product.name}</h3>
                    <div className="flex flex-wrap items-end gap-6 mb-4">
                      {product.rate && (<div><p className="text-[10px] text-slate-400 font-bold uppercase">金利 (年利)</p><p className="text-3xl font-black text-orange-500">{product.rate}<span className="text-sm">%</span></p></div>)}
                      {product.minAmount && (<div><p className="text-[10px] text-slate-400 font-bold uppercase">最低預入</p><p className="text-lg font-bold text-slate-900 dark:text-white">{product.minAmount}</p></div>)}
                      {product.annualFeeText && (<div><p className="text-[10px] text-slate-400 font-bold uppercase">年会費</p><p className="text-lg font-bold text-slate-900 dark:text-white">{product.annualFeeText}</p></div>)}
                    </div>
                    <ul className="space-y-1 mb-4">
                      {(product.features || product.desc?.split('、') || []).slice(0,3).map((feat, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0"><Check size={10} className="text-green-600 dark:text-green-400"/></div>{typeof feat === 'string' ? feat : '詳細はお問い合わせ'}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-stretch justify-center gap-3 w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                    <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm ${compareList.includes(product.id) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-400'}`}>
                      <input type="checkbox" className="hidden" checked={compareList.includes(product.id)} onChange={() => toggleCompare(product.id)} />
                      {compareList.includes(product.id) ? <><Check size={16}/> 選択中</> : '比較リストに追加'}
                    </label>
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl shadow-md hover:bg-black dark:hover:bg-slate-200 transition">詳細を見る</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
              <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="text-slate-400" size={32}/></div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">条件に合う商品が見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-full shadow-2xl flex items-center justify-between z-50 animate-fadeIn">
          <div className="flex items-center gap-4 px-2"><span className="bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-md">{compareList.length}</span><span className="font-bold text-sm">商品を比較中...</span></div>
          <div className="flex gap-2">
            <button onClick={() => setCompareList([])} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 transition">リセット</button>
            <button onClick={() => setShowCompareModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-black text-sm transition shadow-lg flex items-center gap-1">比較する <ChevronRight size={14}/></button>
          </div>
        </div>
      )}

      {showCompareModal && (
        <ProductComparisonModal category={activeCategory} selectedIds={compareList} onClose={() => setShowCompareModal(false)} />
      )}

    </div>
  );
};

export default FinancialComparisonPage;