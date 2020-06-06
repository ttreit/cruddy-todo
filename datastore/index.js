const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');


// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let newDirectory = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newDirectory, text, () => {
      // if (err) {
      //   console.log(err);
      //   callback(err);
      // }
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {

  // [{ id, text }, { id, text }, { id, text }]
  fs.readdir(exports.dataDir, (err, files) => {

    var fs = Promise.promisifyAll(require('fs'));

    var promises = _.map(files, (file) => {
      let newDirectory = path.join(exports.dataDir, file);

      let splitt = file.split('.');
      let id = splitt[0];
      // let text = 'b';
      return new Promise((resolve, reject) => {

        // reject(err);

        // let fileData = fs.readFile(newDirectory);

        // console.log("+++++++++++", fileData)

        // resolve(fileData);
        fs.readFile(newDirectory, (err, fileData) => {
        // console.log("+++++++", fileData)
          if(err) {
            reject(err);
          } else {
            fileData = fileData.toString();
            resolve(fileData);
          }
        });

      }).then(text => { return {id, text}; });

      // return { id, text };

    });
    // callback(null, promises);
    Promise.all(promises).then(data => callback(null, data));
  });

  //////
};


exports.readOne = (id, callback) => {
  let filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  let filePath = path.join(exports.dataDir, id + '.txt');
  //if id doesn't exist than return error callback

  fs.access(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, () => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  let filePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
