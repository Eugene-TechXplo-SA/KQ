# 出金申請 / Withdrawal Request

## 1. UIイメージ

（Figmaスクリーンショットをここに追加予定）

## 2. 使用API

（Engチーム記載 — 空欄でOK）

## 3. 項目定義

### 出金申請フォーム

| No | 項目名 | 表示名 | English Label | I/O |
|----|--------|--------|---------------|-----|
| 1 | アセット選択チップ | KQ | Asset Selection | I |
| 2 | 申請可能残高 | 申請可能残高: {balance} KQ | Available Balance | O |
| 3 | KYCステータス | 承認済み | KYC Status | O |
| 4 | 送金先アドレス | {wallet_address} | Destination Wallet Address | O |
| 5 | ネットワーク | Polygon | Network | O |
| 6 | 出金手数料 | 手数料: {fee} | Withdrawal Fee | O |
| 7 | 日次上限案内 | 1日の出金上限は100万円相当です | Daily Limit Notice | O |
| 8 | 申請金額入力 | 申請金額 | Withdrawal Amount | I |
| 9 | 利用規約同意チェック | 利用規約に同意して申請する | Agree to Terms | I |
| 10 | 申請実行ボタン | 申請を実行する | Submit Request | I |

### KYC未完了ゲート

| No | 項目名 | 表示名 | English Label | I/O |
|----|--------|--------|---------------|-----|
| 11 | ゲートアイコン | 本人確認が必要です | KYC Required Icon | O |
| 12 | ゲートタイトル | 本人確認が必要です | KYC Required Title | O |
| 13 | ゲート説明 | 出金申請にはKYCの完了が必要です | KYC Required Description | O |
| 14 | KYC画面遷移ボタン | 本人確認へ進む | Go to KYC | I |

### ウォレット未接続ゲート

| No | 項目名 | 表示名 | English Label | I/O |
|----|--------|--------|---------------|-----|
| 15 | ゲートアイコン | ウォレット未接続 | Wallet Not Connected Icon | O |
| 16 | ゲートタイトル | ウォレットが接続されていません | Wallet Not Connected Title | O |
| 17 | ゲート説明 | 出金申請にはウォレット接続が必要です | Wallet Required Description | O |
| 18 | ウォレット画面遷移ボタン | ウォレットを接続する | Connect Wallet | I |

### 出金履歴

| No | 項目名 | 表示名 | English Label | I/O |
|----|--------|--------|---------------|-----|
| 19 | 状態フィルターチップ | 申請中 / 承認済み / 処理中 / 完了 / 却下 / 失敗 / キャンセル | Status Filter | I |
| 20 | 出金履歴カード一覧 | 出金履歴 | Withdrawal History List | O |
| 21 | 出金額 | {amount} {asset} | Withdrawal Amount | O |
| 22 | ステータスピル | PENDING / APPROVED / PROCESSING / COMPLETED / REJECTED / FAILED / CANCELLED | Status Pill | O |
| 23 | 申請日時 | yyyy/mm/dd hh:mm | Requested At | O |
| 24 | ステッパー | 申請中 → 承認済み → 処理中 → 送金完了 | Progress Stepper | O |
| 25 | TxHash | TxHash: {hash} | Transaction Hash | O |
| 26 | キャンセルボタン | キャンセル | Cancel Request | I |
| 27 | 却下理由 | 却下理由: {reason} | Rejection Reason | O |
| 28 | 失敗理由 | 失敗理由: {reason} | Failure Reason | O |
| 29 | 残高復帰表示 | 残高が復帰されました | Balance Restored | O |
| 30 | 取消線金額 | ~~{amount} {asset}~~ | Strikethrough Amount | O |
| 31 | 新規申請ボタン | 新規申請 | New Request | I |
| 32 | メニューに戻るボタン | メニューに戻る | Back to Menu | I |

### 状態別UI表示パターン

| 状態 | ステッパー表示 | 特有の表示項目 |
|------|---------------|----------------|
| `PENDING` | Step1 アクティブ、Step2-4 未着手 | No.26 キャンセルボタン |
| `APPROVED` | Step1-2 完了、Step3-4 未着手 | - |
| `PROCESSING` | Step1-3 完了、Step4 未着手 | - |
| `COMPLETED` | Step1-4 完了 | No.25 TxHash |
| `REJECTED` | Step1 完了、Step2 失敗、Step3-4 非表示 | No.27 却下理由、No.29 残高復帰表示 |
| `FAILED` | Step1-3 完了、Step4 失敗 | No.25 TxHash、No.28 失敗理由、No.29 残高復帰表示 |
| `CANCELLED` | ステッパー非表示 | No.29 残高復帰表示、No.30 取消線金額 |

## 4. アクション

| No | 対象項目No | 対象項目名 | トリガー | アクション概要 | 遷移先画面名 | 参照API | 備考 |
|----|-----------|-----------|---------|--------------|------------|--------|------|
| 1 | 1 | アセット選択チップ | タップ | 出金対象アセットを選択する | - | | Phase1 は KQ 固定 |
| 2 | 9 | 利用規約同意チェック | タップ | チェック状態を切り替える | - | | No.10 の活性制御に使用 |
| 3 | 10 | 申請実行ボタン | タップ | 出金申請を送信し、履歴一覧を更新する | - | | `PENDING` で作成 |
| 4 | 14 | KYC画面遷移ボタン | タップ | KYC画面へ遷移する | S-08 本人確認（KYC） | | |
| 5 | 18 | ウォレット画面遷移ボタン | タップ | ウォレット画面へ遷移する | S-11 ウォレット | | |
| 6 | 19 | 状態フィルターチップ | タップ | 指定ステータスの履歴だけを表示する | - | | 複数選択可否は下位設計 |
| 7 | 26 | キャンセルボタン | タップ | `PENDING` の出金申請を `CANCELLED` に更新する | - | | ユーザー本人のみ実行可 |
| 8 | 31 | 新規申請ボタン | タップ | 出金申請フォーム先頭へスクロールする | - | | 履歴表示中の導線 |
| 9 | 32 | メニューに戻るボタン | タップ | メニュー画面へ戻る | S-06 メニュー | | |
| 10 | - | 画面読み込み時 | 画面表示 | 申請可能残高、Wallet、KYC状態、出金履歴を取得する | - | | |

## 5. メッセージ

| 表示タイプ | 対象項目No | 対象項目名 | 表示条件 | メッセージテキスト | English Message | 備考 |
|-----------|-----------|-----------|---------|-----------------|----------------|------|
| エラー | 8 | 申請金額入力 | 入力額が申請可能残高を超える場合 | 申請可能残高を超えています | Amount exceeds available balance | |
| エラー | 8 | 申請金額入力 | 入力額が最低出金額未満の場合 | 最低出金額は1,000円相当です | Minimum withdrawal amount is JPY 1,000 equivalent | |
| エラー | 8 | 申請金額入力 | 日次合計が100万円相当を超える場合 | 1日の出金上限を超えています | Daily withdrawal limit exceeded | JST 0:00-23:59 集計 |
| エラー | 9 | 利用規約同意チェック | 未チェックで申請する場合 | 利用規約への同意が必要です | Agreement to the terms is required | |
| エラー | 13 | ゲート説明 | `NOT_SUBMITTED` / `REJECTED` 時 | 本人確認書類を提出してください | Please submit your KYC documents | |
| インフォ | 13 | ゲート説明 | `PENDING` 時 | 現在審査中です。しばらくお待ちください | Your KYC review is in progress | |
| エラー | 17 | ゲート説明 | Wallet未接続時 | 出金申請にはウォレット接続が必要です | Wallet connection is required for withdrawals | |
| インフォ | 10 | 申請実行ボタン | 申請成功時 | 出金申請を受け付けました | Your withdrawal request has been submitted | |
| インフォ | 26 | キャンセルボタン | キャンセル成功時 | 出金申請をキャンセルしました | Your withdrawal request has been cancelled | |
| インフォ | 29 | 残高復帰表示 | `REJECTED` / `FAILED` / `CANCELLED` 時 | 残高が復帰されました | Your balance has been restored | |


