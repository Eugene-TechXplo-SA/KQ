# 技術スタック

> Notion Source: https://www.notion.so/318541c6043480fcab21fe88c77185f8

## Project Overview
- **ユーザー向け**: モバイルファーストのレスポンシブWebアプリ
- **管理者向け**: PC向け管理画面（Web）
- **ドメイン**: FX取引量に応じたトークン付与プラットフォーム（内部台帳管理 + 手動出金）

---

## Architecture Direction

仕様書から読み取れるアーキテクチャ要件:

| 要件 | 仕様書の根拠 |
|------|-------------|
| REST API (`/v1` versioning) | 外部IF要求書で明記 |
| JWT認証 (Bearer Token) | Identity & Access ドメインモデルで確定 |
| UUID (全主要リソースID) | 外部IF要求書で明記 |
| 整数演算 (`amount_atomic`) | 浮動小数禁止、最小単位の整数で保持 |
| 追記型台帳 (Append-only Ledger) | BR-09 台帳不変・二重計上防止 |
| 監査ログ必須 | BR-04 全重要操作で監査ログ |
| 冪等性 (Idempotency-Key) | 外部IF要求書で定義 |
| オフセットページング | `page/page_size` 方式 |

---

## Recommended Tech Stack

### Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js** (App Router) | モバイルファースト + 管理画面をモノレポで管理可能、SSR/SSG対応 |
| Language | **TypeScript** | 型安全性、`amount_atomic`の整数制約を型で表現 |
| UI Library | **Tailwind CSS** + コンポーネントライブラリ (shadcn/ui等) | レスポンシブ対応、管理画面のテーブル/フォーム多用 |
| State/Data | **TanStack Query** (React Query) | REST APIとの連携、ページング/キャッシュ管理 |
| Wallet接続 | **WalletConnect** or カスタム (Izakaya Wallet SDK TBD) | Polygon対応 |

### Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | **Node.js** (or **Go/Rust** も選択肢) | TypeScript統一ならNode.js |
| Framework | **NestJS** or **Hono** | 構造化されたREST API、DI、Guards(認可) |
| Language | **TypeScript** | フロントと型共有、ドメインモデルの表現力 |
| ORM/Query | **Prisma** or **Drizzle** | スキーマ管理、マイグレーション |
| Auth | **Firebase Auth** or **Supabase Auth** or 自前JWT | 認証レイヤーとしての利用はOK |
| CSV処理 | **papaparse** or **csv-parse** | ブローカー別CSVインポート |
| Validation | **zod** | リクエスト検証、`amount_atomic`の整数制約 |

### Database / Infrastructure

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Primary DB | **PostgreSQL** | 追記型台帳(Ledger)、ACID保証、UUID対応、整数演算 |
| Hosting | **AWS** (ECS/Fargate or Lambda) or **GCP** (Cloud Run) | スケーラビリティ、セキュリティ管理の自由度 |
| File Storage | **S3** (or GCS) | CSV一時保存 |
| CI/CD | **GitHub Actions** | 標準的なワークフロー |

---

## Firebase / Supabase の利用方針

Firebase / Supabase は **許容範囲内で利用OK**。ただし、ビジネスロジックの中核をBaaSに依存させないこと。

### OK（利用して良い範囲）

| Service | Use Case | Note |
|---------|----------|------|
| **Firebase Auth / Supabase Auth** | ユーザー認証・JWT発行 | 認証レイヤーとして利用OK |
| **Firebase Storage / Supabase Storage** | CSVファイルの一時保存 | ファイルアップロードのみ |
| **Supabase Database (PostgreSQL)** | ホスティングされたPostgreSQLとして利用 | DB基盤として利用OK |
| **Resend / SendGrid** | パスワードリセットメール | メール送信 |
| **Vercel** | フロントエンドホスティング | Next.jsデプロイ |
| **Sentry** | エラー監視 | フロント/バック共通 |
| **CloudFlare** | CDN / DDoS防御 | エッジ保護 |

### NG（BaaSに委ねてはいけない範囲）

以下の処理はバックエンドAPIで自前実装すること。BaaSのクライアントSDKやRLS/Functionsだけで済ませない。

| 領域 | 理由 |
|------|------|
| **台帳の書き込み・残高計算** | 追記型台帳(append-only)の厳密なトランザクション制御が必要。Firestoreのドキュメントモデルでは`amount_atomic`の整合性保証が困難 |
| **付与計算ロジック (BR-08)** | 原資 x 還元率 x ランク倍率 x キャンペーン倍率 → 配分 → 端数処理の一連の計算はサーバーサイドで完結させる |
| **状態遷移の制御** | `PENDING→APPROVED→COMPLETED` 等の遷移制約をRLSだけで表現するのは脆弱。APIレイヤーでガードする |
| **冪等性制御** | `Idempotency-Key`ベースの二重実行防止はRDBのユニーク制約+トランザクションで実装する |
| **監査ログの記録** | BR-04で全重要操作の監査ログが必須。BaaS任せにせずAPI側で確実に記録する |
| **認可判定 (User/Admin)** | 認証はBaaSでOKだが、「どの操作が許可されるか」の判定はAPI側で行う |

---

## Key Domain Boundaries (for Offshore Team)

```
├── Identity & Access      ... ユーザー/Admin認証、KYC、Wallet接続
├── Broker Integration     ... 口座連携申請、承認/却下
├── Trade Import & Ledger  ... CSV取込、付与計算、台帳管理 ★最重要
├── Withdrawals            ... 出金申請、承認、TxHash記録
├── Rewards / Rank         ... ランク、キャンペーン、配分
├── Notifications & CMS    ... お知らせ管理
└── Platform Ops           ... 緊急停止、監査ログ、異常検知
```
