const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const app = express();
const token = "1234";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = 3000;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "singto11442525",
  database: "loginDB"
});
app.get("/employee", (req, res) => {
  let sql = "SELECT * FROM loginDB.tableDB;";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
//----------------------------------------------------------
app.post("/employee/token", (req, res) => {
  const tokenInput = req.header("authorization");
  console.log(tokenInput);
  if (token === tokenInput) {
    res.send("Login success...");
  } else {
    res.send("Login failed...");
  }
});
//----------------------------------------------------------
app.post("/employee/login", (req, res) => {
  let sql = `SELECT user,password FROM loginDB.tableDB WHERE user='${req.body.user}';`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const userFormDB = results[0];
      if (userFormDB.password === req.body.password) {
        res.json({ token });
      }
    } else {
      res.send("Login failed...");
    }
  });
});
// ---------------------------------------------------------
app.post("/employee/del", (req, res) => {
  console.log({ id: req.body.id });
  let sql = `DELETE FROM loginDB.tableDB WHERE id=${req.body.id};`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
// ---------------------------------------------------------
app.post("/employee/add", (req, res) => {
  let sql = `INSERT INTO loginDB.tableDB (user, password, name) VALUES ('${req.body.user}', 
  '${req.body.password}', '${req.body.name}');`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
//------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
