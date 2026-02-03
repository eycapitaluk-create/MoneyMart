import { 
  ShoppingCart, Plane, Utensils, Home as HomeIcon, Music, Shield, 
  Globe, TrendingUp, Coins, RefreshCw, DollarSign, PiggyBank, Users, 
  CreditCard, CheckCircle, Heart
} from 'lucide-react';

// --- 👥 가상 가입자 데이터 ---
export const INITIAL_USERS = [
  { id: 1, name: '山田 花子', email: 'hanako@example.jp', joinDate: '2025/12/10', plan: 'free', status: 'active', provider: 'google', riskProfile: '安定型' },
];

// --- 🌟 통합 금융 상품 데이터 ---
export const FINANCIAL_PRODUCTS = {
  card: [
    { id: 'c1', name: '楽天カード', company: '楽天カード', rate: 1.0, annualFee: 0, annualFeeText: '永年無料', badge: '人気No.1', color: 'bg-red-500', points: '楽天ポイント', bonus: 8000, tags: ['年会費無料', '高還元', 'ショッピング'], brand: ['visa', 'master', 'jcb'], features: ['楽天市場でポイント3倍', '年会費永年無料', '海外旅行保険利用付帯'], desc: '楽天市場での利用でポイント3倍。年会費はずっと無料。', url: '#' },
    { id: 'c2', name: '三井住友カード (NL)', company: '三井住友カード', rate: 0.5, annualFee: 0, annualFeeText: '永年無料', badge: '定番', color: 'bg-green-600', points: 'Vポイント', bonus: 6000, tags: ['コンビニ特化', 'ナンバーレス', '年会費無料'], brand: ['visa', 'master'], features: ['対象のコンビニ・飲食店で最大7%', 'ナンバーレスで安心', '最短10秒発行'], desc: '対象のコンビニ・飲食店で最大7%還元。番号が印字されない安全設計。', url: '#' },
    { id: 'c3', name: 'JCB CARD W', company: 'JCB', rate: 1.0, annualFee: 0, annualFeeText: '39歳以下無料', badge: '若年層', color: 'bg-blue-600', points: 'Oki Doki', bonus: 13000, tags: ['39歳以下限定', 'Amazon優遇', 'ポイントアップ'], brand: ['jcb'], features: ['Amazon・スタバで高還元', '39歳以下限定・年会費無料', 'ポイント常に2倍'], desc: '39歳以下限定、ポイント常に2倍。Amazonやスタバでさらにお得。', url: '#' },
    { id: 'c4', name: 'dカード GOLD', company: 'NTTドコモ', rate: 1.0, annualFee: 11000, annualFeeText: '11,000円', badge: 'ドコモ', color: 'bg-yellow-500', points: 'dポイント', bonus: 11000, tags: ['携帯料金還元', 'ゴールド', '空港ラウンジ'], brand: ['visa', 'master'], features: ['ドコモ利用料金10%還元', 'ケータイ補償3年間', '国内空港ラウンジ無料'], desc: 'ドコモユーザー必携。毎月の携帯料金の10%がポイント還元されます。', url: '#' },
  ],
  insurance: [
    { id: 'i1', name: 'ニッセイ みらいのカタチ', company: '日本生命', monthly: 15000, type: '終身保険', rating: 4.8, badge: '人気', coverage: '500万円', period: '終身', tags: ['終身保障', '配当金あり', '大手'], features: ['一生涯の死亡保障', '将来の資金ニーズに対応', '配当金による受取増'] },
    { id: 'i2', name: 'しあわせ物語', company: '第一生命', monthly: 18000, type: '個人年金', rating: 4.7, badge: '定番', coverage: '800万円', period: '60歳まで', tags: ['老後資金', '税制優遇', '円建て'], features: ['公的年金の不足を補う', '個人年金保険料控除の対象', '安定した資産形成'] },
    { id: 'i3', name: 'ドルスマートS', company: 'メットライフ生命', monthly: 22000, type: '外貨建', rating: 4.7, badge: '高金利', coverage: '1200万円', period: '10年', tags: ['外貨建て', '高利回り', '積立'], features: ['米ドルでの運用で高金利', '積立利率最低保証あり', '為替リスクあり'] },
  ],
  mortgage: [ 
    { id: 'm1', bank: '住信SBIネット銀行', name: 'ネット専用住宅ローン', rate: 0.320, type: 'variable', typeText: '変動金利', badge: '最低金利', payment: '¥75,513', fees: 2.2, groupLife: '無料', tags: ['ネット銀行', '低金利', '全疾病保障'], features: ['業界最低水準の金利', '全疾病保障が無料付帯', '保証料0円'], desc: '業界最低水準の金利。全疾病保障が無料で付帯。', url: '#' },
    { id: 'm2', bank: 'auじぶん銀行', name: '住宅ローン', rate: 0.319, type: 'variable', typeText: '変動金利', badge: '人気No.1', payment: '¥75,500', fees: 2.2, groupLife: '無料', tags: ['モバイル優遇', 'がん団信', 'ネット完結'], features: ['au回線利用で金利引下げ', 'がん50%保障団信無料', '印紙代0円'], desc: 'au回線利用で金利優遇あり。がん50%保障団信이無料。', url: '#' },
    { id: 'm3', bank: 'フラット35 (ARUHI)', name: 'ARUHI フラット35', rate: 1.820, type: 'fixed', typeText: '固定金利', badge: '安心', payment: '¥96,000', fees: 1.1, groupLife: '別枠', tags: ['固定金利', '自営業', '全国対応'], features: ['ずっと金利が変わらない', '自営業・転職直後も審査可', '全国店舗で相談可能'], desc: 'ずっと金利が変わらない安心感。自営業の方에도 추천。', url: '#' },
  ],
  bank: [
    { id: 'b1', bank: 'SBI新生銀行', name: 'パワーフレックス円定期', rate: 0.35, min: 10000, type: 'deposit', tags: ['高金利', 'ネット完結', 'キャンペーン'], badge: '注目', features: ['スタートアップ定期預金が高金利', 'ATM出金手数料無料(条件有)', 'Tポイント等が貯まる'], company: 'SBI新生銀行', desc: 'ネット完結で高金利。半年もの特別金利キャンペーン実施中。' },
    { id: 'b2', bank: '楽天銀行', name: 'マネーブリッジ普通預金', rate: 0.10, min: 1, type: 'deposit', tags: ['ポイント連携', 'ネット銀行', '証券連携'], badge: '人気', features: ['楽天証券連携で金利5倍', '楽天ポイント이貯まる・使える', 'ATM手数料最大7回無料'], company: '楽天銀行', desc: '楽天証券口座との連携で普通預金金利이優遇됩니다。' },
    { id: 'b3', bank: 'あおぞら銀行', name: 'BANK The 定期', rate: 0.25, min: 1000, type: 'deposit', tags: ['業界最高水準', '店舗なし', '普通預金'], badge: '高金利', features: ['普通預金でも高金利', 'ゆうちょATM手数料無料', 'アプリ이使いやすい'], company: 'あおぞら銀行', desc: '店舗を持たないネット支店ならではの好金利を提供。' },
    { id: 'l1', bank: '三菱UFJ銀行', name: 'バンクイック', rate: 1.4, max: 500, type: 'loan', tags: ['メガバンク', 'ATM無料', '即日'], badge: '大手', features: ['テレビ窓口でカード受取可能', '提携ATM手数料無料', '最短即日融資回答'], company: '三菱UFJ銀行', desc: 'テレビ窓口でカード受取可能。ATM手数料も無料。' },
    { id: 'l2', bank: 'PayPay銀行', name: 'カードローン', rate: 1.59, max: 1000, type: 'loan', tags: ['スマホ完結', '初回無利息', '24時間'], badge: '注目', features: ['初回借入30日間無利息', '24時間365日スマホで申込', '郵送物なし'], company: 'PayPay銀行', desc: '初回30日間無利息。スマホひとつで完結する便利さ。' },
  ]
};

