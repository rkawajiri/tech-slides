---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: "Hiragino Sans", "Noto Sans JP", sans-serif;
  }
  table {
    font-size: 1em;
  }
  section.lead h1 {
    font-size: 2.2em;
  }
  section.lead p {
    font-size: 1.1em;
  }
---

<!-- _class: lead -->

# LLMアプリを育てる
## 評価・モニタリング・フィードバックループの実践

2026-03-19 社内勉強会
川尻 亮真

---

## aitalk-role-play とは

- AI キャラクターとの音声ロールプレイアプリ
- LLM でシナリオ・セリフ・感情を生成
- リリース後も継続的に品質を改善中

> **「LLMアプリは、作るより育てる方が難しい」**

---

## 業界の流れ

### 2024年 = **作る**年
- LLM アプリが爆発的に増加
- Prompt engineering / RAG / Agent の時代

### 2025年 = **育てる**年
- 品質の担保・運用・改善が課題に
- **LLMOps** という分野が確立

<!-- FEでいうと、React出始め→ テスト・CI/CD・監視が整った流れに似ている -->

---

## LLMOps の全体像

![w:1100](diagrams/llmops-comparison.svg)

<!-- 左が一般的なLLMOps。Prompt → 評価 → デプロイ → モニタリング → フィードバック → 再チューニング のサイクル -->

---

## 従来開発 → MLOps → LLMOps

| | 従来ソフトウェア | MLOps | LLMOps |
|---|---|---|---|
| **出力** | 決定的 | 非決定的（数値） | **非決定的（自然言語）** |
| **正解** | 仕様で定義 | ラベルあり | **曖昧（主観的）** |
| **コスト** | 実行は安い | 学習時が高い | **推論時も高い** |
| **再現性** | ほぼ完全 | シード固定で概ね可 | **困難** |

右に行くほど不確実性が増す → **テスト戦略の発想**が必要

---

## なぜ評価が難しいのか

### 確率的な出力
- 同じ入力でも毎回違う結果
- 「正解」が一つに定まらない

### 曖昧な品質基準
- 文法的に正しい ≠ 良い応答
- ニュアンス・トーン・キャラクター性

### → どうやって自動で測る？

---

## 3段階の評価 — Overview

![w:1000](diagrams/dev-eval.svg)

**軽い → 重い** の順に 3 段階で評価を重ねる

<!-- 緑=軽量、黄=中量、赤=重量。コストと粒度のグラデーション -->

---

## Tier 1: ANTLR4 フォーマット検証

**FEの例え：Lint / 型チェック**

- LLM出力が定義済みフォーマットに従っているか検証
- ANTLR4 で文法定義 → パース
- **全件チェック、コスト極小**

```
✅ {"emotion": "happy", "line": "こんにちは！"}
❌ {"emotion": "happy", "line": こんにちは！}  ← JSON壊れ
❌ {"feeling": "happy", ...}  ← スキーマ違反
```

<!-- CIの型チェックと同じ。壊れたら即ブロック -->

---

## Tier 2: deepeval メトリクス

**FEの例え：ユニットテスト**

- カスタムメトリクスで品質スコアを算出
- **Faithfulness** — 事実に忠実か
- **Relevancy** — 質問に対して適切か
- **Toxicity** — 有害でないか

```python
from deepeval.metrics import FaithfulnessMetric
metric = FaithfulnessMetric(threshold=0.7)
```

CI / バッチで定期実行、閾値でアラート

---

## Tier 3: LLM as a Judge

**FEの例え：QAレビュー / E2Eテスト**

- GPT-4 / Claude に「この応答は良いか？」を判定させる
- ニュアンス・キャラクター一貫性を評価可能
- **コストが高い → サンプリング実行**

```
あなたはQA担当です。以下の応答を評価してください：
- キャラクターの性格と一致しているか (1-5)
- 会話の文脈に合っているか (1-5)
- 不適切な表現がないか (Yes/No)
```

<!-- 人間レビューの代替。週次・手動トリガー -->

---

## 3段階 vs テスト戦略

| | Tier 1: 形式検証 | Tier 2: メトリクス | Tier 3: LLM Judge |
|---|---|---|---|
| **FEの例え** | Lint / 型チェック | ユニットテスト | QAレビュー |
| **ツール** | ANTLR4 | deepeval | GPT-4 / Claude |
| **対象** | 全件 | カスタム指標 | サンプリング |
| **コスト** | ◎ 極小 | ○ 中程度 | △ 高い |
| **実行頻度** | 毎回 | CI / バッチ | 週次 / 手動 |
| **検出できるもの** | 構造エラー | 品質低下 | 微妙なニュアンス |

