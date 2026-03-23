# CSVフォーマット

> Notion Source: https://www.notion.so/31c541c60434804bbf5ee77b3ede9fbb

## 概要

ブローカーから受領する取引履歴CSVは、ブローカーごとにカラム構成が異なる。
本書では各ブローカーのCSVカラム定義、共通内部モデルへのマッピング、およびバリデーションルールを定義する。

> 本定義は T-01（取引履歴CSVインポート）、T-02（取引データの検証・整形）の下位設計に該当する。

---

## 対象ブローカー一覧

Phase1で使用するブローカーは以下の4社。

| ブローカー名 | CSVの種類 | 備考 |
|-------------|----------|------|
| BigBoss | 取引明細（注文単位） | 日本語カラム |
| XM | 取引明細（取引単位） | 日本語カラム |
| FX GT | 口座サマリ（口座単位） | 日本語カラム・取引明細ではない |
| EXNESS | 口座サマリ（口座単位） | 英語カラム |

> ブローカーごとにCSVの形式・カラム名・集計単位が異なるため、それぞれ個別のパーサーを用意する。

---

## 1. 共通内部モデル（正規化後）

各ブローカーのCSVは、取込時に以下の共通モデルに正規化される。

| フィールド | 型 | 必須 | 用途 |
|-----------|---|------|------|
| `trade_id` | String | ○ | 重複判定キー（ブローカー内で一意） |
| `broker_account_id` | String | ○ | ユーザー紐付け（FXAccount参照、BR-01） |
| `reward_usd` | Integer（cents） | ○ | IB報酬額（USD、最小単位整数で保持） |
| `lot` | Decimal | ○ | ロット数（監査/参照用、計算には使用しない） |
| `trade_closed_at` | DateTime（UTC） | ○ | 決済日時（対象月の判定に使用） |
| `instrument` | String | - | 通貨ペア/銘柄（参照用） |
| `raw_data` | JSON | - | 元CSVの全カラムを保持（監査/デバッグ用） |

### 補足
- `reward_usd` はCSVの報酬列をパースし、USD cents（整数）に変換して保持する（不変条件: RはUSDの最小単位整数で保持）
- `trade_id` はブローカーコードをプレフィックスとして付与し、システム全体で一意にする（例: `BIGBOSS_12345`）
- `raw_data` は元CSVの全カラムをJSON形式で保持し、後から参照可能とする

---

## 2. ブローカー別CSVカラム定義

### 2.1 BigBoss

| No | カラム名 | 型 | 必須 | マッピング先 | 備考 |
|----|---------|---|------|-------------|------|
| 1 | 注文ID | String | ○ | `trade_id` | 重複判定キー |
| 2 | 口座番号 | String | ○ | `broker_account_id` | ユーザー紐付けに使用 |
| 3 | AFF名前 | String | - | - | アフィリエイト名（参照用） |
| 4 | オープンタイム | DateTime | - | - | 参照用 |
| 5 | タイプ | String | - | - | 取引タイプ（参照用） |
| 6 | ロット | Decimal | ○ | `lot` | |
| 7 | 通貨ペア | String | - | `instrument` | |
| 8 | オープン価格 | Decimal | - | - | 参照用 |
| 9 | 逆指値 | Decimal | - | - | 参照用 |
| 10 | 指値 | Decimal | - | - | 参照用 |
| 11 | クローズタイム | DateTime | ○ | `trade_closed_at` | 対象月判定に使用 |
| 12 | クローズ価格 | Decimal | - | - | 参照用 |
| 13 | スワップ | Decimal | - | - | 参照用 |
| 14 | 入出金+損益 | Decimal | - | - | 参照用 |
| 15 | 報酬額 | Decimal | ○ | `reward_usd` | IB報酬（USD） |
| 16 | コメント | String | - | - | 参照用 |
| 17 | カスタムキャンペーン | String | - | - | 参照用 |
| 18 | プロダクト | String | - | - | 参照用 |

