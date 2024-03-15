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

const selectMaterie_Classe = () => {
  const sql = `
  SELECT Classe.Nome AS NomeClasse, GROUP_CONCAT(Materia.Nome) AS Materie
  FROM Classe
  INNER JOIN Studiare ON Classe.Id = Studiare.Classe_Id
  INNER JOIN Materia ON Studiare.Materia_Id = Materia.Id
  GROUP BY Classe.Nome;  
         `;
  return executeQuery(sql);
};

const selectStudenti_Classe = () => {
  const sql = `
  SELECT Classe.Nome AS NomeClasse, Studente.Id, Studente.Cognome, Studente.Nome 
  FROM Classe
  INNER JOIN Comporre ON Classe.Id = Comporre.Classe_Id
  INNER JOIN Studente ON Comporre.Studente_Id = Studente.Id
  ORDER BY Classe.Id, Studente.Id;  
   `;
  return executeQuery(sql);
};

const selectValutazioni_Materie = () => {
  const sql = `
  SELECT 
  Materia.Id AS IdMateria,
  Materia.Nome AS NomeMateria,
  Valutazione.Id AS IdValutazione,
  Valutazione.Voto,
  Valutazione.Studente_Id
  FROM 
  Materia
  INNER JOIN 
  Valutazione ON Materia.Id = Valutazione.Materia_Id
  ORDER BY 
  Materia.Id, Valutazione.Id;
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
    res.json(result);
  });
});

app.get("/materieXclassi", (req, res) => {
  //inviare
  selectMaterie_Classe().then((result) => {
    res.json(result);
  });
});

app.get("/studentiXclassi", (req, res) => {
  //inviare
  selectStudenti_Classe().then((result) => {
    res.json(result);
  });
});

app.get("/valutazioniXmaterie", (req, res) => {
  //inviare
  selectValutazioni_Materie().then((result) => {
    res.json(result);
  });
});
