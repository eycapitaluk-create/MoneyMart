// src/data/mockData.js

export const funds = [
  {
    fundCode: "JP90C000xxxx",
    shortCode: "0331xxxx",
    fundName: "ひふみプラス (Hifumi Plus)",
    managementCompany: "レオス・キャピタルワークス",
    category: "Domestic Equity (Active)",
    riskLevel: 4,
    basePrice: 58921,
    prevComparison: 340,
    prevComparisonPercent: 0.58,
    
    // ★ 신규 추가된 데이터 (Quick 기반)
    return1y: 18.52,          // 연간 리턴 (%)
    minInvestment: 100,       // 최저 투자금액 (엔)
    netAssets: "8,500 億円",   // AUM (순자산)
    trustFee: 1.078,          // 신탁보수 (%)

    baseDate: "20260202",
    description: "主として日本の株式に投資します。市場価値が割安と判断される銘柄や、長期的な成長が期待される銘柄を選別して投資するアクティブファンドです。経済情勢の変化に応じて柔軟に現金比率を調整します。",
    aiAnalysis: {
      summary: "最近の日本の中小型成長株の弱含みにもかかわらず、独自の銘柄選定でベンチマークに対して健闘しています。",
      Outlook: "positive",
      keyPoints: [
        "現金比率を15%に拡大し、下落相場への防御力を強化",
        "半導体関連の比率を縮小し、内需消費財の比率を拡大",
        "過去3年のシャープレシオが同カテゴリー上位10%を維持"
      ]
    },
    topHoldings: [
      { name: "TOYOTA MOTOR CORP", weight: 4.2, code: "7203" },
      { name: "SONY GROUP CORP", weight: 3.8, code: "6758" },
      { name: "KEYENCE CORP", weight: 3.1, code: "6861" },
      { name: "MITSUBISHI UFJ FINANCIAL", weight: 2.9, code: "8306" },
      { name: "NINTENDO CO LTD", weight: 2.5, code: "7974" }
    ]
  },
  {
    fundCode: "JP90C000yyyy",
    shortCode: "0331yyyy",
    fundName: "eMAXIS Slim 全世界株式 (All Country)",
    managementCompany: "三菱UFJ国際投信",
    category: "Global Equity (Index)",
    riskLevel: 3,
    basePrice: 24500,
    prevComparison: -120,
    prevComparisonPercent: -0.49,
    
    // ★ 신규 추가된 데이터
    return1y: 22.40,
    minInvestment: 100,
    netAssets: "2兆 1,000 億円",
    trustFee: 0.05775,

    baseDate: "20260202",
    description: "MSCI ACWI(All Country World Index)指数の収益率に連動するように運用されるインデックスファンドです。先進国および新興国を含む全世界の株式市場に幅広く分散投資し、業界最低水準の低コストが特徴です。",
    aiAnalysis: {
      summary: "全世界株式の平均的な動きに追随しています。米国ハイテク株の比率が高いため、最近のNASDAQ調整の影響を受けています。",
      Outlook: "neutral",
      keyPoints: [
        "米国比率約60%で、米国市場の影響力が絶対的",
        "為替ヘッジなしのため、円安進行時に基準価額の上昇効果あり",
        "長期積立投資家にとって最も無難で効率的な選択肢"
      ]
    },
    topHoldings: [
      { name: "APPLE INC", weight: 4.8, code: "AAPL" },
      { name: "MICROSOFT CORP", weight: 4.3, code: "MSFT" },
      { name: "AMAZON.COM INC", weight: 2.1, code: "AMZN" },
      { name: "NVIDIA CORP", weight: 1.9, code: "NVDA" },
      { name: "ALPHABET INC-CL A", weight: 1.6, code: "GOOGL" }
    ]
  },
  {
    fundCode: "JP90C000zzzz",
    shortCode: "0331zzzz",
    fundName: "Alliance Bernstein US Growth",
    managementCompany: "Alliance Bernstein",
    category: "US Equity (Active)",
    riskLevel: 5, 
    basePrice: 12400,
    prevComparison: 150,
    prevComparisonPercent: 1.22,
    
    // ★ 신규 추가된 데이터
    return1y: 35.60,
    minInvestment: 1000,
    netAssets: "1兆 5,000 億円",
    trustFee: 1.5,

    baseDate: "20260202",
    currency: "JPY",
    description: "米国の持続可能な成長潜在力を持つ企業に集中投資します。AI革命をリードするテクノロジー企業を中心にポートフォリオを構築しています。",
    aiAnalysis: {
      summary: "高い成長性が期待できる米国企業に厳選投資。ボラティリティは高いが高いリターンを狙います。",
      Outlook: "positive", 
      keyPoints: [
        "AI関連銘柄への集中投資",
        "金利低下局面でのパフォーマンス改善に期待",
        "アクティブ運用による市場平均超えを目指す"
      ]
    },
    topHoldings: [
        { name: "MICROSOFT CORP", weight: 8.5, code: "MSFT" },
        { name: "AMAZON.COM INC", weight: 7.2, code: "AMZN" },
        { name: "NVIDIA CORP", weight: 6.8, code: "NVDA" },
        { name: "META PLATFORMS INC", weight: 5.4, code: "META" },
        { name: "VISA INC", weight: 4.1, code: "V" }
    ]
  },
  {
    fundCode: "JP90C000aaaa",
    shortCode: "0331aaaa",
    fundName: "Nomura Japan High Dividend 70",
    managementCompany: "Nomura Asset Mgt",
    category: "Domestic Equity (Dividend)",
    riskLevel: 3,
    basePrice: 18200,
    prevComparison: 45,
    prevComparisonPercent: 0.25,
    
    // ★ 신규 추가된 데이터
    return1y: 12.80,
    minInvestment: 1000,
    netAssets: "6,000 億円",
    trustFee: 0.8,

    baseDate: "20260202",
    currency: "JPY",
    description: "日本企業の中で予想配当利回りが高い70銘柄に投資します。安定したインカムゲインの確保と中長期的な信託財産の成長を目指します。",
    aiAnalysis: {
        summary: "安定した配当収入と株価上昇の両立を目指すファンドです。",
        Outlook: "neutral",
        keyPoints: [
          "バリュー株優位の相場で強みを発揮",
          "新NISAの成長投資枠で人気",
          "銀行・商社株の比率が高い"
        ]
    },
    topHoldings: [
      { name: "NIPPON STEEL CORP", weight: 3.5, code: "5401" },
      { name: "MITSUI & CO LTD", weight: 3.2, code: "8031" },
      { name: "HONDA MOTOR CO LTD", weight: 3.0, code: "7267" },
      { name: "MIZUHO FINANCIAL GROUP", weight: 2.8, code: "8411" },
      { name: "TAKEDA PHARMACEUTICAL", weight: 2.5, code: "4502" }
    ]
  }
];

export const marketIndices = [
    { name: "Nikkei 225", value: 36200, change: 1.2 },
    { name: "S&P 500", value: 4950, change: 0.8 },
    { name: "NASDAQ", value: 15600, change: -0.5 },
    { name: "USD/JPY", value: 148.50, change: 0.1 }
];

export const INITIAL_USERS = [
  {
    id: 1,
    email: "user@moneymart.jp",
    password: "password",
    name: "MoneyMart User",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    isAdmin: false
  },
  {
    id: 2,
    email: "admin@moneymart.jp",
    password: "admin",
    name: "Admin",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    isAdmin: true
  }
];