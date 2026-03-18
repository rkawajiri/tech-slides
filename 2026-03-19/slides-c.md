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

## めろ とは — LLMアプリの品質に向き合う日々

- AI キャラクターとの音声ロールプレイアプリ
- LLM でシナリオ・セリフ・感情を生成

### この発表でやること
- **説明 → デモ** を交互に繰り返します
- 実際のコード・ダッシュボードを見ながら進めます

> **「LLMアプリは、作るより育てる方が難しい」** — その育て方を実演します

---

## LLMOps — なぜ「育てる」が難しいのか

| 年 | テーマ | やること |
|---|---|---|
| 2024 | **作る** | Prompt engineering / RAG / Agent |
| 2025 | **育てる** ← 今ここ | LLMOps — 品質・運用・改善 |
| 2026〜 | **自律** | AgentOps |

### 従来ソフトウェアとの違い
- 出力が非決定的 → テストの発想そのものが変わる
- 「正解」が曖昧 → **LLMに評価させる（LLM-as-a-Judge）**

<!-- 背景を1枚で。ここは手短に -->

---

## 3段階評価 — テストピラミッドで設計する

| | Tier 1 形式検証 | Tier 2 Judge 軽量 | Tier 3 Judge 重厚 |
|---|---|---|---|
| **FE例え** | Lint / 型チェック | ユニットテスト | QAレビュー |
| **ツール** | ANTLR4 | deepeval + 軽量LLM | deepeval + GPT-4等 |
| **対象** | 全件 | CI / バッチ | サンプリング |
| **コスト** | ◎ 極小 | ○ 中程度 | △ 高い |

![w:1000](diagrams/dev-eval.svg)

<!-- 次のスライドでこれを実際に動かす -->

---

## 🖥 デモ: ANTLR4 + deepeval を動かす

### Tier 1 — ANTLR4 フォーマット検証

```
✅ {"emotion": "happy", "line": "こんにちは！"}
❌ {"emotion": "happy", "line": こんにちは！}  ← 即座に弾く
```

### Tier 2 — deepeval で品質スコア

```python
from deepeval.metrics import FaithfulnessMetric
metric = FaithfulnessMetric(threshold=0.7)
# → Score: 0.85 ✅ PASSED
```

<!-- ここでターミナルに切り替えて実演。ANTLR4 のパース → deepeval のスコア算出を見せる -->
<!-- デモ失敗時の代替：上記のコード例 + 結果のスクリーンショットを用意しておく -->

---

## 本番モニタリング — 現状と課題

### 今やっていること（Google Cloud）

- Cloud Monitoring でレイテンシ・エラーレート・稼働率を監視
- Cloud Logging でリクエスト/レスポンスのログ収集
- OTel でトレース・メトリクスを統一収集

### 見えていないこと

- 「200 OK で返ったけど、実はハルシネーションしていた」
- 「キャラクターの一貫性が崩れている」ことに気づけない
- LLM呼び出しごとのコスト・品質スコアが **紐づいていない**

> **インフラの健全性 ≠ LLMの品質** — ここを埋めたい

---

## Langfuse を導入したら何が変わるか

### 既存の OTel インフラをそのまま活用

- OTel SDK → Langfuse の `/api/public/otel` エンドポイントに送信
- **既存の Span / Trace がそのまま Langfuse に表示される**
- 追加の SDK 不要、設定変更だけで導入可能

### 今見えないものが見えるようになる

| 観点 | Google Cloud のみ | + Langfuse |
|---|---|---|
| **レイテンシ** | ✅ | ✅ + LLM呼び出し単位 |
| **コスト** | ❌ 手動集計 | ✅ トークン数・USD自動算出 |
| **品質スコア** | ❌ | ✅ Faithfulness等をトレースに紐付け |
| **I/O確認** | ログを検索 | ✅ トレース内でプロンプト/応答を直接確認 |
| **評価** | ❌ | ✅ LLM-as-a-Judge をダッシュボードで実行 |

---

## 🖥 Langfuse の画面イメージ

### Traces 一覧
- ユーザーインタラクションごとに1行表示
- **コスト・レイテンシ・品質スコア** がひと目で分かる
- フィルタ：モデル・ユーザー・日時・タグで絞り込み

### 実行ツリー（トレース詳細）
- LLM呼び出し → ツール実行 → 応答生成の **階層表示**
- 各ステップの入力/出力・トークン数・処理時間を確認
- 問題のあるステップを即座に特定

### コストダッシュボード
- モデル別・日次のコスト推移をグラフ表示
- 「先週から Claude の呼び出しコストが 30% 増えた」が一目瞭然

<!-- デモ: Langfuse のデモ環境（langfuse.com/docs/demo）を使って実際の画面を見せる -->
<!-- 代替: スクリーンショットを用意 -->

---

## フィードバックループ + CI/CD

![w:900](diagrams/feedback-loops.svg)

### 開発↔本番で同じ指標を回す

| ループ | トリガー | サイクル |
|---|---|---|
| ① 即時修正 | ANTLR4 形式エラー | 分単位 |
| ② 設計見直し | LLM Judge 低スコア | 日単位 |
| ③ 長期改善 | ユーザーフィードバック | 週〜月単位 |

### eval をCIゲートに

```yaml
- name: Run LLM Eval
  run: deepeval test run tests/eval_suite.py
- name: Deploy
  if: success()
  run: gcloud run deploy ...
```

---

## まとめ

### 今日のポイント

| やったこと | 効果 |
|---|---|
| 3段階評価 | 品質を数値で把握 |
| OTel モニタリング | 本番の動きを可視化 |
| フィードバックループ | 改善を仕組み化 |

### 次のステップ
- **Langfuse 導入**: OTel から接続して LLM 特化のオブザーバビリティを獲得
- **DSPy**: プロンプト最適化の自動化で改善ループを加速

> この発表資料も LLM（Claude）と相談しながら作りました
> **LLMアプリを育てる発表を、LLMで育てる** 🔄

---

<!-- _class: lead -->

# 議論

### デモを見て気になったことはありますか？

- 3段階評価、あなたのチームならどの Tier から始めますか？
- Langfuse のような LLM 特化ツール、導入してみたいですか？
- コストと品質のトレードオフ、どこに線を引きますか？
