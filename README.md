# tech-slides

Marp ベースのテック発表スライド集です。

## セットアップ

```bash
pnpm install
```

## コマンド

| コマンド | 説明 |
|---|---|
| `pnpm run preview <file>` | スライドのライブプレビュー |
| `pnpm run build` | HTML にビルド（`dist/` に出力） |
| `pnpm run pdf <file>` | PDF にエクスポート |
| `pnpm run new` | 新しいスライドを作成 |
| `pnpm run diagrams` | Mermaid 図を SVG に変換 |
| `pnpm run check` | スライドのオーバーフローを検出 |

## ディレクトリ構成

```
├── YYYY-MM-DD/        # 日付ごとのスライドディレクトリ
│   ├── slides.md      # スライド本体（Marp Markdown）
│   └── diagrams/      # Mermaid 図（.mmd → .svg）
├── theme/             # カスタムテーマ CSS
└── scripts/           # ユーティリティスクリプト
```

## 技術スタック

- [Marp CLI](https://github.com/marp-team/marp-cli) — Markdown → スライド変換
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) — 図の生成
- [Playwright](https://playwright.dev/) — オーバーフロー検出
