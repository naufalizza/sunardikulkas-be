const express = require('express')
const app = express()
const db = require("./database.js")
const sha256 = require('sha256')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// get config vars
dotenv.config();

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    
    console.log(err)

    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}






const port = 5000

app.listen(port, () => {
  console.log(`visit http://localhost:${port}`)
})



// Root endpoint
app.get("/", (req, res, next) => {
  res.json({"message":"Ok"})
});




// Insert here other API endpoints
// app.get("/api/users", (req, res, next) => {
//   var sql = "select * from cicilan"
//   var params = []
//   db.all(sql, params, (err, rows) => {
//       if (err) {
//         res.status(400).json({"error":err.message});
//         return;
//       }
//       res.json({
//           "message":"success",
//           "data":rows
//       })
//     });
// });

app.get("/api/cicilan/:id", (req, res, next) => {
  var sql = "select * from cicilan where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

app.post("/api/buat_cicilan/", (req, res, next) => {
  var errors=[]

  var data = {
      id: req.body.id,
      nama: req.body.nama,
      alamat: req.body.alamat,
      total_harga: req.body.total_harga,
      angsuran: req.body.angsuran,
      nomor_angsuran: req.body.nomor_angsuran,
      sisa_angsuran: req.body.sisa_angsuran
  }
  
  var sql ='INSERT INTO cicilan (id, nama, alamat, total_harga, angsuran, nomor_angsuran, sisa_angsuran) VALUES (?,?,?,?,?,?,?)'
  var params =[data.id, data.nama, data.alamat, data.total_harga, data.ngsuran, data.nomor_angsuran, data.sisa_angsuran]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})

app.patch("/api/cicil/:id", (req, res, next) => {
  var data = {
    alamat: req.body.alamat,
    nomor_angsuran: req.body.nomor_angsuran,
    sisa_angsuran: req.body.sisa_angsuran
}
  db.run(
      `UPDATE user set 
         nomor_angsuran = nomor_angsuran+1, 
         sisa_angsuran = sisa_angsuran-?,
         WHERE id = ?`,
      [req.body.jumlah_angsuran, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({
              message: "success",
              data: data,
              changes: this.changes
          })
  });
})

// app.delete("/api/user/:id", (req, res, next) => {
//   db.run(
//       'DELETE FROM user WHERE id = ?',
//       req.params.id,
//       function (err, result) {
//           if (err){
//               res.status(400).json({"error": res.message})
//               return;
//           }
//           res.json({"message":"deleted", changes: this.changes})
//   });
// })








// Default response for any other request
app.use(function(req, res){
  res.status(404);
});