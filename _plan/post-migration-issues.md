# Step 1〜7 実装後の問題点・不手際・実行ミス 全量リスト

作成日: 2026-03-28
対象: tw-migration-plan-2026-03-23.md の全 Step（impl-prompt-step1〜7）実行後の現状

---

## 調査方法

- 計画書 §4（移行後ディレクトリ構造）、§6（ファイル移行マッピング）、§8（global API 統合）、§9（SCSS→CSS変数変換）、§11（style.scss 最終構成）、§14（実行ステップ）、§15（判断保留事項）を全文精読
- impl-prompt-step1〜7 の全文精読（特に Step 4 の最終到達状態・完了チェック・作業手順）
- precheck-01〜07 の全文精読
- log.md の全 Step 記録を精読
- 実コード全ファイルの内容確認（@use パス、ディレクトリ構造、変数使用状況）
- git show での移行前コードとの差分比較

---

## 問題 1（実行ミス）: `swiper/` が features/ に配置されている — vendor/ が正しい

**重大度: 高**

**現状**: `src/styles/global/features/swiper/_swiper-bundle.scss`（Swiper 8.3.2、サードパーティライブラリ CSS）が `features/` 内に存在する。

**根拠 — なぜ vendor/ が正しいか**:
- 計画書§4 移行後の構造で `features/` の中身は `_layout.scss`, `_tab.scss`, `_toggle.scss`, `_table.scss`, `_style.scss` の5ファイルのみ。`swiper/` は含まれていない
- `features/` はプロジェクト固有のグローバルスタイル用ディレクトリ。サードパーティ CSS の配置場所は `vendor/`
- Step 4 impl-prompt の最終到達状態（L31-50）で features/ の中身が明示的に列挙されており、swiper/ は含まれていない
- 同じサードパーティ CSS である react-modal は Step 4 の 4-1d で `component/react-modal/` → `vendor/react-modal/` に正しく移動された。swiper も同様に `vendor/swiper/` に移動すべきだった
- scroll-hint も `utility/` → `vendor/scroll-hint/` に正しく移動された

**発生原因**:
- Step 4 の 4-1a で `component/` → `features/` にディレクトリごとリネームした際、`component/` 内にあった `swiper/` が丸ごと `features/` に入った
- impl-prompt-step4 の手順 4-1d で react-modal と scroll-hint の vendor/ への移動は明記されていたが、swiper の移動/処理が明記されていなかった
- 実行者（AI）は Step 4 ログ L134 で「swiper/ ディレクトリが features/ 内に残存: style.scss でコメントアウト済みの @use がある可能性があるため温存」と記録したが、**vendor/ に移動すべきという判断をしなかった**

**補足**: 移行前の `style.scss` で `// @use "component/swiper/swiper-bundle";` とコメントアウトされており、現在の `style.scss` からも参照されていない（ビルド出力に含まれない）。ただし配置場所の問題は使用有無に関わらず是正すべき。

**修正案**: `src/styles/global/features/swiper/` → `src/styles/global/vendor/swiper/` に移動

---

## 問題 2（処理漏れ）: `global/global/_unicode.scss` が残存

**重大度: 中**

**現状**: `src/styles/global/global/_unicode.scss` が存在する。FontAwesome の `unicode()` 関数を定義。`_index.scss` で `@forward` されておらず、どこからも参照されていない孤立ファイル。

**根拠**:
- 計画書§8 移行後の `@forward` リストに `_unicode` は含まれていない（`variables, breakpoints, calc, hover, media-queries` のみ）
- 計画書§4 移行後の `global/global/` ファイル一覧に `_unicode.scss` は含まれていない
- FontAwesome は計画書で除外対象（§2 `unicode` 廃止、§6 `_font.scss` から FA mixin 除去）

**発生原因**:
- Step 2 ログ:「後続 Step で整理予定」
- Step 3 ログ:「依然残存: 無害」
- 以降のどの Step の対象にも組み込まれず放置。impl-prompt-step7（不要ディレクトリ削除）は `utility/`, `layout/`, `foundation/`, `mixins/` のディレクトリ単位の削除のみ対象で、`global/global/` 内の個別ファイル削除は含まれていなかった

