# AIラッパーサービスの進化過程 — モート構築の段階論

## TL;DR

- AIラッパーサービスは段階1(純粋ラッパー)→段階6(プラットフォーム)へと**6段階**で発展する
- **学術論文は段階4以降(ルーティング、蒸留、fine-tune)に集中**している
- しかし**実際の死は段階3(独自データ蓄積期)で起きている**: Jasper、Inflection、Adept、Character.AI 全て段階1で巨額調達したが段階3を抜けられなかった
- 2024〜2025年の**reverse acqui-hire連発**は「段階3未完で死ぬ前のBig Tech救済」という新しい死に方の定着を示す
- 段階3は学術的に研究しにくく、論文を読んでも解けない**プロダクト戦略・UX設計・組織能力の問題**
- 段階3の本質は「**プロダクトをデータ収集装置として再設計する段階**」。意識的に設計できるチームに持続的モートが残る

## 1. AIラッパーの進化の段階

「AIラッパー」と揶揄されるサービスは、初期段階ではOpenAIやAnthropicのAPIを叩くだけの薄いレイヤーに見える。しかし生き残るサービスを観察すると、ここから持続的な競争優位を構築していく明確なパターンがある。発展段階は概ね以下の6つに整理できる。

| 段階 | 概要 | 主なモート |
|---|---|---|
| 1. 純粋なラッパー期 | APIに最小限のプロンプトを被せた特化サービス | UI/UX、SEO先行者利益(ほぼゼロ) |
| 2. ワークフロー統合期 | ユーザーの実作業環境に食い込む | スイッチングコスト |
| 3. 独自データ・コンテキスト蓄積期 | 使うほど蓄積するユニークなデータ | データネットワーク効果 |
| 4. マルチモデル・モデル抽象化期 | 複数モデルのオーケストレーション | 供給側の交渉力、ルーティング知財 |
| 5. 自社モデル・ファインチューニング期 | 蓄積データでドメイン特化モデルを構築 | 性能優位、コスト効率 |
| 6. 流通・分配チャネルの確立期 | サービス自体がAI機能の流通プラットフォーム | 需要側の集中、エコシステム |

各段階は順次積み上がる関係にあり、後の段階に進むほど競争優位が強固で持続的になる。重要なのは、これらが代替関係ではなく**重ね塗り**の関係にあること — 段階4に進んでもUI/UX(段階1)とワークフロー統合(段階2)は捨てない。

## 2. 各段階で必要な技術・手法・サービス

### 段階1: 純粋なラッパー期

**主な技術・手法**

- プロンプトエンジニアリングの体系化(prompt caching、context window管理)
- MCP(Model Context Protocol)による軽い外部接続
- シンプルなRAGパイプライン(LangChain/LlamaIndexの基礎機能)
- 最低限のObservability(token使用量、コスト、latency)

**サービス例**: 初期Jasper、Copy.ai、無数の「○○GPT」系特化チャットボット

**この段階の特徴**: モデルプロバイダーの値下げや機能追加で簡単に蒸発する。RAGFlowが「Context Engineering 1.0」と呼ぶ、プロンプトテンプレートをハードコードする旧来型アプローチがここに該当する。

### 段階2: ワークフロー統合期

**主な技術・手法**

- Computer Use / Browser Agent: Anthropic Computer Use、OpenAI CUA(Operator)、Google Gemini 2.5 Computer Use(2025年10月、ブラウザ自動化70%精度)
- WebMCP: Googleが2026年2月にChrome Canaryで実装した、ウェブサイトをAIエージェント用ツールに構造化するプロトコル
- エディタ統合(VS Codeフォーク等)
- IDE/ブラウザレベルでのコンテキスト取得

**サービス例**: Cursor、Perplexity、Claude in Chrome、ChatGPT Atlas、Comet、Browser Use(OSS)、Operator/ChatGPT Agent

**この段階の特徴**: AnthropicによるVercept買収(2026年2月)でClaude SonnetのOSWorldスコアが15%未満から72.5%へ急伸。Atlassianによるdia買収(6.1億ドル)で、ブラウザAIスタートアップのエンタープライズ統合が始まっている。

### 段階3: 独自データ・コンテキスト蓄積期

(後述で深掘り)

**主な技術・手法**

- Agent Memory System(Mem0、Zep、MemMachine、LongMemEval、LoCoMo)
- Preference Data収集(👍/👎、暗黙シグナル、A/B選択)
- Trajectory Logging(tool call履歴、修正履歴)
- Evaluation Data蓄積(ground truth pairs、failure patterns)

**サービス例**: Glean、Harvey、Character.AI、Cursor(編集ログ)、Midjourney(選択ログ)

### 段階4: マルチモデル・モデル抽象化期

**主な技術・手法**

- 学習されたルーティング: xRouter(RLベース、2025年10月)、OmniRouter/ECCOS、RouteLLM、FrugalGPT、Router-R1
- マルチモデル・オーケストレーション: Pick and Spin(Kubernetes、self-hosted LLM、2025年12月)
- Generalized Routing: MoMA(異種LLMプール対応)

**サービス・インフラ例**: OpenRouter(2025年6月に4,000万ドル調達、623+モデル)、LiteLLM、Bifrost、Portkey

**市場規模**: エンタープライズLLM支出は2025年に84億ドル(2024年は35億ドル)。intelligent routingで30〜85%のコスト削減が報告されている。

### 段階5: 自社モデル・ファインチューニング期

**主な技術・手法**

