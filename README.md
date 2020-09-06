# Geolonia 領域データ

全国町丁目レベルの領域データをオープンデータとして公開いたします。

本データは、2015 年度国勢調査の境界データ（小地域（町丁・字等別））をベースにし、現在までの市区町村変更を反映させたものです。

## 領域データ仕様

### ファイルフォーマット

GeoJSON

### properties

GeoJSON のプロパティは「[平成 27 年国勢調査町丁・字等別境界データ　データベース定義書](https://www.e-stat.go.jp/help/data-definition-information/downloaddata/A002005212015.pdf)」に基づきます。

## 貢献方法

### 必要なプログラム

データのビルドには以下のプログラムが必要です。

- Node.js^12
- unzip
- [GDAL](https://gdal.org/download.html)

### データのビルド

```shell
$ git clone git@github.com:geolonia/japanese-boundaries.git
$ cd japanese-boundaries
$ npm install
$ npm run build
```