**修正案**: `src/styles/global/global/_unicode.scss` を削除

---


## 問題 4（既存の残存物）: header/footer/index.module.scss に未使用の `@use "sass:color"` が残存

**重大度: 低**

**現状**:
- `src/styles/modules/header.module.scss` L2: `@use "sass:color";` — `color.` の使用 0 件
- `src/styles/modules/footer.module.scss` L2: `@use "sass:color";` — `color.` の使用 0 件
- `src/styles/modules/index.module.scss` L2: `@use "sass:color";` — `color.` の使用 0 件

**確認**: `git show a9f01b6` で移行前を確認 — **3 ファイルとも移行前から `@use "sass:color"` が存在**。移行で追加されたものではない。

**根拠**:
- 計画書§6「現 Next.js から維持するファイル」で header/footer/index module.scss は「変更なし」と明記
- impl-prompt-step4 の非スコープ（L77-79）に 3 ファイルが明記
- ビルドに害はないが、Sass deprecation warning の一因になりうる

**修正案**: `@use "sass:color";` を 3 ファイルから削除（1 行削除のみ、低リスク）

---

## 問題 5（既存の残存物）: vendor/react-modal/_react-modal.scss に未使用の `@use "sass:color"` が残存

**重大度: 低**

**現状**: `src/styles/global/vendor/react-modal/_react-modal.scss` L2: `@use "sass:color";` — `color.` の使用 0 件

**確認**: 移行前の `component/react-modal/_react-modal.scss` にも同一の `@use "sass:color"` が存在 — 移行前からの既存物。

**根拠**: 計画書§6 で react-modal は「変更なし」。impl-prompt-step4 の vendor/ 移動手順でも内容変更は含まれていない。

**修正案**: `@use "sass:color";` を削除（1 行削除のみ、低リスク）


---

## 問題 6（処理漏れ）: `_variables-color.scss` が残存 — tw_source では Phase 5 で削除済み

**重大度: 中**

**現状**: `src/styles/global/global/_variables-color.scss` が存在し、`_index.scss` で `@forward "_variables-color"` されている。

**tw_source 調査結果**:
- tw_source の `src/scss/global/` に `_variables-color.scss` は存在しない（Phase 5 で削除済み）
- tw_source の `_index.scss` にカラー変数の `@forward` はない
- tw_source では全カラー参照が `var(--clr1)` 等の CSS 変数形式に移行済み（40件以上）
- tw_source CLAUDE.md L29-30: SCSS 変数は CSS 変数化し、`g.$` 形式の `@use` を使わない方針

**現プロジェクトでの実使用状況（現物確認済み）**:
- `g.$clr1` — アクティブ参照 0 件（module.scss 内は全て Step 4 で `var(--clr1)` に変換済み）
- `g.$clrg50`〜`g.$clrg900` — アクティブ参照 0 件
- `g.$clr1-hover` — アクティブ参照 0 件
- `g.$black` — アクティブ参照 **2 件**（`features/_table.scss` L78, L83: `rgba(g.$black, 0.8)`）
- `g.$white` — アクティブ参照 0 件

**根拠**:
- 計画書§4 移行後の `global/global/` ファイル一覧に `_variables-color.scss` は含まれていない
- 計画書§8 移行後の `@forward` リストにも含まれていない
- Step 3 で `foundation/_variables-color.scss` の内容を `global/global/` に移設して作成したが、tw_source の方針に沿えば最終的に不要
- `_tailwind-base-layer.scss` で `--black: #222` が CSS 変数として定義済み

**発生原因**: Step 3 実行時に後方互換のため移設したが、Step 4 でカラー変数の CSS 変数化が完了した後も削除されなかった。impl-prompt に削除手順が含まれていなかった。

