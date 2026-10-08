# Python Development Environment

このプロジェクトは、ブラウザで動く Python 実習ツールです。
初心者でも使いやすいように、Python のコードを入力して実行結果を確認できます。

- 左: 実行結果
- 中央: Python コード入力
- 右: エラー解説 / 改善提案

## 事前準備（最初に1回だけ）

各 OS に応じて、以下のガイドを参照してください。

- Windows: `SETUP_WINDOWS.md`
- Mac: `SETUP_MAC.md`
- Chromebook: `SETUP_CHROMEBOOK.md`

### 3. このプロジェクトをダウンロード

- GitHub から ZIP でダウンロードするか、`git clone` で取得します。
- プロジェクトのフォルダーに移動します。

```bash
cd /path/to/Python-development-environment
```

### 4. 依存パッケージをインストール

```bash
npm install
```

---

## 使い方

### 1. プロジェクトを起動

```bash
npm run dev
```

### 2. ブラウザで開く

次のURLをブラウザで開きます。

```
http://localhost:3000
```

### 3. Python コードを入力して実行

- 画面中央にコードを入力します。
- 実行ボタンを押すと、左側に結果が表示されます。
- 右側にはエラーの内容や改善案が出ます。

---

## よくある問題と解決方法

### Python が見つからない場合

Windows で `python --version` が動かないときは、次のように環境変数 `PYTHON_EXECUTABLE` を使います。

```bash
set PYTHON_EXECUTABLE=C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe
npm run dev
```

Mac では次のように指定します。

```bash
export PYTHON_EXECUTABLE=/usr/local/bin/python3
npm run dev
```

### npm install が失敗した場合

1. `node --version` が表示されるか確認する
2. `npm --version` が表示されるか確認する
3. もう一度 `npm install` を実行する

---

## 使える機能

- Python のコードをブラウザ上で実行
- 実行結果を表示
- エラー発生時に簡単な解説を表示

---

## 注意点

- 端末に Python がインストールされている必要があります。
- 初回セットアップはオンライン環境で行います。
- 一度 `npm install` すれば、同じ端末ではオフラインでも動かせます。
- Python 実行部分は `src/app/api/run-python/route.ts` で実装されています。

---

## 追加資料

- 初心者向けのセットアップガイド: `SETUP_GUIDE.md`
- OS別セットアップガイド: `SETUP_WINDOWS.md`, `SETUP_MAC.md`, `SETUP_CHROMEBOOK.md`
- デスクトップアプリ化/配布手順: `PACKAGE.md`
