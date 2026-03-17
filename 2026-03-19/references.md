# リファレンス集 — LLMOps 関連ツール・フレームワーク

スライド作成にあたって調査した各ツールの概要と参照先。

---

## deepeval

LLM 出力の評価に特化した OSS フレームワーク（Confident AI 社）。
内部的には **LLM-as-a-Judge** の仕組みで、評価用 LLM にスコアリングさせる。

- G-Eval: Chain-of-Thought で任意のカスタム基準を評価
- DAG Metric: 条件分岐のある多段階スコアリング
- 組み込みメトリクス: Faithfulness, Relevancy, Toxicity, Hallucination 等 50+
- pytest 統合でテスト的に実行可能
- Confident AI（クラウド版）でデータセット管理・本番モニタリングも可能

**軽量モデルでも重厚モデルでも使える** — モデル選択でコスト/精度を調整。

### 参照先
- 公式サイト: https://deepeval.com/
- GitHub: https://github.com/confident-ai/deepeval
- Getting Started: https://deepeval.com/docs/getting-started
- メトリクス一覧: https://deepeval.com/docs/metrics-introduction
- G-Eval: https://deepeval.com/docs/metrics-llm-evals
- DataCamp チュートリアル: https://www.datacamp.com/tutorial/deepeval

---

## DSPy

Stanford NLP 発の「プロンプトを書くのではなくプログラムする」フレームワーク。
Signature（入出力の型定義）と Module（LLM 呼び出し戦略）を組み合わせ、
Optimizer がメトリクスに基づいて最適なプロンプト/Few-Shot 例を自動探索する。

- COPRO: 座標上昇法でインストラクションを最適化
- MIPROv2: ベイズ最適化でインストラクション + Few-Shot を同時探索
- モデル非依存: GPT-4, Claude, Llama 等を切り替え可能
- RAG・Agent・分類器など幅広いユースケースに対応

### 参照先
- 公式サイト: https://dspy.ai/
- GitHub: https://github.com/stanfordnlp/dspy
- Optimization Overview: https://dspy.ai/learn/optimization/overview/
- Optimizers: https://dspy.ai/learn/optimization/optimizers/
- TDS 記事: https://towardsdatascience.com/systematic-llm-prompt-engineering-using-dspy-optimization/

---

## LLMOps 全般

LLM アプリのライフサイクル全体（開発・評価・デプロイ・監視・改善）を管理する分野。
MLOps の延長だが、非決定的な自然言語出力・高い推論コスト・再現性の困難さなど固有の課題がある。

2025年以降のトレンド:
- 自律運用（Autonomous Ops）
- コスト最適化
- ガバナンス（SOC2, HIPAA 対応）

### 参照先
- LLMOps ガイド: https://www.aiacceleratorinstitute.com/your-guide-to-llmops/
- LLMOps Tools of Choice 2025: https://www.aiacceleratorinstitute.com/llmops-tools-of-choice-2025/
- 10 Best LLMOps Tools 2026: https://www.truefoundry.com/blog/llmops-tools

---

## Langfuse

OSS の LLM エンジニアリングプラットフォーム。トレース・評価・プロンプト管理を統合。

- OpenTelemetry ネイティブ（SDK v3 は OTel クライアント上の薄いレイヤー）
- セルフホスト可能（OSS コンポーネントのみ依存）
- LLM-as-a-Judge 評価、プロンプトバージョン管理、データセット管理
- LangChain, OpenAI SDK, LiteLLM 等と統合

### 参照先
- 公式サイト: https://langfuse.com/
- GitHub: https://github.com/langfuse/langfuse
- Observability: https://langfuse.com/docs/observability/overview
- OTel 統合: https://langfuse.com/integrations/native/opentelemetry
- セルフホスト: https://langfuse.com/self-hosting

---

## Arize Phoenix

OSS の AI Observability & Evaluation プラットフォーム。

- OpenTelemetry ベース、ベンダー/フレームワーク非依存
- 完全 OSS・セルフホスト可能（機能制限なし）
- トレース、評価（LLM-as-Judge）、データセット管理、プロンプト Playground
- OpenAI Agents SDK, Claude Agent SDK, LangGraph, DSPy 等に対応

### 参照先
- 公式サイト: https://phoenix.arize.com/
- GitHub: https://github.com/Arize-ai/phoenix
- ドキュメント: https://arize.com/docs/phoenix

---

## Braintrust

AI Observability プラットフォーム（商用 SaaS）。eval ブロッキングが組み込み。

- 全 LLM コールをログ（Agent のツール呼び出し含む）
- 組み込み evaluator: LLM-as-Judge, Factuality, Coherence, Toxicity 等（autoevals）
- CI でのリグレッション検知、プロンプト比較
- SOC 2 Type II / HIPAA / GDPR 準拠
- Notion, Dropbox, Zapier 等が利用

### 参照先
- 公式サイト: https://www.braintrust.dev/
- autoevals GitHub: https://github.com/braintrustdata/autoevals
- Evaluate ドキュメント: https://www.braintrust.dev/docs/evaluate
- LLMOps 比較記事: https://www.braintrust.dev/articles/best-llmops-platforms-2025

---

## LangSmith

LangChain 社の Agent / LLM Observability & Evals プラットフォーム（商用 SaaS）。

- フレームワーク非依存（LangGraph 以外でも利用可能）
- Offline eval（開発時）と Online eval（本番リアルタイム）の両方に対応
- 評価タイプ: Human, Heuristic, LLM-as-Judge, Pairwise comparison
- コスト・レイテンシ・エラー率のダッシュボード & アラート

### 参照先
- 公式サイト: https://www.langchain.com/langsmith-platform
- Evaluation: https://docs.langchain.com/langsmith/evaluation
- Observability: https://www.langchain.com/langsmith/observability

---

## AgentOps（プラットフォーム & 概念）

### プラットフォームとしての AgentOps (agentops.ai)

AI Agent の監視・デバッグに特化した開発者プラットフォーム。

- 2行のコードで導入可能、セッションリプレイ・メトリクス・ライブモニタリング
- CrewAI, OpenAI Agents SDK, LangChain, Autogen, AG2, CamelAI 等 400+ と統合
- LLM コール・ツール使用・マルチエージェント間のやり取りを可視化
- TypeScript/JavaScript にも対応

### 概念としての AgentOps

LLMOps の次の進化形。自律的に行動する AI Agent の運用を管理する分野。

- **LLMOps**: LLM の入出力（トークン・プロンプト・コスト）を管理
- **AgentOps**: マルチステップの推論チェーン・ツール呼び出し・意思決定ループを管理
- LLMOps だけではカバーできない障害モード（意図しない副作用、サイレントループ等）に対応
- 進化の流れ: **MLOps → LLMOps → AgentOps**
- Deloitte 予測: 2027年までに GenAI 利用企業の 50% が AI Agent をデプロイ

### 参照先
- 公式サイト: https://www.agentops.ai/
- ドキュメント: https://docs.agentops.ai/
- GitHub: https://github.com/AgentOps-AI/agentops
- IBM 解説: https://www.ibm.com/think/topics/agentops
- Ops 進化ガイド: https://intellibytes.substack.com/p/devops-vs-mlops-vs-llmops-vs-aiops
- MLOps→LLMOps→AgentOps 解説: https://www.covasant.com/blogs/mlops-llmops-agentops-the-essential-ai-pipeline-guide
