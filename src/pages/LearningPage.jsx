import React, { useState } from 'react';
import { 
  Play, Clock, Eye, Search, Upload, BookOpen, 
  Calculator, RefreshCw, Save, AlertTriangle, PieChart, Video, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const VIDEO_DATA = [
  { id: 1, title: "MoneyMart 15秒 公式プロモーション", category: "Official", views: "1.2M", date: "1日前", duration: "0:15", thumbnail: "bg-gradient-to-br from-orange-400 to-red-500", description: "金融を、もっと自由に。MoneyMartの公式紹介動画です。" },
  { id: 2, title: "5分でわかる！つみたてNISAの始め方", category: "Beginner", views: "85K", date: "3日前", duration: "5:20", thumbnail: "bg-slate-700", description: "初心者必見！非課税制度をフル活用して資産を増やそう。" },
  { id: 3, title: "米国株 vs 全世界株、どっちがいい？", category: "Investment", views: "42K", date: "1週間前", duration: "12:45", thumbnail: "bg-blue-600", description: "S&P500とオルカン、あなたに合う投資スタイルを徹底比較。" },
];

const Learn = () => {
  const [activeTab, setActiveTab] = useState('video');
  const [featuredVideo, setFeaturedVideo] = useState(VIDEO_DATA[0]);

  // 시뮬레이터 State
  const [initialAmount, setInitialAmount] = useState(100);
  const [monthlyContribution, setMonthlyContribution] = useState(5);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [simResult, setSimResult] = useState(null);

  const calculateSim = () => {
    let total = initialAmount * 10000;
    let invested = initialAmount * 10000;
    const months = years * 12;
    const monthlyRate = interestRate / 100 / 12;
    for (let i = 0; i < months; i++) {
      total = (total + monthlyContribution * 10000) * (1 + monthlyRate);
      invested += monthlyContribution * 10000;
    }
    setSimResult({
      total: Math.round(total),
      invested: Math.round(invested),
      profit: Math.round(total - invested),
      chartData: [{ name: '元本', value: Math.round(invested), fill: '#94a3b8' }, { name: '運用益', value: Math.round(total - invested), fill: '#10B981' }]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">MoneyMart Academy</h1>
        <p className="text-slate-500 mb-8">金融知識を学び、シミュレーターで未来を設計しよう。</p>
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('video')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition ${activeTab === 'video' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><Video size={18}/> マネークラス (動画)</button>
          <button onClick={() => setActiveTab('simulator')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition ${activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><Calculator size={18}/> シミュレーター</button>
        </div>
      </div>

      {activeTab === 'video' ? (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 mb-10 flex flex-col lg:flex-row">
            <div className={`lg:w-2/3 aspect-video ${featuredVideo.thumbnail} relative group cursor-pointer flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition shadow-2xl border border-white/50"><Play size={32} fill="white" className="ml-1"/></div>
            </div>
            <div className="lg:w-1/3 p-8 flex flex-col justify-center">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2">FEATURED</span>
              <h2 className="text-2xl font-black text-slate-900 mb-3">{featuredVideo.title}</h2>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">{featuredVideo.description}</p>
              <button className="w-full py-4 bg-[#F06529] hover:bg-[#D9551E] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-orange-100"><Play size={18} fill="white" /> 今すぐ見る</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEO_DATA.filter(v=>v.id !== featuredVideo.id).map((video) => (
              <div key={video.id} onClick={() => setFeaturedVideo(video)} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group">
                <div className={`aspect-video ${video.thumbnail} relative flex items-center justify-center`}><Play size={20} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition"/></div>
                <div className="p-5"><h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{video.title}</h3><div className="flex items-center justify-between text-xs text-slate-400"><span>{video.category}</span><span className="flex items-center gap-1"><Eye size={12}/> {video.views}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="space-y-6">
                <div><label className="block text-xs font-bold text-slate-500 mb-2">初期投資額 (万円)</label><input type="number" value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-2">毎月の積立額 (万円)</label><input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-2">期間 (年)</label><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-2">想定利回り (%)</label><input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition" /></div>
                </div>
                <button onClick={calculateSim} className="w-full py-4 bg-[#F06529] hover:bg-[#D9551E] text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-100 transition transform active:scale-95 flex items-center justify-center gap-2"><RefreshCw size={20} /> 計算する</button>
              </div>
            </div>
            <div className={`transition-all duration-500 ${simResult ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
              {simResult && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center">
                    <p className="text-slate-400 text-sm font-bold mb-2">{years}年後の予想資産額</p>
                    <h2 className="text-5xl font-black mb-6 tracking-tight text-[#10B981]">¥{(simResult.total / 10000).toFixed(0)}<span className="text-2xl text-white">万円</span></h2>
                    <div className="flex justify-center gap-8 border-t border-slate-700 pt-6">
                      <div><p className="text-xs text-slate-400 mb-1">投資元本</p><p className="font-bold text-xl">¥{(simResult.invested / 10000).toFixed(0)}万</p></div>
                      <div><p className="text-xs text-green-400 mb-1">運用収益</p><p className="font-bold text-xl text-green-400">+¥{(simResult.profit / 10000).toFixed(0)}万</p></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 h-64"><h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart size={18}/> 資産の内訳</h4><ResponsiveContainer width="100%" height="80%"><BarChart data={simResult.chartData} layout="vertical"><XAxis type="number" hide /><Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `¥${value.toLocaleString()}`} /><Bar dataKey="value" barSize={40} radius={[0, 10, 10, 0]}>{simResult.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;