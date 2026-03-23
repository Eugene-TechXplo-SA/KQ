# KING and QUEEN

ロイヤリティ・トークンプラットフォームの仕様策定プロジェクト。
実装は南アフリカチームが担当。本リポジトリは仕様書・画面設計書の管理が目的。

## Notion（正式ドキュメント）

- 仕様書・画面設計書は Notion が正。notion-fetch / notion-search で参照。
- ローカルの docs/specs/, screen-docs/ は Notion と同期した参照コピー。

## ドキュメント構成

- 仕様書: `docs/specs/`（11ファイル構成）
- 画面設計書: `screen-docs/{user, admin}/`
- サンプルUI: `samples/`
- 変更管理: `openspec/`
- Figma出力用: `admin/index.html`

## ルール

- docs/specs/ の内容を直接編集しない。OpenSpec change 経由で変更する。
- 画面設計書の命名: ユーザー `S-XX`, 管理 `A-XX`
- 応答は日本語。

## テンプレート

- `.claude/spec-writing-guide.md`
- `.claude/spec-templates.md`
- `.claude/screen-doc-templates.md`
