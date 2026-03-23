# Domain Model vs Specs 整合性レポート — レビュー結果

> 作成日: 2026-03-08
> 対象: `docs/domain-model/consistency-report.md` の検証

## 総評

**整合性レポートは概ね正確である。** 指摘された矛盾・不一致・構造的差異は、該当ドキュメントの該当行を照合した結果、いずれも妥当であった。ただし、いくつか補足・修正点がある。

---

## 1. 矛盾（Contradiction）の検証結果

### C-01: キャンペーン倍率の重複時ルール — ✅ レポート正しい


| 検証結果         | 詳細                                                                           |
| ------------ | ---------------------------------------------------------------------------- |
| domain-model | `04_rewards.md` L152: 「複数キャンペーンが重複する場合は **最大値を採用**」                          |
| specs        | `06_logic.md` L349: 「複数重複時の合算/最大値/優先度は**下位設計で定義**」                           |
| 判定           | 矛盾あり。domain-model は決定済み、specs は未決定扱い。レポートの推奨（specs を domain-model に合わせる）は妥当。 |


---

### C-02: 端数処理（D-03）の記述粒度 — ✅ レポート正しい


| 検証結果         | 詳細                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------- |
| domain-model | `04_rewards.md` L75-76: KQは**1 KQ単位**、その他は**1 pt単位**で切捨て                                        |
| specs        | `06_logic.md` L213-216: **token_decimals に従い最小単位**で切捨て                                          |
| 判定           | 矛盾あり。domain-model の「1 KQ / 1 pt」は token_decimals=0 相当。TBD-02 未決定のため specs 側が抽象化している。レポートの指摘は妥当。 |


---

### C-03: ランク設定 — 手動 vs 自動 — ✅ レポート正しい


| 検証結果            | 詳細                                                                     |
| --------------- | ---------------------------------------------------------------------- |
| domain-model 01 | `01_identity_and_access.md` L347: 「ランクは**手動設定**（Admin操作）」              |
| domain-model 04 | `04_rewards.md` L109-117: 昇格は**月次バッチで自動判定**、降格は**90日非アクティブで自動降格**      |
| specs           | `06_logic.md` L301-313: 同様に月次バッチで自動判定                                  |
| 判定              | domain-model 内部矛盾。01 の決定済み事項が古い記述の可能性。レポートの推奨（01 を 04/specs に合わせる）は妥当。 |


---

### C-04: 台帳エントリの型名（entry_type）— ✅ レポート正しい


| 検証結果              | 詳細                                                                        |
| ----------------- | ------------------------------------------------------------------------- |
| domain-model      | `03_trade_import_and_ledger.md` L199-201: `CREDIT` / `DEBIT` / `REVERSAL` |
| specs 06_logic    | `06_logic.md` L255: `GRANT` / `CANCEL` / `ADJUST`                         |
| specs 04_glossary | `04_glossary.md` L37: `CREDIT` / `DEBIT` / `ADJUST`                       |
| 判定                | 3箇所で異なる命名。レポートの推奨（Ledger層 vs アプリ層の分離を明記）は妥当。                              |


**補足**: `06_logic.md` の `entry_type` は「台帳に必須のキー」表内の列名として `GRANT/CANCEL/ADJUST` が使われている。domain-model の `CREDIT/DEBIT/REVERSAL` は LedgerEntry の操作種別。レイヤーが異なる可能性があるが、現状は混在しており整理が必要。

---

### C-05: dedupe_key の構成要素 — ✅ レポート正しい


| 検証結果         | 詳細                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| domain-model | `03_trade_import_and_ledger.md` L225: `batch_id + user_id + entry_type` 等                                      |
| specs        | `06_logic.md` L257: `batch_id + user_id + entry_type + asset_code`                                             |
| 判定           | 矛盾あり。複数アセットへの按分がある以上、`asset_code` なしでは同一ユーザー・同一バッチ内の複数アセット付与を区別できない。レポートの推奨（domain-model に asset_code を追加）は妥当。 |


---

## 2. 不一致（Discrepancy）の検証結果

### D-01: 出金手数料（ランク別）— ✅ レポート正しい


| 検証結果         | 詳細                                                                          |
| ------------ | --------------------------------------------------------------------------- |
| domain-model | `05_withdrawals.md` L99-111: ランク別手数料（Member/Silver/Gold: TBD）、手数料は出金額から差し引き |
| specs        | `06_logic.md` BR-03: 出金成立ルールに手数料の言及なし。`05_usecases.md` の W-02 にも手数料の記載なし。   |
| 判定           | domain-model にのみ存在。レポートの指摘は妥当。                                              |


**補足**: `05_withdrawals.md` W-02 L18 には「ランク別手数料を算出」とあるが、specs 側には反映されていない。

---

### D-02: 没収（Confiscation）機能 — ✅ レポート正しい


| 検証結果         | 詳細                                                                               |
| ------------ | -------------------------------------------------------------------------------- |
| domain-model | `01_identity_and_access.md` L141-148: A-06 に「没収」フロー（DEBIT/CONFISCATE を台帳に追記）     |
| specs        | `05_usecases.md`, `08_roles_permissions.md`: 没収の記載なし。「台帳delta調整」はあるが没収は明示されていない。 |
| 判定           | domain-model にのみ存在。レポートの指摘は妥当。                                                   |


