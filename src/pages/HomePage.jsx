// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, Shield, BarChart2, 
  Crown, ChevronRight, CreditCard, Landmark, Coins 
} from 'lucide-react';

// 데이터 가져오기
import { funds, marketIndices } from '../data/mockData';

const HomePage = ({ openRiskModal }) => {
  const navigate = useNavigate();

  // 상위 3개 펀드만 추천 상품으로 표시
  const featuredFunds = funds.slice(0, 3);

  // B2B 광고 데이터
  const rollingAds = [
    { 
      id: 1, 
      category: "保険商品", 
      title: "生命保険・医療保険", 
      desc: "万が一に備える。人気保険プラン一括比較", 
      color: "bg-rose-500", 
      icon: <Shield size={24} className="opacity-80"/>
    },
    { 
      id: 2, 
      category: "ファンド", 
      title: "厳選！投資信託", 
      desc: "NISA対応！プロが選ぶ急成長ファンド特集", 
      color: "bg-blue-600", 
      icon: <BarChart2 size={24} className="opacity-80"/>
    },
    { 
      id: 3, 
      category: "カード", 
      title: "クレジットカード", 
      desc: "最大10,000pt還元！ゴールドカード入会CP", 
      color: "bg-orange-500", 
      icon: <CreditCard size={24} className="opacity-80"/>
    },
    { 
      id: 4, 
      category: "銀行", 
      title: "住宅ローン・ネット銀行", 
      desc: "借り換えで総返済額を減らすチャンス！", 
      color: "bg-emerald-600", 
      icon: <Landmark size={24} className="opacity-80"/>
    },
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % rollingAds.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      
      {/* 1. 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            資産運用の未来、<br/>
            <span className="text-orange-500">MoneyMart</span>で始める。
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl">
            AIによる分析、最低水準の手数料、そして直感的な比較ツール。<br/>
            あなたの資産形成をスマートにサポートします。
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/funds')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              ファンドを探す <ArrowRight size={20}/>
            </button>
            
            <button 
              onClick={openRiskModal}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-sm transition"
            >
              リスク診断
            </button>
          </div>
        </div>
        
        {/* 배경 장식 */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-orange-500/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/4"></div>
      </section>

      {/* 2. 시장 지수 (Ticker) */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketIndices.map((idx) => (
            <div key={idx.name} className="text-center border-r last:border-0 border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 font-bold mb-1">{idx.name}</div>
              <div className="text-lg font-bold text-gray-900">{idx.value.toLocaleString()}</div>
              <div className={`text-sm font-medium ${idx.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {idx.change >= 0 ? '+' : ''}{idx.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 광고 섹션 */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* (1) 고정 광고 */}
          <div 
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 shadow-md relative overflow-hidden cursor-pointer group h-48 flex flex-col justify-center"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                <Crown size={20} fill="currentColor" />
                <span>Premium Plan</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">プロ級の分析を<br/>あなたの手に。</h3>
              <p className="text-gray-400 text-sm">月額 500円 / AI分析・リアルタイム株価</p>
              
              <div className="mt-4 flex items-center text-sm font-bold text-yellow-500 group-hover:translate-x-1 transition-transform">
                詳しく見る <ChevronRight size={16} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>
          </div>

          {/* (2) 롤링 광고 */}
          <div className="relative overflow-hidden rounded-2xl shadow-md h-48 group cursor-pointer bg-gray-100">
            {rollingAds.map((ad, index) => (
              <div 
                key={ad.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out p-8 flex flex-col justify-center ${ad.color} text-white
                  ${index === currentAdIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <span className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">{ad.icon}</span>
                      <span className="text-xs font-bold border border-white/30 px-2 py-0.5 rounded-full tracking-wider">
                        {ad.category}
                      </span>
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 leading-tight drop-shadow-sm">{ad.title}</h3>
                <p className="text-white/90 text-sm font-medium">{ad.desc}</p>
                
                <div className="absolute bottom-6 right-6 flex gap-1.5">
                  {rollingAds.map((_, dotIndex) => (
                    <div 
                      key={dotIndex}
                      className={`h-1.5 rounded-full transition-all duration-300 ${dotIndex === currentAdIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. 추천 펀드 */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">注目のファンド</h2>
            <p className="text-gray-500 text-sm mt-1">今、投資家に選ばれている人気商品</p>
          </div>
          <button 
            onClick={() => navigate('/funds')}
            className="text-orange-600 font-bold text-sm hover:underline"
          >
            もっと見る →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFunds.map((fund) => (
            <div 
              key={fund.fundCode}
              onClick={() => navigate(`/fund/${fund.fundCode}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                  {fund.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${fund.riskLevel >= 4 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                   Risk Lv.{fund.riskLevel}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {fund.fundName}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{fund.managementCompany}</p>
              
              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <div>
                  <div className="text-xs text-gray-400">基準価額</div>
                  <div className="font-bold text-xl text-gray-900">¥{fund.basePrice.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">前日比</div>
                  <div className={`font-bold ${fund.prevComparison >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {fund.prevComparison >= 0 ? '+' : ''}{fund.prevComparisonPercent}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 서비스 특징 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">MoneyMartが選ばれる理由</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart2 size={32}/>
              </div>
              <h3 className="font-bold text-lg mb-2">AI分析レポート</h3>
              <p className="text-gray-500 text-sm">膨大な市場データをAIが分析し、<br/>投資判断に役立つ洞察を提供します。</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32}/>
              </div>
              <h3 className="font-bold text-lg mb-2">低コスト運用</h3>
              <p className="text-gray-500 text-sm">業界最低水準の手数料で、<br/>長期的なリターンを最大化します。</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={32}/>
              </div>
              <h3 className="font-bold text-lg mb-2">安心のセキュリティ</h3>
              <p className="text-gray-500 text-sm">最新の暗号化技術と<br/>厳格な管理体制で資産を守ります。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ★ 6. 면책 조항 (신규 추가됨) */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
         <div className="border-t border-gray-100 pt-8 text-center">
             <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed max-w-4xl mx-auto">
                <strong>免責事項：</strong>本サイトは金融商品の情報提供を目的としており、特定の金融商品の推奨、勧誘を目的としたものではありません。
                <br className="hidden md:block" />
                投資に関する最終決定は、お客様ご自身の判断と責任において行われるようお願いいたします。
             </p>
         </div>
      </div>

    </div>
  );
};

export default HomePage;