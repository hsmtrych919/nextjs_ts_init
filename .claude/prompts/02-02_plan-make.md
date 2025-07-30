
7/23 に作成した 02-01_project-analysis.md に対して、不十分な点（scssのグローバルクラス・モジュール化の整理や命名規則など）を完璧に改善した。7日間での改善記録は 02-01_plan-discussion.md にまとめている。
また、別途作成した 02-03_jsdoc-guide-plan.md　も参照すること。

現フェーズの目的は Claude Codeが効率的に作業できる実態に即したガイド作成計画。

実態に必要なガイド は
1. **`scss-styling-guide.md`**: SCSS Modules + グローバルクラスの使い分けルール
   - CSS Modules vs グローバルクラスの使い分け指針
   - ハイブリッド構成（CSS変数 + モジュールクラス）の運用ルール
   - 外部ライブラリスタイル上書きの指針

2. **`file-naming-standards.md`**: ファイル名、変数名、クラス名の統一規則
   - TypeScript/TSXファイル命名規則
   - SCSSファイル命名規則（モジュール vs グローバル）
   - クラス名命名規則（BEM vs ユーティリティ vs CSS Modules）

3. **`development-workflow.md`**: 開発・ビルド・デプロイの標準手順

4. **`jsdoc-component-guide.md`**  現在のコードベースには既に高品質なJSDocが実装されているが、これらのベストプラクティスを標準化し、新規開発者が容易に同じ品質のドキュメントを作成できるようにするためのガイド文書は必要である。詳しくは 02-03_jsdoc-guide-plan.md を参照。

02-01_project-analysis.md
02-01_plan-discussion.md
02-03_jsdoc-guide-plan.md
の内容を上記を踏まえて確認し、4つのガイド制作において 優先度と難易度を明記してそれぞれ必要な詳細タスク、フローをまとめて計画をたてて。

計画は .claude/tmp/02_plan-make-guide.md としてファイル化して。
実行や作成を勝手に進めるな。勝手に実行することは禁止。
計画を立てたら、まずはその計画を報告することを指示している。