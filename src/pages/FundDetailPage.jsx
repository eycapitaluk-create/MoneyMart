import React, { useState } from 'react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '../components/CommonUI';
import { FUNDS_DATA } from '../data/mockData';

const FundDetailPage = ({ fundId, onBack }) => {
  const fund = FUNDS_DATA.find(f => f.id === fundId);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 임시 AI 함수
  const getAIInsight = async () => { 
      setLoading(true); 
      setTimeout(() => {
          setAnalysis("AI分析結果: このファンドは安定したリターンを目指す長期投資に適しています。過去の実績も良好で、手数料も低く抑えられています。");
          setLoading(false);
      }, 1500);
  };

  if (!fund) return null;
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-fadeIn pb-32">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black mb-10 transition-colors"><ArrowLeft size={20}/> 戻る</button>
      <div className="bg-white rounded-[3rem] p-12 shadow-xl mb-12 border border-slate-100 relative overflow-hidden"><Badge text={fund.category} color="blue" /><h2 className="text-5xl font-black mb-6 mt-6 tracking-tighter text-slate-900">{fund.name}</h2><p className="text-slate-500 mb-12 leading-relaxed text-lg font-medium">{fund.desc}</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-8"><div className="bg-slate-50 p-6 rounded-[2rem] text-center"><p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Return</p><p className="text-3xl font-black text-green-600">{fund.return}%</p></div></div></div>
      <div className="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden"><div className="flex justify-between items-center mb-10 relative z-10"><h3 className="text-2xl font-black flex items-center gap-4"><Sparkles size={28} className="text-orange-500"/> AI 投資インサイト</h3>{!analysis && !loading && <button onClick={getAIInsight} className="bg-white text-slate-900 px-8 py-3 rounded-2xl text-sm font-black hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95">分析を実行</button>}</div><div className="min-h-[100px] relative z-10">{loading ? <Loader2 className="animate-spin text-orange-500" size={40}/> : <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium text-lg">{analysis || "ボタンを押すと、AIがこのファンドのリスクと将来性を分析します。"}</p>}</div></div>
    </div>
  );
};

export default FundDetailPage;