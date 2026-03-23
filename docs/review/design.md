# 設計レビュー: Kings & Queen 仕様書

> 設計者による総合評価・問題点分析・改善提案

---

## 1. 現状の設計評価

### 良い点

- **ドメイン分離が明確**: 7つの境界づけられたコンテキスト（Identity, Broker, Trade Import, Rewards, Withdrawals, Notifications, Platform Ops）の責務が概ね整理されている
- **追記型台帳**: BR-09の台帳不変原則は金融ドメインとして適切
- **状態遷移の網羅性**: 各エンティティの状態遷移図・ガード条件が丁寧に定義されている
- **Off-Systemフローの明示**: システム内外の境界が明確
- **決定ログ（D-01〜D-08）**: TBDの追跡と決定の記録が構造化されている

### 整合性評価

| 観点 | 評価 | 備考 |
|------|------|------|
| specs ↔ domain-model | △ | 用語は概ね一致。ただしentry_typeの命名が揺れている |
| specs ↔ csv-format | △ | CSV定義は具体的だが、一部の前提（報酬通貨）が未確定 |
| specs ↔ tech-stack | ○ | アーキテクチャ要件の根拠が仕様書に紐づいている |
| domain-model 内部 | △ | Trade Import と Rewards の責務境界が明記されたが、Ledger がまたがっている |

---

## 2. 発見した問題点

### 矛盾（4件）

| # | 問題 | 箇所 | 影響 |
|---|------|------|------|
| C-01 | **entry_typeの命名不一致**: specs/06 BR-09では `GRANT/CANCEL/ADJUST`、domain-model/03では `CREDIT/DEBIT/REVERSAL`、domain-model/05では `WITHDRAWAL_CRYPTO/WITHDRAWAL_REVERSAL` | specs/06_logic.md BR-09, domain-model/03, 05 | 実装者が混乱。台帳エントリの型を統一しないと整合性が崩れる |
| C-02 | **dedupe_keyの構成要素が不一致**: specs/06 BR-09では `batch_id + user_id + entry_type + asset_code`、domain-model/03では `reference_type + reference_id + entry_type(+asset)` | specs/06_logic.md, domain-model/03 | 二重計上防止の実装が文書間で異なり、どちらに従うか不明 |
| C-03 | **出金制限の通貨が矛盾**: 出金制限は「1,000円」「100万円」（JPY）だが、システムはUSD基準で動作。変換ロジックが未定義 | domain-model/05, specs/06 BR-03 | 為替レートの適用ルールが不明 |
| C-04 | **ランク判定: 手動 vs 自動の混在**: specs/06 BR-10は「月次バッチで自動判定」、specs/08は「手動設定」、domain-model/04は「月次自動判定」。Phase1で実際にどちらか不整合 | specs/06, 08, domain-model/04 | 実装優先度が不明確 |

### 曖昧さ（6件）

| # | 問題 | 箇所 |
|---|------|------|
| A-01 | **token_decimals未決定（TBD-02）**: 計算ロジック全体、API、台帳のatomic表現に影響。Phase1設計着手前に必須だが未確定 | specs/10_open_issues.md |
| A-02 | **除外条件の具体ルール（TBD-03）**: 最低取引時間等の基準が草案レベル | specs/10_open_issues.md |
| A-03 | **Izakaya Wallet接続プロトコル（TBD-05）**: OAuth? WalletConnect? カスタム? 未確定のまま | specs/10_open_issues.md |
| A-04 | **CSVの報酬額の通貨単位（TBD-34）**: USDかJPYか不明。原資R算出に直結する最重要TBD | specs/10_open_issues.md |
| A-05 | **複数キャンペーン重複時のルール**: domain-model/04では「最大値を採用」だが、specs/06 BR-11では「合算/最大値/優先度は下位設計で定義」と未確定 | specs/06, domain-model/04 |
| A-06 | **FX GT/EXNESSのtrade_closed_atの意味**: 口座サマリCSVなので「最後の取引」日時であり、個別取引の決済日時ではない。対象月判定の精度に影響 | docs/csv-format.md |

### 不足（6件）

