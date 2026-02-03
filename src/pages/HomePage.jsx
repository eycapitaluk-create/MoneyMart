import React, { useState, useEffect } from 'react';
import { 
  Shield, ChevronRight, CreditCard, ExternalLink, 
  TrendingUp, Landmark, Coins, Home as HomeIcon, 
  Quote, Star, Phone, Crown 
} from 'lucide-react';
import { Badge, RollingAdBanner } from '../components/CommonUI';

const HomePage = ({ onNavigate, setIsLoginModalOpen, user, openRiskModal }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    { name: "田中 様", age: "40代", text: "投資信託の選び方が分からなかったのですが、リスク診断のおかげで自分に合ったファンドが見つかりました。", rating: 5 },
    { name: "佐藤 様", age: "30代", text: "+60のファンドを一覧で比較できるのが便利。手数料の違いが一目で分かります。", rating: 5 },
    { name: "山田 様", age: "50代", text: "信頼できる情報源として毎日チェックしています。中立的な分析が助かります。", rating: 4 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-24 lg:py-40 overflow-hidden text-center">
        {user?.plan === 'premium' && <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Crown size={400} className="transform rotate-12 text-slate-100" /></div>}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full mb-8 border border-orange-100">
            <Shield className="w-4 h-4" /> <span className="text-sm font-bold">独立系FP監修・中立的な情報提供</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">
            賢く選ぶ、<br/><span className="text-orange-500 underline decoration-slate-200">将来</span>を変える。
          </h1>
          <p className="text-xl lg:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            投資信託、クレジットカード、保険、住宅ローン。<br/>MoneyMartは日本最大の金融比較情報を中立的に提供します。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => onNavigate('compare')} className="bg-slate-900 hover:bg-black text-white font-black text-xl px-16 py-6 rounded-[2rem] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              金融商品を比較する <ChevronRight/>
            </button>
            <button onClick={openRiskModal} className="bg-white border-2 border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-500 font-black text-xl px-16 py-6 rounded-[2rem] transition-all">
              リスク診断を受ける
            </button>
          </div>
        </div>
      </section>

      {/* 2. AD SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-3">注目</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">今月のピックアップ</h2>
            </div>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-[2.5rem] p-12 text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-2xl hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-3 bg-yellow-500 text-indigo-900 text-xs font-bold rounded-bl-xl shadow-md z-20">PREMIUM PARTNER</div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
                
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  <CreditCard className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-3xl font-black mb-4">MoneyMart ゴールドカード</h3>
                <p className="text-indigo-200 text-lg leading-relaxed mb-10">
                  投資信託の積立で最大2.0%ポイント還元。<br/>
                  今なら入会特典で最大15,000ポイントプレゼント中。
                </p>
              </div>
              <button className="bg-yellow-500 text-indigo-900 w-full py-4 rounded-2xl font-black hover:bg-yellow-400 transition relative z-10 flex items-center justify-center gap-2">
                詳細を見る <ExternalLink size={20} />
              </button>
            </div>

            {/* Right: Rolling Ad (Standard) */}
            <RollingAdBanner />
          </div>
        </div>
      </section>

      {/* 3. CATEGORY NAVIGATION */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">何をお探しですか？</h2>
            <p className="text-slate-500">カテゴリーから最適な商品を見つけましょう</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: "投資信託", color: "bg-green-500", action: () => onNavigate('fund') },
              { icon: Landmark, title: "銀行商品", color: "bg-indigo-500", action: () => onNavigate('compare') },
              { icon: CreditCard, title: "カード", color: "bg-blue-600", action: () => onNavigate('compare') }, 
              { icon: Shield, title: "保険", color: "bg-pink-500", action: () => onNavigate('compare') }, 
              { icon: HomeIcon, title: "住宅ローン", color: "bg-cyan-500", action: () => onNavigate('compare') }, 
              { icon: Coins, title: "ポイ活", color: "bg-orange-500" },
            ].map((item, idx) => (
              <button key={idx} onClick={item.action} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center h-52 group">
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <item.icon size={32} />
                </div>
                <span className="font-bold text-slate-700 text-lg group-hover:text-slate-900">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12"><Badge text="ユーザーの声" color="green" /><h2 className="text-3xl font-bold text-slate-900">多くの方に<span className="text-green-600">ご利用</span>いただいています</h2></div>
          <div className="max-w-3xl mx-auto relative bg-slate-50 rounded-3xl p-8 md:p-12 text-center">
            <Quote size={80} className="absolute top-0 left-0 text-slate-100 -translate-x-4 -translate-y-4" />
            <p className="text-lg md:text-xl text-slate-700 mb-8 font-medium relative z-10">"{testimonials[currentTestimonial].text}"</p>
            <div className="flex items-center justify-center gap-1 mb-4">{[...Array(testimonials[currentTestimonial].rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{testimonials[currentTestimonial].name.charAt(0)}</div>
              <div className="text-left"><p className="text-slate-900 font-bold text-sm">{testimonials[currentTestimonial].name}</p><p className="text-slate-500 text-xs">{testimonials[currentTestimonial].age}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">資産形成の第一歩を踏み出しましょう</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button onClick={openRiskModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg transition-colors">無料で始める</button>
            <button className="bg-transparent border border-slate-600 text-white hover:bg-white/10 font-bold text-lg px-10 py-5 rounded-xl transition-colors flex items-center justify-center"><Phone className="w-5 h-5 mr-2" /> お問い合わせ</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;