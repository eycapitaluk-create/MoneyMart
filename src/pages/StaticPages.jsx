import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, FileText, Shield, ArrowLeft, CheckCircle, Target, Globe, Heart,
  Zap, Award, Lock, FileKey, Server, Eye, Sparkles, HelpCircle, Activity, 
  ChevronRight, MessageCircle, Plus, Minus
} from 'lucide-react';

// --- 공통 레이아웃 컴포넌트 ---
const StaticLayout = ({ title, icon: Icon, children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 animate-fadeIn">
      {/* 헤더 영역 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-slate-500 hover:text-orange-500 font-bold transition mr-4"
          >
            <ArrowLeft size={20} className="mr-1"/> 戻る
          </button>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Icon className="text-orange-500" size={20}/>
            {title}
          </h1>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 1. 회사 소개 (AboutPage) ---
export const AboutPage = () => {
  return (
    <StaticLayout title="運営会社" icon={Building2}>
      <div className="text-center mb-16">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-black border border-blue-100 shadow-sm">
            <Shield size={16} className="fill-blue-100" /> 100% 独立・中立
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-black border border-orange-100 shadow-sm">
            <Sparkles size={16} className="fill-orange-100" /> AI搭載プラットフォーム
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
          金融情報の透明性を、<br className="md:hidden"/>あなたの手に
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
          MoneyMartは、中立的な立場から最適な金融商品を比較できる<br className="hidden md:block"/>
          次世代のプラットフォームです。<br/>
          すべての人が自信を持って資産形成を行えるよう支援します。
        </p>
      </div>

      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Target className="text-orange-500" size={28}/>
          <h3 className="text-2xl font-bold text-slate-900 m-0">私たちのミッション</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "個人のリスク許容度に合わせた、客観的でパーソナライズされた投資提案",
            "市場全体の金融情報を、中立的な立場で透明性高く比較",
            "包括的な金融教育とツールで、ユーザのリテラシー向上をサポート",
            "ユーザーの経済的な豊かさを最優先する、信頼できるプラットフォームの構築"
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-orange-50/50 rounded-2xl border border-orange-100 hover:border-orange-200 transition">
              <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={20}/>
              <p className="text-sm text-slate-700 font-bold leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16 bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="text-center mb-10 relative z-10">
          <h3 className="text-2xl font-bold mb-2 text-white">コアバリュー</h3>
          <p className="text-slate-400 text-sm">私たちのすべての行動を導く原則</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          <div className="p-5 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:bg-slate-750 transition">
            <div className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-lg"><Shield size={20}/> 信頼 (Trust)</div>
            <p className="text-sm text-slate-300 leading-relaxed">透明性の高い情報提供を通じ、長期的な信頼関係を築く</p>
          </div>
          <div className="p-5 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:bg-slate-750 transition">
            <div className="text-yellow-400 font-bold mb-2 flex items-center gap-2 text-lg"><Zap size={20}/> 革新 (Innovation)</div>
            <p className="text-sm text-slate-300 leading-relaxed">最先端技術を活用し、金融サービスの体験を進化させる</p>
          </div>
          <div className="p-5 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:bg-slate-750 transition">
            <div className="text-green-400 font-bold mb-2 flex items-center gap-2 text-lg"><Heart size={20}/> ユーザー第一</div>
            <p className="text-sm text-slate-300 leading-relaxed">すべての意思決定において、ユーザーの利益を最優先する</p>
          </div>
          <div className="p-5 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:bg-slate-750 transition">
            <div className="text-purple-400 font-bold mb-2 flex items-center gap-2 text-lg"><Award size={20}/> 卓越性 (Excellence)</div>
            <p className="text-sm text-slate-300 leading-relaxed">最高品質のサービスとデータ精度への妥協なきコミットメント</p>
          </div>
        </div>
      </div>

      <div className="mb-16 px-2">
        <h3 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-orange-500 pl-4">創業の想い</h3>
        <div className="prose prose-slate text-sm leading-8 text-slate-600">
          <p className="mb-6">
            MoneyLabは、日本における金融アドバイスへのアクセスを民主化するという明確なミッションのもとに設立されました。
            誰もがシンプルに、手頃な価格で、プロフェッショナルな金融支援を受けられる社会を目指しています。
          </p>
          <p>
            創業チームは、グローバル金融機関とテクノロジー企業での数十年にわたる経験を結集。
            国際金融市場の深い専門知識と、革新的なテクノロジーソリューションを融合させています。
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6">会社概要</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="border-b border-slate-200/50 pb-4">
            <dt className="text-xs font-bold text-slate-400 mb-1">会社名</dt>
            <dd className="text-base font-bold text-slate-900">株式会社 MoneyLab</dd>
          </div>
          <div className="border-b border-slate-200/50 pb-4">
            <dt className="text-xs font-bold text-slate-400 mb-1">代表者</dt>
            <dd className="text-base font-bold text-slate-900">代表取締役 Justin Nam</dd>
          </div>
          <div className="border-b border-slate-200/50 pb-4">
            <dt className="text-xs font-bold text-slate-400 mb-1">所在地</dt>
            <dd className="text-base font-bold text-slate-900">東京都港区六本木 1-4-5 アークヒルズサウスタワー</dd>
          </div>
          <div className="border-b border-slate-200/50 pb-4">
            <dt className="text-xs font-bold text-slate-400 mb-1">設立</dt>
            <dd className="text-base font-bold text-slate-900">2025年 12月</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-bold text-slate-400 mb-1">事業内容</dt>
            <dd className="text-base font-bold text-slate-900">金融商品比較プラットフォーム「MoneyMart」の企画・開発・運営</dd>
          </div>
        </dl>
      </div>
    </StaticLayout>
  );
};

// --- 2. 이용약관 (TermsPage) ---
export const TermsPage = () => {
  return (
    <StaticLayout title="利用規約" icon={FileText}>
      <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">第1条（規約への同意）</h2>
          <p>MoneyLab Ltd.（以下「当社」）が運営するMoneyMartプラットフォーム（以下「本サービス」）にアクセスまたは使用することにより、お客様は本利用規約に同意したものとみなされます。</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">第2条（サービスの内容）</h2>
          <ul className="list-disc pl-5 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <li>金融商品比較ツール（投資信託、クレジットカード、保険など）</li>
            <li>ポートフォリオ管理・追跡ツール</li>
            <li>金融教育コンテンツおよびリソース</li>
            <li>リスク評価・分析ツール</li>
          </ul>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-xs font-bold">
            ⚠️ 重要: MoneyMartは情報提供のみを目的としたプラットフォームです。投資助言、資産運用、または金融取引の執行は行いません。
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">第3条（禁止事項）</h2>
          <p>違法な目的での使用、システムへの不正アクセス、運営の妨害、データのスクレイピング等は禁止されています。</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">第4条（免責事項）</h2>
          <p>本プラットフォームは「現状有姿」で提供され、情報の正確性や完全性を保証するものではありません。</p>
        </div>
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-400">
          <p>最終更新日: 2025年12月</p>
        </div>
      </div>
    </StaticLayout>
  );
};

// --- 3. 개인정보 처리방침 (PrivacyPage) ---
export const PrivacyPage = () => {
  return (
    <StaticLayout title="プライバシーポリシー" icon={Shield}>
      <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">1. 個人情報の収集と利用</h2>
          <p>当社は、サービスの提供、本人確認、重要なお知らせの送信などのために、必要な範囲で個人情報を収集・利用します。</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">2. 安全管理措置</h2>
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle className="text-green-600 shrink-0" size={20}/>
            <p className="text-green-800 text-xs font-bold leading-relaxed">
              当社は、個人情報の正確性及び安全性確保のために、セキュリティに万全の対策を講じています。すべての通信はSSL/TLS技術により暗号化されています。
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-400">
          <p>お問い合わせ窓口: legal@moneymart.jp</p>
          <p>最終更新日: 2025年12月</p>
        </div>
      </div>
    </StaticLayout>
  );
};

// --- 4. 보안 선언 (SecurityPage) ---
export const SecurityPage = () => {
  return (
    <StaticLayout title="セキュリティ宣言" icon={Lock}>
      <div className="space-y-10 text-slate-700 leading-relaxed text-sm">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">お客様の資産と情報を守るために</h3>
          <p className="text-blue-800">
            MoneyMartは、「セキュリティ・ファースト」を掲げ、全社を挙げて情報保護に取り組むことを宣言します。
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileKey className="text-orange-500" size={20}/> 1. 通信・データの暗号化</h2>
          <p>すべての通信はSSL/TLS暗号化通信によって保護されています。</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Server className="text-orange-500" size={20}/> 2. 厳格なアクセス管理</h2>
          <p>個人情報へのアクセスは、権限を持つ一部の従業員のみに限定され、常時監視されています。</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Eye className="text-orange-500" size={20}/> 3. 24시간 감시 체제</h2>
          <p>外部からのサイバー攻撃を常時監視し、異常を即座に検知・遮断します。</p>
        </div>
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-400">
          <p>情報セキュリティ管理責任者: CTO</p>
        </div>
      </div>
    </StaticLayout>
  );
};

// --- 5. 헬프 센터 (HelpPage) - FAQ 기능 강화 ---
export const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "アカウント・ログイン",
      items: [
        { q: "パスワードを忘れました。再発行できますか？", a: "はい、ログイン画面の「パスワードをお忘れの方」リンクから、登録メールアドレスを入力して再設定手続きを行ってください。" },
        { q: "メールアドレスを変更したいです。", a: "マイページの「設定」＞「アカウント情報」から変更可能です。変更後は確認メールが送信されますので、承認を行ってください。" },
      ]
    },
    {
      category: "プレミアムプラン",
      items: [
        { q: "プレミアムプランの解約方法は？", a: "マイページの「プラン管理」からいつでも解約可能です。解約後も、次回の更新日まではプレミアム機能をご利用いただけます。" },
        { q: "無料プランとプレミアムの違いは？", a: "プレミアムプランでは、広告非表示、無制限のポートフォリオ登録、AIによる資産分析レポート、高度なシミュレーション機能などが利用可能です。" },
      ]
    },
    {
      category: "機能・データ連携",
      items: [
        { q: "銀行や証券口座との連携は安全ですか？", a: "はい、MoneyMartは金融機関レベルのセキュリティ基準（FISC準拠）を満たしており、API連携により参照権限のみを使用します。送金や取引の権限はお預かりしません。" },
        { q: "連携したデータが更新されません。", a: "金融機関によってはデータの反映に時間がかかる場合があります。マイページの「データ更新」ボタンを押して手動更新をお試しください。" },
      ]
    }
  ];

  return (
    <StaticLayout title="ヘルプセンター" icon={HelpCircle}>
      <div className="space-y-12">
        <div className="bg-orange-50 p-8 rounded-[2rem] text-center border border-orange-100">
          <h3 className="text-xl font-black text-slate-900 mb-2">よくあるご質問</h3>
          <p className="text-slate-600 font-medium">
            お客様から多く寄せられる質問をまとめました。<br className="hidden md:block"/>
            解決しない場合は、画面右下のチャットボットへお問い合わせください。
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((section, sIdx) => (
            <div key={sIdx}>
              <h4 className="text-sm font-bold text-slate-400 mb-4 ml-2 uppercase tracking-wider">
                {section.category}
              </h4>
              <div className="space-y-3">
                {section.items.map((item, i) => {
                  const key = `${sIdx}-${i}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={key} className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100 bg-white hover:border-orange-200'}`}>
                      <button 
                        onClick={() => toggleFAQ(key)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className={`font-bold text-sm ${isOpen ? 'text-orange-600' : 'text-slate-700'}`}>
                          {item.q}
                        </span>
                        {isOpen ? <Minus size={18} className="text-orange-500 shrink-0"/> : <Plus size={18} className="text-slate-300 shrink-0"/>}
                      </button>
                      
                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-dashed border-orange-100/50 mt-2">
                            <div className="pt-3">{item.a}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-900 rounded-[2rem] text-center text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-30"></div>
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                <MessageCircle className="text-orange-400" size={32}/>
             </div>
             <h3 className="text-2xl font-bold mb-3">まだ解決しませんか？</h3>
             <p className="text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
               AIチャットボットが24時間365日サポートします。<br/>
               「お問い合わせ」や「バグ報告」もチャットから可能です。
             </p>
             <button 
                onClick={() => document.getElementById('chatbot-toggle')?.click()} 
                className="bg-white text-slate-900 font-bold py-4 px-10 rounded-xl hover:bg-orange-50 transition shadow-lg hover:scale-105 active:scale-95"
             >
               チャットで質問する
             </button>
           </div>
        </div>
      </div>
    </StaticLayout>
  );
};

// --- 6. 시스템 가동 현황 (StatusPage) ---
export const StatusPage = () => {
  return (
    <StaticLayout title="システム稼働状況" icon={Activity}>
      <div className="space-y-8">
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4">
          <div className="relative">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full absolute top-0 left-0 opacity-50 animate-ping"></div>
          </div>
          <div>
            <h3 className="font-black text-green-800 text-lg">全システム正常稼働中</h3>
            <p className="text-xs text-green-700 font-bold">All Systems Operational</p>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm mb-2">サービス別ステータス</h4>
          {["Web Application", "Database API", "OpenAPI Link", "Notification System"].map((service, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">{service}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                <CheckCircle size={12}/> 稼働中
              </span>
            </div>
          ))}
        </div>
        <div className="pt-4 text-center text-xs text-slate-400">最終更新: たった今</div>
      </div>
    </StaticLayout>
  );
};