| # | 問題 | 箇所 |
|---|------|------|
| M-01 | **MFA（多要素認証）の記述なし**: Admin全権限のMVPでMFA不要は危険 | specs/08, domain-model/01 |
| M-02 | **データ保持ポリシーの不在**: PII（個人情報）の保持期間、削除方針が未定義 | 全体 |
| M-03 | **バックアップ・DR（災害復旧）の記述なし**: 台帳データの保護方針がない | tech-stack.md |
| M-04 | **通信暗号化要件の明示なし**: HTTPS/TLS要件が外部I/F要求に含まれていない | specs/11_external_interface.md |
| M-05 | **BANユーザーの残高凍結ルール**: BANされたユーザーの残高はどうなる？出金不可だが没収もしない場合の長期的な扱いが不明 | domain-model/01 |
| M-06 | **Admin作成フローの不在**: AdminUserの初期作成・招待フローが定義されていない | domain-model/01 |

### 過剰設計（2件）

| # | 問題 | 箇所 |
|---|------|------|
| O-01 | **Notification状態遷移が複雑すぎ**: Phase1はアプリ内通知のみなのにQUEUED→SENDING→SENT→READの4段階は過剰。CREATED→READで十分 | domain-model/06 |
| O-02 | **9種のアセット対応**: Phase1から BTC/ETH/XRP/USDT/USDC/JPYR/JPYC/IZAKAYA/KQ の9アセットは運用負荷が高い。レート設定だけで月9回の手動作業 | specs/06 BR-06 |

---

## 3. 改善設計案

### Critical（最優先）

| # | 提案 | 理由 |
|---|------|------|
| P-01 | **entry_typeを統一定義**: `REWARD_CREDIT`, `REWARD_REVERSAL`, `WITHDRAWAL_DEBIT`, `WITHDRAWAL_REVERSAL`, `ADJUSTMENT` の5種に統一 | C-01解決。台帳の型安全性確保 |
| P-02 | **TBD-34（CSV報酬通貨）を即決**: ブローカーマスターに `reward_currency` を持たせ、非USD時はレート変換を挟む設計を確定 | A-04解決。計算ロジックの前提 |
| P-03 | **TBD-02（token_decimals）を即決**: KQトークンは6桁、他アセットは各アセットの標準decimalsに合わせる | A-01解決。API設計の前提 |
| P-04 | **dedupe_keyの統一**: `{distribution_run_id}:{user_id}:{asset_code}` を標準とする | C-02解決 |

### High（重要）

| # | 提案 | 理由 |
|---|------|------|
| P-05 | **出金制限のUSD基準化**: 最低出金額・日次上限をUSD建てに統一し、円換算は表示のみとする | C-03解決。為替変動リスクの排除 |
| P-06 | **Phase1ランク判定の明確化**: 「手動設定 + 管理画面でのランク変更」をPhase1の正、月次自動判定はPhase2と明記 | C-04解決 |
| P-07 | **Admin MFAの追加**: TOTP（Google Authenticator等）による二要素認証をPhase1必須に | M-01解決 |
| P-08 | **レート設定の半自動化**: CoinGecko/CoinMarketCap APIから参考レートを取得→Admin確認→確定のフロー | O-02の運用負荷軽減 |

### Medium（推奨）

| # | 提案 | 理由 |
|---|------|------|
| P-09 | **Notification状態を簡素化**: Phase1は `CREATED → READ` の2状態に。配信インフラはPhase2 | O-01解決 |
| P-10 | **初期アセットを絞る**: Phase1は `BTC, USDT, KQ` の3種に限定し、運用が安定したら拡張 | O-02解決 |
| P-11 | **データ保持ポリシーの策定**: POPIA準拠で個人情報の保持期限・削除プロセスを定義 | M-02解決 |
| P-12 | **BANユーザーの残高方針を確定**: 「90日経過後に没収警告→没収」等のルールを明記 | M-05解決 |

---

## 4. ドメインモデルの改善点

### 境界づけられたコンテキストの問題