// --- 🛠️ 펀드 데이터 ---
export const FUNDS_DATA = [
  { id: 1, name: '日本株式インデックスファンド', desc: 'TOPIX連動型の日本株式インデックス。国内株式市場全体の動きを捉えることを目指します。', tags: ['国内', 'インデックス', '低コスト', '初心者向け'], rating: 'M', ratingType: '国内', ratingSub: 'インデックス', return: 6.80, fee: 0.15, min: 100, aum: '2,800億円', category: '国内株式', region: 'japan', esg: false, sector: 'general', launchDate: '2015/03/12', company: 'マネーマート・アセット', riskLevel: 3, benchmark: 'TOPIX' },
  { id: 2, name: '楽天・インデックス・バランス・ファンド（均等型）', desc: '国内外の株式・債券に均等配分。', tags: ['バランス', '初心者向け', '積立向き'], rating: 'M', ratingType: 'バランス', ratingSub: '初心者向け', return: 5.80, fee: 0.24, min: 100, aum: '3,700億円', category: 'バランス', region: 'global', esg: false, sector: 'general', launchDate: '2018/07/20', company: '楽天投信投資顧問', riskLevel: 2, benchmark: '複合ベンチマーク' },
  { id: 3, name: 'eMAXIS Slim 全世界株式（オール・カントリー）', desc: 'これ1本で世界中の株式に分散投資。', tags: ['海外', '人気No.1', '低コスト'], rating: 'H', ratingType: '海外', ratingSub: '人気', return: 18.50, fee: 0.11, min: 100, aum: '1兆円超', category: '海外株式', region: 'global', esg: false, sector: 'general', launchDate: '2018/10/31', company: '三菱UFJ国際投信', riskLevel: 4, benchmark: 'MSCI ACWI' },
  { id: 5, name: 'SBI・V・S&P500インデックス・ファンド', desc: '米国の代表的な株価指数であるS&P500指数に連動。', tags: ['米国', 'インデックス', '高成長'], rating: 'H', ratingType: '米国', ratingSub: '成長', return: 22.30, fee: 0.09, min: 100, aum: '1.2兆円', category: '海外株式', region: 'north-america', esg: false, sector: 'general', launchDate: '2019/09/26', company: 'SBIアセットマネジメント', riskLevel: 4, benchmark: 'S&P500' },
  { id: 7, name: 'iFreeNEXT FANG+インデックス', desc: '米国の巨大テック企業に集中投資。', tags: ['テクノロジー', 'ハイリスク', '集中投資'], rating: 'VH', ratingType: '米国', ratingSub: 'テック', return: 45.80, fee: 0.77, min: 1000, aum: '1,800億円', category: '海外株式', region: 'north-america', esg: false, sector: 'technology', launchDate: '2018/01/31', company: '大和アセット', riskLevel: 5, benchmark: 'NYSE FANG+' },
  { id: 11, name: 'グローバルESGハイクオリティ成長株式ファンド', desc: '世界中のESG関連企業に厳選投資。', tags: ['ESG', 'アクティブ', '環境'], rating: 'H', ratingType: 'ESG', ratingSub: '成長', return: 14.20, fee: 1.58, min: 1000, aum: '9,500億円', category: '海外株式', region: 'global', esg: true, sector: 'general', launchDate: '2020/07/20', company: 'みずほ投信', riskLevel: 4, benchmark: 'MSCI ACWI' },
  { id: 10, name: '野村インド株投資', desc: '高い経済成長가 기대되는 인도 기업의 주식에 투자.', tags: ['新興国', 'インド', '高成長'], rating: 'VH', ratingType: '新興国', ratingSub: 'インド', return: 15.60, fee: 1.98, min: 1000, aum: '4,500億円', category: '海外株式', region: 'emerging', esg: false, sector: 'general', launchDate: '2008/10/25', company: '野村アセット', riskLevel: 5, benchmark: 'MSCI India' },
];

