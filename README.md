# Clordle

A Wordle clone: https://rtam.xyz/wordle-clone

Original Wordle: https://www.powerlanguage.co.uk/wordle/

# TODO

v0 WORDLE クローン

- [x] Vanilla JS 実装
- [x] WORDLE 基本機能実装

  - [x] ゲームの成功失敗判定
  - [x] 各種アニメーション
    - [x] beat
    - [x] flip
    - [x] shake
  - [x] ゲーム状態のセーブ・ロード
  - [x] キーボード・ソフトウェアキーボードによる入力
  - [x] キーボードのキーへこれまでの試行正誤結果が反映
  - [x] モーダル・ダイアログは alert()を利用

v1 独自機能の追加など

- [x] オフライン対応
- [x] Installable
- [ ] Web Share API
- [ ] GapePad API
- [ ] Web Componets (Custom Elements)
- [x] OGP 対応

v2 React 実装 & 細かい残り機能

- [ ] ReactJS (or preact)
- [ ] TypeScript
- [ ] vanilla-extract
- [ ] システムテーマから Light/Dark テーマを取得して切り替え
  - [ ] ページ内で Light/Dark テーマ切り替え機能
- [ ] 最初に入力した単語で正解した場合の特殊演出
  - [ ] GENIUS と表示
  - [ ] wave アニメーション
- [ ] ゲーム統計情報を永続化
