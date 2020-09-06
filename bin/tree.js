const fs = require("fs");
const mkdirp = require("mkdirp");
const readline = require("readline");
const { ndgeojson_dir, dest_dir } = require("./lib");

const findNdGeoJSONs = () => {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(ndgeojson_dir);
      const shapes = files
        .filter(
          (file) =>
            file.indexOf(".ndgeojson") === file.length - ".ndgeojson".length
        )
        .map((filename) => `${ndgeojson_dir}/${filename}`);
      resolve(shapes);
    } catch (error) {
      reject(error);
    }
  });
};

const parseAsDirectoryTree = async (ndgeojson_path) => {
  const fileStream = fs.createReadStream(ndgeojson_path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const geojson_paths = [];
  for await (const line of rl) {
    let geojson;
    try {
      geojson = JSON.parse(line);
    } catch (error) {
      console.log({ line });
      console.error(error);
      continue;
    }
    delete geojson.name;

    const {
      PREF: prefCode,
      CITY: cityCode,
      S_AREA: smallAreaCode,
    } = geojson.properties;

    const city_dir = `${dest_dir}/${prefCode}/${prefCode + cityCode}`;
    const geojson_path = `${city_dir}/${smallAreaCode}.geojson`;
    await mkdirp(city_dir);
    fs.writeFileSync(geojson_path, JSON.stringify(geojson, null, 2));
    geojson_paths.push(geojson_path);
  }
  return geojson_paths;
};

const main = async () => {
  const ndgeojson_paths = await findNdGeoJSONs();
  await Promise.all(ndgeojson_paths.map(parseAsDirectoryTree));
};
main();
