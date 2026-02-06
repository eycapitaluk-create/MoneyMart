import React, { useState, useEffect } from 'react';
import { 
  // ★ 여기에 Edit2 추가했습니다! (에러 원인 해결)
  Edit2, Search, MessageSquare, ThumbsUp, Flame, 
  Bot, Award, TrendingUp, Filter, MoreHorizontal, CheckCircle2, 
  Loader2, X, Send, Share2 
} from 'lucide-react';

import { supabase } from '../lib/supabase';

// --- Dummy Data (랭킹 등 UI용) ---
const USERS_RANKING = [
  { id: 1, name: '億り人を目指す', level: 42, badge: '👑 Legend' },
  { id: 2, name: '積立NISA民', level: 28, badge: '🔥 Pro' },
  { id: 3, name: '配当金生活', level: 15, badge: '🌱 Beginner' },
];

// --- Poll Widget (투표) ---
const PollWidget = () => {
  const [voted, setVoted] = useState(null); 
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
          <button onClick={() => handleVote('A')} className={`flex-1 rounded-2xl relative overflow-hidden transition-all duration-500 ${voted === 'A' ? 'ring-4 ring-orange-500' : 'hover:opacity-90'}`}>
            <div className="absolute inset-0 bg-blue-600 flex items-center justify-center z-10"><span className="font-black text-lg">オルカン (全世界)</span></div>
            {voted && <div style={{ width: `${percentA}%` }} className="absolute inset-y-0 left-0 bg-blue-500 z-20 flex items-center justify-start px-4 opacity-90 transition-all duration-1000"><span className="font-bold text-2xl">{percentA}%</span></div>}
          </button>
          <button onClick={() => handleVote('B')} className={`flex-1 rounded-2xl relative overflow-hidden transition-all duration-500 ${voted === 'B' ? 'ring-4 ring-orange-500' : 'hover:opacity-90'}`}>
            <div className="absolute inset-0 bg-rose-600 flex items-center justify-center z-10"><span className="font-black text-lg">S&P500 (米国)</span></div>
            {voted && <div style={{ width: `${percentB}%` }} className="absolute inset-y-0 right-0 bg-rose-500 z-20 flex items-center justify-end px-4 opacity-90 transition-all duration-1000"><span className="font-bold text-2xl">{percentB}%</span></div>}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">投票数: {total.toLocaleString()}件</p>
      </div>
    </div>
  );
};

