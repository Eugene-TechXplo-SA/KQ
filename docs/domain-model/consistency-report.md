# Domain Model vs Specs 整合性レポート

> 作成日: 2026-03-08
> 対象: `docs/domain-model/` (7ファイル) vs `docs/specs/` (11ファイル)

## 総評

全体として両ドキュメント群は高い整合性を保っている。状態遷移図・ガード条件・主要ビジネスルールは一致している。ただし、**詳細度の差異**から生じる不整合が複数確認された。以下、重大度順に報告する。

---

## 1. 矛盾（Contradiction） — 要修正

### C-01: キャンペーン倍率の重複時ルール


| 項目  | domain-model           | specs                        |
| --- | ---------------------- | ---------------------------- |
| 場所  | `04_rewards.md` L152   | `06_logic.md` L349           |
| 内容  | 複数キャンペーン重複時は**最大値を採用** | 複数重複時の合算/最大値/優先度は**下位設計で定義** |


**問題**: domain-model では「最大値採用」と明記済みだが、specs では未決定扱い。実装チームがどちらを参照するかで挙動が変わる。

**推奨**: specs の BR-11 を domain-model に合わせて「最大値を採用」に更新する（domain-model の決定済み事項 L315 にも明記されている）。

---

### C-02: 端数処理（D-03）の記述粒度


| 項目  | domain-model                             | specs                                                                           |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| 場所  | `04_rewards.md` L75-76                   | `06_logic.md` L213-216                                                          |
| 内容  | KQ: **1 KQトークン単位**切捨て、その他: **1 pt単位**切捨て | KQ: **token_decimalsに従い最小単位**で切捨て、その他: **token_decimalsに従い最小単位**で切捨て。粒度は下位設計で確定 |


**問題**: domain-model は具体的な単位を確定しているが、specs は token_decimals 依存としており抽象度が異なる。TBD-02（token_decimals: 6 or 18?）が未決定のため、specs 側が曖昧なまま残っている。

**推奨**: TBD-02 の決定後、両方を統一する。現時点では domain-model の「1 KQ / 1 pt」は token_decimals=0 前提であり、token_decimals が 6 や 18 になった場合と矛盾する可能性がある。

---

### C-03: ランク設定 — 手動 vs 自動


| 項目  | domain-model (01)                | domain-model (04) / specs                            |
| --- | -------------------------------- | ---------------------------------------------------- |
| 場所  | `01_identity_and_access.md` L347 | `04_rewards.md` L109-117 / `06_logic.md` L301-313    |
| 内容  | ランクは**手動設定（Admin操作）**            | 昇格: **月次バッチで自動判定**（LEV_USD閾値）、降格: **90日非アクティブで自動降格** |


**問題**: domain-model 内部での矛盾。Identity ドメインでは「手動」、Rewards ドメインと specs では「自動（月次バッチ）」と記載。

**推奨**: `01_identity_and_access.md` の決定済み事項を修正し「ランク判定は月次バッチで自動実施（BR-10）。Adminによる手動変更も可能（USR-02）」に更新する。

---

### C-04: 台帳エントリの型名（entry_type）


| ドキュメント                                                | entry_type の名称                  |
| ----------------------------------------------------- | ------------------------------- |
| `domain-model/03_trade_import_and_ledger.md` L199-201 | `CREDIT` / `DEBIT` / `REVERSAL` |
| `specs/06_logic.md` L255                              | `GRANT` / `CANCEL` / `ADJUST`   |
| `specs/04_glossary.md` L37                            | `CREDIT` / `DEBIT` / `ADJUST`   |


**問題**: 3箇所で異なる命名が使われている。実装時にどれを正とするか不明。

**推奨**: 以下のように整理する。

- **会計操作種別**（Ledger層）: `CREDIT` / `DEBIT` / `REVERSAL`
- **業務イベント種別**（アプリ層）: `GRANT` / `CANCEL` / `ADJUST`
- 両者は別レイヤーであることを specs/glossary に明記する。

---

### C-05: dedupe_key の構成要素


