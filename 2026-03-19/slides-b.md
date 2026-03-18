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

## めろ とは

- AI キャラクターとの音声ロールプレイアプリ
- LLM でシナリオ・セリフ・感情を生成
- リリース後も継続的に品質を改善中

> **「LLMアプリは、作るより育てる方が難しい」**

これから紹介するのは、めろ で **実際に直面した4つの課題** と、それぞれの解決策です

---

<!-- _class: lead -->

# 😱 課題 1
## LLM出力の品質が分からない

---

## Before: 品質が「感覚」でしか分からない

### LLMアプリ特有の難しさ

| | 従来ソフトウェア | LLMアプリ |
|---|---|---|
| **出力** | 決定的 | 非決定的（自然言語） |
| **正解** | 仕様で定義 | 曖昧（主観的） |
| **再現性** | ほぼ完全 | 困難 |

- 「なんか最近キャラの応答が変だな」← これしか分からない
- 人間が全部レビューする？ → **スケールしない**

<!-- 聴衆の共感を得るパート。「あるある」を狙う -->

---

## After: 3段階評価 — テストピラミッドの発想

| | Tier 1 形式検証 | Tier 2 Judge 軽量 | Tier 3 Judge 重厚 |
|---|---|---|---|
| **FE例え** | Lint / 型チェック | ユニットテスト | QAレビュー |
| **ツール** | ANTLR4 | deepeval + 軽量LLM | deepeval + GPT-4等 |
| **対象** | 全件 | CI / バッチ | サンプリング |
| **コスト** | ◎ 極小 | ○ 中程度 | △ 高い |

**軽い → 重い** の順に3段階で品質を数値化

![w:1000](diagrams/dev-eval.svg)

<!-- テストピラミッドと同じ。下が広くて安い、上が狭くて高い -->

---

## 深掘り: 実際のコード

### Tier 1 — ANTLR4 で構造チェック（全件・コスト極小）

```
✅ {"emotion": "happy", "line": "こんにちは！"}
❌ {"emotion": "happy", "line": こんにちは！}  ← JSON壊れ
❌ {"feeling": "happy", ...}  ← スキーマ違反
```

### Tier 2-3 — deepeval で品質スコア（LLM-as-a-Judge）

```python
from deepeval.metrics import FaithfulnessMetric
metric = FaithfulnessMetric(threshold=0.7)
# G-Eval ベース: CoT で評価ステップ生成 → スコアリング
# 人間評価との相関が高い（論文で実証済み）
```

<!-- Tier 1 でクラッシュ激減、Tier 2 で品質の見える化を実現 -->

---

<!-- _class: lead -->

# 🔍 課題 2
## 本番で何が起きているか分からない

---

## Before: デプロイしたら祈るだけ？

### Google Cloud のメトリクスでは見えない世界

- レイテンシ・エラーレート・稼働率 → **インフラは見える**
- でも…
  - 「モデルがハルシネーションした」→ 200 OK で返る
  - 「キャラが別人になった」→ メトリクス上は正常
  - 「有害な発言が混入した」→ アラートは鳴らない

> **インフラの健全性 ≠ LLMの品質**

<!-- ここが従来のモニタリングとの決定的な違い -->

---

## After: OTel で 3層モニタリング

![w:1000](diagrams/prod-mon.svg)

### OpenTelemetry で統一収集

![w:700](diagrams/otel-architecture.svg)

**導入の苦労:** 概念の壁（Span / Trace / Baggage）、SDK差異、GenAI Semantic Conventions がまだ Experimental

<!-- Claude と相談しながら進めた。概念理解が最大のハードル -->

---

<!-- _class: lead -->

# 🔄 課題 3
## 改善が回らない

---

## Before: 評価はあるが改善につながらない

### ありがちなパターン
- 「スコアが下がった」→ 誰が見る？ → 放置
- 「ユーザーからクレーム」→ 場当たり的に対応
- 評価指標と改善アクションが **つながっていない**

> 評価を「作る」のは序章。**回す仕組み** がないと意味がない

---

## After: 4つのフィードバックループ

![w:900](diagrams/feedback-loops.svg)

| ループ | トリガー | サイクル |
|---|---|---|
| ① 即時修正 | ANTLR4 形式エラー | 分単位 |
| ② 設計見直し | LLM Judge 低スコア | 日単位 |
| ③ 長期改善 | ユーザーフィードバック | 週〜月単位 |
| ④ 評価指標還元 | 本番分析 → 開発評価 | 月単位 |

**開発と本番で同じ指標を使い回す** → DSPy でプロンプト最適化も自動化

---

<!-- _class: lead -->

# ⚙️ 課題 4
## CI/CD にどう組み込む？

---

## Before: 手動 eval は続かない

### 現実
- 「週次でスコアを確認する」→ 3週目から忘れる
- 「リリース前に eval を回す」→ 急ぎのとき飛ばす
- 手動は必ずサボる → **仕組み化が必要**

---

## After: eval ゲート + コストのハイブリッド戦略

### CI に eval を組み込む

```yaml
- name: Run LLM Eval
  run: deepeval test run tests/eval_suite.py
- name: Deploy
  if: success()  # eval が通った場合のみ
  run: gcloud run deploy ...
```

### コストはハイブリッドで管理

| チェック種別 | 対象 | コスト |
|---|---|---|
| ルールベース | 全件 | ◎ |
| LLM Judge | サンプリング 5-10% | ○ |
| Human review | エスカレーション | △ |

<!-- npm test && npm run build と同じ。eval をゲートにする -->

---

## まとめ + ツール選定ガイド

### 4つの課題と解決策

| 課題 | 解決策 |
|---|---|
| 品質が分からない | 3段階評価（テストピラミッド） |
| 本番が見えない | OTel 3層モニタリング |
| 改善が回らない | 4つのフィードバックループ |
| CI/CD 統合 | eval ゲート + ハイブリッドコスト |

### ツール推奨
- OTelネイティブ + セルフホスト → **Langfuse** or **Arize Phoenix**
- eval ブロッキング組み込み → **Braintrust**

---

<!-- _class: lead -->

# 議論

### 4つの課題、あなたのチームではどうですか？

- 😱 品質 — LLM出力の品質をどう測っていますか？
- 🔍 監視 — 本番でLLMの品質をモニタリングしていますか？
- 🔄 改善 — フィードバックループは回っていますか？
- ⚙️ CI/CD — eval を自動化していますか？
