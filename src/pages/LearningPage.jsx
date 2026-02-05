// src/pages/LearningPage.jsx
import React, { useState } from 'react';
import { 
  Play, Clock, Eye, Search, Upload, BookOpen, 
  Calculator, RefreshCw, Save, AlertTriangle, PieChart, Video, TrendingUp, X, Youtube
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// ★ 초기 데이터: 유튜브 비디오 ID를 사용합니다 (src에 유튜브 ID 입력)
const INITIAL_VIDEOS = [
  { 
    id: 1, 
    title: "MoneyMart 15秒 公式プロモーション", 
    category: "Official", 
    views: "1.2M", 
    date: "1日前", 
    duration: "0:15", 
    type: "youtube", 
    src: "ScMzIvxBSi4", // 유튜브 영상 ID (예: https://youtu.be/ScMzIvxBSi4)
    description: "金融を、もっと自由に。MoneyMartの公式紹介動画です。" 
  },
  { 
    id: 2, 
    title: "【初心者向け】資産運用の始め方", 
    category: "Beginner", 
    views: "85K", 
    date: "3日前", 
    duration: "12:20", 
    type: "youtube",
    src: "9v4H4s9k8FA", // 다른 유튜브 ID
    description: "初心者必見！非課税制度をフル活用して資産を増やそう。" 
  },
];

const Learn = ({ user }) => {
  const [activeTab, setActiveTab] = useState('video');
  const [videoList, setVideoList] = useState(INITIAL_VIDEOS);
  const [featuredVideo, setFeaturedVideo] = useState(INITIAL_VIDEOS[0]);

  // 시뮬레이터 State
  const [initialAmount, setInitialAmount] = useState(100);
  const [monthlyContribution, setMonthlyContribution] = useState(5);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [simResult, setSimResult] = useState(null);

  // ★ 유튜브 영상 추가 핸들러 (관리자용)
  const handleAddVideo = () => {
    // 실제로는 멋진 모달을 띄워야 하지만, 지금은 간단히 prompt로 구현
    const youtubeUrl = prompt("YouTube URLを入力してください (例: https://youtu.be/VIDEO_ID)");
    if (youtubeUrl) {
      // URL에서 ID 추출 (간단한 로직)
      let videoId = youtubeUrl.split('v=')[1];
      const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
      // 짧은 URL (youtu.be) 대응
      if (!videoId && youtubeUrl.includes('youtu.be/')) {
         videoId = youtubeUrl.split('youtu.be/')[1];
      }

      if (!videoId) {
        alert("有効なYouTube URLではありません。");
        return;
      }

      const title = prompt("動画のタイトルを入力してください");
      if (!title) return;

      const newVideo = {
        id: Date.now(),
        title: title,
        category: "New Upload",
        views: "0",
        date: "たった今",
        duration: "--:--",
        type: "youtube",
        src: videoId,
        description: "追加されたYouTube動画です。"
      };
      
      setVideoList([newVideo, ...videoList]);
      setFeaturedVideo(newVideo);
    }
  };

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
      <div className="text-center mb-10 relative">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">MoneyMart Academy</h1>
        <p className="text-slate-500 mb-8">金融知識を学び、シミュレーターで未来を設計しよう。</p>
        
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('video')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition ${activeTab === 'video' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}><Video size={18}/> マネークラス (動画)</button>
          <button onClick={() => setActiveTab('simulator')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition ${activeTab === 'simulator' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}><Calculator size={18}/> シミュレーター</button>
        </div>

        {/* ★ 관리자일 때만: 유튜브 영상 추가 버튼 */}
        {user?.role === 'admin' && (
          <div className="absolute right-0 top-0 hidden md:block">
              <button 
                  onClick={handleAddVideo}
                  className="px-4 py-2 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg"
              >
                  <Youtube size={18}/> 動画追加 (YouTube)
              </button>
          </div>
        )}
      </div>

      {activeTab === 'video' ? (
        <div className="animate-fadeIn">
          
          {/* ★ 메인 플레이어 (YouTube Iframe) */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 mb-10 flex flex-col lg:flex-row">
            <div className="lg:w-2/3 bg-black aspect-video relative flex items-center justify-center">
               <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${featuredVideo.src}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
               ></iframe>
            </div>
            
            <div className="lg:w-1/3 p-8 flex flex-col justify-center">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2">NOW PLAYING</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2">{featuredVideo.title}</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 line-clamp-4">{featuredVideo.description}</p>
              
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                 <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-gray-400">Category</span>
                    <span className="font-bold text-slate-900 dark:text-white">{featuredVideo.category}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-gray-400">Views</span>
                    <span className="font-bold text-slate-900 dark:text-white">{featuredVideo.views}</span>
                 </div>
                 
                 {/* 유튜브 채널로 이동 버튼 */}
                 <a 
                    href={`https://www.youtube.com/watch?v=${featuredVideo.src}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition text-sm"
                 >
                    <Youtube size={16}/> YouTubeで見る
                 </a>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 ml-1">その他の動画</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoList.filter(v=>v.id !== featuredVideo.id).map((video) => (
              <div 
                key={video.id} 
                onClick={() => setFeaturedVideo(video)} 
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group"
              >
                {/* 유튜브 썸네일 자동 추출 */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                    <img 
                        src={`https://img.youtube.com/vi/${video.src}/mqdefault.jpg`} 
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play size={20} fill="white" className="text-white ml-1"/>
                        </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 rounded font-mono">
                        {video.duration}
                    </span>
                </div>
                
                <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 text-sm">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{video.category}</span>
                        <span className="flex items-center gap-1"><Eye size={12}/> {video.views}</span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn max-w-5xl mx-auto">
          {/* 시뮬레이터 (기존 코드 유지) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="space-y-6">
                <div><label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">初期投資額 (万円)</label><input type="number" value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition" /></div>
                <div><label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">毎月の積立額 (万円)</label><input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">期間 (年)</label><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">想定利回り (%)</label><input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition" /></div>
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
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 h-64"><h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><PieChart size={18}/> 資産の内訳</h4><ResponsiveContainer width="100%" height="80%"><BarChart data={simResult.chartData} layout="vertical"><XAxis type="number" hide /><Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `¥${value.toLocaleString()}`} /><Bar dataKey="value" barSize={40} radius={[0, 10, 10, 0]}>{simResult.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
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