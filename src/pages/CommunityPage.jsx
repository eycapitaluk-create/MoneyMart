import React, { useState } from 'react';
import { 
  Edit2, Search, MessageSquare, ThumbsUp, Flame, 
  Bot, Award, TrendingUp, Filter, MoreHorizontal, CheckCircle2 
} from 'lucide-react';

// --- Dummy Data ---
const USERS_RANKING = [
  { id: 1, name: '億り人を目指す', level: 42, badge: '👑 Legend' },
  { id: 2, name: '積立NISA民', level: 28, badge: '🔥 Pro' },
  { id: 3, name: '配当金生活', level: 15, badge: '🌱 Beginner' },
];

const INITIAL_POSTS = [
  { 
    id: 1, 
    author: 'S&P500信者', 
    authorLevel: 35,
    title: '新NISA、成長投資枠で何買いました？🔥', 
    content: 'やっぱり王道のS&P500一本でいくか、インド株などの新興国を混ぜるか迷っています。皆さんのポートフォリオ教えてください！', 
    tags: ['#新NISA', '#ポートフォリオ'], 
    likes: 124, 
    comments: 45, 
    isHot: true,
    aiSummary: "多くのユーザーは「コアはS&P500、サテライトでインド株」という戦略を取っているようです。リスク許容度に合わせて配分を決めましょう。"
  },
  { 
    id: 2, 
    author: '住宅ローン悩み中', 
    authorLevel: 8,
    title: '変動金利、これから上がると思いますか？😰', 
    content: '日銀の決定が気になります。0.1%でも上がると支払い額が怖い...', 
    tags: ['#住宅ローン', '#金利'], 
    likes: 8, 
    comments: 12, 
    isHot: false,
    aiSummary: null 
  },
  { 
    id: 3, 
    author: 'ポイ活マスター', 
    authorLevel: 22,
    title: '【速報】楽天カードの改悪について対策まとめ', 
    content: 'ポイント付与条件が変わりました。これからは三井住友NLとの併用が最強かもしれません。', 
    tags: ['#ポイ活', '#クレジットカード'], 
    likes: 89, 
    comments: 32, 
    isHot: true,
    aiSummary: "三井住友カード(NL)への乗り換えを検討するユーザーが増加傾向です。SBI証券との連携メリットが再評価されています。"
  },
];

