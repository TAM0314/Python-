# Python Development Environment

Next.js-based classroom Python editor with a three-pane layout:

- 左: 実行結果
- 中央: Python コード入力
- 右: エラー解説 / 改善提案

## 使い方

1. `npm install`
2. `npm run dev`
3. `http://localhost:3000` にアクセス

## 機能

- Python コードを実行
- 実行結果を表示
- 簡易エラー解析を表示

## 注意

- Python 実行にはローカルの Python が必要です
- API ルートは `src/app/api/run-python/route.ts` で実装しています
