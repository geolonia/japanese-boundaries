const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const mkdirp = require("mkdirp");
const { shape_dir, geojson_dir, ndgeojson_dir } = require("./lib");

const findShapes = () => {
  return new Promise((resolve, reject) => {
    try {
      const files = fs.readdirSync(shape_dir);
      const shapes = files
        .filter((file) => file.indexOf(".shp") === file.length - 4)
        .map((filename) => `${shape_dir}/${filename}`);
      resolve(shapes);
    } catch (error) {
      reject(error);
    }
  });
};

const toGeoJSON = (shape_path) => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(shape_path).replace(/\.shp$/, ".geojson");
    const geojson_path = `${geojson_dir}/${filename}`;
    try {
      child_process.execSync(
        `ogr2ogr -t_srs "urn:ogc:def:crs:OGC:1.3:CRS84" -f geojson ${geojson_path} ${shape_path}`
      );
      resolve(geojson_path);
    } catch (error) {
      reject(error);
    }
  });
};

const toNDGeoJSON = (geojson_path) => {
  return new Promise((resolve, reject) => {
    const filename = path
      .basename(geojson_path)
      .replace(/\.geojson$/, ".ndgeojson");
    const ndgeojson_path = `${ndgeojson_dir}/${filename}`;

    try {
      const geojson = JSON.parse(
        fs.readFileSync(geojson_path).toString("utf-8")
      );
      const ndgeojson = geojson.features
        .map((feature) => {
          return JSON.stringify({
            name: geojson.name,
            csr: geojson.csr,
            ...feature,
          });
        })
        .join("\n");
      fs.writeFileSync(ndgeojson_path, ndgeojson);
      resolve(ndgeojson_path);
    } catch (error) {
      reject(error);
    }
  });
};

const toDissolvedGeoJSONByPref = (shape_path) => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(shape_path).replace(/\.shp$/, ".geojson");
    const geojson_path = `${geojson_dir}/${filename}`;
    const table_name = path.basename(shape_path, ".shp");
    rmDir(geojson_path).then(() => {
      try {
        child_process.execSync(
          `ogr2ogr -t_srs "urn:ogc:def:crs:OGC:1.3:CRS84" -f geojson ${geojson_path} ${shape_path} -dialect sqlite -sql "select ST_union(Geometry), PREF, PREF_NAME from ${table_name} group by PREF"`
        );
        const geojson = JSON.parse(fs.readFileSync(geojson_path));
        delete geojson.name;
        fs.writeFileSync(geojson_path, JSON.stringify(geojson));
        resolve(geojson_path);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const toDissolvedGeoJSONByCity = (shape_path) => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(shape_path).replace(/\.shp$/, ".geojson");
    const geojson_path = `${geojson_dir}/${filename}`;
    const table_name = path.basename(shape_path, ".shp");
    rmDir(geojson_path).then(() => {
      try {
        child_process.execSync(
          `ogr2ogr -t_srs "urn:ogc:def:crs:OGC:1.3:CRS84" -f geojson ${geojson_path} ${shape_path} -dialect sqlite -sql "select ST_union(Geometry), PREF, CITY, PREF_NAME, CITY_NAME from ${table_name} group by CITY"`
        );
        const geojson = JSON.parse(fs.readFileSync(geojson_path));
        delete geojson.name;
        fs.writeFileSync(geojson_path, JSON.stringify(geojson));
        resolve(geojson_path);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const main = async () => {
  await mkdirp(geojson_dir);
  await mkdirp(ndgeojson_dir);

  const shape_paths = await findShapes();
  const geojson_paths = await Promise.all(shape_paths.map(toGeoJSON));
  const ndgeojson_paths = await Promise.all(geojson_paths.map(toNDGeoJSON));
};

main();
