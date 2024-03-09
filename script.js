const fs = require("fs");
const mysql = require("mysql2");
const conf = require("./conf.js");
const connection = mysql.createConnection(conf);

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        reject();
      }
      console.log("done");
      resolve(result);
    });
  });
};

const selectClassi = () => {
  const sql = `
      SELECT * FROM Classe
         `;
  return executeQuery(sql);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});

app.get("/classi", (req, res) => {
  //inviare
  selectClassi().then((result) => {
    console.log(result);
    res.json({ classi: result });
  });
});