**修正案（未実施）**:
1. `features/_table.scss` L78, L83 の `rgba(g.$black, 0.8)` → `rgba(#222, 0.8)` 等に変換
2. `global/global/_variables-color.scss` を削除
3. `global/global/_index.scss` から `@forward "_variables-color"` を削除


---

## 問題 7（処理漏れ）: utility/ 削除後、TSX 内のグローバルユーティリティクラス参照が宙に浮いている

**重大度: 中**

**現状**: Step 7 で `src/styles/global/utility/` を削除したが、TSX ファイル内で旧 `utility/_font.scss` 由来のグローバルクラスを参照している箇所が残存。クラス定義が消失しているため、スタイルが適用されない。

**該当箇所（現物確認済み）**:

1. `src/components/layout/footer.tsx` L44:
   ```tsx
   <p className={`${styles.copy} fz-14 tac`}>
   ```
   - `fz-14`: 旧 `utility/_font.scss` L9 で定義 — `font-size: min(calc(var(--unit) * 14), g.rem(15)) !important;`
   - `tac`: 旧 `utility/_font.scss` L46 でレスポンシブ生成 — `text-align: center !important;`

2. `src/components/ui/TableDemo.tsx` — `fw-500` が 14 箇所:
   ```tsx
   <td className="fw-500">  // L38, L40, L42, L46, L50, L54, L56, L58, L62, L66, L70, L72, L76, L80
   ```
   - `fw-500`: 旧 `utility/_font.scss` L66 で定義 — `font-weight: 500;`

**根拠**:
- 計画書§7「tailwind.config.js の extend.fontSize（fz12〜fz36）」で utility クラスの Tailwind 化を記載。しかし Tailwind の使用形式は `text-fz14` であり `fz-14` ではない
- impl-prompt-step6 のスコープに footer.tsx を含むが、gridStyles/gutterStyles 変換が主目的で font utility クラスの変換は明記されていない
- impl-prompt-step7 は SCSS ファイル削除のみで、TSX 内のクラス名参照チェックは対象外
- Step 5 のスコープに TableDemo.tsx を含むが、`fw-500` の変換は明記されていない

**発生原因**: utility/ 削除の影響範囲が SCSS の `@use` 参照のみチェックされ、TSX 内でグローバルクラスとして直接参照しているケースが見落とされた。

**修正案（未実施）**:
- `footer.tsx` L44: `fz-14` → `text-fz14`（※ 元の min() 計算とは異なる固定値になる点に注意）、`tac` → `text-center`
- `TableDemo.tsx` 14 箇所: `fw-500` → `font-medium`（Tailwind 標準）

---

## 問題 8（未完了）: Step 5 完了条件未達 — `c-table` がコメント内に残存

**重大度: 低**

**現状**: `src/lib/hooks/useTableScroll.ts` のコメント内に `c-table` が 2 件残存。

- L10: `@param tableOuterSelector テーブル外側コンテナ要素のセレクタ（例: '.c-table__responsive'）`
- L19: `useTableScroll('.c-table__responsive');`

**根拠**:
- impl-prompt-step5 L27: 「プロジェクト全体で `c-tab`、`c-toggle`、`c-table` を含むコードが 0 件（**コメント内も含む**）」
- impl-prompt-step5 L189: 「プロジェクト全体で `c-table` の検索結果が 0 件」
- 上記完了条件を満たしていない

**ログとの不整合**:
- log.md L171: 「`useTableScroll.ts` のコメント内 `c-table` 2 件: 非スコープのため変更なし」と例外扱い
- impl-prompt-step5 L191 に「`useTableScroll.ts` が変更されていない」という完了条件もあり、L189 の「`c-table` 0 件」と矛盾するプロンプト設計上の問題がある
- ただし「コメント内も含む」が明記されている以上、完了条件未達の事実は変わらない

**修正案（未実施）**: `useTableScroll.ts` L10, L19 のコメント内 `c-table__responsive` → `table__responsive` に更新

---

## 計画書と実装の整合確認（問題なし項目）