export const SECTOR_DATA_BY_PERIOD = {
  '6ヶ月': [
    { name: 'テクノロジー', icon: '💻', change: '+15.2%', isUp: true },
    { name: 'ヘルスケア', icon: '🧬', change: '+5.3%', isUp: true },
    { name: '金融', icon: '🏦', change: '+8.1%', isUp: true },
    { name: 'エネルギー', icon: '⚡', change: '-2.4%', isUp: false },
  ],
  '12ヶ月': [
    { name: 'テクノロジー', icon: '💻', change: '+28.5%', isUp: true },
    { name: 'ヘルスケア', icon: '🧬', change: '+12.3%', isUp: true },
    { name: '金融', icon: '🏦', change: '+18.7%', isUp: true },
    { name: 'エネルギー', icon: '⚡', change: '+22.1%', isUp: true },
  ]
};

export const FILTERS_CONFIG = {
  card: {
    dropdowns: [
      { key: 'annualFee', label: '年会費', options: ['すべて', '無料', '条件付き無料', '有料'] },
      { key: 'brand', label: '国際ブランド', options: ['すべて', 'Visa', 'Mastercard', 'JCB', 'Amex'] },
    ],
    checkboxes: [
      { key: 'shopping', label: 'ショッピング', icon: ShoppingCart },
      { key: 'travel', label: 'トラベル', icon: Plane },
      { key: 'food', label: 'グルメ・飲食', icon: Utensils },
      { key: 'convenience', label: 'コンビニ', icon: HomeIcon },
      { key: 'entertainment', label: 'エンターテイメント', icon: Music },
      { key: 'insurance', label: '保険付帯', icon: Shield },
    ]
  },
  bank: {
    dropdowns: [
      { key: 'type', label: '商品タイプ', options: ['すべて', '普通預金', '定期預金', 'カードローン'] },
      { key: 'bankType', label: '銀行タイプ', options: ['すべて', '都市銀行', 'ネット銀行', '地方銀行'] },
    ],
    checkboxes: [
      { key: 'atm_free', label: 'ATM手数料優遇', icon: CreditCard },
      { key: 'net_banking', label: 'ネット完結', icon: Globe },
      { key: 'high_rate', label: '高金利', icon: TrendingUp },
      { key: 'points', label: 'ポイント連携', icon: Coins },
      { key: '24h', label: '24時間取引', icon: RefreshCw },
    ]
  },
  insurance: {
    dropdowns: [
      { key: 'category', label: '保険種類', options: ['すべて', '生命保険', '医療保険', 'がん保険', '学資保険'] },
      { key: 'payment', label: '払込期間', options: ['すべて', '終身', '定期', '短期払い'] },
    ],
    checkboxes: [
      { key: 'net_apply', label: 'ネット申込可', icon: Globe },
      { key: 'cheap', label: '保険料割安', icon: DollarSign },
      { key: 'return', label: '解約返戻金あり', icon: PiggyBank },
      { key: 'consult', label: '対面相談可', icon: Users },
    ]
  },
  mortgage: {
    dropdowns: [
      { key: 'rate_type', label: '金利タイプ', options: ['すべて', '変動金利', '固定金利', 'フラット35'] },
    ],
    checkboxes: [
      { key: 'low_rate', label: '金利重視', icon: TrendingUp },
      { key: 'fee_free', label: '保証料0円', icon: CheckCircle },
      { key: 'disease', label: '疾病保障充実', icon: Heart },
      { key: 'online', label: 'ネット完結', icon: Globe },
    ]
  }
};