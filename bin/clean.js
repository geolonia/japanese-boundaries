const { tmp_dir, dest_dir, rmDir } = require("./lib");

const main = async () => {
  process.stderr.write(`Cleaning ${tmp_dir}\n`);
  await rmDir(tmp_dir);
  process.stderr.write(`Cleaning ${dest_dir}\n`);
  await rmDir(dest_dir);
};

main();