- LoRA/QLoRA、PEFT
- Knowledge Distillation: Adapt-and-Distill、Flipping Knowledge Distillation(ACL 2025、SLM→LLMの逆方向蒸留)
- TuneShift-KD(fine-tuned modelから新base modelへの知識転移)
- FineScope(SAE-guidedデータ選択 + structured pruning + self-distillation)
- Agent Fine-tuning through Distillation(microdomain向け、JP1での14%性能向上)

**サービス例**: Cursorの自社Tabモデル/Applyモデル、Perplexity Sonar、Replitのコード補完モデル

### 段階6: 流通・分配チャネルの確立期

**主な技術・手法**

- Context Engineering 2.0(自動化されたコンテキスト作成・配信)
- Graph RAG / Hybrid Retrieval(Fujitsuの実装でITヘルプデスク解決時間40%削減)
- エンタープライズコンプライアンス(ISO/IEC 42001、RBAC、監査ログ、NCSC/CISAガイドライン)
- マルチテナント分離、データレジデンシー対応

**フレームワーク市場**: LangChain(2025年中頃シリーズB 1億ドル調達、評価額11億ドル)、LlamaIndex、Haystack、DSPy、Pathway

**サービス例**: Glean、Notion AI、Microsoft 365 Copilot、Google Workspace Gemini、Slack AI

### 横断的レイヤー: 評価・Observability・Guardrails

これらは特定段階に属さず、全段階を貫く基盤レイヤー。段階を進むほど精緻さが上がる。

**評価**

- Holistic rubric → Analytic rubric → Bias-corrected & psychometric judge への進化
- LLM-as-a-Judge: G-Eval、Promptfoo、DeepEval、Autorubric(2025)、Multi-Agent LLM Judge
- Trajectory評価: TRAJECT-Bench(2025年10月)、ToolPRMBench
- Reliability評価: ReliabilityBench(2026年1月、k-trial pass rates、ε-perturbations、λ-fault tolerance)

**Observability**

- 標準: OpenTelemetry GenAI Semantic Conventions(CNCFのデファクト)
- OSS計装: OpenLLMetry(Traceloop)、OpenLIT
- 統合プラットフォーム: LangSmith、Langfuse、Helicone、Arize Phoenix、Galileo、Agenta

**Guardrails**

- NVIDIA NeMo Guardrails(Colangで対話フロー定義)
- LLM Guard(Protect AI)、Llama Guard 3、Guardrails AI
- Azure AI Content Safety / Prompt Shield、AWS Bedrock Guardrails
- 現実: 主要ガードレールでも character injection ASRが20〜90%(単一ガードでは突破される前提で多層防御)

## 3. 学術論文と実務段階のミスマッチ

ここで興味深い観察がある。**論文として研究しやすい問題は段階4以降に偏っている**。

学術側の力学を考えると、論文化しやすいのは以下の3条件を満たす問題である。

- 評価可能性: ベンチマークが整備され、新手法の優位を数値で示せる
- 一般化可能性: 特定企業の特定データに依存しない、再現可能な手法
- 完結性: 学位論文や学会発表のスコープに収まる、明確な始まりと終わりがある

段階4(ルーティング)、段階5(蒸留・fine-tune)はこの3条件を満たしやすい。アルゴリズムを提案し、公開ベンチマークで測り、論文に閉じる。xRouter、RouteLLM、FrugalGPT、Adapt-and-Distill、Agent Fine-tuning through Distillation — 全て条件を満たす。同様に、メモリ研究(LongMemEval、MemMachine、Field-Theoretic Memory)も評価可能性を確保しやすく、2025年に集中投稿されている。

ところが**段階3の本質部分**(データ収集UXの設計、preference dataの構造化、trajectory loggingの設計)は、この3条件と相性が悪い。

- 評価が困難: 「ユーザーデータの蓄積」自体は時間軸の上での現象で、論文1本の実験期間で示せない。Character.AIの長期エンゲージメント、Cursorのacceptance率推移、Gleanの企業内グラフ成長はそもそも公開できない
- 一般化が困難: あるサービスで効いたUX設計が他で効くとは限らない
- 完結しない: 「貯めながら回し続ける」運用そのものなので終わりがない

つまり段階3は **経営・プロダクト・運用の問題**であって、論文化しにくいだけで難しさが少ないわけではない。むしろここに**学術と実務のギャップ**が最も大きく現れている。

## 4. 実際には段階3が最大の難所

論文の分布から「段階4以降が技術的に難しい」と錯覚しがちだが、実務では**段階3で多くのサービスが死んでいく**。Jasperが2022年末のChatGPT登場で評価額を大きく下げた事例は、「段階1で大きくスケールしたが段階3に進めなかった」典型例として象徴的。

### 段階3で詰まる構造的理由

**(1) 「評価不可能なものが価値を持つ」というジレンマ**

段階1-2で勝つには「目に見える品質」(出力の質、UI、レスポンス速度)を上げる必要がある。これらは比較的すぐに測れて、改善サイクルが回る。

ところが段階3で本当に価値があるのは「目に見えない蓄積」 — 後で効くpreference data、後で効くfailure pattern、後で効くdomain knowledge graph。これらは**今**の指標を改善しない。

経営者から見ると「今のNPS、retention、ARRが伸びる施策」と「3年後の自社モデルの燃料になる施策」の2つがあり、市場競争が激しい中で前者を優先するのが合理的に見える。結果として段階3を素通りして段階1のスケールに突き進み、コモディティ化に飲まれる。

**(2) データ収集UXの設計は「未来への投資」**

