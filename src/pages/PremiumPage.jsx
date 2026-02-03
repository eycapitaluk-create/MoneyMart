import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const PremiumMembershipPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'free',
      title: 'Free Plan',
      description: '金融比較を始める方に',
      price: { monthly: 0, yearly: 0 },
      features: ['ファンド比較', '金利・商品比較', 'クレカ・保険比較', 'リスク評価'],
      cta: '無料で始める',
      popular: false,
      color: 'border-slate-200 dark:border-slate-600',
      button: 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600'
    },
    {
      id: 'premium',
      title: 'Premium',
      description: '資産管理を本格的に',
      price: { monthly: 980, yearly: 9800, originalMonthly: 1980 },
      features: ['全ての無料機能', 'AIポートフォリオ分析', 'リアルタイム市場アラート', '会員限定レポート', '広告非表示'],
      cta: 'プレミアムに登録',
      popular: true,
      color: 'border-orange-500 ring-4 ring-orange-50 dark:ring-orange-900/30',
      button: 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fadeIn pb-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Premium Membership</h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
          AIによる高度な分析と、あなただけの専属アドバイザー。<br/>
          資産形成のスピードを加速させる特別なプランです。
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex relative">
          <button onClick={()=>setBillingPeriod('monthly')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${billingPeriod==='monthly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>月払い</button>
          <button onClick={()=>setBillingPeriod('yearly')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${billingPeriod==='yearly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>年払い</button>
          {billingPeriod==='yearly' && <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm">17% OFF</div>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border-2 relative flex flex-col ${plan.color}`}>
            {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">Most Popular</div>}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.title}</h3>
              <p className="text-sm text-slate-400 font-bold mb-6">{plan.description}</p>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">¥{(billingPeriod === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly/12)).toLocaleString()}</span>
                <span className="text-slate-400 font-bold">/ 月</span>
              </div>
              {plan.price.originalMonthly && billingPeriod === 'monthly' && <p className="text-xs text-slate-400 line-through mt-2">通常 ¥{plan.price.originalMonthly.toLocaleString()}</p>}
            </div>
            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <div className={`p-1 rounded-full ${plan.popular ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}><Check size={14}/></div>
                  {f}
                </div>
              ))}
            </div>
            <button className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${plan.button}`}>{plan.cta}</button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 text-center">よくある質問</h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex justify-between items-center">いつでも解約できますか？ <ChevronDown size={20} className="text-slate-400"/></h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">はい、いつでもアカウント設定から解約可能です。解約後も現在の請求期間終了まではプレミアム機能をご利用いただけます。</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex justify-between items-center">無料プランとの違いは？ <ChevronDown size={20} className="text-slate-400"/></h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">無料プランでは基本的な比較機能のみですが、プレミアムではAIによるポートフォリオ分析、リアルタイムのアラート機能など、より高度な資産管理ツールが利用可能です。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMembershipPage;