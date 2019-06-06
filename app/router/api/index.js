const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const filenames = fs.readdirSync(__dirname);
  for (const filename of filenames) {
    if (filename === 'index.js') {
      continue;
    }

    const filePath = path.join(__dirname, filename);
    const router = require(filePath);
    router(app);
  }
}