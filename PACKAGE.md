# パッケージ化手順

このプロジェクトをデスクトップアプリとして配布するための手順です。

## 前提条件

- Node.js がインストールされている
- npm が使える
- Python がインストールされている
- ネットワーク接続が利用可能であること（Electron バイナリのダウンロードに必要）

## 1. 依存パッケージをインストール

```bash
npm install
```

## 2. Electron 用の開発サーバーを動かす（テスト）

```bash
npm run electron:dev
```

このコマンドは、Next.js の開発サーバーを起動した上で Electron ウィンドウを開きます。

## 3. インストーラーを作成

```bash
npm run electron:build
```

実行後、`dist/` フォルダにインストーラーが作成されます。

### Windows

- `dist/` フォルダに `.exe` または `.zip` 形式のインストーラーが生成されます

### Mac

- `dist/` フォルダに `.dmg` または `.zip` 形式のインストーラーが生成されます

## 4. 配布時の注意

- ビルドしたアプリは、同じ OS で実行してください。
- Mac 用アプリは macOS でビルドし、Windows 用アプリは Windows でビルドします。
- Python 実行環境が必要です。アプリを配布する端末にも Python がインストールされている必要があります。

## 5. もし `npm install` が失敗したら

`electron` のパッケージは Electron 本体のダウンロードを行います。ネットワーク証明書の問題や会社ネットワークの制限がある場合は、以下を確認してください。

- インターネット接続があるか
- プロキシや証明書フィルタがないか
- `npm config get registry` が `https://registry.npmjs.org/` になっているか

---

## 追加補足

- `package.json` には次のスクリプトを追加済みです。
  - `electron:dev`
  - `electron:build`
- `main.js` には Electron から Next.js アプリを起動するロジックを実装済みです。
