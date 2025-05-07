# Project Guidelines

[共通]
* ts, tsxファイルはすべてkebab-caseで命名する

[フロントエンド]
* スタイルにはTailWindCSSを使用する

[サーバーサイド]
* src/app/api はサーバーサイドの領域と定義する
* Clean Architectureに基づく 

[JsDoc]
* 日本語で記載する
* classについては、constructorを除いてすべて記載する
* function, constについては、記載不要

[テスト]
* Vitestを使用する
* vitest.testの説明文は日本語にする
* フロントエンド、サーバーサイドともに、可能な限り単体テストを実装する
* 期待値の比較をする際、戻り値がobjectの場合は、objectでの比較をする。NG: obj.idでの比較はしない