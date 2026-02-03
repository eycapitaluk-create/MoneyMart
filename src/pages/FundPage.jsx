import React, { useState } from 'react';
import { Activity, Search, Filter, Leaf, TrendingUp, Heart, PlusCircle, CheckSquare, X } from 'lucide-react';
import { FUNDS_DATA, SECTOR_DATA_BY_PERIOD } from '../data/mockData'; // 데이터 가져오기
import { FeaturedFundsAd } from '../components/CommonUI'; // 부품 가져오기

const FundPage = ({ onFundClick, user, myWatchlist, toggleWatchlist, addToPortfolio, openLogin }) => { 
  const [filterText, setFilterText] = useState('');
  const [activeType, setActiveType] = useState('all'); 
  const [activeRegion, setActiveRegion] = useState('all'); 
  const [activeSector, setActiveSector] = useState('all'); 
  const [isEsgOnly, setIsEsgOnly] = useState(false); 
  const [sectorPeriod, setSectorPeriod] = useState('12ヶ月'); 
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [targetFund, setTargetFund] = useState(null);
  const [assetForm, setAssetForm] = useState({amount: '', buyPrice: '', currentPrice: '', date: new Date().toISOString().split('T')[0]});

  const filteredFunds = FUNDS_DATA.filter(fund => {
    const matchesText = fund.name.includes(filterText) || fund.tags.some(t => t.includes(filterText));
    const matchesType = activeType === 'all' || fund.category === activeType;
    const matchesRegion = activeRegion === 'all' || fund.region === activeRegion;
    const matchesSector = activeSector === 'all' || fund.sector === activeSector;
    const matchesEsg = !isEsgOnly || fund.esg === true;
    return matchesText && matchesType && matchesRegion && matchesSector && matchesEsg;
  });

  const toggleFundSelection = (id) => {
    if (selectedCompareIds.includes(id)) setSelectedCompareIds(prev => prev.filter(fundId => fundId !== id));
    else { if (selectedCompareIds.length >= 4) return alert("比較できるファンドは最大4つまでです。"); setSelectedCompareIds(prev => [...prev, id]); }
  };

  const openAddModal = (fund) => {
    if (!user) { openLogin(); return; }
    setTargetFund(fund);
    setAssetForm({amount: '', buyPrice: '', currentPrice: '', date: new Date().toISOString().split('T')[0]});
    setAddModalOpen(true);
  };

  const submitPortfolio = () => {
    if (!assetForm.amount || !assetForm.buyPrice || !assetForm.date) return alert("必須項目を入力してください");
    addToPortfolio({ fundId: targetFund.id, fundName: targetFund.name, amount: assetForm.amount, buyPrice: assetForm.buyPrice, currentPrice: assetForm.currentPrice || assetForm.buyPrice, date: assetForm.date });
    setAddModalOpen(false);
  };

  const sectorData = SECTOR_DATA_BY_PERIOD[sectorPeriod] || SECTOR_DATA_BY_PERIOD['12ヶ月'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2"><Activity className="text-blue-600 w-5 h-5" /><h2 className="text-lg font-bold text-slate-900">セクター別パフォーマンス</h2></div>
          <div className="flex gap-2 text-sm bg-slate-100 p-1 rounded-lg">
            {['6ヶ月', '9ヶ月', '12ヶ月', 'YTD'].map(period => (
              <button key={period} onClick={() => setSectorPeriod(period)} className={`px-3 py-1 rounded-md transition-all ${sectorPeriod === period ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{period}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sectorData.map((sector, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between h-32 hover:shadow-md transition bg-white group cursor-pointer">
              <div className="flex justify-between items-start"><span className="text-2xl group-hover:scale-110 transition-transform">{sector.icon}</span>{sector.isUp ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />}</div>
              <div><div className="font-bold text-slate-800 text-sm mb-1">{sector.name}</div><span className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold text-white ${sector.isUp ? 'bg-green-500' : 'bg-red-500'}`}>{sector.change}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Filter size={16}/> フィルター</h3><button onClick={() => {setFilterText(''); setActiveType('all'); setActiveRegion('all'); setActiveSector('all'); setIsEsgOnly(false);}} className="text-xs text-slate-400 hover:text-slate-600">リセット</button></div>
            <div className="space-y-5">
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">キーワード</label><div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="text" value={filterText} onChange={(e)=>setFilterText(e.target.value)} placeholder="ファンド名を入力" className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm"/></div></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">資産クラス</label><select value={activeType} onChange={(e)=>setActiveType(e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-slate-700"><option value="all">全ての資産クラス</option><option value="国内株式">国内株式</option><option value="海外株式">海外株式</option><option value="バランス">バランス</option></select></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">地域・市場</label><select value={activeRegion} onChange={(e)=>setActiveRegion(e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-slate-700"><option value="all">全ての地域</option><option value="japan">日本</option><option value="north-america">北米</option><option value="emerging">新興国</option></select></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">セクター</label><select value={activeSector} onChange={(e)=>setActiveSector(e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm bg-white text-slate-700"><option value="all">全てのセクター</option><option value="technology">テクノロジー</option><option value="healthcare">ヘルスケア</option><option value="finance">金融</option></select></div>
              <div className="pt-2 border-t border-slate-100"><label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium hover:text-green-700"><input type="checkbox" checked={isEsgOnly} onChange={(e)=>setIsEsgOnly(e.target.checked)} className="rounded text-green-600 focus:ring-green-500 w-4 h-4" /><Leaf size={14} className="text-green-500" /> ESG / サステナブル</label></div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 min-w-0">
          <FeaturedFundsAd onFundClick={onFundClick} />
          <div className="flex justify-between items-center px-1"><p className="text-sm text-slate-600"><span className="font-bold text-slate-900">{filteredFunds.length}</span> 件のファンドを表示中</p></div>
          <div className="space-y-0 bg-white border border-slate-200 rounded-b-lg md:rounded-t-none rounded-lg overflow-hidden shadow-sm">
            {filteredFunds.map((fund, idx) => (
              <div key={fund.id} className={`p-4 hover:bg-slate-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${idx !== filteredFunds.length -1 ? 'border-b border-slate-100' : ''}`}>
                <div className="col-span-1 flex justify-center"><input type="checkbox" checked={selectedCompareIds.includes(fund.id)} onChange={() => toggleFundSelection(fund.id)} className="w-5 h-5 cursor-pointer text-blue-600 rounded" /></div>
                <div className="col-span-11 md:col-span-5"><div className="flex items-start gap-2"><div><h4 onClick={() => onFundClick(fund.id)} className="font-bold text-[#F06529] hover:underline cursor-pointer text-base md:text-sm mb-1 line-clamp-2">{fund.name}</h4><p className="text-xs text-slate-500 mb-2 line-clamp-1">{fund.desc}</p><div className="flex flex-wrap gap-1">{fund.tags.map((tag, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{tag}</span>)}</div></div></div></div>
                <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center"><span className="w-8 h-8 flex items-center justify-center rounded bg-[#FFF4C8] text-[#9A7D0A] font-bold text-sm mb-1">{fund.rating}</span><span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">{fund.ratingType}</span></div>
                <div className="col-span-6 md:col-span-1 text-center"><div className="md:hidden text-xs text-slate-400 mb-1">年間リターン</div><div className="font-bold text-green-600 text-base">{fund.return.toFixed(2)}%</div></div>
                <div className="col-span-4 md:col-span-1 text-center"><div className="md:hidden text-xs text-slate-400 mb-1">信託報酬</div><div className="font-bold text-red-500 text-sm">{fund.fee.toFixed(2)}%</div></div>
                <div className="col-span-4 md:col-span-1 text-center"><div className="md:hidden text-xs text-slate-400 mb-1">最低投資額</div><div className="font-bold text-blue-600 text-sm">¥{fund.min.toLocaleString()}</div></div>
                <div className="col-span-12 md:col-span-2 flex justify-end gap-2">
                  <button onClick={() => toggleWatchlist(fund.id)} className={`p-2 rounded hover:bg-slate-200 transition ${myWatchlist.includes(fund.id) ? 'text-red-500' : 'text-slate-400'}`}><Heart size={20} fill={myWatchlist.includes(fund.id) ? "currentColor" : "none"} /></button>
                  <button onClick={() => openAddModal(fund)} className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-1 px-4 py-2 rounded font-bold text-xs shadow-sm transition"><PlusCircle size={16} /> 追加</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedCompareIds.length > 0 && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-6 z-50 animate-fadeIn"><div className="flex items-center gap-2"><CheckSquare size={18} className="text-green-400" /><span className="text-sm font-bold">{selectedCompareIds.length}つのファンドを選択中</span></div><div className="flex items-center gap-2"><button onClick={() => setIsCompareModalOpen(true)} className="bg-orange-500 px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-lg">比較する</button><button onClick={() => setSelectedCompareIds([])} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={18} /></button></div></div>}
      {/* 비교 모달은 여기서 뺍니다. (복잡도 줄이기) */}
      {addModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"><h3 className="font-bold text-lg mb-4">ポートフォリオに追加</h3><p className="text-xs text-slate-500 mb-4 font-bold">{targetFund?.name}</p><div className="space-y-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">投資額 (円)</label><input type="number" value={assetForm.amount} onChange={(e)=>setAssetForm({...assetForm, amount: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="例: 100000" /></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">取得単価</label><input type="number" value={assetForm.buyPrice} onChange={(e)=>setAssetForm({...assetForm, buyPrice: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="基準価額" /></div><div><label className="text-xs font-bold text-slate-500 block mb-1">購入日</label><input type="date" value={assetForm.date} onChange={(e)=>setAssetForm({...assetForm, date: e.target.value})} className="w-full border p-2 rounded text-sm" /></div></div></div><div className="flex gap-3 mt-6"><button onClick={submitPortfolio} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-sm transition-colors">保存</button><button onClick={()=>setAddModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded text-sm transition-colors">キャンセル</button></div></div></div>}
    </div>
  );
};

export default FundPage;