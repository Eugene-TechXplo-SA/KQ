# コンテンツ管理（CMS） / Content Management

## 画面概要


| 項目      | 内容                                     | English                                                                |
| ------- | -------------------------------------- | ---------------------------------------------------------------------- |
| 画面名     | コンテンツ管理（CMS）                           | Content Management (CMS)                                               |
| 目的      | ユーザーに表示するお知らせの作成・編集・公開/予約公開・アーカイブを管理する | Create, edit, publish, schedule, and archive user-facing announcements |
| パネル説明   | ユーザーに表示するお知らせの作成・編集・公開管理                |                                                                        |
| 主な利用ロール | ADMIN                                  |                                                                        |
| 責務      | お知らせの作成・編集・公開状態管理                      |                                                                        |
| やらないこと  | 個別通知の生成（システム自動生成）、ユーザー操作               |                                                                        |
| 画面構成    | お知らせ一覧テーブル（フィルター付き）+ 作成/編集モーダル         |                                                                        |


## 表示項目定義（一覧）


| No  | 項目名        | 表示名       | English Label | I/O | 備考                                 |
| --- | ---------- | --------- | ------------- | --- | ---------------------------------- |
| 1   | 作成日時       | 作成日時      | Created Date  | O   |                                    |
| 2   | タイトル/本文    | タイトル / 本文 | Title / Body  | O   | 本文は省略表示                            |
| 3   | カテゴリ       | カテゴリ      | Category      | O   | メンテナンス/キャンペーン/アップデート/その他            |
| 4   | 優先度        | 優先度       | Priority      | O   | 高/中/低                              |
| 5   | ステータス      | ステータス     | Status        | O   | DRAFT/SCHEDULED/PUBLISHED/ARCHIVED |
| 6   | ステータスフィルター | ステータス     | Status Filter | I   | ALL/DRAFT/SCHEDULED/PUBLISHED/ARCHIVED |
| 7   | 操作ボタン      | 操作        | Actions       | I   | 編集/公開/アーカイブ                        |
| 8   | 新規作成ボタン    | ＋ 新規作成    | Create New    | I   |                                    |


## 表示項目定義（詳細ドロワー：作成/編集モーダル）


| No  | 項目名    | 表示名     | English Label | I/O | 備考                 |
| --- | ------ | ------- | ------------- | --- | ------------------ |
| 9   | タイトル入力 | タイトル    | Title         | I   |                    |
| 10  | 本文入力   | 本文      | Body          | I   | リッチテキストまたはMarkdown |
| 11  | カテゴリ選択 | カテゴリ    | Category      | I   |                    |
| 12  | 優先度選択  | 優先度     | Priority      | I   | 高/中/低              |
| 13  | 公開日時設定 | 予約公開日時  | Scheduled Publish Date | I   | 即時公開 or 予約公開       |
| 14  | 保存ボタン  | 下書き保存   | Save as Draft | I   |                    |
| 15  | 公開ボタン  | 公開      | Publish       | I   |                    |


## アクション定義


| No  | トリガー           | 処理内容                           | 状態変更                                  | ログ有無 | 備考     |
| --- | -------------- | ------------------------------ | ------------------------------------- | ---- | ------ |
| 1   | 「新規作成」ボタン      | 作成モーダルを開く                      | -                                     | -    |        |
| 2   | 「下書き保存」ボタン      | DRAFTとしてAnnouncementを作成/更新     | Announcement: →DRAFT                  | 必須   |        |
| 3   | 「公開」ボタン（即時）    | published_at=nowでPUBLISHEDに更新  | Announcement: DRAFT→PUBLISHED         | 必須   |        |
| 4   | 「予約公開」ボタン      | published_at=未来日時でSCHEDULEDに更新 | Announcement: DRAFT→SCHEDULED         | 必須   |        |
| 5   | published_at到達 | 自動的にPUBLISHED状態へ移行             | Announcement: SCHEDULED→PUBLISHED     | -    | システム自動 |
| 6   | 「アーカイブ」ボタン     | ARCHIVEDに更新（非表示化）              | Announcement: PUBLISHED→ARCHIVED      | 必須   |        |
| 7   | 「編集」ボタン        | 編集モーダルを開く                      | -                                     | -    |        |
| 8   | 「削除」ボタン        | DELETEDに更新（公開前のみ）              | Announcement: DRAFT/SCHEDULED→DELETED | 必須   | 公開前のみ  |


## 状態遷移


| 状態        | 説明                       | 遷移先                             | 備考  |
| --------- | ------------------------ | ------------------------------- | --- |
| DRAFT     | 下書き。ユーザーには非表示            | SCHEDULED / PUBLISHED / DELETED |     |
| SCHEDULED | 予約公開。published_at到達前は非表示 | PUBLISHED / DELETED             |     |
| PUBLISHED | 公開中。ユーザーに表示              | ARCHIVED                        |     |
| ARCHIVED  | アーカイブ済み。ユーザーには非表示        | -                               |     |
| DELETED   | 削除済み                     | -                               |     |


## ガード条件


| No  | ガード条件          | 内容                               |
| --- | -------------- | -------------------------------- |
| 1   | Admin権限        | お知らせ管理操作はAdmin権限が必要              |
| 2   | 公開済み削除不可       | PUBLISHED状態のお知らせは直接削除不可（アーカイブのみ） |
| 3   | published_at形式 | 予約公開の場合は未来日時であること                |
| 4   | タイトル必須         | タイトルは必須入力                        |