| # | 確認項目 | 結果 |
|---|---|---|
| 1 | style.scss が計画書§11 の最終構成と一致 | ✓ |
| 2 | foundation/ 削除済み（Step 3） | ✓ |
| 3 | mixins/ 削除済み（Step 7） | ✓ |
| 4 | utility/ 削除済み（Step 7） | ✓ |
| 5 | layout/ 削除済み（Step 7） | ✓ |
| 6 | grid.module.scss 削除済み（Step 6） | ✓ |
| 7 | gutter.module.scss 削除済み（Step 6） | ✓ |
| 8 | modules/ ファイル一覧が計画書§4 と一致（7ファイル） | ✓ |
| 9 | vendor/ 構成が計画書§4 と一致（react-modal/ + scroll-hint/） | ✓ |
| 10 | _app.tsx import 順序が計画書§3 と一致 | ✓ |
| 11 | FLOCSS prefix（c-）が実コード（コメント外）に残存なし | ✓ |
| 12 | gridStyles/gutterStyles が実コード（コメント外）に残存なし | ✓ |
| 13 | jc-start/ai-center が実コードに残存なし | ✓ |
| 14 | 実コードに `@use.*foundation` 参照なし | ✓ |
| 15 | 実コードに `@use.*mixins` 参照なし | ✓ |
| 16 | 実コードに `@use.*component` 参照なし（旧パス） | ✓ |
| 17 | 実コードに `@use.*utility` 参照なし | ✓ |
| 18 | features/ 内各ファイルの `@use "../global" as g;` パス正常 | ✓ |
| 19 | vendor/react-modal/ の `@use "../../global" as g;` パス正常 | ✓ |
| 20 | _tailwind-base-layer.scss の `--bdrs: #{g.rem(6)}` 確認 | ✓ |
| 21 | _tailwind-base-layer.scss の `--modal-height-photo: 75vh` 確認 | ✓ |
| 22 | features/_layout.scss から container-py--blog/--search 除去済み | ✓ |
| 23 | type.module.scss に title__underbar/bg-grd/bg-grd--wrap 追加済み | ✓ |
| 24 | type.module.scss の rhombus/horizontal が 2 層構造化済み | ✓ |
| 25 | _toggle.scss の `m.hover` → `g.hover` 完了 | ✓ |
| 26 | button.module.scss の `m.hover` → `g.hover` 6 箇所完了 | ✓ |
| 27 | button.module.scss の `g.$border-radius` → `var(--bdrs)` 完了 | ✓ |
| 28 | npm run build 成功 | ✓ |

---

## 要修正サマリ

| # | 重大度 | 分類 | 内容 | 修正作業 |
|---|---|---|---|---|
| 1 | **高** | 実行ミス | `features/swiper/` — サードパーティ CSS が features/ に誤配置。vendor/ が正しい | `vendor/swiper/` に移動 |
| 2 | **中** | 処理漏れ | `global/global/_unicode.scss` が孤立残存 | ファイル削除 |
| 4 | 低 | 既存残存物 | header/footer/index.module.scss に未使用 `@use "sass:color"` | 1 行削除 × 3 |
| 5 | 低 | 既存残存物 | vendor/react-modal/_react-modal.scss に未使用 `@use "sass:color"` | 1 行削除 |
| 6 | **中** | 処理漏れ | `_variables-color.scss` が残存 — tw_source では削除済み。`g.$black` 参照 2 件のみ | `_table.scss` の `g.$black` 変換 → ファイル削除 → `@forward` 削除 |
| 7 | **中** | 処理漏れ | utility/ 削除後、TSX 内の `fz-14`, `tac`, `fw-500` クラス参照が定義消失 | footer.tsx: Tailwind クラスに変換、TableDemo.tsx: `fw-500` → `font-medium` |
| 8 | 低 | 未完了 | Step 5 完了条件未達 — `useTableScroll.ts` コメント内 `c-table` 2 件残存 | コメント内 `c-table__responsive` → `table__responsive` |
