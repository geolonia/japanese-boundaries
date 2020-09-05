const fs = require("fs");
const https = require("https");
const path = require("path");
const child_process = require("child_process");
const mkdirp = require("mkdirp");
const { rmDir, shape_dir } = require("./lib");

/**
 * 小地域のシェープファイルをダウンロード
 * @param {string} prefCode
 */
const download = (prefCode) => {
  const url = `https://www.e-stat.go.jp/gis/statmap-search/data?dlserveyId=A002005212015&code=${prefCode}&coordSys=2&format=shape&downloadType=5`;
  return new Promise((resolve, reject) => {
    const filepath = path.resolve(shape_dir, `${prefCode}.zip`);
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) =>
      response
        .pipe(file)
        .on("finish", () => resolve(filepath))
        .on("error", (error) => reject(error))
    );
  });
};

/**
 * zip ファイルを展開する
 * @param {string} filepath
 * @return {Promise<void>}
 */
const unzip = (filepath) => {
  return new Promise((resolve, reject) => {
    try {
      child_process.execSync(
        `pushd ${shape_dir} && unzip -o ${filepath} && rm ${filepath} && popd`
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const main = async () => {
  const defaultPrefCodes = Array(47)
    .fill(0)
    .map((_0, index) => (index + 1).toString().padStart(2, "00"));
  const givenPrefCode = (process.argv[2] || "").padStart(2, "00");

  const prefCodes = process.argv[2] ? [givenPrefCode] : defaultPrefCodes;

  await mkdirp(shape_dir);

  for (const prefCode of prefCodes) {
    process.stderr.write(
      `downloading shapefile with prefCode of ${prefCode}...\n`
    );
    await download(prefCode).then(unzip);
  }
};

main();
