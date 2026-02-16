import React, { useState, useRef, useEffect } from 'react';
import { Target, Heart, Scale, Feather, ArrowRight, RotateCcw, ArrowLeft, Users, AlertTriangle, Sparkles, Share2, ExternalLink, BookOpen, Info, Shield, X } from 'lucide-react';
import html2canvas from 'html2canvas';

// -----------------------------------------------------------------------------
// Google AdSense Component
// -----------------------------------------------------------------------------
// 注意: AdSenseの審査が通った後、広告ユニットを作成してslot IDを設定してください
// AdSenseダッシュボード → 広告 → 広告ユニット → 新しい広告ユニットを作成
// 作成後、各AdSenseUnitコンポーネントのslotプロパティにslot IDを設定してください
const AdSenseUnit = ({ slot, format = 'auto', className = '' }) => {
  useEffect(() => {
    try {
      if (slot) {
        // slot IDが設定されている場合のみ広告を表示
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [slot]);

  // slot IDが設定されていない場合は何も表示しない（審査中など）
  if (!slot) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9384193584221337"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// Data & Logic Definitions
// -----------------------------------------------------------------------------

const questions = [
  {
    id: 1,
    text: "レストランで注文した料理と違うものが運ばれてきた。その瞬間、どう思う？",
    axis: "y",
    options: [
      {
        label: "「あ、店員さんが間違えたな」と、まずは相手や店のミスだと思う",
        value: 1, // 外向（他責・環境要因）
      },
      {
        label: "「あれ、自分が頼み間違えたかな？」と、まずは自分の記憶や注文内容を疑う",
        value: -1, // 内向（自責・内部要因）
      },
    ],
  },
  {
    id: 2,
    text: "家電やガジェットを買うとき、最終的な決め手になるのは？",
    axis: "x",
    options: [
      {
        label: "「スペック」「価格」「コスパ」「機能」などの数値的・実用的なメリット",
        value: -1, // 具体（数値・機能）
      },
      {
        label: "「デザイン」「ブランドのストーリー」「持っていて気分が上がるか」などの感覚的な魅力",
        value: 1, // 抽象（感性・意味）
      },
    ],
  },
  {
    id: 3,
    text: "大勢の飲み会やパーティに参加中。あなたの振る舞いはどっちに近い？",
    axis: "y",
    options: [
      {
        label: "みんなの中心で話を回したり、盛り上げ役を買って出たり、積極的に動く",
        value: 1, // 外向（発散）
      },
      {
        label: "端の席で気の合う人とだけ話すか、人間観察をしながら料理を食べている",
        value: -1, // 内向（収束）
      },
    ],
  },
  {
    id: 4,
    text: "友達の相談に乗っているとき、内心こう思ってしまうのはどっち？",
    axis: "x",
    options: [
      {
        label: "「で、結局どうしたいの？」「結論から言ってほしい」と、解決策を急ぎたくなる",
        value: -1, // 具体（解決・結論）
      },
      {
        label: "「大変だったね」「気持ちわかるよ」と、共感したり感情を共有したりする時間が大事",
        value: 1, // 抽象（共感・プロセス）
      },
    ],
  },
  {
    id: 5,
    text: "ダイエットや勉強など、目標を達成するためにやる気が出るのは？",
    axis: "mix", // 複合的な質問
    options: [
      {
        label: "「誰かに褒められたい」「見返したい」「ライバルに勝ちたい」という対人動機",
        valueY: 1.5, // 外向強め
        valueX: 0,
      },
      {
        label: "「自分が納得したい」「理想の自分に近づきたい」「知識欲を満たしたい」という自己完結動機",
        valueY: -1.5, // 内向強め
        valueX: 0,
      },
    ],
  },
  {
    id: 6,
    text: "映画や漫画の感想で、あなたが重視するのは？",
    axis: "x",
    options: [
      {
        label: "「伏線の回収が見事」「設定に矛盾がない」「リアリティがある」などの構造的な完成度",
        value: -1, // 具体（構造・ロジック）
      },
      {
        label: "「主人公の生き様に泣けた」「テーマが深い」「胸が熱くなった」などの情緒的な感動",
        value: 1, // 抽象（物語・エモーション）
      },
    ],
  },
  {
    id: 7,
    text: "どうしても許せないのはどっち？",
    axis: "mix",
    options: [
      {
        label: "「無能扱いされること」や「無視されること」。自分の存在価値を否定されるのが一番辛い。",
        valueY: 1.0, // 外向寄り
        valueX: -0.5, // やや具体寄り（評価・実利）
      },
      {
        label: "「自由を奪われること」や「嘘をつかされること」。自分の信念やペースを乱されるのが一番辛い。",
        valueY: -1.0, // 内向寄り
        valueX: 0.5, // やや抽象寄り（真実・自由）
      },
    ],
  },
  {
    id: 8,
    text: "最後に究極の選択。人生において欲しいのは？",
    axis: "mix",
    options: [
      {
        label: "社会的成功、勝利、名声、みんなからの愛",
        valueY: 1.0,
        valueX: 0,
      },
      {
        label: "精神的自由、真実の理解、納得できる生き方、唯一無二の個性",
        valueY: -1.0,
        valueX: 0,
      },
    ],
  },
];

const types = {
  shirei: {
    name: "司令型",
    alias: "The Commander",
    keyword: "「勝利」",
    quadrant: "Top-Left",
    color: "bg-red-500",
    textColor: "text-red-600",
    borderColor: "border-red-500",
    icon: Target,
    description: "外交的 × 具体的",
    detail: "勝負に勝ちたい、序列の上に行きたい努力家。合理的で冷徹に見えるが、実は仲間思いな一面も。「仕事ができる」と評価されることを好むが、負けることや無能扱いされることを極端に嫌う。",
    famous: "勝間和代、堀江貴文",
    weakness: "上から目線になりがち。使えない部下にイライラする。",
    partners: {
      good: { type: "注目型", reason: "あなたが唯一「憧れる」存在。彼らの愛嬌と華やかさは、あなたにない魅力です。" },
      bad: { type: "理想型", reason: "理解不能な相手。あなたの「合理性」と相手の「こだわり」が真っ向から衝突します。" },
      business: { type: "法則型", reason: "ビジネスパートナーとして優秀。感情論抜きで話が進むので楽です。" }
    }
  },
  chumoku: {
    name: "注目型",
    alias: "The Entertainer",
    keyword: "「情熱」",
    quadrant: "Top-Right",
    color: "bg-yellow-400",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-400",
    icon: Heart,
    description: "外交的 × 抽象的",
    detail: "みんなに愛されたい、注目されたいアイドル気質。場を盛り上げるのが得意で、情に厚い。論理よりも感情や「空気」を重視する。無視されることが一番の恐怖。",
    famous: "明石家さんま、岡田斗司夫",
    weakness: "おせっかい焼き。話を盛る。嫌われるとひどく落ち込む。",
    partners: {
      good: { type: "理想型", reason: "あなたが「憧れる」存在。彼らの揺るがない信念や独自の世界観にかっこよさを感じます。" },
      bad: { type: "法則型", reason: "天敵。あなたの話を「で、根拠は？」と冷たくあしらうため、一緒にいると傷つきます。" },
      business: { type: "司令型", reason: "頼れるリーダー。あなたの面倒を見て、守ってくれる親分肌の相手です。" }
    }
  },
  hosoku: {
    name: "法則型",
    alias: "The Analyst",
    keyword: "「自由」",
    quadrant: "Bottom-Left",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
    icon: Scale,
    description: "内向的 × 具体的",
    detail: "世界の仕組み（法則）を理解したい参謀タイプ。一歩引いて物事を観察し、なぜそうなるのかを解明する事に喜びを感じる。感情論は苦手。何よりも「自由」であることを望む。",
    famous: "池上彰、ひろゆき",
    weakness: "冷たいと思われる。行動する前に考えすぎて動けない。",
    partners: {
      good: { type: "司令型", reason: "あなたが「憧れる」存在。自分にはない実行力と社会適応力を持つ彼らを評価します。" },
      bad: { type: "注目型", reason: "疲れる相手。感情で動く彼らの行動原理が理解できず、あなたの自由な時間を奪います。" },
      business: { type: "理想型", reason: "観察対象として面白い。あなたの分析を興味深く聞いてくれる良き理解者になり得ます。" }
    }
  },
  riso: {
    name: "理想型",
    alias: "The Idealist",
    keyword: "「真実」",
    quadrant: "Bottom-Right",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-500",
    icon: Feather,
    description: "内向的 × 抽象的",
    detail: "自分なりの理想や美学を追求する職人・芸術家タイプ。結果よりもプロセスや「納得感」を大事にする。頑固で、世間一般の成功よりも「自分の生き方」を貫くことに命をかける。",
    famous: "宮崎駿、松本人志",
    weakness: "こだわりが強すぎて周囲と衝突する。客観的な成功に興味がない。",
    partners: {
      good: { type: "法則型", reason: "あなたが「憧れる」存在。あなたの理想や抽象的な話を、論理的に解釈・理解してくれます。" },
      bad: { type: "司令型", reason: "支配しようとしてくる天敵。結果だけを求め、あなたの美学を無視する彼らとは争いが絶えません。" },
      business: { type: "注目型", reason: "良きファン。あなたのこだわりを「すごい！」と無邪気に称賛してくれる癒やしの存在。" }
    }
  }
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// -----------------------------------------------------------------------------
// Privacy Policy Component
// -----------------------------------------------------------------------------

const PrivacyModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">プライバシーポリシー</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            <strong>1. 基本方針</strong><br/>
            当サイト（以下「本サイト」）は、ユーザーの個人情報の重要性を認識し、その保護を徹底するために、以下のプライバシーポリシーを定めます。
          </p>
          <p>
            <strong>2. 個人情報の収集について</strong><br/>
            本サイトでは、診断結果の判定処理はすべてユーザーの端末内（ブラウザ）で行われます。氏名、メールアドレスなどの個人情報をサーバーに送信・保存することはありません。
          </p>
          <p>
            <strong>3. アクセス解析ツールについて</strong><br/>
            本サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用する可能性があります。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p>
            <strong>4. 広告について</strong><br/>
            本サイトでは、第三者配信の広告サービス（Google AdSense等）を利用する可能性があります。広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、Cookieを使用することがあります。
          </p>
          <p>
            <strong>5. 免責事項</strong><br/>
            本サイトの診断結果は、岡田斗司夫氏の提唱する理論を基にした非公式なものであり、その正確性や有用性を保証するものではありません。本サイトの利用によって生じた損害等について、運営者は一切の責任を負いません。
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Main Application Component
// -----------------------------------------------------------------------------

export default function App() {
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const resultCardRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleStart = () => {
    setStep('test');
    setCurrentQuestion(0);
    setScores({ x: 0, y: 0 });
    setHistory([]);
    window.scrollTo(0, 0);
  };

  const handleAnswer = (option) => {
    setHistory([...history, { ...scores }]);

    const newScores = { ...scores };
    if (questions[currentQuestion].axis === 'x') {
      newScores.x += option.value;
    } else if (questions[currentQuestion].axis === 'y') {
      newScores.y += option.value;
    } else if (questions[currentQuestion].axis === 'mix') {
      if (option.valueX) newScores.x += option.valueX;
      if (option.valueY) newScores.y += option.valueY;
    }
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousScores = history[history.length - 1];
      setScores(previousScores);
      setHistory(history.slice(0, -1));
    } else {
      setStep('intro');
    }
  };

  const calculateType = () => {
    const { x, y } = scores;
    if (y >= 0 && x < 0) return types.shirei;
    if (y >= 0 && x >= 0) return types.chumoku;
    if (y < 0 && x < 0) return types.hosoku;
    return types.riso;
  };

  const resultType = step === 'result' ? calculateType() : null;
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  // X (Twitter) Sharing Logic with Image
  const handleTwitterShare = async () => {
    if (!resultType || !resultCardRef.current) return;
    
    setIsGeneratingImage(true);
    
    try {
      // 結果カードを画像化
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 高解像度
        logging: false,
        useCORS: true,
      });
      
      // CanvasをBlobに変換
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGeneratingImage(false);
          return;
        }
        
        const text = `私の欲求タイプは【${resultType.name}】でした！\nキーワード：${resultType.keyword}\n\n#岡田斗司夫4タイプ診断`;
        const url = "https://okada-4types.vercel.app/";
        
        // Web Share APIが使える場合（主にモバイル）
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], `okada-4types-${resultType.name}.png`, { type: 'image/png' });
            
            // Web Share APIで画像とテキストを一緒に共有
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `岡田斗司夫の4タイプ診断 - ${resultType.name}`,
                text: text,
                url: url,
                files: [file],
              });
              setIsGeneratingImage(false);
              return;
            }
          } catch (shareError) {
            // Web Share APIがキャンセルされた場合など
            if (shareError.name !== 'AbortError') {
              console.error('Web Share API エラー:', shareError);
            }
            setIsGeneratingImage(false);
            return;
          }
        }
        
        // Web Share APIが使えない場合のフォールバック
        try {
          // クリップボードに画像をコピー（デスクトップ）
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          
          // Twitterの共有URLを開く
          const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
          
          alert('診断結果の画像をクリップボードにコピーしました！\nTwitterで画像を貼り付けて投稿してください。');
          window.open(shareUrl, '_blank');
        } catch (clipboardError) {
          // クリップボードAPIが使えない場合、画像をダウンロード
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `okada-4types-${resultType.name}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          
          const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
          
          alert('診断結果の画像をダウンロードしました！\nTwitterで画像を添付して投稿してください。');
          window.open(shareUrl, '_blank');
        }
        
        setIsGeneratingImage(false);
      }, 'image/png');
    } catch (error) {
      console.error('画像生成エラー:', error);
      setIsGeneratingImage(false);
      
      // フォールバック: 画像なしで共有
      const text = `私の欲求タイプは【${resultType.name}】でした！\nキーワード：${resultType.keyword}\n\n#岡田斗司夫4タイプ診断`;
      const url = "https://okada-4types.vercel.app/";
      const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    }
  };

  const plotX = clamp(50 + (scores.x * 8), 5, 95);
  const plotY = clamp(50 - (scores.y * 8), 5, 95);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 flex flex-col">
      <div className="max-w-xl mx-auto px-4 py-8 flex-grow flex flex-col w-full">

        {/* Header */}
        <header className="mb-6 text-center">
          <div className="inline-block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">Unofficial Fan Site</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            岡田斗司夫の4タイプ診断
          </h1>
        </header>

        {/* === AdSense: ヘッダー下 === */}
        {/* 広告ユニット作成後、slot IDを設定してください。例: slot="1234567890" */}
        {step === 'intro' && (
          <AdSenseUnit slot="" format="auto" className="mb-6" />
        )}

        {/* Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center w-full">

          {step === 'intro' && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full text-center space-y-6 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">あなたの「欲求の源泉」はどこ？</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  岡田斗司夫氏が提唱する「欲求の4タイプ」理論に基づき、<br/>
                  あなたの行動原理となる本能的な欲求を判定します。<br/>
                  <span className="font-bold text-indigo-600">考えすぎず、直感で選んでください。</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-left opacity-80">
                <div className="p-3 bg-red-50 rounded border border-red-100">
                  <span className="font-bold text-red-600 block mb-1">司令型</span>
                  勝利・序列・合理的
                </div>
                <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                  <span className="font-bold text-yellow-600 block mb-1">注目型</span>
                  情熱・人気・感情的
                </div>
                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                  <span className="font-bold text-blue-600 block mb-1">法則型</span>
                  自由・分析・仕組み
                </div>
                <div className="p-3 bg-purple-50 rounded border border-purple-100">
                  <span className="font-bold text-purple-600 block mb-1">理想型</span>
                  真実・美学・こだわり
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-500 text-left flex gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  本アプリは有志による<span className="font-bold">非公式ファンサイト</span>です。
                  診断結果は簡易的なものであり、正確な判定や理論の詳細は、ご本人の書籍や公式コンテンツをご確認ください。
                </p>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                診断を始める <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 'test' && (
            <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 relative">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-baseline mb-2 text-slate-500">
                  <span className="text-xs font-bold">PROGRESS</span>
                  <span className="text-sm font-mono font-bold">{currentQuestion + 1} <span className="text-slate-300">/ {questions.length}</span></span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-bold leading-snug mb-4 text-slate-800">
                  Q{currentQuestion + 1}. {questions[currentQuestion].text}
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Select one</p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-5 text-left bg-white border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm group active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 mt-0.5 transition-colors flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="font-medium text-lg text-slate-700 group-hover:text-indigo-900 leading-snug">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleBack}
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition-colors py-2 px-4 rounded-lg hover:bg-slate-100"
                >
                  <ArrowLeft size={16} />
                  {currentQuestion === 0 ? "トップに戻る" : "前の質問に戻る"}
                </button>
              </div>
            </div>
          )}

          {step === 'result' && resultType && (
            <div className="w-full animate-in zoom-in-95 duration-500 space-y-8 pb-4">

              {/* === AdSense: 結果表示前 === */}
              <AdSenseUnit slot="" format="auto" className="mb-4" />

              {/* Result Card */}
              <div ref={resultCardRef} className={`relative overflow-hidden rounded-3xl bg-white shadow-2xl border-4 ${resultType.borderColor}`}>
                <div className={`absolute top-0 left-0 w-full h-24 ${resultType.color} opacity-10`}></div>
                <div className="relative p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full ${resultType.color} text-white mb-4 shadow-md`}>
                    {React.createElement(resultType.icon, { size: 32 })}
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-1">YOUR TYPE</p>
                    <h2 className={`text-4xl font-black ${resultType.textColor} mb-2`}>{resultType.name}</h2>
                    <p className="text-lg font-medium text-slate-600">{resultType.alias}</p>
                  </div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-6 border border-slate-200">
                    キーワード：{resultType.keyword}
                  </div>

                  <div className="text-left bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                    <p className="text-slate-700 leading-relaxed text-sm mb-4">
                      {resultType.detail}
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 pt-4 border-t border-slate-200">
                      <div className="flex gap-2">
                         <span className="font-bold min-w-[50px]">有名人:</span>
                         <span>{resultType.famous}</span>
                      </div>
                      <div className="flex gap-2">
                         <span className="font-bold min-w-[50px]">弱点:</span>
                         <span>{resultType.weakness}</span>
                      </div>
                    </div>
                  </div>

                  {/* X (Twitter) Share Button */}
                  <button
                    onClick={handleTwitterShare}
                    disabled={isGeneratingImage}
                    className="w-full mb-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>画像を生成中...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-lg">𝕏</span> 結果をポストする
                      </>
                    )}
                  </button>

                  {/* === AdSense: 結果カード内（シェアボタン下） === */}
                  <AdSenseUnit slot="" format="auto" className="mb-6" />

                  {/* Compatibility Section */}
                  <div className="text-left pt-6 border-t border-slate-200">
                    <h3 className="text-center font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
                      <Users size={16} /> 相性と人間関係
                    </h3>
                    <div className="space-y-3">
                      {/* Good / Admire */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
                         <div className="flex items-center gap-2 mb-1 text-orange-600 font-bold text-sm">
                           <Sparkles size={14} /> あなたが憧れるタイプ
                         </div>
                         <p className="text-sm font-bold text-slate-800 mb-1">
                           {resultType.partners.good.type}
                         </p>
                         <p className="text-xs text-slate-600">
                           {resultType.partners.good.reason}
                         </p>
                      </div>
                      {/* Bad / Conflict */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 opacity-80">
                         <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-sm">
                           <AlertTriangle size={14} /> 理解し合えないタイプ（対角線）
                         </div>
                         <p className="text-sm font-bold text-slate-700 mb-1">
                           {resultType.partners.bad.type}
                         </p>
                         <p className="text-xs text-slate-500">
                           {resultType.partners.bad.reason}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-center font-bold text-slate-800 mb-6 text-sm flex items-center justify-center gap-2">
                   <Target size={14}/> 診断結果チャート
                </h3>
                <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-50 rounded-lg border border-slate-200 mb-2">
                  {/* Axes */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-300 transform -translate-x-1/2"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-300 transform -translate-y-1/2"></div>

                  {/* Labels */}
                  <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-slate-500 bg-white px-1 border border-slate-200 rounded">外向的</span>
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-slate-500 bg-white px-1 border border-slate-200 rounded">内向的</span>
                  <span className="absolute top-1/2 left-1 transform -translate-y-1/2 text-[10px] font-bold text-slate-500 bg-white px-1 border border-slate-200 rounded writing-vertical-lr">具体的</span>
                  <span className="absolute top-1/2 right-1 transform -translate-y-1/2 text-[10px] font-bold text-slate-500 bg-white px-1 border border-slate-200 rounded writing-vertical-lr">抽象的</span>

                  {/* Quadrant Labels */}
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
                    <span className={`text-xs font-bold ${resultType.name === "司令型" ? "text-red-500" : "text-slate-300"}`}>司令型</span>
                  </div>
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
                    <span className={`text-xs font-bold ${resultType.name === "注目型" ? "text-yellow-500" : "text-slate-300"}`}>注目型</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
                    <span className={`text-xs font-bold ${resultType.name === "法則型" ? "text-blue-500" : "text-slate-300"}`}>法則型</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
                    <span className={`text-xs font-bold ${resultType.name === "理想型" ? "text-purple-500" : "text-slate-300"}`}>理想型</span>
                  </div>

                  {/* User Plot */}
                  <div
                    className={`absolute w-5 h-5 rounded-full border-4 border-white shadow-xl ${resultType.color} z-10 transition-all duration-1000 ease-out`}
                    style={{
                      left: `${plotX}%`,
                      top: `${plotY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 animate-in fade-in delay-1000 fill-mode-forwards">
                      YOU
                    </div>
                  </div>
                </div>
              </div>

              {/* === AdSense: チャートと公式リンクの間 === */}
              <AdSenseUnit slot="" format="auto" className="mb-6" />

              {/* Official Links & Affiliate */}
              <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                  <ExternalLink size={14} /> 公式コンテンツ（本家）
                </h3>
                <div className="space-y-2">
                  <a href="https://www.youtube.com/@toshiookada0701" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-600 text-white p-1.5 rounded-full">
                         <ExternalLink size={12} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">岡田斗司夫 YouTube</p>
                        <p className="text-[10px] text-slate-500">本人の詳細な解説動画で学ぶ</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-red-500" />
                  </a>
                  <a href="https://amzn.to/3O3J7Yx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center gap-3">
                       <div className="bg-orange-500 text-white p-1.5 rounded-full">
                         <BookOpen size={12} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">書籍『人生の法則』(Amazon)</p>
                        <p className="text-[10px] text-slate-500">4タイプ理論の決定版テキスト</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500" />
                  </a>
                </div>
              </div>

              {/* === AdSense: フッター上 === */}
              <AdSenseUnit slot="" format="auto" className="mb-6" />

              <button
                onClick={handleStart}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw size={16} /> 最初からやり直す
              </button>
            </div>
          )}

        </main>

        <footer className="mt-8 pb-4 text-center space-y-4">
           <button
             onClick={() => setShowPrivacy(true)}
             className="text-[10px] text-slate-400 underline hover:text-slate-600"
           >
             プライバシーポリシー
           </button>
           <div className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
             <p className="mb-2">Disclaimer: This is an Unofficial Fan Site.</p>
             <p>
               本アプリは岡田斗司夫氏の提唱する『欲求の4タイプ』理論を元に作成された<span className="font-bold text-slate-500">非公式ファンサイト</span>です。
               公式（株式会社オタキング/FREEex）とは一切関係ありません。<br/>
               コンテンツの権利はそれぞれの権利所有者に帰属します。
             </p>
           </div>
        </footer>

        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </div>
    </div>
  );
}
