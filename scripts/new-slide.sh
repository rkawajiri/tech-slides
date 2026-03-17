#!/bin/bash
set -euo pipefail

DATE="${1:-$(date +%Y-%m-%d)}"
DIR="$DATE"

if [ -d "$DIR" ]; then
  echo "Already exists: $DIR"
  exit 1
fi

mkdir -p "$DIR"
cat > "$DIR/slides.md" <<EOF
---
marp: true
theme: default
paginate: true
---

# タイトル

$DATE

---

## アジェンダ

1. トピック1
2. トピック2
3. まとめ

---

## トピック1

---

## まとめ
EOF

echo "Created: $DIR/slides.md"
