/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

/*
Send final result to professor on slack
BONUS: Use the filter to make another colour!
Condition: Try something more challenging than sepia, maybe one of instagrams!
Hint: sepia filter is less challenging, if only using sepia => half the bonus mark
Full bonus marks = apply filter + performance
Should utilize multithreading (worker-thread module)

*/

const yauzl = require('yauzl-promise'),
  fs = require('fs'),
  PNG = require('pngjs').PNG,
  path = require('path'),
  { pipeline } = require('stream/promises');

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn, { supportMacArchive: false }); //Not sure if this does anything, thought I'd throw it in just in case.
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        try {
          await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
        } catch (error) {
          // Handle EEXIST error (directory already exists)
          if (error.code !== 'EEXIST') {
            throw error; // Re-throw the error if it's not EEXIST
          }
        }
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathOut}/${entry.filename}`
        );
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
};
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    pngArray = [];
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files.forEach((file) => {
          if (path.extname(file) == '.png') {
            filePath = path.join(dir, file);
            pngArray.push(filePath);
          }
        });
        resolve(pngArray);
      }
    });
  });
};
//Should make an array of just png images in the folder, otherwise it is ignored.
// if (path.extname !== 'png') {
// }
//Save to unzipped folder
//Will only apply filters to png images!
//Returns a promise!

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  const fileName = path.basename(pathIn);
  const outputPath = path.join(pathOut, fileName);
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on('parsed', function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            const gray =
              (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }

        this.pack()
          .pipe(fs.createWriteStream(outputPath))
          .on('finish', resolve);
      })
      .on('error', reject);
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
