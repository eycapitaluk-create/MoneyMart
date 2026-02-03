import React, { useState, useEffect } from 'react';
import { Newspaper, Sparkles, Loader2, Filter } from 'lucide-react';

// 간단한 API 함수 (임시 포함)
const fetchGemini = async (prompt) => {
  return "AI 분석 기능은 API 설정 후 이용 가능합니다.";
};

const MarketPage = () => {
  const [region, setRegion] = useState('asia');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const [marketIndices, setMarketIndices] = useState({
    asia: [
      { name: "日経225", price: 38500.12, change: 120.50, percent: 0.31, up: true },
      { name: "TOPIX", price: 2750.40, change: -15.20, percent: -0.55, up: false },
      { name: "香港ハンセン", price: 16500.80, change: 80.20, percent: 0.49, up: true },
      { name: "上海総合", price: 3050.15, change: -5.10, percent: -0.17, up: false },
    ],
    us: [
      { name: "S&P 500", price: 5100.25, change: 45.10, percent: 0.89, up: true },
      { name: "ダウ平均", price: 39050.80, change: 150.20, percent: 0.39, up: true },
      { name: "ナスダック", price: 16200.50, change: 210.45, percent: 1.32, up: true },
    ],
    europe: [
      { name: "DAX", price: 17800.20, change: -25.50, percent: -0.14, up: false },
      { name: "FTSE 100", price: 7950.10, change: 10.20, percent: 0.13, up: true },
      { name: "CAC 40", price: 8100.45, change: 5.30, percent: 0.07, up: true },
    ]
  });

  const newsData = [
    { title: "米FRB、利下げ時期を慎重に判断へ。インフレ指標は依然として高止まり", source: "Bloomberg", time: "1時間前" },
    { title: "日銀、マイナス金利解除後の追加利上げを示唆。円安進行に歯止めか", source: "日経新聞", time: "2時間前" },
    { title: "AI半導体需要が急増、主要テック企業の決算に注目集まる", source: "Reuters", time: "3時間前" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketIndices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = next[key].map(idx => {
            const fluctuation = (Math.random() - 0.5) * 2;
            const newPrice = idx.price + fluctuation;
            const newChange = idx.change + fluctuation;
            const newPercent = (newChange / (newPrice - newChange)) * 100;
            return { ...idx, price: newPrice, change: newChange, percent: newPercent, up: newChange > 0 };
          });
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const dataStr = JSON.stringify(marketIndices[region]);
    const prompt = `現在の${region}市場の動向を分析してください: ${dataStr}. 主要指数とニュースに基づいて、投資家へのアドバイスをお願いします。日本語で回答してください。`;
    try {
      const result = await fetchGemini(prompt);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis("分析中にエラーが発生しました。");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 animate-fadeIn">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">マーケット情報</h1>
          <p className="text-slate-500 font-bold">世界の主要市場のリアルタイム情報とニュース</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['asia', 'us', 'europe'].map(r => (
            <button key={r} onClick={()=>setRegion(r)} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${region === r ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              {r === 'asia' ? 'アジア' : r === 'us' ? '米国' : '欧州'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {marketIndices[region].map((idx, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-slate-700 dark:text-slate-200">{idx.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${idx.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{idx.up ? '▲' : '▼'} {Math.abs(idx.percent).toFixed(2)}%</span>
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{idx.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p className={`text-sm font-bold ${idx.up ? 'text-green-600' : 'text-red-600'}`}>{idx.change > 0 ? '+' : ''}{idx.change.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-white"><Sparkles className="text-orange-500"/> AI 市場分析</h3>
              {!aiAnalysis && !analyzing && <button onClick={handleAnalyze} className="bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-black hover:bg-orange-500 hover:text-white transition-all">分析を開始</button>}
            </div>
            <div className="min-h-[100px]">
              {analyzing ? <div className="flex items-center gap-3 text-slate-400 font-bold"><Loader2 className="animate-spin"/> AIが市場データを分析中...</div> : <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{aiAnalysis || "ボタンを押すと、AIが現在の市場動向を分析します。"}</p>}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit">
          <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Newspaper size={20}/> 関連ニュース</h3>
          <div className="space-y-6">
            {newsData.map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-xs text-slate-400 font-bold mb-1">{news.source} • {news.time}</p>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 transition-colors">{news.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;