| 項目  | domain-model                         | specs                                          |
| --- | ------------------------------------ | ---------------------------------------------- |
| 場所  | `03_trade_import_and_ledger.md` L225 | `06_logic.md` L257                             |
| 内容  | `batch_id + user_id + entry_type` 等  | `batch_id + user_id + entry_type + asset_code` |


**問題**: specs では `asset_code` を含むが、domain-model では含まない。複数アセットへの按分がある以上、`asset_code` なしでは一意にならない。

**推奨**: domain-model を specs に合わせて `asset_code` を追加する。

---

## 2. 不一致（Discrepancy） — 要確認

### D-01: 出金手数料（ランク別）


| 項目  | domain-model                                   | specs          |
| --- | ---------------------------------------------- | -------------- |
| 場所  | `05_withdrawals.md` L99-111                    | 該当記述なし         |
| 内容  | ランク別手数料（Member/Silver/Gold: TBD）、手数料は出金額から差し引き | 出金に関する手数料の言及なし |


**問題**: domain-model では出金手数料の概念が導入されているが、specs（BR-03, 05_usecases, 09_acceptance_criteria）には一切記載がない。

**推奨**: specs の BR-03 に出金手数料の項目を追加するか、domain-model が先行して追加したものであれば specs への反映が必要。

---

### D-02: 没収（Confiscation）機能


| 項目  | domain-model                                 | specs                       |
| --- | -------------------------------------------- | --------------------------- |
| 場所  | `01_identity_and_access.md` L141-148         | 該当記述なし                      |
| 内容  | A-06 ユーザー管理に「没収」フロー（DEBIT/CONFISCATE を台帳に追記） | specs のロール権限・ユースケースに没収の記載なし |


**問題**: domain-model にのみ存在する機能。specs に反映されていない。

**推奨**: Phase1 スコープに含めるか判断し、含める場合は specs の 05_usecases, 08_roles_permissions に追加する。

---

### D-03: 出金の W-04 前提条件と状態遷移の整合


| 項目  | domain-model (ユースケース)                | domain-model (状態図) / specs                                            |
| --- | ------------------------------------ | --------------------------------------------------------------------- |
| 場所  | `05_withdrawals.md` L63 W-04 前提      | `05_withdrawals.md` L141 状態図 / `specs/07_state_transitions.md` L78-80 |
| 内容  | 前提: `APPROVED`**（または `PROCESSING`）** | APPROVED → PROCESSING → COMPLETED（順次遷移）                               |


**問題**: W-04 のユースケース文中では APPROVED からも PROCESSING からも TxHash 登録可能と読めるが、状態遷移図は APPROVED → PROCESSING → COMPLETED の順次遷移。APPROVED から直接 COMPLETED に遷移できるかが曖昧。

**推奨**: W-04 の前提条件を状態図に合わせて「対象申請が `PROCESSING`」に統一するか、APPROVED → PROCESSING の遷移を TxHash 登録操作に含める（送金開始 + TxHash 登録を一括操作として設計）ことを明記する。

---

### D-04: 監査ログのランク関連記録の詳細度


| 項目  | domain-model                     | specs                                                                 |
| --- | -------------------------------- | --------------------------------------------------------------------- |
| 場所  | `07_platform_ops.md` L178        | `06_logic.md` L134                                                    |
| 内容  | 配分・ランク: 配分比率変更、**ランク設定変更**、還元率変更 | 配分・ランク: 配分比率変更、ランク倍率変更、**ランク閾値（LEV_USD閾値）変更（effective_from含む）**、還元率変更 |


**問題**: specs のほうが詳細（閾値変更・effective_from を明記）。domain-model の「ランク設定変更」では何が監査対象か曖昧。

**推奨**: domain-model を specs の詳細度に合わせて更新する。

---

## 3. 構造的差異（Structural Gap） — 認識事項

### S-01: 付与計算モデルのステップ分割


| 項目  | domain-model                                 | specs                                                       |
| --- | -------------------------------------------- | ----------------------------------------------------------- |
| 構成  | Step 1: ユーザー還元原資算出、Step 2: アセット別付与量算出（2ステップ） | Step 1: IB報酬算出、Step 2: ユーザー還元原資算出、Step 3: アセット別付与量算出（3ステップ） |


