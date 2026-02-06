import React, { useState } from 'react';
import { 
  PiggyBank, CreditCard, Home, CheckCircle2, X, ArrowRight,
  TrendingUp, Landmark, ShieldCheck, Gift, CalendarClock, Calculator, FileSearch,
  ArrowDownRight // ★ 아이콘 추가
} from 'lucide-react';

// PremiumLock import 제거 (무료 개방)

// --- Mock Data (상품 데이터) ---
const MOCK_PRODUCTS = {
  savings: [
    { id: 's1', name: 'SBJ銀行 定期預金', type: '定期', rate: 0.35, period: '1年', minAmount: 10, features: ['業界最高水準の金利', 'ネット完結'] },
    { id: 's2', name: '楽天銀行 マネーブリッジ', type: '普通', rate: 0.10, period: '設定なし', minAmount: 0, features: ['楽天証券連携で金利UP', '普通預金なのに高金利'] },
    { id: 's3', name: 'あおぞら銀行 BANK', type: '普通', rate: 0.20, period: '設定なし', minAmount: 0, features: ['条件なしで高金利', 'ゆうちょATM無料'] },
  ],
  cards: [
    { id: 'c1', name: '楽天カード', issuer: '楽天カード', annualFee: 0, pointRate: 1.0, bonus: '楽天市場で最大3倍', features: ['年会費永年無料', 'ポイントが貯まりやすい'] },
    { id: 'c2', name: '三井住友カード (NL)', issuer: '三井住友カード', annualFee: 0, pointRate: 0.5, bonus: 'コンビニ・マックで最大7%', features: ['ナンバーレスで安心', 'タッチ決済対応'] },
    { id: 'c3', name: 'Marriott Bonvoy Amex', issuer: 'American Express', annualFee: 49500, pointRate: 3.0, bonus: '高級ホテル無料宿泊特典', features: ['旅行好きに最適', 'ステータス付与'] },
  ],
  mortgage: [
    { id: 'm1', name: 'auじぶん銀行', type: '変動金利', rate: 0.298, fees: '借入額×2.2%', features: ['au回線利用で金利優遇', 'がん団信100%無料'] },
    { id: 'm2', name: '住信SBIネット銀行', type: '変動金利', rate: 0.320, fees: '借入額×2.2%', features: ['全疾病保障が無料付帯', '保証料0円'] },
    { id: 'm3', name: 'PayPay銀行', type: '固定10年', rate: 1.050, fees: '借入額×2.2%', features: ['PayPayポイント還元', '審査スピード早い'] },
  ],
};

// --- ★ [NEW] 갈아타기 진단 모달 (Refinance Modal) ---
const RefinanceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 상태 관리 (잔액, 현재금리, 갈아탈금리)
  const [balance, setBalance] = useState(3000); // 단위: 만엔
  const [currentRate, setCurrentRate] = useState(1.2); // 단위: %
  const [newRate, setNewRate] = useState(0.35); // 단위: %

  // 약식 계산 로직: (금리차 * 잔액) * (남은기간/2 가중치)
  // 여기서는 UI 데모를 위해 '10년치 이자 절감액' 정도로 단순화하여 보여줍니다.
  const diffRate = Math.max(0, currentRate - newRate);
  const saveAmount = Math.round(balance * (diffRate / 100) * 10); 

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"><X size={20} className="text-slate-500 dark:text-white"/></button>
        
        <div className="text-center mb-6">
           <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
             <Calculator size={32}/>
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white">住宅ローン借り換え診断</h3>
           <p className="text-sm text-slate-500 mt-2">現在のローンを見直すと、<br/>どれくらいお得になるか計算します。</p>
        </div>

        <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-6">
           <div className="flex justify-between items-center">
             <label className="text-xs font-bold text-slate-500">ローン残高 (万円)</label>
             <input type="number" value={balance} onChange={e=>setBalance(Number(e.target.value))} className="w-24 text-right p-2 rounded-lg font-bold bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600"/>
           </div>
           <div className="flex justify-between items-center">
             <label className="text-xs font-bold text-slate-500">現在の金利 (%)</label>
             <input type="number" step="0.1" value={currentRate} onChange={e=>setCurrentRate(Number(e.target.value))} className="w-24 text-right p-2 rounded-lg font-bold bg-white dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600"/>
           </div>
           <div className="flex justify-between items-center">
             <label className="text-xs font-bold text-slate-500">借り換え後 (%)</label>
             <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">最安水準</span>
                <input type="number" step="0.01" value={newRate} readOnly className="w-24 text-right p-2 rounded-lg font-bold bg-slate-200 text-slate-500 cursor-not-allowed"/>
             </div>
           </div>
        </div>

        <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">借り換えた場合の総削減額（目安）</p>
            <div className="text-4xl font-black text-orange-500 mb-6 flex items-center justify-center gap-1">
                <ArrowDownRight size={32}/>
                ¥{saveAmount > 0 ? saveAmount.toLocaleString() : 0}<span className="text-lg text-slate-900 dark:text-white">万円</span>
            </div>
            <button className="w-full py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition shadow-lg">
                詳細シミュレーションへ
            </button>
        </div>
      </div>
    </div>
  );
};