<!-- テストピラミッドと同じ。下が広くて安い、上が狭くて高い -->

---

## モニタリング 3 層

![w:1000](diagrams/prod-mon.svg)

デプロイ後も **3層** で品質を監視し続ける

<!-- 緑=全件・安い、黄=サンプリング、赤=人間・高コスト -->

---

## OTel アーキテクチャ

![w:700](diagrams/otel-architecture.svg)

- **OpenTelemetry** でトレース・メトリクスを統一収集
- GCP サービスに分散して送信・分析

---

## OTel 導入の苦労話

### 概念理解が難しい
- Span / Trace / Baggage ... 独自用語の壁

### 言語差異
- Python SDK と Go SDK で挙動が微妙に違う

### GenAI Semantic Conventions
- LLM 用の convention はまだ Experimental（`gen_ai.request.model` 等）

> **Coding Agent（Claude）と相談しながら進めた** — Agent なしでは厳しかった

---

## フィードバックループ — 全体像

![w:900](diagrams/feedback-loops.svg)

開発と本番、**2種類のループ**が回り続ける

---

## フィードバックループ — 開発段階

![w:900](diagrams/feedback-dev.svg)

| ループ | トリガー | サイクル |
|---|---|---|
| ① 即時修正 | ANTLR4 形式エラー | 分単位 |
| ② 設計見直し | LLM Judge 低スコア | 日単位 |

---

## フィードバックループ — 運用段階

![w:900](diagrams/feedback-prod.svg)

| ループ | トリガー | サイクル |
|---|---|---|
| ③ 長期改善 | ユーザー / 社内フィードバック | 週〜月単位 |

---

## 標準フレームワークとの比較

### Microsoft の LLMOps 提唱
- Inner loop / Outer loop の概念
- 我々の実装はこれに近い構造

### DSPy の位置づけ
- プロンプトの最適化を **自動化**
- 評価メトリクスを定義 → 最適プロンプトを探索
- aitalk-role-play では構造化プロンプトに活用

> 標準に寄せつつ、自分たちのプロダクトに合わせてカスタマイズ

---

## ツール比較

| | Langfuse | Braintrust | LangSmith | Arize Phoenix |
|---|---|---|---|---|
| **OSS** | ✅ | ❌ | ❌ | ✅ |
| **OTel対応** | ✅ ネイティブ | △ | △ | ✅ |
| **セルフホスト** | ✅ | ❌ | ❌ | ✅ |
| **CI/CD連携** | ○ | ✅ ブロッキング | ○ | ○ |
| **価格** | 無料〜 | 有料 | 有料 | 無料〜 |

OTel ネイティブ + セルフホスト可能 → **Langfuse** or **Arize Phoenix** が有力

---

## eval が落ちたらデプロイをブロック

```yaml
# CI パイプライン例
- name: Run LLM Eval
  run: deepeval test run tests/eval_suite.py

- name: Deploy
  if: success()  # eval が通った場合のみ
  run: gcloud run deploy ...
```

- FE の `npm test && npm run build` と同じ発想
- **eval をゲートにする** ことで品質を担保
- Braintrust は eval ブロッキングが組み込み

---

## コスト設計の考え方

### 全件チェックは高すぎる → ハイブリッド戦略

| チェック種別 | 対象 | コスト |
|---|---|---|
| ルールベース | 全件 | ◎ |
| LLM judge | サンプリング（5-10%） | ○ |
| Human review | エスカレーション | △ |

### 議論してみたいこと
- サンプリング率はどう決める？
- コストと品質のトレードオフをどう判断する？

---

## まとめ — Key Takeaways

### 1. 評価は3段階で積み上げる
軽い検証 → メトリクス → LLM Judge（テストピラミッド）

### 2. 本番モニタリングは開発評価の延長
同じ指標を開発と本番で使い回す

### 3. フィードバックループを回し続ける
作って終わりではなく、**育て続ける**

> ちなみにこの発表資料も LLM（Claude）と相談しながら作りました。
> **LLMアプリを育てる発表を、LLMで育てる** — 再帰的な構造 🔄

---

<!-- _class: lead -->

# 議論

**みなさんのチームでは
LLMアプリの品質を
どう担保していますか？**

- 評価の仕組みはありますか？
- モニタリングで困っていることは？
- 気になったツールや手法は？
