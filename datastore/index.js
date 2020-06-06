const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


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
  fs.readdir(exports.dataDir, (err, files) => {
    var data = _.map(files, (file) => {
      let splitt = file.split('.');
      let id = splitt[0];
      let text = id;
      return { id, text };
    });
    callback(null, data);
  });
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
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