1. **Ledgerの所属が曖昧**: Trade Import and Reward Ledger（domain-model/03）にLedgerがあるが、RewardsやWithdrawalsからも直接書き込む。Ledgerを独立したコンテキストとして切り出すべき
2. **Trade Import と Rewards の責務境界**: 「原資R確定」と「付与計算」の境界は明記されているが、ユースケース番号が `T-04`, `T-05` と Trade Import の番号体系を使っており混乱を招く
3. **Platform Ops に A-02（承認タスク一覧）が含まれている**: これは各ドメインの集約ビューであり、Opsの責務としては違和感がある

### エンティティ関係の改善

```
User 1--* FXAccount
User 1--1 WalletConnection
User 1--* LedgerEntry (via LedgerAccount)
FXAccount *--1 Broker
TradeImport *--1 Broker
TradeImport 1--* TradeRecord (新設推奨)
RewardCalculationRun 1--1 DistributionRun
DistributionRun 1--* LedgerEntry
Withdrawal 1--0..1 TransferTx
```

- **TradeRecordの明示化**: CSV取込後の正規化済みデータを保持するエンティティが domain-model に明確に定義されていない
- **LedgerAccountの具体化**: USER/BUYBACK/OPSの3種が概念として挙げられているが、BUYBACKとOPSの詳細な使い方が不明

---

## 5. CSV/外部連携の設計評価

### csv-format.md の問題

| # | 問題 | 改善案 |
|---|------|--------|
| CSV-01 | FX GT/EXNESSは口座サマリ形式で、`trade_closed_at`の意味が「最後の取引日時」となり、個別取引の精度がない | 対象月判定は「CSVの取得対象期間」で制御し、`trade_closed_at`は参照情報として扱う |
| CSV-02 | ファイルサイズ上限・最大行数がTBDのまま | 10MB / 50,000行を確定させる |
| CSV-03 | 報酬額の通貨単位が未確定（TBD-34） | ブローカーマスターで管理する方針を確定 |
| CSV-04 | CSVインジェクション対策の記述なし | パース時に数式プレフィクス（`=`, `+`, `-`, `@`）のサニタイズを必須とする |

### tech-stack.md の問題

| # | 問題 | 改善案 |
|---|------|--------|
| TS-01 | バックエンドのランタイムが「Node.js or Go/Rust」と未確定 | 南アフリカチームのスキルセットを考慮して早期に確定すべき |
| TS-02 | Firebase/Supabaseの利用方針でAuth/DBはOKだが、セッション管理の詳細が不明 | JWT+リフレッシュトークンの具体設計を確定（TBD-06） |
| TS-03 | 暗号資産送金の秘密鍵管理方針がない | HSM/KMS等の鍵管理ソリューションを明記すべき |

---

## 6. 推奨アクションリスト

### P0: Phase1設計着手前に必須

1. **TBD-02確定**: token_decimalsの値を決定
2. **TBD-34確定**: CSV報酬額の通貨単位を確認（ブローカーへのヒアリング）
3. **TBD-05確定**: Izakaya Wallet接続プロトコルの確定
4. **entry_type統一**: specs/06とdomain-model間の用語統一
5. **dedupe_key統一**: 二重計上防止キーの定義統一

### P1: Phase1設計中に対応

6. **出金制限のUSD基準化**
7. **Phase1ランク判定方式の明確化**（手動 vs 自動の整理）
8. **Admin MFA要件の追加**
9. **CSVインジェクション対策の追加**
10. **Ledgerドメインの独立化検討**
11. **レート設定の半自動化設計**
12. **Notification状態の簡素化**
13. **TBD-06確定**: JWT有効期限・リフレッシュ方式
14. **秘密鍵管理方針の策定**

### P2: Phase1リリースまでに対応

15. **データ保持ポリシーの策定**（POPIA準拠）
16. **BANユーザーの残高方針確定**
17. **DR/バックアップ方針の策定**
18. **初期アセット数の絞り込み検討**
19. **TBD-03確定**: 除外条件の具体的ルール
20. **FX GT/EXNESSの対象月判定ルール明確化**
21. **Admin初期作成フローの定義**

---

*レビュー実施日: 2026-03-08*
*ロール: 設計者*
