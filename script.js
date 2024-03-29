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

const selectLogin = () => {
  const sql = `
      SELECT Prof.Email AS Email, Prof.Password AS Password FROM Prof
         `;
  return executeQuery(sql);
};

const selectMaterie_Classe = () => {
  const sql = `
  SELECT Classe.Nome AS NomeClasse, Materia.Id ,Materia.Nome AS Materia
  FROM Classe
  INNER JOIN Studiare ON Classe.Id = Studiare.Classe_Id
  INNER JOIN Materia ON Studiare.Materia_Id = Materia.Id;  
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

const selectValutazione = () => {
  const sql = `SELECT * FROM Valutazione;`;
  return executeQuery(sql);
};

const insertValutazione = (voto, materia, studente) => {
  const sql =
    `INSERT INTO Valutazione (Voto, Materia_Id, Studente_Id) VALUES (` +
    voto +
    `, ` +
    materia +
    `, ` +
    studente +
    `);`;
  return executeQuery(sql);
};

const updateValutazione = (voto, materia, studente) => {
  const sql =
    `UPDATE Valutazione
  SET Voto = ` +
    voto +
    `
  WHERE Materia_Id = ` +
    materia +
    ` AND Studente_Id = ` +
    studente +
    `;
  `;
  return executeQuery(sql);
};

// ADMIN
const getClassi = () => {
  const sql = `
  SELECT Classe.Nome, Studente.Id, Studente.Cognome, Studente.Nome 
  FROM Classe
  INNER JOIN Comporre ON Classe.Id = Comporre.Classe_Id
  INNER JOIN Studente ON Comporre.Studente_Id = Studente.Id
  GROUP BY Classe.id
   `;
  return executeQuery(sql);
};

//inserimenti studente (+tabelle fk)
const insertStudenti_Classe = (nome, cognome) => {
  const sql = `
  INSERT INTO Studente (Nome, Cognome)
  VALUES ('${nome}', '${cognome}')
   `;
  return executeQuery(sql);
};

const insertStudenti_intoValutazione = (id) => {
  const sql = `
  INSERT INTO Valutazione (Studente_Id)
  VALUES ('${id}')
   `;
  return executeQuery(sql);
};

const insertStudenti_intoComporre = (id) => {
  const sql = `
  INSERT INTO Comporre (Studente_Id)
  VALUES ('${id}')
   `;
  return executeQuery(sql);
};

//inserimenti classe (+tabelle fk)
const insertClassi_IntoStudiare = (id) => {
  const sql = `
  INSERT INTO Studiare (Classe_Id)
  VALUES ('${id}')
   `;
  return executeQuery(sql);
};

const insertClassi_IntoInsegnare = (id) => {
  const sql = `
  INSERT INTO Insegnare (Classe_Id)
  VALUES ('${id}')
   `;
  return executeQuery(sql);
};

const insertClassi_IntoComporre = (id) => {
  const sql = `
  INSERT INTO Comporre (Classe_Id)
  VALUES ('${id}')
   `;
  return executeQuery(sql);
};

const insertClassi = (val) => {
  const sql = `
      INSERT INTO Classe (Nome)
      VALUES ('${val}')
         `;
  return executeQuery(sql);
};

//inserimenti materia (+tabelle fk)
const insertMateria = (mat) => {
  const sql = `
  INSERT INTO Materia (Nome)
  VALUES ('${mat}')
         `;
  return executeQuery(sql);
};

const insertMateria_intoValutazione = (id) => {
  const sql = `
  INSERT INTO Valutazione (Materia_Id)
  VALUES ('${id}')
         `;
  return executeQuery(sql);
};

const insertMateria_intoStudiare = (id) => {
  const sql = `
  INSERT INTO Studiare (Materia_Id)
  VALUES ('${id}')
         `;
  return executeQuery(sql);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
server.listen(8090, () => {
  console.log("- server running");
});

app.get("/classi", (req, res) => { //futura implementazione
  const username = req.headers.username;
  const password = req.headers.password;
  checkLogin(username, password) //controllo autenticazione
    .then(() => {
      //inviare
      selectClassi().then((result) => {
        res.json(result);
      });
    })
    .catch(() => {
      res.status(401); //401 è il codice http Unauthorized)
      res.json({ result: "Unauthorized" });
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

app.post("/modificaValutazione", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  checkLogin(username, password)
    .then(() => {
      //prendere
      let modifica = req.body.cose;
      selectValutazione().then((result) => {
        let check = false;
        result.forEach((valutazione) => {
          if (
            modifica.studente == valutazione.Studente_Id &&
            modifica.materia == valutazione.Materia_Id
          ) {
            check = true;
          }
        });
        if (check) {
          updateValutazione(modifica.voto, modifica.materia, modifica.studente);
        } else {
          insertValutazione(modifica.voto, modifica.materia, modifica.studente);
        }
      });
    })
    .catch(() => {
      res.status(401); //401 è il codice http Unauthorized)
      res.json({ result: "Unauthorized" });
    });
});

const adminAccess = JSON.parse(fs.readFileSync("./credAd.json"));
app.post("/login", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  if (username == adminAccess.username && password == adminAccess.password) {
    res.json({ result: "admin" });
  } else {
    checkLogin(username, password)
      .then(() => {
        res.json({ result: "prof" });
      })
      .catch(() => {
        res.status(401); //401 è il codice http Unauthorized)
        res.json({ result: "Unauthorized" });
      });
  }
});

const checkLogin = (username, password) => {
  return new Promise((res, rej) => {
    selectLogin().then((result) => {
      let check = false;
      result.forEach((prof) => {
        if (prof.Email == username && prof.Password == password) {
          check = true;
        }
      });
      if (check) {
        res();
      } else {
        rej();
      }
    });
  });
};

/////////////////// FUNZIONI SERVER ADMIN /////////////////////////
const ultimoIDClasse = 0;
const ultimoIDMateria = 0;
const ultimoIDStudente = 0;

app.post("/insertClasse", (req, res) => {
  const classe = req.body.nomeClasse;
  ultimoIDClasse = req.body.Classe_Id;
  insertClassi(classe).then((response) => {
    res.json({ result: "ok" });
  });

  insertClassi_IntoComporre(ultimoIDClasse).then((response) => {
    res.json({ result: "ok" });
  });
  insertClassi_IntoInsegnare(ultimoIDClasse).then((response) => {
    res.json({ result: "ok" });
  });
  insertClassi_IntoStudiare(ultimoIDClasse).then((response) => {
    res.json({ result: "ok" });
  });
});

app.post("/materieXclassi", (req, res) => {
  const materia = req.body.materia;
  ultimoIDMateria = req.body.Materia_Id;
  insertMateria(materia).then((result) => {
    res.json({ result: "ok" });
  });

  // scorrere array materie e classe fissa -- ?
  insertMateria_intoStudiare(ultimoIDMateria).then((result) => {
    res.json({ result: "ok" });
  });
  insertMateria_intoValutazione(ultimoIDMateria).then((result) => {
    res.json({ result: "ok" });
  });
});

app.post("/studentiXclassi", (req, res) => {
  const studenti = req.body.studenti;
  ultimoIDStudente = req.body.Studente_Id;
  let i = 0;
  while (i < studenti.length) {
    insertStudenti_Classe(studenti[i].nome, studenti[i].cognome).then(
      (result) => {
        i++;
      }
    );
  }
  insertStudenti_intoComporre(ultimoIDStudente).then((result) => {
    res.json({ result: "ok" });
  });
  insertStudenti_intoValutazione(ultimoIDStudente).then((result) => {
    res.json({ result: "ok" });
  });
});

app.get("/getClassi", (req, res) => {
  selectClassi().then((response) => {
    res.json({ result: response });
  });
});
