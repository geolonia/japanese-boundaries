const path = require("path");
const rimraf = require("rimraf");

const tmp_dir = path.resolve(__dirname, "..", "tmp");
const shape_dir = path.resolve(__dirname, "..", "tmp", "shapes");
const geojson_dir = path.resolve(__dirname, "..", "tmp", "geojson");
const ndgeojson_dir = path.resolve(__dirname, "..", "tmp", "ndgeojson");
const dest_dir = path.resolve(__dirname, "..", "data", "japan");

/**
 *
 * @param {string} path
 * @return {Promise} throws if fail to remove Directory
 */
const rmDir = (path) => {
  return new Promise((resolve, reject) => {
    rimraf(path, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const applyFilters = (geojson) => {
  const filterNames = process.env.FILTERS ? process.env.FILTERS.split(",") : [];
  return filterNames.reduce((prev, filterName) => {
    const filter = require(`./filters/${filterName}`);
    return filter(prev);
  }, geojson);
};

module.exports = {
  rmDir,
  applyFilters,
  tmp_dir,
  shape_dir,
  geojson_dir,
  ndgeojson_dir,
  dest_dir,
};
