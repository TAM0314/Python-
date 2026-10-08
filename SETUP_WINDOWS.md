# セットアップガイド（Windows）

このガイドは、Windows で Python 実習ツールを使うための手順です。

## 1. Node.js をインストール

1. https://nodejs.org/ にアクセス
2. 「LTS」版の Windows インストーラをダウンロード
3. ダウンロードした `msi` ファイルを実行
4. インストール中に「Add to PATH」または「PATH に追加する」オプションがあれば、必ずチェック
5. インストール完了後、PowerShell またはコマンドプロンプトを開く

次のコマンドを入力して確認します。

```powershell
node --version
npm --version
```

## 2. Python をインストール

1. https://www.python.org/downloads/windows/ にアクセス
2. 最新の Python 3 の「Download Windows installer」をダウンロード
3. インストーラを実行
4. 「Add Python to PATH」にチェック
5. インストールを完了させる

次のコマンドを入力して確認します。

```powershell
python --version
```

もし `python --version` が動かない場合は、代わりに次を入力してみてください。

```powershell
py --version
```

## 3. プロジェクトをダウンロード

1. GitHub のリポジトリページを開く
2. 「Code」 > 「Download ZIP」でダウンロード
3. ZIP を解凍
4. フォルダを開く

または、Git を使う場合:

```powershell
git clone https://github.com/TAM0314/Python-.git
```

## 4. 依存関係のインストール

プロジェクトフォルダに移動して、次を実行します。

```powershell
cd path\to\Python-development-environment
npm install
```

## 5. ツールを起動

```powershell
npm run dev
```

ブラウザで次にアクセスします。

```
http://localhost:3000
```

## 6. Python が見つからない場合の対処

PowerShell で `python --version` が使えない場合、次のように Python のパスを指定して起動します。

```powershell
set PYTHON_EXECUTABLE=C:\Users\yourname\AppData\Local\Programs\Python\Python311\python.exe
npm run dev
```

> `yourname` は自分の Windows ユーザー名に置き換えてください。