**重複判定キー：** `注文ID`

---

### 2.2 XM

| No | カラム名 | 型 | 必須 | マッピング先 | 備考 |
|----|---------|---|------|-------------|------|
| 1 | 取引番号 | String | ○ | `trade_id` | 重複判定キー |
| 2 | MT4/MT5 ID | String | ○ | `broker_account_id` | ユーザー紐付けに使用 |
| 3 | トレーダー名 | String | - | - | 参照用 |
| 4 | 口座タイプ | String | - | - | 参照用 |
| 5 | 口座通貨 | String | - | - | 参照用 |
| 6 | キャンペーン | String | - | - | 参照用 |
| 7 | 発注時間 | DateTime | - | - | 参照用 |
| 8 | 決済時間 | DateTime | ○ | `trade_closed_at` | 対象月判定に使用 |
| 9 | 取引カテゴリ | String | - | - | 参照用 |
| 10 | 取引タイプ | String | - | - | 参照用 |
| 11 | 金融商品 | String | - | `instrument` | |
| 12 | 銘柄グループ | String | - | - | 参照用 |
| 13 | ロット数 | Decimal | ○ | `lot` | |
| 14 | 合計報酬 | Decimal | - | - | 参照用 |
| 15 | アフィリエイト報酬 | Decimal | ○ | `reward_usd` | IB報酬（USD） |

**重複判定キー：** `取引番号`

---

### 2.3 FX GT

| No | カラム名 | 型 | 必須 | マッピング先 | 備考 |
|----|---------|---|------|-------------|------|
| 1 | アカウントID | String | ○ | `broker_account_id` | ユーザー紐付けに使用 |
| 2 | プラットフォーム | String | - | - | 参照用 |
| 3 | クライアントID | String | - | - | 参照用 |
| 4 | 紹介コード | String | - | - | 参照用 |
| 5 | 国 | String | - | - | 参照用 |
| 6 | 通貨 | String | - | - | 口座通貨（参照用） |
| 7 | アカウントタイプ | String | - | - | 参照用 |
| 8 | ステータス | String | - | - | 参照用 |
| 9 | 報酬 USD | Decimal | ○ | `reward_usd` | IB報酬（USD） |
| 10 | 紹介者 | String | - | - | 参照用 |
| 11 | 作成日 | Date | - | - | 参照用 |
| 12 | 初回入金日 | Date | - | - | 参照用 |
| 13 | 初回入金額（USD） | Decimal | - | - | 参照用 |
| 14 | 最初の取引 | DateTime | - | - | 参照用 |
| 15 | 有効化日 | Date | - | - | 参照用 |
| 16 | 最後の取引 | DateTime | ○ | `trade_closed_at` | 対象月判定に使用 |
| 17 | 預金 | Decimal | - | - | 参照用 |
| 18 | 出金 | Decimal | - | - | 参照用 |
| 19 | 有効証拠金（USD） | Decimal | - | - | 参照用 |
| 20 | GTLots | Decimal | ○ | `lot` | |

**重複判定キー：** `アカウントID + 対象月`（複合キー）

**特記事項：**
- FX GTのCSVは口座単位のサマリであり、取引単位の明細ではない
- `trade_id` は `FXGT_{アカウントID}_{対象月}` として生成する（例: `FXGT_123456_2026-02`）
- 1つの口座につき対象月ごとに1行となるため、同一口座×同一月の重複取込を防止する

---

### 2.4 EXNESS

| No | カラム名 | 型 | 必須 | マッピング先 | 備考 |
|----|---------|---|------|-------------|------|
| 1 | Payment date | Date | ○ | `trade_closed_at` | 対象月判定に使用 |
| 2 | Partner code | String | - | - | 参照用 |
| 3 | Client country | String | - | - | 参照用 |
| 4 | Client ID | String | - | - | 参照用 |
| 5 | Client account | String | ○ | `broker_account_id` | ユーザー紐付けに使用 |
| 6 | Client account type | String | - | - | 参照用 |
| 7 | Volume Mln. USD | Decimal | - | - | 取引量USD（参照用） |
| 8 | Volume Lots | Decimal | ○ | `lot` | |
| 9 | Profit | Decimal | ○ | `reward_usd` | IB報酬（USD） |

