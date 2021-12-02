# rails6 tutorial sample app

[プロダクトページはこちら](https://rails-tutorial.vercel.app/)
<br>
[Rails tutorial のページはこちら](https://railstutorial.jp/chapters/beginning?version=6.0)

こちらは Next.js による**フロントエンド**側の App レポジトリーです。
**バックエンド**側の Rails API 側のレポジトリーは[こちら](https://github.com/takaya787/tut_backend)

## このサンプルアプリケーションについて記事を書きました!

読んで頂けると幸いです。
[記事はこちら](https://qiita.com/takaya787/items/86e0ee24b2e148a755fe)

## サイト概要

**Rails Tutorial**(rails ver 6.0)用のアプリケーションを`React`を用いて完全 SPA 化しました。

## 作成理由

**Rails Tutorial**は初めて**Rails**を触れる人にとっては非常に優れた教材だと思います。現在**Rails**を勉強中で、まだ購入していない人はぜひ購入してみてください。
ただ、現在は**SPA(Single Page Application)**が非常に流行っているので、**Rails tutorial**のバックエンドを用いて**SPA**作成の勉強のために作成しました。
各章ごとにブランチを残しているので、もし興味がある人はぜひチェックしてみてください。

## 使用技術 一覧

- Ruby 2.7.2
- Rails 6.1.1
- Typescript
- React
- Next
- Bootstrap
- Docker, Docker-compose (開発環境)
- Postgresql(DB)
- Google Cloud Storage(画像保存用)
- Send Grid(Email 配信用)

## 機能一覧

◆ 　ユーザー機能

- 新規登録、ログイン、ログアウト、email によるユーザー有効化設定、password reset 機能
- マイページ、登録情報を変更

◆ 　マイクロポスト機能

- マイクロポスト作成、編集、消去
- マイクロポストに画像を追加(`GCSに保存`)

◆ 　ユーザー機能

- 他のユーザーをフォロー
- フォローしたユーザーのフォローを解除
- フォローしたユーザー、フォローされているユーザーを確認

◆ 　フィード機能

- フォローしたユーザーのマイクロポストを表示
