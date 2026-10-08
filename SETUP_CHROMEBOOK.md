# セットアップガイド（Chromebook）

Chromebook で Python 実習ツールを動かす場合は、通常の Windows/Mac 手順と異なります。

## 1. Chromebook の種類を確認

Chromebook には主に次の2種類があります。

- Linux (Crostini) を使えるもの
- Linux が使えないもの

このツールを使うには、**Linux が使える Chromebook** が必要です。

## 2. Linux (Crostini) を有効にする

1. Chromebook の設定を開く
2. 「Linux (Beta)」または「Linux 開発環境」を探す
3. 有効にしてセットアップを進める

> もし Chromebook に Linux がない場合、このツールはそのままでは使えません。

## 3. Linux ターミナルを開く

Linux ターミナルを起動します。

## 4. Node.js と Python をインストール

### Node.js のインストール

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

次のコマンドで確認します。

```bash
node --version
npm --version
```

### Python のインストール

```bash
sudo apt-get update
sudo apt-get install -y python3 python3-venv python3-pip
```

次のコマンドで確認します。

```bash
python3 --version
```

## 5. プロジェクトをダウンロード

GitHub から ZIP をダウンロードして解凍するか、次のコマンドを使います。

```bash
git clone https://github.com/TAM0314/Python-.git
```

## 6. 依存関係をインストール

プロジェクトフォルダに移動して、次を実行します。

```bash
cd /path/to/Python-development-environment
npm install
```

## 7. ツールを起動

```bash
npm run dev
```

ブラウザで次にアクセスします。

```
http://localhost:3000
```

## 8. Python が `python3` で動く場合

次のように環境変数を設定して起動します。

```bash
export PYTHON_EXECUTABLE=$(which python3)
npm run dev
```

---

### 重要

- Chromebook では Linux を使える必要があります。
- Linux が使えない Chromebook では、このツールは動きません。
