const { tmp_dir, rmDir } = require("./lib");

const main = async () => {
  process.stderr.write(`Cleaning ${tmp_dir}\n`);
  await rmDir(tmp_dir);
};

main();
