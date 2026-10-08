# Python 実習ツール 初心者向けセットアップガイド

この資料は、高校の授業で生徒が自分の端末（Windows / Mac）を使って、ローカルで Python 実習ツールを動かすための手順です。

---

## 1. 何が必要か

- インターネット環境（初回セットアップ時）
- `Node.js`（JavaScript 実行環境）
- `Python`（Pythonコードを実行するため）
- このプロジェクトのファイル

> 一度セットアップが完了すれば、その端末ではオフラインでも動作します。

---

## 2. まずは Node.js をインストール

### Windows の場合

1. https://nodejs.org/ にアクセス
2. 「LTS」版の Windows インストーラをダウンロード
3. ダウンロードした `msi` ファイルを実行
4. インストール中に表示される画面で「Add to PATH」などがあればチェック
5. インストール完了後、PowerShell またはコマンドプロンプトを開く

次のコマンドを入力して、インストールが成功したか確認します。

```powershell
node --version
npm --version
```

### Mac の場合

1. https://nodejs.org/ にアクセス
2. 「LTS」版の macOS インストーラをダウンロード
3. ダウンロードした `.pkg` ファイルを実行し、手順に従ってインストール
4. ターミナルを開く

次のコマンドを入力して、インストールが成功したか確認します。

```bash
node --version
npm --version
```

---

## 3. Python をインストール

### Windows の場合

1. https://www.python.org/downloads/windows/ にアクセス
2. 最新の Python 3 の「Download Windows installer」をダウンロード
3. インストーラを実行
4. 必ず「Add Python to PATH」にチェックを入れる
5. インストールを続ける

次のコマンドで確認します。

```powershell
python --version
```

もし `python` コマンドが動かない場合は、次のコマンドを試します。

```powershell
py --version
```

### Mac の場合

1. https://www.python.org/downloads/macos/ にアクセス
2. 最新の Python 3 のインストーラをダウンロード
3. ダウンロードした `.pkg` を実行してインストール
4. ターミナルを開く

次のコマンドで確認します。

```bash
python3 --version
```

---

## 4. プロジェクトをダウンロード

### GitHub からダウンロードする方法

1. GitHub 上のリポジトリページを開く
2. 「Code」ボタンを押す
3. 「Download ZIP」を選ぶ
4. ZIP ファイルを解凍
5. フォルダを開く

### Git を使う方法

1. ターミナル / PowerShell を開く
2. 以下のように入力します

```bash
git clone https://github.com/TAM0314/Python-.git
```

> もし Git が入っていない場合は、ZIP ダウンロードで問題ありません。

---

## 5. 依存関係をインストール

プロジェクトのフォルダに移動して、次のコマンドを実行します。

```bash
cd path/to/Python-development-environment
npm install
```

- `npm install` はネットに接続して依存ライブラリをダウンロードします
- 初回だけ行えば、同じ端末ではオフラインでも使えます

---

## 6. ツールを起動する

```
npm run dev
```

起動後、ブラウザで次の URL を開きます。

```
http://localhost:3000
```

---

## 7. 使い方

1. 画面中央に Python コードを入力
2. 実行ボタンを押す
3. 左に実行結果が表示される
4. 右にエラーや改善案が表示される

---

## 8. Python が見つからないときの対処

### Windows の場合

`python --version` が使えないときは、次のいずれかのコマンドを試してください。

```powershell
python --version
py --version
```

上記が動かない場合は、Python のインストールが正しく完了していません。

#### それでも動かない場合

このプロジェクトでは、`PYTHON_EXECUTABLE` を使って Python の場所を指定できます。

```powershell
set PYTHON_EXECUTABLE=C:\Users\あなたのユーザー名\AppData\Local\Programs\Python\Python311\python.exe
npm run dev
```

### Mac の場合

```bash
export PYTHON_EXECUTABLE=/usr/local/bin/python3
npm run dev
```

---

## 9. よくある問題

### 1. `npm install` でエラーになる

- `node --version` を確認
- `npm --version` を確認
- もう一度 `npm install` を実行
- ネット接続があるか確認

### 2. `http://localhost:3000` にアクセスできない

- ターミナルにエラーが出ていないか確認
- `npm run dev` が実行中であることを確認
- 別のブラウザで試す

### 3. `Python 実行に失敗しました` と表示される

- Python が正しくインストールされているか確認
- `python --version` または `py --version` を実行
- `PYTHON_EXECUTABLE` を使って Python のパスを指定

---

## 10. 授業で使うときのコツ

- 事前に教員が1回だけ全体セットアップを実施
- 生徒は各自の端末で `npm install` を行い、動作確認する
- もし依存関係のダウンロードが重い場合は、学校の Wi-Fi を使う
- 端末によっては `python` コマンドが `python3` になる場合がある
- できれば事前に `Node.js` と `Python` のインストール動画や資料を用意

---

## 11. 事前チェックリスト

- [ ] Node.js がインストールされている
- [ ] Python がインストールされている
- [ ] `node --version` が動く
- [ ] `npm --version` が動く
- [ ] `python --version` または `py --version` が動く
- [ ] `npm install` を実行済み
- [ ] `npm run dev` で `http://localhost:3000` が開く
