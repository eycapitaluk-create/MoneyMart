import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, DollarSign, Map, Sparkles, Loader2, Newspaper 
} from 'lucide-react';

// 1. 자금 유출입 데이터 (Asset Flow) - 양수: 유입, 음수: 유출
const ASSET_FLOW_DATA = [
  { name: 'eMAXIS Slim 全世界', flow: 520 }, // 520억엔 유입
  { name: 'SBI・V・S&P500', flow: 450 },
  { name: '楽天・全米株式', flow: 300 },
  { name: 'ひふみプラス', flow: 150 },
  { name: '日本国債ファンド', flow: -120 }, // 120억엔 유출
  { name: '新興国リート', flow: -240 },
  { name: '原油先物ベア', flow: -350 },
];

// 2. 수익 맵 데이터 (Heatmap)
const HEATMAP_DATA = [
  { name: '半導体', change: 4.5, weight: 3 }, 
  { name: 'AI・ハイテク', change: 3.2, weight: 3 },
  { name: '銀行・金融', change: 1.2, weight: 2 },
  { name: '商社', change: 0.8, weight: 2 },
  { name: '自動車', change: -0.5, weight: 2 },
  { name: '食品', change: 0.1, weight: 1 },
  { name: '医薬品', change: -1.8, weight: 2 },
  { name: '不動産', change: -2.5, weight: 2 },
  { name: 'エネルギー', change: -3.2, weight: 1 },
];

// 3. 뉴스 데이터
const newsData = [
  { title: "米FRB、利下げ時期を慎重に判断へ。インフレ指標は依然として高止まり", source: "Bloomberg", time: "1時間前" },
  { title: "日銀、マイナス金利解除後の追加利上げを示唆。円安進行に歯止めか", source: "日経新聞", time: "2時間前" },
  { title: "AI半導体需要が急増、主要テック企業の決算に注目集まる", source: "Reuters", time: "3時間前" },
  { title: "中国経済指標、予想を下回る結果に。アジア市場への影響懸念", source: "CNBC", time: "5時間前" },
];

const MarketPage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  // 가짜 AI 분석 시뮬레이션
  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
        setAiAnalysis("本日の市場は、米国のハイテク株主導で堅調な推移を見せています。特にAI関連銘柄への資金流入（Asset Flow）が顕著で、半導体セクターが市場全体を牽引しています。一方で、エネルギーや不動産セクターからは資金が流出しており、セクターローテーションが起きています。投資家は、短期的にはモメンタムの強いAI関連を注視しつつ、過熱感への警戒も必要です。");
        setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32">
      
      {/* 헤더 & AI 요약 */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <TrendingUp className="text-orange-500" /> マーケット・トレンド
        </h1>

        {/* AI 분석 카드 (최상단 배치) */}
        <div className="bg-slate-900 dark:bg-black p-6 rounded-3xl relative overflow-hidden shadow-lg border border-slate-700">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-orange-500"/> AI マーケット分析
                    </h3>
                    {!aiAnalysis && !analyzing && (
                        <button onClick={handleAnalyze} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 hover:text-white transition-all shadow-md">
                            分析を開始
                        </button>
                    )}
                </div>
                <div className="min-h-[60px]">
                    {analyzing ? (
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                            <Loader2 className="animate-spin" size={18}/> AIが市場データを分析中...
                        </div>
                    ) : (
                        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                            {aiAnalysis || "ボタンを押すと、AIが現在の資金流出入やセクター動向を分析し、要約を表示します。"}
                        </p>
                    )}
                </div>
            </div>
            {/* 배경 데코 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽 컬럼 (차트 영역) - 2칸 차지 */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Asset Flow Chart (자금 유출입) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <DollarSign size={20} className="text-green-500"/> 週間資金流出入 (Fund Flow)
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">過去1週間の純資金流入・流出額ランキング (単位: 億円)</p>
                    </div>
                </div>
                
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={ASSET_FLOW_DATA}
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
                                {ASSET_FLOW_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.flow > 0 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-bold justify-center text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> 資金流入 (人気)</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> 資金流出 (解約)</div>
                </div>
            </div>

            {/* 2. Market Heatmap (수익 맵) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Map size={20} className="text-orange-500"/> セクター別騰落率 (Heatmap)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">市場全体の温度感とセクターごとの強弱を可視化</p>
                </div>

                {/* 그리드 기반 히트맵 구현 */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 h-80">
                    {HEATMAP_DATA.map((item, idx) => {
                        // 등락률에 따른 색상 결정 (일본: 상승=빨강, 하락=파랑/초록)
                        let bgClass = "bg-gray-100";
                        if (item.change >= 3) bgClass = "bg-red-600";
                        else if (item.change >= 1) bgClass = "bg-red-500";
                        else if (item.change >= 0) bgClass = "bg-red-400";
                        else if (item.change >= -1) bgClass = "bg-emerald-400"; // 하락은 초록/파랑 계열
                        else if (item.change >= -3) bgClass = "bg-emerald-500";
                        else bgClass = "bg-emerald-600";

                        // 박스 크기 (weight에 따라 col-span 조정)
                        const spanClass = item.weight === 3 ? 'col-span-2 row-span-2' : item.weight === 2 ? 'col-span-2 md:col-span-1 row-span-1' : 'col-span-1';

                        return (
                            <div key={idx} className={`${spanClass} ${bgClass} rounded-xl p-4 flex flex-col items-center justify-center text-white transition hover:scale-[1.02] cursor-pointer shadow-sm relative overflow-hidden group`}>
                                <span className="font-bold text-sm md:text-base z-10 text-center">{item.name}</span>
                                <span className="font-black text-lg md:text-xl z-10">
                                    {item.change > 0 ? '+' : ''}{item.change}%
                                </span>
                                {/* 배경 효과 */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* 오른쪽 컬럼 (뉴스 & 지표) */}
        <div className="space-y-8">
            
            {/* 3. 주요 뉴스 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Newspaper size={18} className="text-orange-500"/> マーケット・ニュース
                </h2>
                <div className="space-y-8">
                    {newsData.map((news, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded">
                                    {news.source}
                                </span>
                                <span className="text-xs text-slate-400">{news.time}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 transition-colors">
                                {news.title}
                            </h4>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-8 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    ニュースをもっと見る
                </button>
            </div>

            {/* 경제 캘린더 (간단) */}
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