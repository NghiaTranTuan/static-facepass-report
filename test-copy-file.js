const fs = require('fs');

// // File destination.txt will be created or overwritten by default.
// fs.copyFile('source.txt', 'destination.txt', (err) => {
//   if (err) throw err;
//   console.log('source.txt was copied to destination.txt');
// });




fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });



