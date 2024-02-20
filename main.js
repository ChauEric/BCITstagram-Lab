const path = require('path');
/*
 * Project: BCITstagram
 * File Name: main.js
 * Description: Grayscaling a png image.
 *
 * Due Date: February 21, 2024
 * Author: Eric Chau
 *
 */

const IOhandler = require('./IOhandler');
const zipFilePath = path.join(__dirname, 'myfile.zip');
const pathUnzipped = path.join(__dirname, 'unzipped');
const pathProcessed = path.join(__dirname, 'grayscaled');

async function main() {
  try {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
    const imgs = await IOhandler.readDir(pathUnzipped);
    await Promise.all(
      imgs.map((png) => IOhandler.grayScale(png, pathProcessed))
    );
  } catch (error) {
    console.log(error);
  }
}
main();
