import React, { useState } from 'react';
import { 
  Check, X, Shield, CreditCard, Zap, Star, Lock, HelpCircle 
} from 'lucide-react';

const Payment = () => {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // 가격 설정
  const monthlyPrice = 980;
  const yearlyPrice = 9800; // 2개월 무료 효과

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32 animate-fadeIn">
      
      {/* 1. 헤더 */}
      <div className="text-center mb-12">
        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">MoneyMart Premium</span>
        <h1 className="text-4xl font-black text-slate-900 mb-4">資産形成のスピードを、<br/>加速させよう。</h1>
        <p className="text-slate-500">プレミアム機能で、より賢く、より効率的に資産管理。</p>
      </div>

      {/* 2. 요금제 선택 (토글) */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1 rounded-xl flex relative">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all z-10 ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            月額払い
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all z-10 flex items-center gap-1 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            年額払い <span className="bg-green-100 text-green-600 text-[10px] px-1.5 rounded-full">お得</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
        {/* 3. 무료 플랜 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 opacity-70 hover:opacity-100 transition">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Free Plan</h3>
          <p className="text-3xl font-black text-slate-900 mb-6">¥0 <span className="text-sm text-slate-400 font-medium">/ 永年</span></p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-slate-600"><Check size={16} className="text-slate-400"/> 資産ポートフォリオ作成</li>
            <li className="flex items-center gap-3 text-sm text-slate-600"><Check size={16} className="text-slate-400"/> 家計簿・支出管理</li>
            <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} className="text-slate-300"/> 資産推移グラフ (無制限)</li>
            <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} className="text-slate-300"/> AI ポートフォリオ診断</li>
            <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} className="text-slate-300"/> 広告非表示</li>
          </ul>
          <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed">現在のプラン</button>
        </div>

        {/* 4. 프리미엄 플랜 */}
        <div className="bg-slate-900 p-8 rounded-3xl text-white relative shadow-2xl transform md:-translate-y-4 border border-slate-700">
          <div className="absolute top-0 right-0 bg-[#F06529] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} className="text-yellow-400" fill="currentColor"/> Premium</h3>
          <p className="text-4xl font-black mb-6">
            ¥{billingCycle === 'yearly' ? (yearlyPrice/12).toFixed(0) : monthlyPrice} 
            <span className="text-sm text-slate-400 font-medium"> / 月</span>
          </p>
          {billingCycle === 'yearly' && <p className="text-xs text-green-400 font-bold mb-6 -mt-4">年額 ¥9,800 (2ヶ月分無料！)</p>}
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} className="text-green-400"/> 全てのFree機能</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-400"/> 資産推移グラフ (過去全期間)</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-400"/> AI ポートフォリオ診断</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-400"/> 配当金カレンダー</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-400"/> 広告完全非表示</li>
          </ul>
        </div>
      </div>

      {/* 5. 결제 폼 */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20}/> お支払い情報の入力</h3>
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-slate-200 rounded"></div>
            <div className="w-8 h-5 bg-slate-200 rounded"></div>
            <div className="w-8 h-5 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">カード番号</label>
            <div className="relative">
              <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition"/>
              <CreditCard size={18} className="absolute left-3 top-3.5 text-slate-400"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">有効期限 (MM/YY)</label>
              <input type="text" placeholder="MM / YY" value={expiry} onChange={e=>setExpiry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CVC</label>
              <div className="relative">
                <input type="text" placeholder="123" value={cvc} onChange={e=>setCvc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition"/>
                <HelpCircle size={18} className="absolute right-3 top-3.5 text-slate-300"/>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={()=>alert("ありがとうございます！Premium会員になりました。")} className="w-full bg-[#F06529] hover:bg-[#D9551E] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition transform active:scale-95 flex items-center justify-center gap-2">
            <Lock size={18}/> 
            {billingCycle === 'yearly' ? '年額 ¥9,800 で登録する' : '月額 ¥980 で登録する'}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
            <Shield size={10}/> 256-bit SSL暗号化通信で安全に処理されます
          </p>
        </div>
      </div>
      
      {/* 6. FAQ */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <p className="text-slate-400 text-xs mb-4">いつでもキャンセル可能です。隠れた手数料はありません。</p>
        <div className="text-slate-300 text-[10px]">
          &copy; 2026 MoneyMart Inc. All rights reserved.
        </div>
      </div>

    </div>
  );
};

// 👇 이 줄이 없어서 에러가 났던 겁니다!
export default Payment;