Cursorの「Tab acceptance」、Midjourneyの「4枚選択」、Character.AIの「★評価」は、振り返ると見事なpreference data収集装置だが、当初は「ユーザー体験を良くするUI」として設計され、データ蓄積の戦略的価値は後から認識された側面が大きい。

逆に意識的にデータ収集UXを設計しようとすると、しばしば「UXを犠牲にしてデータを取りに行く」誘惑に陥る。アンケート、強制的な評価入力、ポップアップでのフィードバック要求 — これらはユーザーを離反させる。「自然に使うとデータが貯まる」設計には相当なプロダクト感覚が要る。

**(3) コールドスタート問題**

段階3のデータネットワーク効果は、回り始めれば強い。しかし回し始めるのが難しい。

ユーザーが少ない → preference dataが貯まらない → 自社モデル訓練に足りない → 汎用モデルとの差が出ない → ユーザー差別化要因が弱い → ユーザーが増えない、という悪循環。

これを破るには初期にデータの種を別の方法で確保する必要がある。Harveyは大手法律事務所との独占契約、Character.AIは無料・無制限戦略でユーザーを集める、CursorはVS Codeフォークで既存IDEユーザーを取り込む — それぞれにブートストラップ戦略がある。**段階3を成功させるサービスは段階1の戦い方が独特**で、教科書的な「MVP→PMF→スケール」とは違う。

**(4) データ品質の問題**

集めたデータがそのままfine-tuneに使える訳ではない。ノイズ(誤クリック、ボット)、偏り(熱心なユーザーの嗜好だけ反映)、法的制約(privacy、ToS)、追加ラベリングコストがある。Scale AIやSurge AIが商売として成立しているのは、データを「持っている」と「使える形に整える」の間に大きなギャップがあるから。

**(5) 組織能力の壁**

段階3を真剣に運用するには以下の組織能力が同時に必要。

- プロダクト: データ収集と価値提供を両立するUX設計
- データエンジニアリング: トラッキング、ストレージ、ラベリング
- ML/Research: 蓄積データから何を学習可能か見抜く目
- Privacy/Legal: データ利用の合法性
- 経営: 短期収益を犠牲にしても長期データ価値を取る判断

スタートアップではこれらの能力が揃うのに時間がかかる。大企業は能力はあるがデータを使った素早い実験が組織的に難しい。**段階3はミドルステージのスタートアップにとって最も組織的負荷が高い**。

**(6) 「データ持ってるだけ」の罠**

データを大量に持っているのに、それを段階5に活かす能力がない状態。

- 過去のチャットログを大量に持っているが、preference signalが付いていない → DPO/RLAIFに使えない
- ユーザーフィードバックを集めているが、構造化されていない → judge訓練に使えない
- 失敗パターンを観測しているが、再現可能な形でログされていない → adversarial fine-tuneに使えない

「段階3でデータを集める時点で、段階5での使われ方を逆算しておかないと、後で使えない」という難しさ。

**(7) モデル進化が早すぎる問題**

汎用モデルの性能向上が、ドメイン特化データの価値を相対的に下げる。3年前なら自社データでfine-tuneして勝てた性能差が、次世代汎用モデルが追い抜いてしまう。**段階3でデータを貯めている間に、汎用モデル側が能力で追いついてくる**現象が起きる。

## 5. 段階3で死んでいったサービスの実例

定量的な統計データもいくつか出ているので、まずマクロから押さえる。

### マクロな失敗率データ

業界レポートと分析記事から拾えるマクロ指標。出典の信頼度はまちまちだが(VCコメンタリーやブログ集計が多く、厳密な学術統計ではない)、傾向感を掴む参考として。

