var sqlite3 = require('sqlite3').verbose()
var sha256 = require('sha256')

const DBSOURCE = "cicilan.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE cicilan (
            id INTEGER PRIMARY KEY UNIQUE,
            nama text, 
            alamat text, 
            total_harga INTEGER,
            angsuran INTEGER,
            nomor_angsuran INTEGER,
            sisa_angsuran INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created
            }
        });  
    }
});


module.exports = db