// --- Main Page ---
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('hot'); 
  const [selectedTag, setSelectedTag] = useState('All');
  
  // DB 데이터 상태
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLikes, setUserLikes] = useState([]); 
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const tags = ['All', '新NISA', '住宅ローン', 'ポイ活', '米国株', '節税'];

  useEffect(() => {
    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        fetchPosts(user?.id);
    };
    init();
  }, []);

  const fetchPosts = async (userId) => {
    try {
      setIsLoading(true);
      const { data: postsData, error: postsError } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (postsError) throw postsError;
      setPosts(postsData);

      if (userId) {
          const { data: likesData, error: likesError } = await supabase.from('post_likes').select('post_id').eq('user_id', userId);
          if (!likesError) setUserLikes(likesData.map(item => item.post_id));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("ログインが必要です。");
    if (!newPost.title || !newPost.content) return alert("内容を入力してください。");

    setIsSubmitting(true);
    try {
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', currentUser.id).single();
        const authorName = profile?.name || currentUser.email.split('@')[0];

        const { error } = await supabase.from('posts').insert({
            user_id: currentUser.id,
            title: newPost.title,
            content: newPost.content,
            category: newPost.category, 
            author_name: authorName,
            likes: 0,
            views: 0
        });

        if (error) throw error;
        alert("投稿しました！");
        setIsModalOpen(false);
        setNewPost({ title: '', content: '', category: 'General' });
        fetchPosts(currentUser.id); 
    } catch (error) { alert("投稿エラー"); } finally { setIsSubmitting(false); }
  };

  const handleLike = async (postId, currentLikes) => {
    if (!currentUser) return alert("ログインが必要です。");
    const isLiked = userLikes.includes(postId);
    const newLikesCount = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: newLikesCount } : p));
    setUserLikes(prev => isLiked ? prev.filter(id => id !== postId) : [...prev, postId]);

    try {
        if (isLiked) await supabase.from('post_likes').delete().eq('user_id', currentUser.id).eq('post_id', postId);
        else await supabase.from('post_likes').insert({ user_id: currentUser.id, post_id: postId });
        await supabase.from('posts').update({ likes: newLikesCount }).eq('id', postId);
    } catch (e) { console.error("Like error:", e); }
  };

  const filteredPosts = posts.filter(post => selectedTag === 'All' ? true : post.category === selectedTag);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 animate-fadeIn font-sans text-slate-800 dark:text-white min-h-screen">
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
            <input type="text" placeholder="キーワードで検索..." className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition"/>
          </div>
          {/* ★ 여기가 에러 났던 부분: Edit2를 import 했으니 이제 정상 작동합니다 */}
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 whitespace-nowrap">
            <Edit2 size={18}/> 投稿
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 px-2">トピック</h3>
            <div className="space-y-1">
              {tags.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex justify-between items-center ${selectedTag === tag ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  {tag}
                  {selectedTag === tag && <CheckCircle2 size={16}/>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          <PollWidget />
          <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 px-2">
            <button onClick={() => setActiveTab('hot')} className={`pb-3 font-black text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'hot' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              <Flame size={18}/> 人気 (Hot)
            </button>
            <button onClick={() => setActiveTab('new')} className={`pb-3 font-black text-sm flex items-center gap-2 transition border-b-2 ${activeTab === 'new' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              <MessageSquare size={18}/> 新着 (New)
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500"/></div>
            ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => {
                    const isLiked = userLikes.includes(post.id); 
                    return (
                        <div key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-black text-slate-500">
                                    {post.author_name ? post.author_name.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm dark:text-white">{post.author_name}</span>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-bold">Lv.{Math.floor(Math.random()*50)+1}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {post.likes > 10 && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                                    <Flame size={12} fill="currentColor"/> HOT
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 transition">{post.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{post.content}</p>

                            <div className="flex gap-2 mb-4">
                                <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded hover:underline">
                                    #{post.category}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <div className="flex gap-6">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleLike(post.id, post.likes); }}
                                        className={`flex items-center gap-1.5 transition group/btn ${isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}
                                    >
                                        <ThumbsUp size={18} className={`transition group-hover/btn:scale-110 ${isLiked ? 'fill-pink-500' : ''}`}/> 
                                        <span className="text-xs font-bold">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition group/btn">
                                        <MessageSquare size={18} className="group-hover/btn:scale-110 transition"/> 
                                        <span className="text-xs font-bold">0</span>
                                    </button>
                                </div>
                                <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={18}/></button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-20 text-gray-400">投稿がありません。</div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
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
                    <p className="text-xs text-slate-400">{user.badge} (Lv.{user.level})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Write Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900">新規投稿</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                        <X size={20} className="text-slate-500"/>
                    </button>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">カテゴリー</label>
                        <div className="flex gap-2 flex-wrap">
                            {tags.slice(1).map(tag => (
                                <button key={tag} type="button" onClick={() => setNewPost({...newPost, category: tag})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${newPost.category === tag ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input type="text" placeholder="タイトルを入力" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:bg-white focus:border-orange-500 outline-none transition" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}/>
                    <textarea className="w-full p-4 bg-slate-50 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-orange-500 outline-none min-h-[150px] resize-none transition" placeholder="投資に関する質問や共有したい情報を書きましょう..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}></textarea>
                    <button disabled={isSubmitting} className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <><Send size={18}/> 投稿する</>}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;