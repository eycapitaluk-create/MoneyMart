export const funds = [
  // 1. 닛케이 225 (국내)
  {
    id: "QF001131",
    fundName: "日経２２５連動型上場投信",
    fundNameEn: "Nikkei 225 ETF (Nomura)",
    fundCode: "01311017",
    shortCode: "1321",
    category: "国内 株式",
    riskLevel: 4,
    annualReturn: "33.11%",
    trustFee: "0.1815%",
    minInvest: 100,
    aum: "142,035 億円",
    basePrice: 39100,
    prevComparison: -450,
    prevComparisonPercent: "-1.14",
    managementCompany: "野村",
    baseDate: "2026/02/05",
    description: "日経平均株価（225銘柄）に連動する運用成果を目指すETFです。日本を代表する企業に分散投資できます。",
    topHoldings: [
        { name: "ファーストリテイリング", code: "9983", weight: "10.8" },
        { name: "東京エレクトロン", code: "8035", weight: "6.4" },
        { name: "ソフトバンクG", code: "9984", weight: "4.2" }
    ],
    aiAnalysis: {
        outlook: "positive",
        summary: "半導体関連の調整はあるものの、円安基調が輸出企業の業績を支え、中長期的な上昇トレンドは継続と予想。",
        keyPoints: ["流動性が高く短期売買に最適", "輸出関連株の比率が高い", "日銀の金融政策決定会合に注目"]
    }
  },
  // 2. TOPIX (국내)
  {
    id: "QF001134",
    fundName: "ＴＯＰＩＸ連動型上場投信",
    fundNameEn: "TOPIX ETF (Nomura)",
    fundCode: "01312017",
    shortCode: "1306",
    category: "国内 株式",
    riskLevel: 3,
    annualReturn: "26.83%",
    trustFee: "0.264%",
    minInvest: 100,
    aum: "301,638 億円",
    basePrice: 2840,
    prevComparison: -15,
    prevComparisonPercent: "-0.53",
    managementCompany: "野村",
    baseDate: "2026/02/05",
    description: "東証株価指数（TOPIX）全体に投資する、国内最大級のETFです。",
    topHoldings: [
        { name: "トヨタ自動車", code: "7203", weight: "4.1" },
        { name: "ソニーグループ", code: "6758", weight: "2.8" },
        { name: "三菱UFJ", code: "8306", weight: "2.3" }
    ],
    aiAnalysis: {
        outlook: "neutral",
        summary: "市場全体への分散効果が高く、長期保有に適しています。",
        keyPoints: ["国内市場全体をカバー", "バリュー株の比率が高い", "安定した分配金利回り"]
    }
  },
  // 3. S&P500 (해외/미국)
  {
    id: "QF009383",
    fundName: "ｅＭＡＸＩＳ Ｓｌｉｍ 米国株Ｓ＆Ｐ５００",
    fundNameEn: "eMAXIS Slim US Equity (S&P500)",
    fundCode: "03311187",
    shortCode: "-",
    category: "海外 株式",
    riskLevel: 5,
    annualReturn: "35.60%",
    trustFee: "0.0938%", // 저비용
    minInvest: 100,
    aum: "101,066 億円",
    basePrice: 28450,
    prevComparison: 150,
    prevComparisonPercent: "0.53",
    managementCompany: "三菱UFJ",
    baseDate: "2026/02/05",
    description: "米国の代表的な株価指数S&P500に連動。業界最低水準のコストで米国市場に投資。",
    topHoldings: [
        { name: "Microsoft", code: "MSFT", weight: "7.1" },
        { name: "Apple", code: "AAPL", weight: "6.8" },
        { name: "NVIDIA", code: "NVDA", weight: "4.5" }
    ],
    aiAnalysis: {
        outlook: "positive",
        summary: "AIブームによるテック企業の成長が指数を牽引。円安効果もあり円ベースでのリターンは好調。",
        keyPoints: ["米国経済の堅調さ", "GAFAMへの集中投資効果", "為替リスクに注意"]
    }
  },
  // 4. 올컨트리 (전세계)
  {
    id: "QF009384",
    fundName: "ｅＭＡＸＩＳ Ｓｌｉｍ 全世界株式（オール・カントリー）",
    fundNameEn: "eMAXIS Slim All Country",
    fundCode: "03311188",
    shortCode: "-",
    category: "全世界 株式",
    riskLevel: 3,
    annualReturn: "22.40%",
    trustFee: "0.0578%", // 초저비용
    minInvest: 100,
    aum: "210,000 億円",
    basePrice: 24500,
    prevComparison: 120,
    prevComparisonPercent: "0.49",
    managementCompany: "三菱UFJ",
    baseDate: "2026/02/05",
    description: "日本を含む先進国および新興国の株式市場の値動きに連動する投資成果を目指します。",
    aiAnalysis: {
        outlook: "positive",
        summary: "これ一本で世界中に分散投資が可能。新NISAで最も選ばれているファンドです。",
        keyPoints: ["究極の分散投資", "信託報酬が極めて低い", "リバランス不要"]
    }
  },
  // 5. TOPIX (iFree - 저비용)
  {
    id: "QF001135",
    fundName: "ｉＦｒｅｅＥＴＦ ＴＯＰＩＸ(年１回決算)",
    fundNameEn: "iFreeETF TOPIX",
    fundCode: "04315017",
    shortCode: "2625",
    category: "国内 株式",
    riskLevel: 3,
    annualReturn: "26.81%",
    trustFee: "0.066%", // 저비용
    minInvest: 100,
    aum: "135,586 億円",
    basePrice: 2835,
    prevComparison: -12,
    prevComparisonPercent: "-0.42",
    managementCompany: "大和",
    baseDate: "2026/02/05",
    description: "低コストでTOPIXに連動する成果を目指すETFです。",
    aiAnalysis: {
        outlook: "neutral",
        summary: "コスト重視の投資家に最適なTOPIX連動型ETFです。",
        keyPoints: ["業界最低水準のコスト", "長期積立に最適", "流動性も十分"]
    }
  },
  // 6. 나스닥 100 (미국)
  {
    id: "QF002222",
    fundName: "ｉＦｒｅｅＮＥＸＴ ＮＡＳＤＡＱ１００インデックス",
    fundNameEn: "iFreeNEXT NASDAQ100",
    fundCode: "04311122",
    shortCode: "-",
    category: "海外 株式",
    riskLevel: 5,
    annualReturn: "42.10%",
    trustFee: "0.495%",
    minInvest: 100,
    aum: "85,000 億円",
    basePrice: 32100,
    prevComparison: 350,
    prevComparisonPercent: "1.10",
    managementCompany: "大和",
    baseDate: "2026/02/05",
    description: "米国のNASDAQ市場に上場する金融銘柄を除く時価総額上位100銘柄に投資します。",
    aiAnalysis: {
        outlook: "positive",
        summary: "ハイテク株比率が高く、ボラティリティは高いものの大きなリターンが期待できます。",
        keyPoints: ["ハイテク集中投資", "高成長企業が多い", "金利動向に敏感"]
    }
  },
  // 7. 일본 고배당
  {
    id: "QF003333",
    fundName: "野村日本高配当株プレミアム",
    fundNameEn: "Nomura Japan High Dividend",
    fundCode: "01319999",
    shortCode: "1577",
    category: "国内 株式",
    riskLevel: 3,
    annualReturn: "12.80%",
    trustFee: "0.80%",
    minInvest: 1000,
    aum: "6,000 億円",
    basePrice: 18200,
    prevComparison: 45,
    prevComparisonPercent: "0.25",
    managementCompany: "野村",
    baseDate: "2026/02/05",
    description: "予想配当利回りが市場平均と比較して高い銘柄を選定して投資します。",
    aiAnalysis: {
        outlook: "neutral",
        summary: "インカムゲイン（配当）狙いの投資家に人気です。",
        keyPoints: ["安定した配当収入", "割安株が多い", "下落局面に強い"]
    }
  },
  // 8. 글로벌 리츠
  {
    id: "QF004444",
    fundName: "ピクテ・グローバル・インカム",
    fundNameEn: "Pictet Global Income",
    fundCode: "05318888",
    shortCode: "-",
    category: "海外 債券・REIT",
    riskLevel: 2,
    annualReturn: "5.20%",
    trustFee: "1.25%",
    minInvest: 1000,
    aum: "9,200 億円",
    basePrice: 3200,
    prevComparison: 10,
    prevComparisonPercent: "0.31",
    managementCompany: "ピクテ",
    baseDate: "2026/02/05",
    description: "世界の高配当公益株に投資し、安定した配当収入の確保を目指します。",
    aiAnalysis: {
        outlook: "neutral",
        summary: "株式市場との相関が低く、ポートフォリオの分散役として機能します。",
        keyPoints: ["高い分配金", "ディフェンシブ性", "インフレヘッジ"]
    }
  },
  // 9. 인도 주식
  {
    id: "QF005555",
    fundName: "iTrustインド株式",
    fundNameEn: "iTrust India Equity",
    fundCode: "05317777",
    shortCode: "-",
    category: "海外 株式",
    riskLevel: 5,
    annualReturn: "18.50%",
    trustFee: "0.98%",
    minInvest: 100,
    aum: "1,200 億円",
    basePrice: 15400,
    prevComparison: -100,
    prevComparisonPercent: "-0.65",
    managementCompany: "ピクテ",
    baseDate: "2026/02/05",
    description: "高い経済成長が続くインド企業の株式に投資します。",
    aiAnalysis: {
        outlook: "positive",
        summary: "ポストチャイナとして注目されるインド市場の高い成長力を享受できます。",
        keyPoints: ["人口ボーナス", "インフラ整備の進展", "高ボラティリティ"]
    }
  },
  // 10. 일본 반도체
  {
    id: "QF006666",
    fundName: "グローバルＸ 半導体関連-日本株式 ETF",
    fundNameEn: "Global X Japan Semi ETF",
    fundCode: "06316666",
    shortCode: "2644",
    category: "国内 株式",
    riskLevel: 5,
    annualReturn: "45.20%",
    trustFee: "0.649%",
    minInvest: 100,
    aum: "500 億円",
    basePrice: 4100,
    prevComparison: 120,
    prevComparisonPercent: "3.01",
    managementCompany: "GlobalX",
    baseDate: "2026/02/05",
    description: "日本の半導体製造装置・素材メーカーに集中投資するETFです。",
    aiAnalysis: {
        outlook: "positive",
        summary: "世界的な半導体需要の増加に伴い、日本の製造装置メーカーの受注残高は高水準です。",
        keyPoints: ["高い技術力", "シリコンサイクルの影響", "テーマ型投資"]
    }
  }
];