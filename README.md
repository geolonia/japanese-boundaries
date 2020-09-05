# Geolonia 領域データ

全国町丁目レベルの領域データをオープンデータとして公開いたします。

## 領域データ仕様

### ファイルフォーマット

GeoJSON

### properties

以下を参照してください。

https://www.e-stat.go.jp/help/data-definition-information/downloaddata/A002005212015.pdf

## 貢献方法

### 必要なプログラム

- Node.js^12
- unzip
- GDAL ogr2ogr

### データのダウンロード、ビルド

```shell
$ git clone git@github.com:geolonia/japanese-boundaries.git
$ cd japanese-boundaries
$ npm install
$ npm run build
```
