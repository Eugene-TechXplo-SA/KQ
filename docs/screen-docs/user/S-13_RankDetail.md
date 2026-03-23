# ランク詳細 / Rank Detail

## 1. UIイメージ

（Figmaスクリーンショットをここに追加予定）

## 2. 使用API

（Engチーム記載 — 空欄でOK）

## 3. 項目定義

> ダッシュボード（S-01）またはメニュー（S-06）から遷移する画面。
> ランク制度の見せ方を定義し、ランク値の正本はランクマスター（RNK-01）に従う。


| No  | 項目名        | 表示名                                                     | English Label          | I/O |
| --- | ---------- | ------------------------------------------------------- | ---------------------- | --- |
| 1   | 現在ランクカード   | ランク詳細                                                   | Current Rank Card      | O   |
| 2   | 現在ランク名     | Member / Silver / Gold                                  | Current Rank Name      | O   |
| 3   | ランクバッジ     | ランクバッジ                                                  | Rank Badge             | O   |
| 4   | 付与レートカード   | 付与レート                                                   | Reward Rate Multiplier | O   |
| 5   | 出金手数料カード   | 出金手数料                                                   | Withdrawal Fee         | O   |
| 6   | LEV_USD表示  | 現在のランク基準                                                | Current LEV_USD        | O   |
| 7   | 次ランク条件     | 次のランク（{rank}）                                           | Next Rank Threshold    | O   |
| 8   | 進捗バー       | 進捗バー                                                    | Rank Progress Bar      | O   |
| 9   | 進捗ラベル      | ${current_lev_usd} / ${target_lev_usd}                  | Progress Label         | O   |
| 10  | ランク一覧      | ランク一覧                                                   | Rank Tier List         | O   |
| 11  | ランク一覧項目    | {rank}: x{multiplier} / 手数料 {fee} / LEV_USD {threshold} | Rank Tier Item         | O   |
| 12  | ランク判定ノート   | ランクは毎月自動で判定されます                                         | Rank Evaluation Note   | O   |
| 13  | メニューに戻るボタン | メニューに戻る                                                 | Back to Menu           | I   |


> ランク閾値と出金手数料はマスター管理のため、本画面では確定値が未設定の場合 `TBD` 表示を許容する。

## 4. アクション


| No  | 対象項目No | 対象項目名      | トリガー | アクション概要                         | 遷移先画面名    | 参照API | 備考                         |
| --- | ------ | ---------- | ---- | ------------------------------- | --------- | ----- | -------------------------- |
| 1   | 10     | ランク一覧      | 画面表示 | 現在ランクを含むランク一覧を表示する              | -         |       | Member / Silver / Gold     |
| 2   | 13     | メニューに戻るボタン | タップ  | メニュー画面へ戻る                       | S-06 メニュー |       |                            |
| 3   | -      | 画面読み込み時    | 画面表示 | 現在ランク、LEV_USD、次ランク条件、ランク一覧を取得する | -         |       | 閾値変更は `effective_from` に従う |


## 5. メッセージ


| 表示タイプ | 対象項目No | 対象項目名    | 表示条件       | メッセージテキスト                             | English Message                                                          | 備考       |
| ----- | ------ | -------- | ---------- | ------------------------------------- | ------------------------------------------------------------------------ | -------- |
| インフォ  | 4      | 付与レートカード | 常時         | 現在のランクに基づく付与レートが適用されます                | Reward rate is applied based on your current rank                        |          |
| インフォ  | 5      | 出金手数料カード | 手数料が未設定の場合 | 出金手数料は確定後に表示されます                      | Withdrawal fee will be shown once configured                             | `TBD` 表示 |
| インフォ  | 8      | 進捗バー     | 最高ランク到達時   | 最高ランクに到達しました                          | You have reached the highest rank                                        |          |
| インフォ  | 12     | ランク判定ノート | 常時         | ランクは毎月自動で判定されます。90日以上取引がない場合は1段階降格します | Ranks are evaluated monthly and may be downgraded after 90 inactive days | BR-10    |


