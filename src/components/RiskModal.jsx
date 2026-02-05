import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, TrendingUp, Zap, PieChart } from 'lucide-react';

export default function RiskModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0); // 0: Start, 1~5: Questions, 6: Result
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const questions = [
    {
      q: "Q1. 投資経験について教えてください。",
      options: [
        { text: "全く経験がない、または始めたばかり", point: 1 },
        { text: "少し経験がある (3年未満)", point: 3 },
        { text: "豊富な経験がある (3年以上)", point: 5 },
      ]
    },
    {
      q: "Q2. 投資予定の資金はどのような性格のものですか？",
      options: [
        { text: "近いうちに使う予定がある (教育費・住宅など)", point: 1 },
        { text: "当面使う予定はない (老後資金など)", point: 3 },
        { text: "生活に全く影響のない余裕資金", point: 5 },
      ]
    },
    {
      q: "Q3. 投資における優先順位は？",
      options: [
        { text: "元本割れを絶対に避けたい (安全性)", point: 1 },
        { text: "安全性と収益性のバランス重視", point: 3 },
        { text: "リスクを取ってでも資産を大きく増やしたい", point: 5 },
      ]
    },
    {
      q: "Q4. 保有資産が一時的に20%下落しました。どうしますか？",
      options: [
        { text: "怖くなってすぐに全て売却する", point: 1 },
        { text: "不安だが、戻るのを待つ", point: 3 },
        { text: "安く買えるチャンスだと思って買い増す", point: 5 },
      ]
    },
    {
      q: "Q5. 現在の年収に対する投資予定額の割合は？",
      options: [
        { text: "年収の10%未満 (慎重)", point: 1 },
        { text: "年収の10%〜30%程度", point: 3 },
        { text: "年収の30%以上 (積極的)", point: 5 },
      ]
    }
  ];

  const handleAnswer = (point) => {
    setScore(prev => prev + point);
    setStep(prev => prev + 1);
  };

  const reset = () => {
    setStep(0);
    setScore(0);
  };

  const getResult = () => {
    if (score <= 9) return { 
        type: "堅実運用タイプ (Conservative)", 
        desc: "あなたは「石橋を叩いて渡る」慎重派です。大きなリターンよりも、資産を減らさないことを最優先する傾向があります。一般的に債券や預金に近い運用が好まれます。",
        color: "bg-blue-50 text-blue-700",
        icon: <ShieldCheck size={64} className="text-blue-500 mb-4"/> 
    };
    if (score <= 18) return { 
        type: "バランス重視タイプ (Balanced)", 
        desc: "リスクとリターンのバランスが取れた運用を好むスタイルです。市場の平均的な成長を目指し、株式と債券を組み合わせるスタイルが一般的です。",
        color: "bg-green-50 text-green-700",
        icon: <PieChart size={64} className="text-green-500 mb-4"/>
    };
    return { 
        type: "積極運用タイプ (Aggressive)", 
        desc: "短期的な変動を恐れず、将来の大きなリターンを狙う投資家タイプです。株式比率を高めたり、成長国への投資も視野に入ります。",
        color: "bg-orange-50 text-orange-700",
        icon: <Zap size={64} className="text-orange-500 mb-4"/>
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-fadeInUp">
        
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition z-50">
          <X size={20} className="text-slate-500 dark:text-white"/>
        </button>

        {/* Step 0: Intro */}
        {step === 0 && (
          <div className="p-10 text-center">
            <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <TrendingUp size={48} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">投資スタイル診断</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed">
              5つの質問に答えるだけで、<br/>
              あなたの<span className="text-orange-500 font-bold">投資スタイル</span>と<br/>
              <span className="text-orange-500 font-bold">リスク許容度</span>を確認します。
            </p>
            <button onClick={() => setStep(1)} className="w-full py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-2xl transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
              診断スタート
            </button>
          </div>
        )}

        {/* Step 1~5: Questions */}
        {step > 0 && step <= questions.length && (
          <div className="p-8">
            <div className="flex justify-between items-end mb-8">
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-orange-500 mb-1">STEP {step} / {questions.length}</span>
                 <div className="flex gap-1.5">
                   {questions.map((_, i) => (
                     <div key={i} className={`h-2 w-8 rounded-full transition-all duration-300 ${i + 1 <= step ? 'bg-orange-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                   ))}
                 </div>
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed h-16 flex items-center">
              {questions[step-1].q}
            </h3>

            <div className="space-y-4">
              {questions[step-1].options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(opt.point)}
                  className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group flex justify-between items-center bg-white dark:bg-slate-900"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-orange-700 dark:group-hover:text-orange-400 text-sm">{opt.text}</span>
                  <ArrowRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Result */}
        {step > questions.length && (() => {
           const result = getResult();
           return (
             <div className="p-10 text-center">
               <div className="flex justify-center animate-bounce-slow">{result.icon}</div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ANALYSIS COMPLETE</p>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                 あなたのタイプは...<br/>
                 <span className="text-4xl text-orange-500 block mt-2 tracking-tight">{result.type}</span>
               </h2>
               
               <div className={`p-6 rounded-3xl mb-8 text-left ${result.color} dark:bg-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-700`}>
                 <p className="font-medium leading-loose text-sm">{result.desc}</p>
               </div>

               <div className="flex flex-col gap-3">
                 {/* ★ 여기가 수정되었습니다! '추천' 단어 완전 제거 */}
                 <button onClick={onClose} className="w-full py-4 bg-slate-900 dark:bg-orange-500 hover:bg-black dark:hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-lg">
                   商品一覧を見る
                 </button>
                 <button onClick={reset} className="w-full py-3 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold transition text-sm">
                   もう一度診断する
                 </button>
               </div>
             </div>
           );
        })()}

      </div>
    </div>
  );
}