// --- Sub Component: VS Poll Widget ---
const PollWidget = () => {
  const [voted, setVoted] = useState(null); // 'A' or 'B'
  const [counts, setCounts] = useState({ A: 45, B: 55 });

  const handleVote = (side) => {
    if (voted) return;
    setVoted(side);
    setCounts(prev => ({ ...prev, [side]: prev[side] + 1 }));
  };

  const total = counts.A + counts.B;
  const percentA = Math.round((counts.A / total) * 100);
  const percentB = 100 - percentA;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8 group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition duration-700">
        <Flame size={100} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded animate-pulse">LIVE</span>
          <h3 className="font-bold text-lg">今週のどっち派？</h3>
        </div>
        
        <h4 className="text-xl font-black mb-6 text-center">NISAの積立、どっち派？</h4>

        <div className="flex gap-4 h-16">
          {/* Option A */}
          <button 
            onClick={() => handleVote('A')}
            className={`flex-1 rounded-2xl relative overflow-hidden transition-all duration-500 ${voted === 'A' ? 'ring-4 ring-orange-500' : 'hover:opacity-90'}`}
          >
            <div className="absolute inset-0 bg-blue-600 flex items-center justify-center z-10">
              <span className="font-black text-lg">オルカン (全世界)</span>
            </div>
            {voted && (
              <div 
                style={{ width: `${percentA}%` }} 
                className="absolute inset-y-0 left-0 bg-blue-500 z-20 flex items-center justify-start px-4 opacity-90 transition-all duration-1000"
              >
                <span className="font-bold text-2xl">{percentA}%</span>
              </div>
            )}
          </button>

          {/* Option B */}
          <button 
            onClick={() => handleVote('B')}
            className={`flex-1 rounded-2xl relative overflow-hidden transition-all duration-500 ${voted === 'B' ? 'ring-4 ring-orange-500' : 'hover:opacity-90'}`}
          >
            <div className="absolute inset-0 bg-rose-600 flex items-center justify-center z-10">
              <span className="font-black text-lg">S&P500 (米国)</span>
            </div>
            {voted && (
              <div 
                style={{ width: `${percentB}%` }} 
                className="absolute inset-y-0 right-0 bg-rose-500 z-20 flex items-center justify-end px-4 opacity-90 transition-all duration-1000"
              >
                <span className="font-bold text-2xl">{percentB}%</span>
              </div>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">投票数: {total.toLocaleString()}件</p>
      </div>
    </div>
  );
};

// --- Main Page ---
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('hot'); // 'hot', 'new'
  const [selectedTag, setSelectedTag] = useState('All');
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const tags = ['All', '#新NISA', '#住宅ローン', '#ポイ活', '#米国株', '#節税'];

  const filteredPosts = posts.filter(post => 
    selectedTag === 'All' ? true : post.tags.includes(selectedTag)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 animate-fadeIn font-sans text-slate-800 dark:text-white min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-2">
            MoneyMart Lounge <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">Beta</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            投資家のためのリアルタイム掲示板
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="キーワードで検索..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 whitespace-nowrap">
            <Edit2 size={18}/> 投稿
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* 2. Left Sidebar (Navigation) - Desktop Only */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 px-2">トピック</h3>
            <div className="space-y-1">
              {tags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex justify-between items-center ${selectedTag === tag ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {tag}
                  {selectedTag === tag && <CheckCircle2 size={16}/>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Main Feed (Center) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Poll Widget */}
          <PollWidget />

          {/* Feed Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 px-2">
            <button 
              onClick={() => setActiveTab('hot')}
              className={`pb-3 font-black text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'hot' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <Flame size={18}/> 人気 (Hot)
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`pb-3 font-black text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'new' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <MessageSquare size={18}/> 新着 (New)
            </button>
          </div>

          {/* Post List */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer group">
                
                {/* Author Info */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-black text-slate-500">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm dark:text-white">{post.author}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-bold">Lv.{post.authorLevel}</span>
                      </div>
                      <span className="text-xs text-slate-400">2時間前</span>
                    </div>
                  </div>
                  {post.isHot && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                      <Flame size={12} fill="currentColor"/> HOT
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {post.tags.map(t => (
                    <span key={t} className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded hover:underline">
                      {t}
                    </span>
                  ))}
                </div>

                {/* AI Summary Card (If exists) */}
                {post.aiSummary && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 mb-4 border border-slate-100 dark:border-slate-700 flex gap-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg h-fit">
                      <Bot size={20} className="text-indigo-600 dark:text-indigo-400"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">MoneyMart AI Insight</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{post.aiSummary}</p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-pink-500 transition group/btn">
                      <ThumbsUp size={18} className="group-hover/btn:scale-110 transition"/> 
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition group/btn">
                      <MessageSquare size={18} className="group-hover/btn:scale-110 transition"/> 
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-slate-300 hover:text-slate-500">
                    <MoreHorizontal size={18}/>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 4. Right Sidebar (Ranking & Etc) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          
          {/* Ranking Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Award size={20} className="text-yellow-500"/>
              <h3 className="font-bold text-slate-900 dark:text-white">今週の貢献者</h3>
            </div>
            <div className="space-y-4">
              {USERS_RANKING.map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                  <div className={`w-6 h-6 flex items-center justify-center font-black text-xs rounded ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : idx === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.badge} (Lv.{user.level})</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-orange-500 text-center block py-2">
              ランキング詳細 →
            </button>
          </div>

          {/* Mini Ad / Banner */}
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-6 text-white text-center shadow-lg transform hover:scale-[1.02] transition cursor-pointer">
            <p className="text-xs font-bold opacity-80 mb-2">プレミアム会員限定</p>
            <h4 className="font-black text-lg mb-4">プロの投資レポートが<br/>読み放題！</h4>
            <button className="bg-white text-orange-500 text-xs font-bold px-4 py-2 rounded-full shadow-md">
              無料体験する
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommunityPage;