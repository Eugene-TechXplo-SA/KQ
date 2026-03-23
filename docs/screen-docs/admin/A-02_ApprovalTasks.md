# 承認タスク / Approval Tasks

## 画面概要


| 項目      | 内容                                    | English                                                              |
| ------- | ------------------------------------- | -------------------------------------------------------------------- |
| 画面名     | 承認タスク                                 | Approval Tasks                                                       |
| 目的      | 口座連携申請と出金申請の承認/却下を一元管理する              | Manage approval/rejection of account linking and withdrawal requests |
| 主な利用ロール | ADMIN                                 |                                                                      |
| 責務      | PENDING状態の口座連携申請・出金申請の一覧表示、承認/却下の実行   |                                                                      |
| やらないこと  | 手動送金（出金承認後の送金はOff-System）、ユーザー情報の直接編集 |                                                                      |
| 画面構成    | 口座開設承認パネル + 出金管理パネル（タブ分割、件数バッジ付き）     |                                                                      |
| パネル補足   | 口座連携申請と出金申請の承認/却下を一元管理                 |                                                                      |


## 表示項目定義（一覧：口座連携申請）


| No  | 項目名          | 表示名           | English Label  | I/O | 備考                            |
| --- | ------------ | ------------- | -------------- | --- | ----------------------------- |
| 1   | 申請日時         | 申請日時          | Request Date   | O   |                               |
| 2   | ユーザー（Wallet） | ユーザー (Wallet) | User (Wallet)  | O   | メールまたはウォレットアドレス               |
| 3   | ブローカー        | ブローカー         | Broker         | O   |                               |
| 4   | 口座番号         | 口座番号          | Account Number | O   | MT4/MT5                       |
| 5   | ステータス        | ステータス         | Status         | O   | PENDING/APPROVED/REJECTED     |
| 6   | ステータスフィルター   | ステータス         | Status Filter  | I   | ALL/PENDING/APPROVED/REJECTED |
| 7   | 操作ボタン（承認/却下） | 操作            | Actions        | I   | PENDING時のみ表示                  |


## 表示項目定義（一覧：出金申請）


| No  | 項目名                      | 表示名       | English Label          | I/O | 備考                                                         |
| --- | ------------------------ | --------- | ---------------------- | --- | ---------------------------------------------------------- |
| 8   | 申請日時                     | 申請日時      | Request Date           | O   |                                                            |
| 9   | ユーザーID                   | ユーザーID    | User ID                | O   |                                                            |
| 10  | メール                      | メール       | Email                  | O   |                                                            |
| 11  | ウォレットアドレス                | ウォレットアドレス | Wallet Address         | O   | 出金先                                                        |
| 12  | 保有ポイント                   | 保有ポイント    | Balance                | O   | 現在残高                                                       |
| 13  | 出金申請額                    | 出金申請額     | Withdrawal Amount      | O   |                                                            |
| 14  | アセット                     | アセット      | Asset                  | O   | KQ等                                                        |
| 15  | 送金ステータス                  | 送金ステータス   | Transfer Status        | O   | PENDING〜COMPLETED/FAILED                                   |
| 16  | 送金ステータスフィルター             | 送金ステータス   | Transfer Status Filter | I   | ALL/PENDING/APPROVED/PROCESSING/COMPLETED/FAILED/CANCELLED（※REJECTEDは実装に存在しないため除外） |
| 17  | 操作ボタン（承認/却下/送金/TxHash入力） | 操作        | Actions                | I   | ステータスに応じて変化                                                |


## 表示項目定義（モーダル：口座連携申請）


| No  | 項目名      | 表示名    | English Label           | I/O | 備考                      |
| --- | -------- | ------ | ----------------------- | --- | ----------------------- |
| 18  | 申請ID     | 申請ID   | Request ID              | O   |                         |
| 19  | ユーザー詳細   | ユーザー情報 | User Details            | O   |                         |
| 20  | 重複口座アラート | 重複口座警告 | Duplicate Account Alert | O   | 同一broker×account_number |
| 21  | 却下理由入力   | 却下理由   | Rejection Reason        | I   | 却下時必須                   |


## 表示項目定義（モーダル：出金操作）

一覧の「操作」ボタンで開く。出金申請の詳細表示とステータス遷移操作を行う。

| No  | 項目名          | 表示名       | English Label      | I/O | 備考                                                       |
| --- | ------------ | --------- | ------------------ | --- | -------------------------------------------------------- |
| 22  | モーダルタイトル     | 出金操作: {ID} | Withdrawal Op: {ID} | O   |                                                          |
| 23  | ユーザーID       | ユーザーID    | User ID            | O   |                                                          |
| 24  | メール          | メール       | Email              | O   |                                                          |
| 25  | KYC状態        | KYC       | KYC Status         | O   | ピル表示                                                     |
| 26  | ウォレットアドレス    | ウォレットアドレス | Wallet Address     | O   | 申請時点のスナップショット                                            |
| 27  | 保有残高         | 保有残高      | Balance            | O   | アセット別ピル表示                                                |
| 28  | 出金申請額        | 出金申請額     | Amount             | O   | `{金額} {アセット}` 形式                                        |
| 29  | 送金ステータス      | 送金ステータス   | Transfer Status    | O   | ピル表示                                                     |
| 30  | TxHash       | TxHash    | Transaction Hash   | O   | COMPLETED/FAILED時のみ表示                                    |
| 31  | 状態遷移フロー説明    | —         | —                  | O   | `PENDING → 承認 → 処理中 → 完了/失敗`                            |
| 32  | 編集ボタン        | 編集        | Edit               | I   | 全ステータスで表示。出金申請編集モーダルを開く                                  |
| 33  | ステータス依存ボタン   | —         | Actions            | I   | PENDING→承認、APPROVED→送金処理開始、PROCESSING→送金完了 / 送金失敗        |
| 34  | 閉じるボタン       | 閉じる       | Close              | I   |                                                          |


## 表示項目定義（モーダル：出金申請編集）

出金操作モーダルの「編集」ボタンで開く。出金申請の内容を直接編集する。

| No  | 項目名        | 表示名       | English Label      | I/O | 備考                                        |
| --- | ---------- | --------- | ------------------ | --- | ----------------------------------------- |
| 35  | モーダルタイトル   | 出金申請 編集: {ID} | Edit Withdrawal: {ID} | O   |                                           |
| 36  | アセット       | アセット      | Asset              | I   | テキスト入力                                    |
| 37  | 数量         | 数量        | Amount             | I   | 数値入力（0以上）                                 |
| 38  | 送付先        | 送付先       | Destination        | I   | ウォレットアドレス                                 |
| 39  | 送金ステータス    | 送金ステータス   | Transfer Status    | I   | セレクト: 未処理(PENDING)/処理中(PROCESSING)/完了(COMPLETED)/失敗(FAILED) |
| 40  | TxHash     | TxHash（任意） | Transaction Hash   | I   | 任意入力。COMPLETED時に未入力なら自動生成                 |
| 41  | キャンセルボタン   | キャンセル     | Cancel             | I   |                                           |
| 42  | 保存ボタン      | 保存        | Save               | I   |                                           |


## アクション定義


| No  | トリガー             | 処理内容                                                   | 状態変更                                           | ログ有無 | 備考              |
| --- | ---------------- | ------------------------------------------------------ | ---------------------------------------------- | ---- | --------------- |
| 1   | 口座連携「承認」ボタン      | 申請をAPPROVEDに更新。FXAccountを作成・紐付け                        | AccountLinkRequest: PENDING→APPROVED           | 必須   | 重複チェック実施        |
| 2   | 口座連携「却下」ボタン      | 却下理由入力後、REJECTEDに更新                                    | AccountLinkRequest: PENDING→REJECTED           | 必須   | reject_reason必須 |
| 3   | 出金一覧「操作」ボタン      | 出金操作モーダルを開く                                            | -                                              | -    |                 |
| 4   | 出金操作「承認」ボタン      | 出金申請をAPPROVEDに更新                                       | WithdrawalRequest: PENDING→APPROVED            | 必須   | PENDING時のみ表示    |
| 5   | 出金操作「送金処理開始」ボタン  | PROCESSINGに更新                                          | WithdrawalRequest: APPROVED→PROCESSING         | 必須   | APPROVED時のみ表示   |
| 6   | 出金操作「送金完了」ボタン    | COMPLETEDに更新。TxHash自動生成（未入力時）。台帳DEBITを追記               | WithdrawalRequest: PROCESSING→COMPLETED        | 必須   | PROCESSING時のみ表示 |
| 7   | 出金操作「送金失敗」ボタン    | FAILEDに更新                                              | WithdrawalRequest: PROCESSING→FAILED           | 必須   | PROCESSING時のみ表示 |
| 8   | 出金操作「編集」ボタン      | 出金申請編集モーダルを開く                                          | -                                              | -    | 全ステータスで表示       |
| 9   | 出金申請編集「保存」ボタン    | アセット・数量・送付先・ステータス・TxHashを更新                            | WithdrawalRequest: 直接編集                        | 必須   | COMPLETED時TxHash自動生成 |


## 状態遷移

### 口座連携申請


| 状態       | 説明                 | 遷移先                 | 備考            |
| -------- | ------------------ | ------------------- | ------------- |
| PENDING  | ユーザーが申請済み、管理者の承認待ち | APPROVED / REJECTED |               |
| APPROVED | 承認済み。還元対象口座        | -                   | FXAccount作成済み |
| REJECTED | 却下済み               | -                   | 却下理由保持        |


### 出金申請


| 状態         | 説明           | 遷移先                             | 備考       |
| ---------- | ------------ | ------------------------------- | -------- |
| PENDING    | ユーザーが申請済み    | APPROVED / REJECTED / CANCELLED |          |
| APPROVED   | 管理者承認済み。送金待ち | PROCESSING                      |          |
| PROCESSING | 送金実行中        | COMPLETED / FAILED              |          |
| COMPLETED  | 送金完了         | -                               | TxHash必須 |
| REJECTED   | 管理者却下        | -                               | 却下理由保持   |
| CANCELLED  | ユーザーキャンセル    | -                               |          |
| FAILED     | 送金失敗         | -                               |          |


## ガード条件


| No  | ガード条件         | 内容                                         |
| --- | ------------- | ------------------------------------------ |
| 1   | ステータスがPENDING | 承認/却下はPENDING状態のみ実行可能                      |
| 2   | 却下理由必須        | 却下時はreject_reasonの入力が必須                    |
| 3   | 出金停止OFF       | 出金関連操作は緊急停止スイッチ（出金）がOFFであること               |
| 4   | 口座連携停止OFF     | 口座連携関連操作は停止スイッチがOFFであること                   |
| 5   | TxHash一意      | 同一tx_hashの二重登録不可                           |
| 6   | 申請ステータス整合     | APPROVED→PROCESSING→COMPLETED/FAILEDの順序を保証 |