**重複判定キー：** `Client account + Payment date`（複合キー）

**特記事項：**
- CSVヘッダーは英語表記
- `trade_id` は `EXNESS_{Client account}_{Payment date}` として生成する
- `Volume Mln. USD` は百万USD単位の取引量（参照用、計算には使用しない）

---

## 3. カラムマッピングサマリ

| 共通フィールド | BigBoss | XM | FX GT | EXNESS |
|--------------|---------|-----|-------|--------|
| `trade_id` | 注文ID | 取引番号 | アカウントID + 対象月（生成） | Client account + Payment date（生成） |
| `broker_account_id` | 口座番号 | MT4/MT5 ID | アカウントID | Client account |
| `reward_usd` | 報酬額 | アフィリエイト報酬 | 報酬 USD | Profit |
| `lot` | ロット | ロット数 | GTLots | Volume Lots |
| `trade_closed_at` | クローズタイム | 決済時間 | 最後の取引 | Payment date |
| `instrument` | 通貨ペア | 金融商品 | -（なし） | -（なし） |

---

## 4. バリデーションルール

### 4.1 共通バリデーション

| チェック項目 | ルール | 不正時の処理 |
|------------|-------|-------------|
| CSVヘッダー | ブローカー定義の必須カラムが全て存在すること | TradeImport=FAILED |
| 必須フィールド空欄 | 必須マッピング先のカラムが空でないこと | 該当行をエラー記録 |
| `reward_usd` 数値 | 数値としてパース可能であること | 該当行をエラー記録 |
| `lot` 数値 | 0以上の数値であること | 該当行をエラー記録 |
| `trade_closed_at` 日時 | 日時としてパース可能であること | 該当行をエラー記録 |
| 重複チェック | 同一 `trade_id` が既存データに存在しないこと | 該当行を除外（スキップ） |
| 口座紐付け | `broker_account_id` が FXAccount に存在すること | 該当行を除外し、ログに記録 |

### 4.2 ブローカー別バリデーション

| ブローカー | 追加チェック |
|-----------|-------------|
| BigBoss | `注文ID` が空でないこと |
| XM | `MT4/MT5 ID` が数値であること |
| FX GT | `報酬 USD` が0以上であること |
| EXNESS | `Payment date` が日付形式であること |

---

## 5. 処理フロー

1. Admin がブローカーを選択し CSV をアップロード（T-01）
2. ブローカーに対応するカラムマッピング定義を取得
3. CSVヘッダーを検証（必須カラムの存在チェック）→ NG: TradeImport = FAILED
4. 行単位で処理（T-02）:
   - カラムマッピングに基づき共通モデルに変換
   - 型・形式バリデーション
   - reward_usd を USD cents（整数）に変換
   - trade_closed_at を UTC に正規化
   - trade_id にブローカーコードプレフィックスを付与
   - 重複判定（既存 trade_id との照合）
   - 口座紐付け（broker_account_id → FXAccount → User）
5. 結果集計（適用 / スキップ / 除外 / エラー）
6. TradeImport を IMPORTED / FAILED に更新
7. ユーザー別に reward_usd を集計 → 原資入力欄にプリフィル（T-03）

---

## 6. CSVファイル前提条件

| 項目 | 仕様 |
|------|------|
| 文字コード | UTF-8（BOM有無は許容） |
| 改行コード | LF / CRLF いずれも許容 |
| 区切り文字 | カンマ（`,`） |
| ヘッダー行 | 1行目に必須 |
| ファイルサイズ上限 | TBD |
| 最大行数 | TBD |