// --- Eligibility Modal (자격 진단 모달) ---
// src/pages/ProductPage.jsx 내부의 EligibilityModal 컴포넌트 교체

const EligibilityModal = ({ isOpen, onClose }) => {
  const [income, setIncome] = useState(''); // 연봉
  const [debt, setDebt] = useState('');     // 기타 대출
  const [result, setResult] = useState(null); // 결과 값
  const [isLoading, setIsLoading] = useState(false);

  // 모달 닫힐 때 초기화
  const handleClose = () => {
    setIncome('');
    setDebt('');
    setResult(null);
    onClose();
  };

  const handleCalculate = () => {
    if (!income) return alert("年収を入力してください");
    
    setIsLoading(true);
    
    // 🧮 일본 주택론 심사 간이 로직 (연봉의 7~8배 - 기타부채)
    setTimeout(() => {
      const annualIncome = parseFloat(income);
      const existingDebt = parseFloat(debt) || 0;
      
      // 보수적으로 연봉의 7.5배 적용
      const maxBorrow = Math.floor((annualIncome * 7.5) - existingDebt);
      const safeBorrow = Math.floor((annualIncome * 6.0) - existingDebt); // 안전권

      setResult({ max: maxBorrow, safe: safeBorrow });
      setIsLoading(false);
    }, 1000); // 1초 로딩 효과
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition z-10"><X size={20} className="text-slate-500 dark:text-white"/></button>
        
        {/* 결과 화면 */}
        {result ? (
           <div className="text-center animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32}/>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">判定結果</h3>
              <p className="text-sm text-slate-500 mb-6">あなたの年収と借入状況からの目安です</p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl mb-6">
                 <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 font-bold mb-1">借入可能額（上限目安）</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                       {result.max > 0 ? (result.max / 10000).toFixed(1) : 0} <span className="text-sm">億円</span>
                       <span className="text-lg text-slate-400 font-medium ml-2">({result.max.toLocaleString()}万円)</span>
                    </p>
                 </div>
                 <div>
                    <p className="text-xs text-green-600 font-bold mb-1">無理のない返済ライン</p>
                    <p className="text-xl font-bold text-green-600">
                       {result.safe > 0 ? (result.safe / 10000).toFixed(1) : 0} 億円
                    </p>
                 </div>
              </div>

              <button onClick={handleClose} className="w-full py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition shadow-lg">
                確認しました
              </button>
              <button onClick={() => setResult(null)} className="mt-4 text-sm text-slate-400 font-bold hover:text-slate-600">
                もう一度計算する
              </button>
           </div>
        ) : (
           /* 입력 화면 */
           <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSearch size={32}/>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">借入可能額の判定</h3>
              <p className="text-sm text-slate-500 mt-2">年収と他社借入状況から、<br/>無理のない借入目安を算出します。</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">昨年の税込年収 (万円)</label>
                <input 
                  type="number" 
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="例: 600" 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none font-bold text-lg outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">他社からの借入残高 (万円)</label>
                <input 
                  type="number" 
                  value={debt}
                  onChange={(e) => setDebt(e.target.value)}
                  placeholder="例: 50" 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white border-none font-bold text-lg outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <p className="text-[10px] text-slate-400 mt-1 ml-1">※ カードローン、自動車ローンなど</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 ポイント:</strong> 一般的に年収の7〜8倍が借入上限の目安と言われています。
              </div>

              <button 
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>計算中...</>
                ) : (
                  <>判定する <ArrowRight size={18}/></>
                )}
              </button>
            </div>
           </>
        )}
      </div>
    </div>
  );
};

