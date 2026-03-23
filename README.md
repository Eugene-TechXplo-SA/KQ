# KING and QUEEN - Sample UI

This repository contains the **sample UI (screen mockups)** for KING and QUEEN.
It is intended for sharing the screen structure and layout, and should be used as a starting point for implementation.

## Project Structure

```text
KingsAndQueen/
├── samples/                 # Sample UI
│   ├── interactive/         # For local browser preview
│   │   ├── admin/           # Admin console (self-contained HTML)
│   │   └── user/            # User app + landing page
│   └── toFigma/             # For Figma export (static HTML)
│       ├── admin/           # Admin screens ja/en
│       ├── user/            # User app ja/en
│       └── lp/              # Landing page
```

## Preview the Sample UI Locally

All HTML files under `samples/interactive/` are self-contained.
You can preview the screens by simply starting a local server.

```bash
# Admin Console — http://localhost:8001
python3 -m http.server 8001 --directory samples/interactive/admin

# User App — http://localhost:8002
python3 -m http.server 8002 --directory samples/interactive/user
```

### Admin Console

* File: `samples/interactive/admin/index.html`
* Features: Dashboard, account opening approval, CSV import and ledger reflection, withdrawal management, user management, token ledger, announcement management, and master management

### User App

* Files: `samples/interactive/user/index.html` (app), `lp.html` (landing page)
* Features: Wallet connection, account opening flow, point and balance display, portfolio, leaderboard, and store


---

# KING and QUEEN - Sample UI

このリポジトリには、KING and QUEEN の「サンプルUI（画面イメージ）」が含まれています。  
画面構成やレイアウトの共有を目的としており、実装の出発点として利用してください。

## プロジェクト構成

```
KingsAndQueen/
├── samples/                 # サンプルUI
│   ├── interactive/         # ローカルブラウザで動作確認用
│   │   ├── admin/           # 管理画面（単体HTMLで完結）
│   │   └── user/            # ユーザーアプリ + LP
│   └── toFigma/             # Figma出力用（静的HTML）
│       ├── admin/           # 管理画面 ja/en
│       ├── user/            # ユーザーアプリ ja/en
│       └── lp/              # ランディングページ
```

## サンプルUI をローカルで確認する

`samples/interactive/` 配下の HTML はすべて単体で完結しています。
ローカルサーバーを立てるだけで画面を確認できます。

```bash
# Admin（管理コンソール）— http://localhost:8001
python3 -m http.server 8001 --directory samples/interactive/admin

# User（ユーザーアプリ）— http://localhost:8002
python3 -m http.server 8002 --directory samples/interactive/user
```

### Admin（管理コンソール）

- ファイル: `samples/interactive/admin/index.html`
- 機能: ダッシュボード、口座開設承認、CSVインポート・台帳反映、出金管理、ユーザー管理、トークン台帳、お知らせ管理、マスター管理

### User（ユーザー向けアプリ）

- ファイル: `samples/interactive/user/index.html`（アプリ）、`lp.html`（ランディングページ）
- 機能: ウォレット接続、口座開設フロー、ポイント・残高表示、ポートフォリオ、リーダーボード、ストア