---

### D-03: 出金の W-04 前提条件と状態遷移の整合 — ✅ レポート正しい


| 検証結果    | 詳細                                                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W-04 前提 | `05_withdrawals.md` L63: 対象申請が `APPROVED`**（または `PROCESSING`）**                                                                                                                    |
| 状態遷移図   | `05_withdrawals.md` L141, `07_state_transitions.md` L78-80: APPROVED → PROCESSING → COMPLETED（順次）                                                                                  |
| 判定      | 曖昧さあり。W-04 は APPROVED の時点でも TxHash 登録可能と読めるが、状態図では PROCESSING → COMPLETED で TxHash 記録。実態としては「送金開始」で APPROVED→PROCESSING に遷移し、TxHash 登録で PROCESSING→COMPLETED と解釈するのが自然。レポートの推奨は妥当。 |


---

### D-04: 監査ログのランク関連記録の詳細度 — ✅ レポート正しい


| 検証結果         | 詳細                                                                                  |
| ------------ | ----------------------------------------------------------------------------------- |
| domain-model | `07_platform_ops.md` L178: 「配分比率変更、**ランク設定変更**、還元率変更」                               |
| specs        | `06_logic.md` L134: 「配分比率変更、ランク倍率変更、**ランク閾値（LEV_USD閾値）変更（effective_from含む）**、還元率変更」 |
| 判定           | specs のほうが詳細。domain-model の「ランク設定変更」は曖昧。レポートの推奨は妥当。                                 |


---

## 3. 構造的差異（Structural Gap）の検証結果

### S-01: 付与計算モデルのステップ分割 — ✅ レポート正しい


| 検証結果         | 詳細                                                                                |
| ------------ | --------------------------------------------------------------------------------- |
| domain-model | 2ステップ: ユーザー還元原資算出 → アセット別付与量算出                                                    |
| specs        | 3ステップ: IB報酬算出 → ユーザー還元原資算出 → アセット別付与量算出                                           |
| 判定           | 矛盾ではない。domain-model の Rewards ドメインは「確定済みRを受け取ってから」が責務のため IB 報酬集計を含まない。レポートの評価は妥当。 |


---

### S-02: Phase1 初期アセット一覧 — ✅ レポート正しい


| 検証結果         | 詳細                                                                                 |
| ------------ | ---------------------------------------------------------------------------------- |
| specs        | `06_logic.md` L173: BTC / ETH / XRP / USDT / USDC / JPYR / JPYC / IZAKAYA / KQ（9種） |
| domain-model | `04_rewards.md` L83: 計算例として BTC / USDT / ETH / KQ（4種のみ）                            |
| 判定           | 矛盾ではない。domain-model は計算例のため。レポートの「domain-model にも正式なアセット一覧を記載すべき」は妥当。              |


---

## 4. レポートに未記載の確認事項

### csv-format.md との整合

- `docs/csv-format.md` は `docs/domain-model/` や `docs/specs/` とは別ドキュメントだが、整合性レポートの対象外。
- `reward_usd` は **Integer（cents）** で保持（csv-format L35）。domain-model の「RはUSDの最小単位整数で保持」と一致。
- `trade_id` の生成ルール（ブローカーコードプレフィックス）は csv-format と domain-model で一致。

### tech-stack.md との整合

- `docs/tech-stack.md` は技術選定であり、domain-model / specs の業務ルールとは直接の矛盾はなし。
- 追記型台帳、整数演算、監査ログ必須など、tech-stack の記載は specs と整合。

---

## 5. レビュー結論


| 項目       | 判定                                 |
| -------- | ---------------------------------- |
| レポートの正確性 | **概ね正確**。指摘はすべて該当箇所で確認できた。         |
| 行番号      | 若干のずれがある可能性はあるが、おおむね正確。            |
| 推奨アクション  | いずれも妥当。                            |
| 優先度      | C-01〜C-03 を高、C-04〜C-05 を中とする分類は適切。 |


### 追加推奨

1. **csv-format.md の参照**: 整合性レポートの対象に `docs/csv-format.md` を加えると、Trade Import 周りの整合性確認がより網羅的になる。
2. **entry_type の整理**: C-04 について、`06_logic.md` の `GRANT/CANCEL/ADJUST` が「業務イベント種別」なのか「台帳操作種別」なのか、用語定義（04_glossary）で明示するとよい。
3. **没収と delta 調整**: D-02 の没収は、specs の「台帳delta調整」に含まれると解釈することも可能。含める場合は 08_roles_permissions に「没収（delta調整の一種）」と追記するのが望ましい。

---

## 6. 検証に使用したドキュメント

- `docs/domain-model/01_identity_and_access.md`
- `docs/domain-model/03_trade_import_and_ledger.md`
- `docs/domain-model/04_rewards.md`
- `docs/domain-model/05_withdrawals.md`
- `docs/domain-model/07_platform_ops.md`
- `docs/specs/04_glossary.md`
- `docs/specs/05_usecases.md`
- `docs/specs/06_logic.md`
- `docs/specs/07_state_transitions.md`
- `docs/specs/08_roles_permissions.md`
- `docs/csv-format.md`
- `docs/tech-stack.md`