- AI/テックスタートアップの失敗率は2024年に92%(SaaS全体平均より2倍以上)([Felix Neumann, Medium, 2025](https://medium.com/@neumannfelix/most-ai-startups-are-just-wrappers-that-wont-exist-in-a-couple-of-years-74d5dec95f00))
- AIラッパーの60〜70%が売上ゼロ、月次MRR $10K超えは3〜5%のみ。APIコストが成功サービスでも売上の15〜30%を消費([Mohsin Akram, "I Analyzed 24 Failed AI Startups", 2025](https://www.mohsindev369.dev/blog/failed-ai-startups-analysis-2024))
- 業界予測では「**90%のAIラッパーが2026年までに失敗する**」(unsustainable economicsが理由)(同上)

これらはマクロ統計だが、実例を見ると「**段階1の派手なローンチ → 段階2-3への移行に失敗 → 死または救済**」のパターンが繰り返されているのが分かる。以下、有名度の高い順に整理する。

### 5.1 Jasper AI — 「最初の象徴的失敗例」

ChatGPT登場の**わずか1ヶ月前**に巨額調達した、タイミングの悲劇。

- 2022年10月: $125M Series Aを$1.5B評価で調達(Insight Partners主導)
- **2022年11月: ChatGPT登場**(調達のわずか1ヶ月後) — 事実上のコモディティ化
- 2023年7月: レイオフ実施
- 2023年9月: 内部評価額を20%カット($1.2B)、共同創業者CEO退任
- 2024年: 売上は前年から大幅減(報道では2024年売上 $35M、ピーク $120Mからの**53%減**との記載と、ピーク $55Mとの記載が混在)

**段階3視点での読み**: マーケティングコンテンツ生成という比較的検証しにくいドメインで、「ユーザーがどの出力を採用したか」のpreference dataを構造化して持っていなかった。ChatGPT登場後にエンタープライズへピボット試行したが、汎用モデルとの差別化に必要な独自データ資産が薄かった。

### 5.2 Inflection AI / Pi — 「100万DAU持っていても死ぬ」

2024年3月時点でDAU 100万人を超え、Microsoftが$13B出資後の最有力対抗馬と目されていたが、結末は**Microsoftによる$650Mのreverse acqui-hire**。創業者Mustafa Suleyman以下70人のチームの大半がMicrosoftへ移籍、製品Piは法人カスタマーサービスボットとしてライセンス供与される形に縮小。$1.3B調達からの実質的撤退。

**段階3視点での読み**: 1.3Bドルを調達したが、ユーザーエンゲージメントを段階5(自社モデルfine-tune)の燃料として体系化できていなかった。会話履歴は大量にあったが、「Piらしさ」を再現するためのpreference signalやtrajectoryが構造化されておらず、汎用モデル + better UI に追い抜かれた。**100万DAUという派手な数字が、必ずしもデータネットワーク効果に変換されない**ことを示した事例。

### 5.3 Adept AI — 「Computer Useのパイオニアが死んだ」

Transformer論文の共著者を含むドリームチームが創業、$415Mを調達して$1B評価。AIエージェントがソフトウェアを操作する未来を最初に提示した会社の一つだったが、2024年6月に**Amazonによるreverse acqui-hire**。創業者David Luan以下のチームがAmazon AGI Labsへ移籍、技術ライセンスをAmazonに供与。

**段階3視点での読み**: 「数ヶ月のテストを重ねたが製品を市場に出せなかった」と報じられている。技術デモは強力だったが、実ユーザーのtrajectory data(成功軌跡、失敗軌跡、人間の修正パターン)を蓄積する前に資金が尽きた。同時期に同じ領域で生き残ったCursorとの違いは、「**製品をリリースしてユーザー軌跡データを取り始めるまでの速度**」だった可能性が高い。

### 5.4 Character.AI — 「20M MAUでも段階3を回せなかった」

2024年初頭で20M MAU(月間アクティブ)、6M DAU(2024年7月時点)、平均利用時間75分/日という驚異的なエンゲージメントを誇っていたが:

- 2024年8月: Googleとの**$2.7B reverse acqui-hire**で創業者Noam Shazeer(Attention Is All You Need共著者)とDe Freitasがチーム30人と共にGoogleへ
- 2025年6月: 5%レイオフ
- 2025年8月: 売却または$1B超評価での資金調達を模索中(2024年の$2.5B評価から減価)
- 競合(Janitor AI、Crushon AI、Replikaなど)へユーザー流出
- 2024年10月: 14歳ユーザーの自殺をめぐり訴訟

**段階3視点での最重要分析**: Character.AIは「closed-loop strategy」を掲げており、自社LLMを訓練→チャットボットで使う→使用データを訓練に戻すというフライホイールを持っていた。**これは段階3→段階5の理想形**だった。しかし結果は失敗。理由は複数考えられる。

(a) **インフラコストがエンゲージメントの伸びを上回った** — 「ユーザー活動に直接比例してインフラコストがスケールする一方、収益化は遅れて始まった」とSacraが分析している。$9.99のサブスクではコストを賄えなかった。

(b) **Big Techのreverse acqui-hireがデータフライホイールを切断した** — 創業者と最重要の研究者が抜けた後、自社LLM開発を断念しオープンソースモデル(Llama等)へpost-trainingする戦略へ転換。蓄積していた会話データの活用能力そのものが失われた。

(c) **コンテンツモデレーションの締め付けがコア体験を毀損した** — 2023〜2026にかけてフィルタリングが強化され、ユーザーが移行。フルスクリーン中断広告も入れたためエンゲージメントが下がる悪循環。

つまりCharacter.AIは「**段階3を実装する技術力もユーザー基盤もあったのに、ユニットエコノミクスと外部圧力(規制、訴訟、Big Tech引き抜き)で段階5への移行を完遂できなかった**」事例。段階3が成立しても段階5へのパスを断たれることがあるという教訓。

### 5.5 Reverse Acqui-hireの連続発生 — 「段階3で死ぬ前に救済される」パターン

2024〜2025年に、$1B+評価のAIスタートアップが相次いでBig Techに「人材吸収+技術ライセンス」という形で実質的に解体された。

| 時期 | スタートアップ | 引き取り先 | 取引額 | 元の調達総額 |
|---|---|---|---|---|
| 2024年3月 | Inflection AI | Microsoft | $650M | $1.3B |
| 2024年6月 | Adept AI | Amazon | 非開示 | $415M |
| 2024年8月 | Character.AI | Google | $2.7B | $193M |
| 2025年7月 | Windsurf(コーディングエージェント) | Google → Cognition | $2.4B + 売却 | 非開示 |

これらは**形式的には「成功した撤退」**だが、創業者と研究チームを失った残骸の会社は実質的に段階1へ逆戻りする。VCはリファンドに近い形で資金回収できるが、リターンは大幅減。**「段階1で大型調達した後、段階3を完遂できないまま、段階4-5への移行リソースが尽きた状態でBig Techに救済される」という新しい死に方**が定着している。

**生き残っているが収益疑問を抱える例**: Mistral AI(2024年6月に$645M調達/$6B評価、収益はまだ控えめ)、Cohere(2024年に$500M調達、収益が投資家期待に届いているか疑問視されている)。foundation model系すら収益化に苦戦しており、独立系AIスタートアップが「中堅」として生き残るのが構造的に難しいことが分かる。

### 5.6 ハードウェアAI — 段階2でも詰む

ソフトウェアより事態が深刻なのがハードウェア。

- **Humane AI Pin**: $230M調達、HPに$116Mで売却(2025年)。**全デバイスが2025年2月28日にbricked**(動作停止)
- **Rabbit R1**: 100,000台販売したが大量返品、2026年時点で給与支払いに苦慮との報道
- **Friend AIペンダント**、**AI Pin類似製品**: 軒並み撤退・縮小

ハードウェアは「launch-day capabilitiesにロックされる」ため、ソフトウェアのように段階1→段階2→段階3と進化させる時間が取れない。**段階2(ワークフロー統合)に到達する前に、ユーザーが返品して終わる**。

### 5.7 「成功的失敗」一覧 — プレスリリース時は華々しかった

報道された時点では業界注目だったが、後に死亡 or 縮小したサービス。

- **Artifact**(元Instagram創業者のニュースアプリ): ニュース → Twitterクローン → Pinterestクローンと複数ピボット後シャットダウン
- **CodeParent**: YC支援、$500K調達、複数ピボット後MRR $1,500で天井打ち、2024年7月閉鎖
- **Buildt.ai**: 2年以上、$250M(2023)を費やしたが失敗
- **Safurai**(コーディング支援): GPU/computeコストが収益を上回り破綻
- **Insure Tag**: 同上
- **Copy.ai系のAIライティング支援**: ChatGPTが同等機能を安く提供する状態でコモディティ化、独立サービスとしての価値が縮小
- **Booth AI**、**The Gist**、**Settle AI**、**Low Light**など多数

### 5.8 まとめ — 何が見えるか

これらの事例から繰り返し読み取れる4つのパターンがある。

1. **「派手なローンチ + 大型調達」と「段階3への移行」は別の能力**: Jasper、Inflection、Adept、Character.AI全てが段階1で巨額調達したが、段階3を経て段階5まで進めなかった
2. **エンゲージメントと収益化のタイミングがずれる**: Character.AIが示したように、20M MAUで75分/日の利用があってもインフラコストの方が早く膨らむ。段階3のデータ蓄積期間を支える資金が必要
3. **Big Tech reverse acqui-hireは「段階3未完で死ぬ」前の救済装置として機能している**: 結果として、独立した中堅AIサービスがほぼ存在しない状態が生まれている
4. **汎用モデルの能力向上が段階3の競争を厳しくする**: 蓄積データの優位が、汎用モデルの世代交代で相対的に縮小する

「論文が段階4以降に集中している」一方で「**実際の死は段階3手前で起きている**」という構造的観察は、これらの実例で裏付けられる。

## 6. 段階3の深掘り

### 6.1 段階3の本質

セクション5の失敗事例を見ると、共通して欠けているのは「ユーザーが使うほど自社にユニークなデータが貯まり、それが後の段階での競争力に転化する仕組み」である。Inflectionは100万DAUの会話履歴、Adeptは技術デモ、Character.AIは20M MAUのエンゲージメントを持っていたが、いずれも段階5で活かせる形に構造化されていなかった。

つまり段階3の本質は、「**プロダクトをデータ収集装置として再設計する段階**」である。ユーザーへの価値提供と、後続段階の燃料となるデータ蓄積を同時に行うようプロダクト全体を設計し直す段階であり、ユーザーごとの長期メモリの実装はその一形態に過ぎない。

### 6.2 段階3で蓄積できるデータの類型

8つに整理できる。

**A. 会話・対話履歴(メモリ系)**
ユーザーごとの長期コンテキスト、関係性、好みの蓄積。Mem0、Zep、LongMemEvalなどが該当。ロールプレイ・パーソナルアシスタント・コーチング系で支配的。

**B. ユーザー嗜好・選好データ(Preference Data)**
ユーザーがどの出力を選んだか・拒否したかの暗黙的・明示的フィードバック。段階5への燃料として極めて重要。

- 明示的シグナル: 👍/👎、5段階評価、「もう一度生成」、「この回答を使う」選択
- 暗黙的シグナル: コピーされた箇所、編集された箇所、最後まで読まれたか、どの応答で会話が継続したか
- 比較選択: A/B提示時の選択、複数案からの採用パターン

実例: Cursorの「Tab補完を受け入れた/拒否した」データ、GitHub Copilotのacceptance rate、Midjourneyの`--v`バージョン選択(4枚から1枚選ぶUI)。これらが**DPO、KTO、RLAIF、Online DPO**といった手法の燃料になる。

**C. ツール使用軌跡(Trajectory Data)**
エージェント系で、ユーザータスクをどの順序で・どのツールを・どの引数で呼んで解決したかの軌跡。

- 成功軌跡: タスクが完了した一連のtool call sequence
- 失敗軌跡と回復: エラー後にどう修正したか
- 人間による介入: どこで人間がエージェントを止めたか・修正したか
- 効率的な軌跡: 同じタスクを少ないステップで解いた事例

Devin、Cursor Composer、Replit Agentが蓄積している軌跡データは、Agent Fine-tuning through Distillationに直接使える。

**D. ドメイン固有の構造化知識**
ユーザーや組織が時間をかけて整備した構造化データ。

- ナレッジベース・Wiki(Glean、Notion AI)
- タクソノミー・分類体系(タグ、カテゴリ、優先度ラベル)
- ワークフロー定義(自動化ルール、テンプレート、SOP)
- エンティティ関係グラフ(顧客・案件・プロジェクトの関連付け)

Gleanの真のモートは「LLMが賢いこと」ではなく、Slack、GitHub、Confluence、Jira、Salesforceを横断して整備されたエンティティグラフとパーミッションモデル。Harveyも法律事務所ごとの判例引用ネットワーク、契約条項のバージョン履歴、チームごとのドラフティング規約を蓄積。汎用LLMが何年経っても作れない領域。

**E. ユーザー生成コンテンツ(UGC)とその関係性**
ユーザーが直接作るコンテンツ自体が中核資産になる。

- Character.AI: ユーザー生成キャラクター数千万体とエンゲージメント(ただし5.4で論じた通り、UGC蓄積に成功してもユニットエコノミクスや外部圧力で失敗することがある)
- GPTs(OpenAI)、Claude Projects: ユーザー作成のカスタムボット
- v0、Bolt.new: ユーザーが作って公開したアプリ
- Replicate、Civitai: ユーザー投稿のモデル・LoRA・プロンプト

フライホイールが二段階で回る: (1)コンテンツが他ユーザーを呼ぶ、(2)コンテンツとエンゲージメントの組がレコメンドモデル・基盤モデル改善のデータになる。

**F. 評価・正解データ(Eval Data as Asset)**
見落とされやすいが、ユーザーから集まった「正解/不正解」のラベル付きデータ自体が独自資産。

- ユーザーが訂正した出力 → ground truth pair
- 「この回答は事実誤認」フラグ → hallucination detectionのlabeled data
- ドメイン専門家による評価 → domain-specific judge訓練データ

bias-corrected judgeやItem Response Theoryベースのrubricを実装するには、calibration用のhuman-labeled datasetが必要で、これは時間をかけて運用しないと貯まらない。Scale AI、Surge AIが商売にしている領域だが、自社サービスを通じて自然に集まる方が筋が良い。

**G. 失敗パターンとエッジケース**
ユーザーが実際に踏んだ失敗・エラー・予期しない入力の集合。

- どんな入力でモデルが混乱するか
- どんなプロンプト構造で品質が落ちるか
- どんなドメイン用語が誤認識されるか
- どんな状況でガードレールが誤発動するか(false positive)

品質改善のロードマップそのもので、競合が新規参入しても実運用ログを持たないと辿れない改善経路になる。

**H. メタデータ・利用パターン**
ユーザーの利用パターン自体がプロダクト改善に効く。

- 機能ごとのretention rate
- 機能間の遷移パターン
- 時間帯・曜日・季節の利用傾向
- ユーザーセグメントごとの使い方の違い

レコメンド・パーソナライゼーション・課金プラン設計に直接使える。

### 6.3 データ類型と「効き先」のマトリクス

データ種ごとに後続段階への活き方が違う。

| データ種 | 段階4(ルーティング)への効き | 段階5(自社モデル)への効き | 段階6(プラットフォーム化)への効き |
|---|---|---|---|
| A. 会話履歴 | パーソナライゼーション判断材料 | 会話モデルfine-tune、判定モデル蒸留 | テナント別カスタマイズ |
| B. 嗜好データ | preference-aware routing | DPO/KTOで直接fine-tune | プラン別品質最適化 |
| C. 軌跡データ | task-aware routing | Agent fine-tuning | プラットフォーム上の他エージェントの教師データ |
| D. 構造化知識 | RAG retrieval最適化 | ドメイン特化埋め込み | エンタープライズ展開の核 |
| E. UGC | コンテンツベースルーティング | UGC品質予測モデル | マーケットプレイス収益化 |
| F. 評価データ | judgeによる動的ルーティング | ドメイン特化judge蒸留 | 第三者監査対応 |
| G. 失敗パターン | リスク回避ルーティング | adversarial fine-tune、ガード強化 | SLA保証 |
| H. 利用パターン | コスト最適ルーティング | usage-aware compression | 課金・パッケージング |

### 6.4 段階3の戦略的含意

**含意1: プロダクトの二重目的設計が必須になる**
段階1-2では「価値を提供する」ことが目的だが、段階3では「価値を提供しながら、後続段階の燃料となるデータを蓄積する」という二重の目的でプロダクトを設計する必要がある(4節(2)で困難として挙げた点の裏返し)。Cursorの「acceptance/rejection」がUXに自然に組み込まれているのは、この二重目的の良例。Midjourneyの「4枚から1枚選ぶ」UIも、ユーザーには自然な選択行為として、サービス側にはpreference dataとして機能する。**重要なのは、データ収集UIをユーザー体験の上から重ねるのではなく、本来のUXフローと一体化させること**。

**含意2: 経年劣化しない型を選ぶ**

- 経年劣化しない型: 構造化知識、UGC、評価データ、軌跡データ — モデルが進化しても価値が残る
- 経年劣化する型: モデル特定の出力、特定モデルバージョンへのfeedback — モデル変更で陳腐化する

可能な限り「モデル非依存」な形式で取るべき。「この応答が良かった」より「このユーザー意図に対してこの種の応答が良かった」という抽象度で記録する方が長持ちする。

**含意3: 不可視な蓄積の方が強い**
ユーザーから見える蓄積(「Claudeが私のことを覚えている」)は説明しやすいが、モートの観点では**ユーザーから不可視な蓄積**(嗜好データ、軌跡データ、評価データ)の方が競合が真似しにくく、自社モデル化への燃料効率が高い場合が多い。Character.AIの本質は個別記憶ではなく全ユーザー横断の会話engagement data、Cursorも個別プロジェクト記憶よりも全ユーザー横断のedit acceptance dataにある。

### 6.5 段階3を抜けたサービスの共通パターン

抜けたサービスを観察すると共通点がある。

**(a) 「使う行為」と「データ生成行為」が同じ**
Cursorの編集、Midjourneyの選択、Character.AIの会話。データ収集が独立した作業ではなく、本来の利用行為そのものから自然発生する。

**(b) 集まるデータが「客観的に検証可能」**
コードはコンパイル可能性で評価できる、画像は人間が選んだものが正解、検索は引用元の存在で検証できる。**正解が事後的に分かる**ドメインを選んでいる。逆にロールプレイ品質や創作の良し悪しのような客観的検証が弱いドメインは、段階3→段階5の移行が難しくなる。

**(c) 段階1の段階で既に段階3を見据えている**
創業時から「何を蓄積するか」が明確。Cursorは創業時からエディタフォークを選び、編集ログ全部を取れる体制を作った。

**(d) ドメインを意図的に狭く設定している**
汎用ではなく特化。Harveyは法律、Cursorはコード、Perplexityは検索引用、Gleanは社内検索。**狭いドメインの方がデータが効きやすく、汎用モデルが追いつきにくい**。

**(e) ユーザーがプロフェッショナル/ヘビーユーザー**
趣味ユーザーよりプロのデータの方が品質が高く、価値も高い(課金もする)。

### 6.6 まとめ

段階3は「**プロダクトをデータ収集装置として再設計する段階**」である。学術論文を読んで解ける問題ではなく、プロダクト戦略・UX設計・組織能力・経営判断が交差する領域である。

論文が段階4以降に集中しているからといって段階4以降が難しいのではない。むしろ**段階3は学術的に研究しにくく、論文を読んでも解けず、組織的負荷が高く、短期指標を改善せず、データ品質と利用形式の整合性が要求され、汎用モデルの進化と競争する**、という重層的な困難があるからこそ、ここで多くのサービスが死んでいく。

これは逆に言えば、**段階3を意図的に・戦略的に設計できるチームには、論文に書かれていない持続的なモートを構築する余地がある**ということでもある。

---

## Appendix A: 用語集

エンジニア向けに頻出略語と簡易定義をまとめる。

### モデル・基盤

- **LLM** (Large Language Model): GPT-4、Claude、Geminiなどの大規模言語モデル
- **SLM** (Small Language Model): 7B〜数十B程度の小規模モデル。エッジ・コスト最適化用途
- **Foundation Model**: 汎用的に使える基盤モデル(LLMを包含する広い概念)
- **MCP** (Model Context Protocol): Anthropic提唱のAI-外部ツール接続標準
- **WebMCP**: Googleが2026年2月Chrome Canaryで実装した、ウェブサイトをAIエージェント用ツールに構造化するプロトコル

### Fine-tuning・最適化手法

- **PEFT** (Parameter-Efficient Fine-Tuning): モデル全体ではなく一部パラメータだけ更新する効率的fine-tune手法群
- **LoRA** (Low-Rank Adaptation): PEFTの代表手法。低ランク行列を追加して学習
- **QLoRA**: LoRAを量子化と組み合わせ、メモリ効率をさらに改善
- **DPO** (Direct Preference Optimization): 報酬モデルを介さず、preference dataから直接モデルを最適化
- **KTO** (Kahneman-Tversky Optimization): DPOの派生。binary feedbackで動く
- **RLHF** (RL from Human Feedback): 人間のフィードバックを報酬信号にした強化学習
- **RLAIF** (RL from AI Feedback): RLHFのフィードバックをAIに置き換えたもの
- **Knowledge Distillation**: 大モデル(教師)から小モデル(生徒)へ知識転移

### RAG・検索

- **RAG** (Retrieval-Augmented Generation): 外部知識を検索してLLMに渡す手法
- **Graph RAG**: 知識グラフを使ったRAG
- **Vector DB**: 埋め込みベクトルを高速検索するDB(Pinecone、Weaviate、Chroma等)

### エージェント・評価

- **CUA** (Computer-Using Agent): OpenAIのコンピュータ操作エージェント
- **OSWorld**: OS操作タスクのベンチマーク。Claude SonnetがVercept買収後72.5%
- **SWE-bench**: GitHub issuesを解くベンチマーク
- **LongMemEval**: 長期記憶エージェントの評価ベンチマーク(ICLR 2025)
- **TRAJECT-Bench**: tool useのtrajectory評価ベンチマーク(2025年10月)

### Observability・Guardrails

- **OTel** (OpenTelemetry): CNCFのオブザーバビリティ標準
- **GenAI Semantic Conventions**: OTelのGenAI向け拡張(現在策定中)
- **LLM-as-a-Judge**: LLMで他のLLM出力を評価する手法
- **G-Eval**: chain-of-thought付きLLM評価のEMNLP 2023手法

### ビジネス用語

- **ARR** (Annual Recurring Revenue): 年間経常収益
- **MRR** (Monthly Recurring Revenue): 月間経常収益
- **DAU/MAU**: Daily/Monthly Active Users
- **Reverse Acqui-hire**: 通常の買収ではなく、人材+技術ライセンスの形でBig Techに吸収される取引形態(2024〜2025に流行)
- **Data Network Effect**: ユーザーが使うほどデータが貯まり、サービス品質向上 → ユーザー増加というフライホイール

---

## Appendix C: 段階3設計チェックリスト

自社プロダクトを診断するための質問リスト。エンジニア向けに、機能設計・データ基盤・運用の3観点で整理。

### 機能設計の観点

- [ ] 主要なユーザーアクション(クリック、選択、編集、コピー)が**preference signal**として記録されているか?
- [ ] そのpreference signalは**DPO/KTO形式**(prompt + chosen + rejected)に変換可能か?
- [ ] ユーザーが「修正した箇所」「採用しなかった出力」「やり直した操作」が**明示的にログ**されているか?
- [ ] エージェント系の場合、tool call の **trajectory全体**(成功・失敗・人間介入含む)が再現可能な形でログされているか?
- [ ] データ収集UIが「アンケート」のように**追加負荷**になっていないか? UXフローと一体化しているか?
- [ ] ユーザーが感じる価値と、サービス側に貯まるデータが**ズレていないか**?

### データ基盤の観点

- [ ] ログのスキーマが**モデル非依存**か? モデルバージョンを変えてもデータが活き続けるか?
- [ ] PII・センシティブデータが分離され、fine-tuneに使う際の**法的経路**が確認されているか?
- [ ] データの**バージョニング**(いつ、どのプロンプト、どのモデルで取られたか)が明確か?
- [ ] **calibration set**(human-labeled の少数高品質データ)と**production log**(大量・低品質)が両方蓄積される設計になっているか?
- [ ] 失敗パターン・エッジケースが**検索可能**な形で蓄積されているか?

### 運用・組織の観点

- [ ] 段階5(自社モデル)に進むための**最小データ量**が見積もられているか?
- [ ] そのデータ量を貯めるまでの**runway**(資金・時間)があるか?
- [ ] データの蓄積が短期KPIには現れないことを、経営・投資家と**合意**しているか?
- [ ] **ML/Research人材**の採用計画があるか? 段階3だけでは要らないが、段階5では必須
- [ ] 競合が同じデータを後から集めようとしたとき、**追いつくのに何年かかるか**? それが事業計画と整合するか?

### 戦略の観点

- [ ] ドメインが**意図的に狭く**設定されているか? 汎用LLMに飲み込まれない狭さか?
- [ ] 集まるデータが**客観的に検証可能**(コンパイル可能、引用検証可能、人間が選んだ)か?
- [ ] ターゲットユーザーが**プロフェッショナル/ヘビーユーザー**か? 趣味ユーザーは段階3の燃料として弱い
- [ ] 「使う行為」と「データ生成行為」が**同じ**になっているか?(別々だと両方に投資が必要で組織負荷が倍)
- [ ] 仮にBig Techが同分野の汎用機能を出してきたとき、**3年生き残れる**ユニークな蓄積はあるか?

このチェックリストで「No」が多い項目は、まさに段階3で詰まる可能性が高いポイント。

---

## Appendix E: 参考文献・出典

### 失敗事例・業界動向

- Felix Neumann, "Most AI Startups Are Just Wrappers That Won't Exist In A Couple Of Years" (Medium, 2025)
- Mohsin Akram, "I Analyzed 24 Failed AI Startups (After ChatGPT)" (2025)
- The Information, Maginative, TechCrunch, Fortune の各種報道(Jasper、Inflection、Adept、Character.AI関連)
- Sacra "Character.AI revenue, funding & news"
- Digital Applied "AI Product Failures 2026: Sora, Humane & Rabbit R1"
- Generational, "Unpacking Big Tech's quasi-acquisitions of GenAI companies"

### 段階4(ルーティング)関連論文

- xRouter: "Training Cost-Aware LLMs Orchestration System via Reinforcement Learning" (arXiv:2510.08439)
- OmniRouter/ECCOS (arXiv:2502.20576)
- Pick and Spin (arXiv:2512.22402)
- MoMA: "Towards Generalized Routing" (arXiv:2509.07571)
- RouteLLM、FrugalGPT、Router-R1(先行研究)

### 段階5(蒸留・fine-tune)関連論文

- Adapt-and-Distill (arXiv:2106.13474)
- Flipping Knowledge Distillation (ACL 2025)
- TuneShift-KD (arXiv:2603.24518)
- FineScope (arXiv:2505.00624)
- Agent Fine-tuning through Distillation (arXiv:2510.00482)

### メモリ・段階3技術関連論文

- "Memory in the Age of AI Agents" survey (arXiv:2512.13564)
- "Rethinking Memory in LLM based Agents" (arXiv:2505.00675)
- MemMachine (arXiv:2604.04853)
- Field-Theoretic Memory (arXiv:2602.21220)
- Agent-Memory-Paper-List (GitHub: Shichun-Liu/Agent-Memory-Paper-List)

### 評価・LLM-as-a-Judge関連

- Autorubric (arXiv:2603.00077)
- Multi-Agent LLM Judge (Cao et al., 2025)
- TRAJECT-Bench (arXiv:2510.04550)
- ToolPRMBench (arXiv:2601.12294)
- ReliabilityBench (arXiv:2601.06112)
- Adnan Masood, "Rubric-Based Evaluations & LLM-as-a-Judge" (Medium, 2026)
- Promptfoo, Langfuse, Monte Carlo の各種ドキュメント

### Observability・Guardrails

- OpenTelemetry GenAI Semantic Conventions (公式ドキュメント)
- Traceloop OpenLLMetry, OpenLIT (GitHub)
- LangSmith, Langfuse, Helicone (公式ドキュメント)
- "Bypassing Prompt Injection and Jailbreak Detection in LLM Guardrails" (arXiv:2504.11168)
- NeMo Guardrails (arXiv:2310.10501)

### Computer Use・ブラウザエージェント

- Anthropic Computer Use, OpenAI Operator/CUA, Google Gemini 2.5 Computer Use の公式アナウンス
- "The State of AI Browser Agents in 2025" (FillApp Blog)
- "AI Browser Agents: The New Automation Layer" (Fordel Studios, 2026)

### コンテキスト・RAG

- RAGFlow "From RAG to Context - A 2025 year-end review" (2025年12月)
- LangChain、LlamaIndex、Haystack、DSPy の各公式ドキュメント