**評価**: 矛盾ではない。domain-model の Rewards ドメインは「確定済みRを受け取ってから」が責務のため、IB報酬集計ステップを含まない。specs は end-to-end で記載しているため3ステップ。ただし、実装チームが混乱する可能性があるため、相互参照リンクがあると良い。

---

### S-02: Phase1 初期アセット一覧


| 項目  | specs                                                          | domain-model                     |
| --- | -------------------------------------------------------------- | -------------------------------- |
| 場所  | `06_logic.md` L173                                             | `04_rewards.md` L83（計算例）         |
| 内容  | BTC / ETH / XRP / USDT / USDC / JPYR / JPYC / IZAKAYA / KQ（9種） | 計算例: BTC / USDT / ETH / KQ（4種のみ） |


**評価**: 矛盾ではない。domain-model は計算例として4種を使っているだけ。ただし、domain-model にも正式なアセット一覧を記載すべき。

---

## 4. 一致確認済み項目

以下の主要項目は両ドキュメント間で完全に一致している。


| 項目                                                            | 状態  |
| ------------------------------------------------------------- | --- |
| User 状態遷移（ACTIVE/BANNED/WITHDRAW_REQUESTED/DEACTIVATED）       | 一致  |
| KYC 状態遷移（NONE/PENDING/APPROVED/REJECTED）                      | 一致  |
| WalletConnection 状態遷移                                         | 一致  |
| AccountLinkRequest 状態遷移（PENDING/APPROVED/REJECTED）            | 一致  |
| Withdrawal 状態遷移（7状態）                                          | 一致  |
| TradeImport 状態遷移（UPLOADED/VALIDATING/IMPORTED/FAILED）         | 一致  |
| RewardCalculationRun 状態遷移（DRAFT/READY/FAILED）                 | 一致  |
| DistributionRun 状態遷移（DRAFT/CONFIRMED/POSTED/CANCELLED/FAILED） | 一致  |
| ContentItem 状態遷移（6状態）                                         | 一致  |
| Notification 状態遷移（6状態）                                        | 一致  |
| LedgerEntry 状態遷移（POSTED/REVERSED）                             | 一致  |
| 緊急停止スイッチ（4種）                                                  | 一致  |
| 付与計算式（IB報酬 x 還元率 x ランク倍率 x キャンペーン倍率）                          | 一致  |
| 出金制限（最低1,000円、日次100万円）                                        | 一致  |
| PENDING時の残高ロック方針                                              | 一致  |
| FAILED時のリカバリ方針（自動リトライなし）                                      | 一致  |
| BR-01〜BR-09 のルール本体                                            | 一致  |
| ロール定義（User/Admin、MVPはAdmin全権限）                                | 一致  |
| 台帳の追記型（不変）原則                                                  | 一致  |
| BANユーザーのログイン可（読み取り専用）                                         | 一致  |
| 退会の前提条件（残高ゼロ + 進行中出金なし）                                       | 一致  |


---

## 5. 対応優先度まとめ


| ID   | 種別   | 優先度   | 概要                               |
| ---- | ---- | ----- | -------------------------------- |
| C-01 | 矛盾   | **高** | キャンペーン重複時ルール（最大値 vs 未定）          |
| C-02 | 矛盾   | **高** | 端数処理の具体性（TBD-02 依存）              |
| C-03 | 矛盾   | **高** | ランク判定の手動 vs 自動（domain-model内部矛盾） |
| C-04 | 矛盾   | **中** | entry_type の命名不統一                |
| C-05 | 矛盾   | **中** | dedupe_key の構成要素                 |
| D-01 | 不一致  | **中** | 出金手数料が specs に未反映                |
| D-02 | 不一致  | **低** | 没収機能が specs に未反映                 |
| D-03 | 不一致  | **中** | W-04 前提条件と状態遷移の曖昧さ               |
| D-04 | 不一致  | **低** | 監査ログの詳細度差異                       |
| S-01 | 構造差異 | **低** | 計算ステップの分割数（矛盾ではない）               |
| S-02 | 構造差異 | **低** | アセット一覧の記載範囲（矛盾ではない）              |


