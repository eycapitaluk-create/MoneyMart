import React, { useState } from 'react';
import { Edit2, Target as TargetIcon, MessageSquare, ThumbsUp, Bot } from 'lucide-react';

const CommunityPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [posts, setPosts] = useState([
    { id: 1, author: '投資初心者A', title: '新NISAのつみたて投資枠、月3万円でのおすすめ銘柄は？', content: '来月から始めようと思っています。S&P500とオルカンで迷っています。', tags: ['NISA', '投資信託'], likes: 12, comments: 4, isAiAnswered: true },
    { id: 2, author: '住宅ローン検討中', title: '変動金利と固定金利、今のタイミングならどっち？', content: '日銀の利上げ観測がありますが、やはり固定の方が安心でしょうか？', tags: ['住宅ローン', '金利'], likes: 8, comments: 2, isAiAnswered: false },
    { id: 3, author: 'ポイ活民', title: '楽天経済圏からPayPay経済圏への移行を検討中', content: '改悪続きで迷っています。皆さんはどうしてますか？', tags: ['ポイ活', 'クレジットカード'], likes: 25, comments: 15, isAiAnswered: true },
  ]);

  const filteredPosts = selectedTopic === 'all' 
    ? posts 
    : posts.filter(post => post.tags.some(tag => tag.includes(selectedTopic.replace('#', ''))));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-40 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">MoneyMart Lounge</h1>
        <p className="text-slate-500 font-medium">みんなの金融・投資に関する悩みや情報をシェアしよう。</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
            <Edit2 size={18}/> 質問・投稿する
          </button>
           
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-slate-800 flex items-center gap-2"><TargetIcon size={18} className="text-red-500"/> 人気のトピック</h3>
               {selectedTopic !== 'all' && <button onClick={() => setSelectedTopic('all')} className="text-[10px] text-slate-400 hover:text-red-500">クリア</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {['#新NISA', '#住宅ローン', '#S&P500', '#オルカン', '#ポイ活', '#節税', '#ふるさと納税'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSelectedTopic(tag === selectedTopic ? 'all' : tag)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${selectedTopic === tag ? 'bg-slate-800 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10"><span className="bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded mb-2 inline-block">今週のアンケート</span><h3 className="font-bold text-xl mb-4">クレカ積立、どっち派？</h3><div className="flex gap-4"><button className="flex-1 bg-white text-indigo-600 font-black py-3 rounded-xl hover:bg-indigo-50 transition">楽天カード (45%)</button><button className="flex-1 bg-white/10 text-white font-black py-3 rounded-xl hover:bg-white/20 transition">三井住友 (55%)</button></div></div>
            <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={120} /></div>
          </div>

          {filteredPosts.length > 0 ? filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  {post.tags.map(t => <span key={t} className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded">{t}</span>)}
                </div>
                {post.isAiAnswered && <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1"><Bot size={12}/> AI回答あり</span>}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{post.content}</p>
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">{post.author.charAt(0)}</div>
                  <span>{post.author}</span>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 hover:text-slate-600"><ThumbsUp size={14}/> {post.likes}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 text-slate-400 font-bold bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               該当するトピックの投稿はありません。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;