// --- Comparison Modal Component ---
const ComparisonModal = ({ isOpen, onClose, products, selectedIds, category }) => {
  if (!isOpen) return null;
  const selectedProducts = products.filter(p => selectedIds.includes(p.id));

  const renderComparisonRows = () => {
    switch (category) {
      case 'savings':
        return (
          <>
            <tr><th className="p-3 text-left text-sm text-slate-500">種類</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-bold">{p.type}</td>)}</tr>
            <tr><th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">金利 (年率)</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-black text-orange-600 bg-slate-50 dark:bg-slate-800">{p.rate.toFixed(2)}%</td>)}</tr>
            <tr><th className="p-3 text-left text-sm text-slate-500">預入期間</th>{selectedProducts.map(p => <td key={p.id} className="p-3">{p.period}</td>)}</tr>
            <tr><th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">最低預入額</th>{selectedProducts.map(p => <td key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800">{p.minAmount}万円〜</td>)}</tr>
          </>
        );
      case 'cards':
        return (
          <>
             <tr><th className="p-3 text-left text-sm text-slate-500">発行会社</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-bold">{p.issuer}</td>)}</tr>
             <tr><th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">年会費</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-bold bg-slate-50 dark:bg-slate-800">{p.annualFee === 0 ? '無料' : `¥${p.annualFee.toLocaleString()}`}</td>)}</tr>
             <tr><th className="p-3 text-left text-sm text-slate-500">基本還元率</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-black text-orange-600">{p.pointRate.toFixed(1)}%</td>)}</tr>
             <tr><th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">特典・ボーナス</th>{selectedProducts.map(p => <td key={p.id} className="p-3 text-sm bg-slate-50 dark:bg-slate-800">{p.bonus}</td>)}</tr>
          </>
        );
      case 'mortgage':
        return (
          <>
             <tr><th className="p-3 text-left text-sm text-slate-500">金利タイプ</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-bold">{p.type}</td>)}</tr>
             <tr><th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">適用金利</th>{selectedProducts.map(p => <td key={p.id} className="p-3 font-black text-orange-600 bg-slate-50 dark:bg-slate-800">{p.rate.toFixed(3)}%</td>)}</tr>
             <tr><th className="p-3 text-left text-sm text-slate-500">事務手数料</th>{selectedProducts.map(p => <td key={p.id} className="p-3 text-sm">{p.fees}</td>)}</tr>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"><X size={20} className="text-slate-500 dark:text-white"/></button>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-orange-500"/> 比較結果 ({selectedProducts.length}件)
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-slate-800 dark:text-slate-200">
                <thead>
                    <tr>
                        <th className="p-3 text-left text-sm text-slate-500">商品名</th>
                        {selectedProducts.map(p => (
                            <th key={p.id} className="p-3 text-lg font-black text-slate-900 dark:text-white min-w-[180px]">{p.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderComparisonRows()}
                    <tr>
                        <th className="p-3 text-left text-sm text-slate-500 bg-slate-50 dark:bg-slate-800">特徴</th>
                        {selectedProducts.map(p => (
                            <td key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800">
                                <ul className="text-sm space-y-1">
                                    {p.features.map((f, i) => <li key={i} className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500 flex-shrink-0"/> {f}</li>)}
                                </ul>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className="p-3"></th>
                        {selectedProducts.map(p => (
                            <td key={p.id} className="p-3">
                                <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md">公式サイトへ</button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const ProductPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('savings'); 
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  // ★ 상태 추가
  const [isEligibleOpen, setIsEligibleOpen] = useState(false);
  const [isRefinanceOpen, setIsRefinanceOpen] = useState(false); // [NEW] 갈아타기 모달 상태

  const currentProducts = MOCK_PRODUCTS[activeTab];

  const handleToggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab) => {
      setActiveTab(tab);
      setSelectedItems([]);
  };

  const tabs = [
      { id: 'savings', label: '貯蓄・預金', icon: <PiggyBank size={18}/>, color: 'bg-blue-500' },
      { id: 'cards', label: 'クレジットカード', icon: <CreditCard size={18}/>, color: 'bg-purple-500' },
      { id: 'mortgage', label: '住宅ローン', icon: <Home size={18}/>, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn pb-32 min-h-screen font-sans text-slate-800 dark:text-white">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          <Landmark className="text-orange-500" size={36}/> 金融商品比較
        </h1>
        <p className="text-slate-500 dark:text-gray-400 font-medium">
          あなたに最適な金融商品を、条件に合わせて比較・検討できます。
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full">
            {tabs.map(tab => (
                <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id)} 
                className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}
                >
                <div className={`p-1 rounded-lg text-white ${tab.color}`}>{tab.icon}</div> {tab.label}
                </button>
            ))}
          </div>
      </div>

      {/* ★ PremiumLock 없이 바로 도구 노출 (무료 개방) */}
      {activeTab === 'mortgage' && (
        <div className="max-w-4xl mx-auto mb-8 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                 {/* 1. 갈아타기 진단 버튼 */}
                 <button 
                   onClick={() => setIsRefinanceOpen(true)} // ★ alert 대신 모달 Open
                   className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-500 transition group"
                 >
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:scale-110 transition"><Calculator size={20}/></div>
                    <div className="text-left">
                       <div className="text-xs text-slate-500 font-bold">今のローンと比較</div>
                       <div className="font-bold text-slate-900 dark:text-white">借り換え診断</div>
                    </div>
                 </button>

                 {/* 2. 대출 한도 조회 버튼 */}
                 <button 
                   onClick={() => setIsEligibleOpen(true)}
                   className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-green-500 transition group"
                 >
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition"><FileSearch size={20}/></div>
                    <div className="text-left">
                       <div className="text-xs text-slate-500 font-bold">いくら借りられる？</div>
                       <div className="font-bold text-slate-900 dark:text-white">借入可能額判定</div>
                    </div>
                 </button>
              </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map(product => (
              <div key={product.id} className={`bg-white dark:bg-slate-800 rounded-[2rem] p-6 border transition-all relative group cursor-pointer ${selectedItems.includes(product.id) ? 'border-orange-500 shadow-lg ring-2 ring-orange-500/20 dark:border-orange-500' : 'border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1'}`} onClick={() => handleToggleSelect(product.id)}>
                  
                  {/* Checkbox */}
                  <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${selectedItems.includes(product.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-orange-400'}`}>
                      {selectedItems.includes(product.id) && <CheckCircle2 size={16} className="text-white"/>}
                  </div>

                  <h3 className="font-bold text-xl mb-4 pr-8 line-clamp-1">{product.name}</h3>

                  {/* Key Metrics based on Category */}
                  <div className="flex items-end gap-4 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                      {activeTab === 'savings' && (
                          <>
                            <div><p className="text-xs text-slate-500 mb-1">金利 (年率)</p><p className="text-3xl font-black text-orange-600">{product.rate.toFixed(2)}<span className="text-sm">%</span></p></div>
                            <div><p className="text-xs text-slate-500 mb-1">タイプ</p><p className="font-bold">{product.type}</p></div>
                          </>
                      )}
                      {activeTab === 'cards' && (
                          <>
                             <div><p className="text-xs text-slate-500 mb-1">基本還元率</p><p className="text-3xl font-black text-orange-600">{product.pointRate.toFixed(1)}<span className="text-sm">%</span></p></div>
                             <div><p className="text-xs text-slate-500 mb-1">年会費</p><p className="font-bold">{product.annualFee === 0 ? '無料' : `¥${product.annualFee.toLocaleString()}`}</p></div>
                          </>
                      )}
                      {activeTab === 'mortgage' && (
                          <>
                             <div><p className="text-xs text-slate-500 mb-1">適用金利</p><p className="text-3xl font-black text-orange-600">{product.rate.toFixed(3)}<span className="text-sm">%</span></p></div>
                             <div><p className="text-xs text-slate-500 mb-1">タイプ</p><p className="font-bold">{product.type}</p></div>
                          </>
                      )}
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                      {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0"/> {feature}
                          </li>
                      ))}
                  </ul>
                  
                  {/* Tags */}
                  {activeTab === 'cards' && product.bonus && (
                      <div className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-xl mb-4">
                          <Gift size={14}/> {product.bonus}
                      </div>
                  )}
                  {activeTab === 'savings' && (
                       <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl mb-4">
                           <CalendarClock size={14}/> 期間: {product.period}
                       </div>
                  )}

                  <button className="w-full py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2 group/btn">
                      詳細を見る <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                  </button>
              </div>
          ))}
      </div>

      {/* Floating Compare Button */}
      {selectedItems.length > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-slow">
              <button onClick={() => setIsCompareModalOpen(true)} className="bg-slate-900 dark:bg-orange-500 text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition flex items-center gap-3">
                  <ShieldCheck size={20}/> {selectedItems.length}件を比較する
              </button>
          </div>
      )}

      {/* Comparison Modal */}
      <ComparisonModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)}
        products={currentProducts}
        selectedIds={selectedItems}
        category={activeTab}
      />
      
      {/* Eligibility Modal */}
      <EligibilityModal 
        isOpen={isEligibleOpen} 
        onClose={() => setIsEligibleOpen(false)} 
      />
      
      {/* ★ [NEW] Refinance Modal */}
      <RefinanceModal
        isOpen={isRefinanceOpen}
        onClose={() => setIsRefinanceOpen(false)}
      />

    </div>
  );
};

export default ProductPage;