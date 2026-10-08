# セットアップガイド（Mac）

このガイドは、Mac で Python 実習ツールを使うための手順です。

## 1. Node.js をインストール

1. https://nodejs.org/ にアクセス
2. 「LTS」版の macOS インストーラをダウンロード
3. `.pkg` ファイルを実行
4. 画面の指示に従ってインストール

次のコマンドをターミナルで入力して確認します。

```bash
node --version
npm --version
```

## 2. Python をインストール

1. https://www.python.org/downloads/macos/ にアクセス
2. 最新の Python 3 の macOS インストーラをダウンロード
3. `.pkg` ファイルを実行
4. 画面の指示に従ってインストール

次のコマンドをターミナルで入力して確認します。

```bash
python3 --version
```

## 3. プロジェクトをダウンロード

1. GitHub のリポジトリページを開く
2. 「Code」 > 「Download ZIP」でダウンロード
3. ZIP を解凍
4. フォルダを開く

または、Git を使う場合:

```bash
git clone https://github.com/TAM0314/Python-.git
```

## 4. 依存関係のインストール

プロジェクトフォルダに移動して、次を実行します。

```bash
cd /path/to/Python-development-environment
npm install
```

## 5. ツールを起動

```bash
npm run dev
```

ブラウザで次にアクセスします。

```
http://localhost:3000
```

## 6. Python が `python3` で動く場合

次のように環境変数を設定して起動します。

```bash
export PYTHON_EXECUTABLE=/usr/local/bin/python3
npm run dev
```
