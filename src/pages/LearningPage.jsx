import React, { useState } from 'react';
import { 
  Play, Video, Calculator, RefreshCw,  
  Youtube, Book, HelpCircle, CheckCircle2, XCircle, Search, ChevronDown, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- [Data] 초기 데이터 ---
const INITIAL_VIDEOS = [
  { 
    id: 1, title: "MoneyMart 15秒 公式プロモーション", category: "Official", views: "1.2M", 
    src: "ScMzIvxBSi4", description: "金融を、もっと自由に。MoneyMartの公式紹介動画です。" 
  },
  { 
    id: 2, title: "【初心者向け】資産運用の始め方", category: "Beginner", views: "85K", 
    src: "9v4H4s9k8FA", description: "初心者必見！非課税制度をフル活用して資産を増やそう。" 
  },
];

const QUIZ_DATA = [
  {
    id: 1,
    question: "新NISAの「つみたて投資枠」の年間非課税限度額はいくら？",
    options: ["40万円", "120万円", "240万円"],
    answer: 1, // Index of correct option (120万円)
    explanation: "正解！新NISAのつみたて投資枠は年間120万円まで非課税で投資できます。"
  },
  {
    id: 2,
    question: "「分散投資」のメリットとして正しいものは？",
    options: ["短期間で資産が2倍になる", "リスク（価格変動）を抑えられる", "手数料が無料になる"],
    answer: 1,
    explanation: "その通り！資産を分けることで、一部が下がっても全体への影響を抑えられます。"
  },
  {
    id: 3,
    question: "インフレ（インフレーション）が起きると、現金の価値はどうなる？",
    options: ["上がる", "変わらない", "下がる"],
    answer: 2,
    explanation: "正解です。物の値段が上がるため、相対的に現金の価値は下がります。"
  }
];

const GLOSSARY_DATA = [
  { term: "ETF (上場投資信託)", desc: "証券取引所に上場している投資信託のこと。株と同じようにリアルタイムで売買できるのが特徴。" },
  { term: "インカムゲイン", desc: "資産を保有し続けることで得られる利益のこと。配当金や利子、家賃収入などがこれにあたる。" },
  { term: "キャピタルゲイン", desc: "保有している資産を売却することによって得られる売買差益のこと。" },
  { term: "NISA (少額投資非課税制度)", desc: "投資で得た利益にかかる税金（約20%）がゼロになるお得な国の制度。" },
  { term: "ポートフォリオ", desc: "金融資産の組み合わせのこと。卵を一つのカゴに盛るなという格言が有名。" },
];

// --- [Sub Component] Quiz Section ---
const QuizSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx) => {
    setSelected(idx);
    const correct = idx === QUIZ_DATA[currentQ].answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0); setSelected(null); setIsCorrect(null); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 text-center shadow-xl border border-slate-100 dark:border-slate-700 animate-fadeIn">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">あなたのスコアは...</p>
        <p className="text-6xl font-black text-slate-900 dark:text-white mb-8">{score} / {QUIZ_DATA.length}</p>
        <button onClick={resetQuiz} className="bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition">もう一度挑戦する</button>
      </div>
    );
  }

  const q = QUIZ_DATA[currentQ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full text-sm">Q.{currentQ + 1}</span>
          <span className="text-slate-400 font-bold text-sm">あと {QUIZ_DATA.length - currentQ} 問</span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">{q.question}</h3>

        <div className="space-y-4 mb-8">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !selected && handleAnswer(idx)}
              disabled={selected !== null}
              className={`w-full text-left p-5 rounded-2xl font-bold text-lg transition-all flex justify-between items-center border-2 
                ${selected === null 
                  ? 'bg-slate-50 dark:bg-slate-700 border-transparent hover:border-orange-300' 
                  : idx === q.answer 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : selected === idx 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-slate-50 dark:bg-slate-700 border-transparent opacity-50'
                }`}
            >
              {opt}
              {selected !== null && idx === q.answer && <CheckCircle2 />}
              {selected === idx && idx !== q.answer && <XCircle />}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-600 animate-slideUp">
            <p className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              {isCorrect ? <span className="text-green-500">正解！🎉</span> : <span className="text-red-500">残念... 💦</span>}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{q.explanation}</p>
            <button onClick={nextQuestion} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">
              {currentQ < QUIZ_DATA.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [Sub Component] Glossary Section ---
const GlossarySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = GLOSSARY_DATA.filter(item => item.term.includes(searchTerm));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-4 text-slate-400" size={20}/>
        <input 
          type="text" 
          placeholder="用語を検索 (例: NISA)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer transition hover:shadow-md"
          >
            <div className="p-5 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.term}</h4>
              <ChevronDown className={`text-slate-400 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}/>
            </div>
            {openIndex === idx && (
              <div className="px-5 pb-5 pt-0 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-700 mt-2 pt-4 bg-slate-50/50 dark:bg-slate-900/20">
                {item.desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page ---
const Learn = ({ user }) => {
  const [activeTab, setActiveTab] = useState('video');
  const [videoList, setVideoList] = useState(INITIAL_VIDEOS);
  const [featuredVideo, setFeaturedVideo] = useState(INITIAL_VIDEOS[0]);

  // Simulator State
  const [initialAmount, setInitialAmount] = useState(100);
  const [monthlyContribution, setMonthlyContribution] = useState(5);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [simResult, setSimResult] = useState(null);

  const handleAddVideo = () => {
    const youtubeUrl = prompt("YouTube URLを入力してください");
    if (!youtubeUrl) return;
    let videoId = youtubeUrl.split('v=')[1];
    if (videoId) {
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) videoId = videoId.substring(0, ampersandPosition);
    } else if (youtubeUrl.includes('youtu.be/')) {
      videoId = youtubeUrl.split('youtu.be/')[1];
    }
    if (!videoId) return alert("無効なURLです");

    const title = prompt("タイトル");
    if (!title) return;

    setVideoList([{ id: Date.now(), title, category: "New", views: "0", src: videoId, description: "New Video" }, ...videoList]);
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32 font-sans">
      
      {/* Header & Navigation */}
      <div className="text-center mb-10 relative">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">MoneyMart Academy</h1>
        <p className="text-slate-500 mb-8">学んで、試して、未来を作る。</p>
        
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          {[
            { id: 'video', icon: <Video size={18}/>, label: '動画クラス' },
            { id: 'simulator', icon: <Calculator size={18}/>, label: 'シミュレーター' },
            { id: 'quiz', icon: <HelpCircle size={18}/>, label: 'クイズ' },
            { id: 'glossary', icon: <Book size={18}/>, label: '用語集' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="absolute right-0 top-0 hidden lg:block">
              <button onClick={handleAddVideo} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg">
                  <Youtube size={18}/> 動画追加
              </button>
          </div>
        )}
      </div>

      {/* --- Tab Content --- */}
      
      {/* 1. Video Tab */}
      {activeTab === 'video' && (
        <div className="animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 mb-10 flex flex-col lg:flex-row">
            <div className="lg:w-2/3 bg-black aspect-video relative flex items-center justify-center">
               <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${featuredVideo.src}?autoplay=0`} title="YouTube player" frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="lg:w-1/3 p-8 flex flex-col justify-center">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2">NOW PLAYING</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2">{featuredVideo.title}</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 line-clamp-4">{featuredVideo.description}</p>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                 <div className="flex justify-between text-sm mb-1"><span className="text-slate-500 dark:text-gray-400">Category</span><span className="font-bold text-slate-900 dark:text-white">{featuredVideo.category}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-gray-400">Views</span><span className="font-bold text-slate-900 dark:text-white">{featuredVideo.views}</span></div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 ml-1">プレイリスト</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoList.filter(v=>v.id !== featuredVideo.id).map((video) => (
              <div key={video.id} onClick={() => setFeaturedVideo(video)} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group">
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${video.src}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition"><div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition"><Play size={20} fill="white" className="text-white ml-1"/></div></div>
                </div>
                <div className="p-4"><h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 text-sm">{video.title}</h3><div className="flex items-center justify-between text-xs text-slate-400"><span>{video.category}</span><span>{video.views} views</span></div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="animate-fadeIn max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="space-y-6">
                <div><label className="block text-xs font-bold text-slate-500 mb-2">初期投資額 (万円)</label><input type="number" value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold text-xl outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-2">毎月の積立額 (万円)</label><input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold text-xl outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-2">期間 (年)</label><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold text-xl outline-none focus:ring-2 focus:ring-orange-500" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-2">想定利回り (%)</label><input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-xl font-bold text-xl outline-none focus:ring-2 focus:ring-orange-500" /></div>
                </div>
                <button onClick={calculateSim} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition transform active:scale-95 flex items-center justify-center gap-2"><RefreshCw size={20} /> 計算する</button>
              </div>
            </div>
            <div className={`transition-all duration-500 ${simResult ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
              {simResult && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-20"></div>
                    <p className="text-slate-400 text-sm font-bold mb-2">{years}年後の予想資産額</p>
                    <h2 className="text-5xl font-black mb-6 tracking-tight text-emerald-400">¥{(simResult.total / 10000).toFixed(0)}<span className="text-2xl text-white">万円</span></h2>
                    <div className="flex justify-center gap-8 border-t border-slate-700 pt-6">
                      <div><p className="text-xs text-slate-400 mb-1">投資元本</p><p className="font-bold text-xl">¥{(simResult.invested / 10000).toFixed(0)}万</p></div>
                      <div><p className="text-xs text-green-400 mb-1">運用収益</p><p className="font-bold text-xl text-green-400">+¥{(simResult.profit / 10000).toFixed(0)}万</p></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-700 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={simResult.chartData} layout="vertical" margin={{left:20, right:20}}><XAxis type="number" hide /><Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `¥${value.toLocaleString()}`} contentStyle={{borderRadius:'12px', border:'none'}}/><Bar dataKey="value" barSize={32} radius={[0, 10, 10, 0]}>{simResult.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Quiz Tab (NEW) */}
      {activeTab === 'quiz' && (
        <div className="animate-fadeIn">
          <QuizSection />
        </div>
      )}

      {/* 4. Glossary Tab (NEW) */}
      {activeTab === 'glossary' && (
        <div className="animate-fadeIn">
          <GlossarySection />
        </div>
      )}

    </div>
  );
};

export default Learn;