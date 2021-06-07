const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/comics.db');

db.serialize(function () {
  db.run(`CREATE TABLE comics (
    comic_number INTEGER PRIMARY KEY,
    views INTEGER NOT NULL)`);
  for (let i = 0; i < 2473; i++){
    db.run('INSERT INTO comics(comic_number, views) VALUES(?, ?)', [i, 0], (err) => {
      if (err){
        return console.log(err.message);
      }
    });
  };
  
  
});

db.close();