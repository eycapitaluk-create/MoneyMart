import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, JapaneseYen, Map, Sparkles, Loader2, Newspaper, ExternalLink 
} from 'lucide-react';

import { supabase } from '../lib/supabase';

const MarketPage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  
  const [newsData, setNewsData] = useState([]);
  const [assetFlowData, setAssetFlowData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);

        // (1) 뉴스 가져오기
        const { data: news } = await supabase
            .from('market_news')
            .select('*')
            .order('created_at', { ascending: false });
        setNewsData(news || []);

        // (2) ★ 자금 흐름 (가장 중요: 숫자 변환)
        const { data: flows } = await supabase
            .from('market_asset_flows')
            .select('*')
            .order('sort_order', { ascending: true });

        if (flows && flows.length > 0) {
            // DB에서 가져온 값을 숫자로 강제 변환 (안전장치)
            const formattedFlows = flows.map(item => ({
                ...item,
                flow: Number(item.flow), 
                name: item.name
            }));
            setAssetFlowData(formattedFlows);
        } else {
            setAssetFlowData([]);
        }

        // (3) 히트맵 가져오기
        const { data: heatmap } = await supabase.from('market_heatmap').select('*');
        setHeatmapData(heatmap || []);

        // (4) AI 리포트 가져오기
        const { data: analysis } = await supabase
            .from('market_analysis')
            .select('content')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (analysis) setAiAnalysis(analysis.content);

      } catch (e) {
        console.error("Market Data Load Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // AI 분석 로딩 효과 (DB 데이터 없을 때만 작동)
  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
        setAiAnalysis("本日の市場は、米国のハイテク株主導で堅調な推移を見せています...");
        setAnalyzing(false);
    }, 2000);
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32}/>
            <p className="text-slate-500 font-bold">市場データを読み込み中...</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32">
      
      {/* 헤더 & AI 요약 */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <TrendingUp className="text-orange-500" /> マーケット・トレンド
        </h1>

        <div className="bg-slate-900 dark:bg-black p-6 rounded-3xl relative overflow-hidden shadow-lg border border-slate-700">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-orange-500"/> AI マーケット分析
                    </h3>
                    <span className="text-[10px] bg-white/10 text-white px-2 py-1 rounded-full">Daily Report</span>
                </div>
                <div className="min-h-[60px]">
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {aiAnalysis || "現在、AI分析データを準備中です..."}
                    </p>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽 컬럼 (차트) */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Asset Flow Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <JapaneseYen size={20} className="text-green-500"/> 週間資金流出入 (Fund Flow)
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">DB連動: リアルタイム資金推移 (単位: 億円)</p>
                    </div>
                </div>
                
                <div className="h-[350px] w-full">
                    {assetFlowData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={assetFlowData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={140} 
                                    tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} 
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`${value > 0 ? '+' : ''}${value} 億円`, 'Flow']}
                                />
                                <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
                                <Bar dataKey="flow" barSize={24} radius={[4, 4, 4, 4]}>
                                    {assetFlowData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.flow > 0 ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                           <Loader2 className="animate-spin mb-2" />
                           <p>データがありません</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Heatmap */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Map size={20} className="text-orange-500"/> セクター別騰落率
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">DB連動: セクターヒートマップ</p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 h-80">
                    {heatmapData.length > 0 ? heatmapData.map((item, idx) => {
                        const change = Number(item.change_rate);
                        let bgClass = "bg-gray-100";
                        if (change >= 3) bgClass = "bg-red-600";
                        else if (change >= 1) bgClass = "bg-red-500";
                        else if (change >= 0) bgClass = "bg-red-400";
                        else if (change >= -1) bgClass = "bg-emerald-400";
                        else if (change >= -3) bgClass = "bg-emerald-500";
                        else bgClass = "bg-emerald-600";

                        const spanClass = item.weight === 3 ? 'col-span-2 row-span-2' : item.weight === 2 ? 'col-span-2 md:col-span-1 row-span-1' : 'col-span-1';

                        return (
                            <div key={idx} className={`${spanClass} ${bgClass} rounded-xl p-4 flex flex-col items-center justify-center text-white transition hover:scale-[1.02] cursor-pointer shadow-sm relative overflow-hidden group`}>
                                <span className="font-bold text-sm md:text-base z-10 text-center">{item.name}</span>
                                <span className="font-black text-lg md:text-xl z-10">
                                    {change > 0 ? '+' : ''}{change}%
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-3 text-center py-10 text-slate-400">ヒートマップデータがありません</div>
                    )}
                </div>
            </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="space-y-8">
            
            {/* 3. News (링크 연결) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Newspaper size={18} className="text-orange-500"/> マーケット・ニュース
                </h2>
                <div className="space-y-8">
                    {newsData.length > 0 ? newsData.map((news, i) => (
                        <a 
                            key={i} 
                            href={news.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group cursor-pointer block hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 -mx-2 rounded-xl transition"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded">
                                    {news.source}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    {news.time_ago}
                                    {news.url && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/>}
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 transition-colors">
                                {news.title}
                            </h4>
                        </a>
                    )) : <div className="text-center text-slate-400 text-sm">ニュースがありません</div>}
                </div>
                <button className="w-full mt-8 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    もっと見る
                </button>
            </div>

            {/* 경제 캘린더 (고정) */}
            <div className="bg-slate-900 dark:bg-black text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                         今週の重要イベント
                    </h2>
                    <ul className="space-y-4 text-sm">
                        <li className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <span className="text-slate-400">2/7 (金)</span>
                            <span className="font-bold">🇺🇸 米雇用統計</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <span className="text-slate-400">2/12 (水)</span>
                            <span className="font-bold">🇺🇸 CPI (消費者物価)</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-slate-400">2/15 (土)</span>
                            <span className="font-bold">🇯🇵 GDP速報値</span>
                        </li>
                    </ul>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MarketPage;