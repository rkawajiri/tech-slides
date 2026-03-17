---
paths:
  - ".claude/settings.json"
---

`permissions.allow` は必ずサブコマンド単位で範囲を絞ること。

- `Bash(git:*)` や `Bash(pnpm:*)` のようなワイルドカードでの一括許可は禁止
- 正しい例: `Bash(git status:*)`, `Bash(pnpm check:*)`
- 新しいコマンドが必要になったら個別に追加する
