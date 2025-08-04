grid.module.scss の

@include g.media-breakpoint-up($breakpoint) {
  @for $i from 1 through $block-grid-max {
    .grid#{$infix}-#{$i} {
      @include flex-grid-layout($i);
    }
  }

はもしかして
.grid-1 > li,
.grid-1 > .col {
  width: 100%;
}

.grid-2 > li,
.grid-2 > .col {
  width: 50%;
}
以下略

というように出力されてる？しっかりと引用の関数など調べて。


命名規則
#### 基本ルール
- ファイル名がBlock役割を担う
- クラス名は `element--modifier` 形式
- 冗長性を排除した効率的な命名

#### 実装例

**grid.module.scss**
```scss
.col--12 {              // 12カラム
  // スタイル定義
}

.col--lg-10 {           // lgブレークポイント・10カラム
  // スタイル定義
}

.row--container {       // コンテナ付きrow
  // スタイル定義
}
```


gridDemo.tsx の以下使用例において
<ul className={`${gridStyles.grid} ${gridStyles['grid--2']} ${gridStyles['grid--md-4']}`} style={{ rowGap: 'var(--gutter)' }}>
  <li >



grid--md-4 > li にはスタイル があるが、grid--2 > には何もスタイルく、ブロックグリッドのレイアウトが破綻している。

いきなり修正を実行するな。まず現状を正しく把握しどこをどう改善するべきかに100%集中して原因を把握して。