let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
  res.render('index');
});

router.get('/comic/:comicNum', function(req, res){

  const https = require('https');

  https.get('https://xkcd.com/' + req.params.comicNum + '/info.0.json', (response) => {
    let data = '';
    
    if (response.statusCode == 404){
      res.render('error');
      return;
    }

    response.on('data', d => {
      data += d;
    });

    response.on('end', () => {
      data = JSON.parse(data);
      let comicViews = 0;
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database('./db/comics.db');
      db.serialize(function() {
        db.run(`UPDATE comics SET views = views + 1 WHERE comic_number = ` + req.params.comicNum);
        db.get('SELECT views FROM comics WHERE comic_number = ?', [req.params.comicNum], (err, row) => {
          if (err) {
            console.log(err.message);
          }
          comicViews = row.views;
          renderPage();
        });
      });
      db.close();

      function renderPage() {
        res.render('comic', {
          comicImg: data.img,
          title: data.safe_title,
          year: data.year,
          month: data.month,
          day: data.day,
          altText: data.alt,
          comicNum: req.params.comicNum,
          transcript: data.transcript,
          comicViews: comicViews
        });
      };
    });

  }).on('error', (err) => {
    console.log('Error: ' + err.message);
  });
});

module.exports = router;