import { load } from "../comune.js";

const classeDaProiettare = "5C";

function creaTabella(materie, studenti, valutazioni) {
  let tabella = "<tr><th>Studenti</th>";
  materie.forEach((materia) => {
    // Creazione dell'intestazione con le materie
    tabella += "<th>" + materia + "</th>";
  });
  tabella += "</tr>";

  studenti.forEach((studente) => {
    // riempimento della tabella con studenti e voti
    tabella += "<tr><td>" + studente.nome + " " + studente.cognome + "</td>";
    materie.forEach((materia) => {
      let trova = false;
      valutazioni.forEach((valutazione) => {
        if (
          materia === valutazione.NomeMateria &&
          studente.id === valutazione.Studente_Id
        ) {
          tabella += "<td>" + valutazione.Voto + "</td>";
          trova = true;
        }
      });
      // riempimento celle con voti
      if (!trova) {
        tabella += "<td> </td>";
      } else {
        trova = false;
      }
    });
    tabella += "</tr>";
  });
  document.getElementById("tabella").innerHTML = tabella; // Aggiunta della tabella al documento
}

function creaTitolo(nome) {
  let titolo = "<h1>" + nome + "</h1>";
  document.getElementById("title-container").innerHTML = titolo;
}

function aggiungiSelect(studenti, materie) {
  let output = "";
  studenti.forEach((studente) => {
    //ciclo per creazione select per studente
    output +=
      `<option value="` +
      studente.cognome +
      " " +
      studente.nome +
      `">` +
      studente.cognome +
      " " +
      studente.nome +
      "</option>";
  });
  document.getElementById("studenti").innerHTML = output; //aggiunta select all'html
  let output2 = "";
  materie.forEach((materia) => {
    //ciclo per creazione select per materie
    output2 += `<option value="` + materia + `">` + materia + "</option>";
  });
  document.getElementById("materie").innerHTML = output2; //aggiunta select all'html
}

load("/materieXclassi").then((data) => {
  load("/studentiXclassi").then((data2) => {
    load("/valutazioniXmaterie").then((data3) => {
      console.log(data);
      console.log(
        "----------------------------------------------------------------------------------"
      );
      console.log(data2);
      console.log(
        "----------------------------------------------------------------------------------"
      );
      console.log(data3);
      let listaMaterie = [];
      const listaStudenti = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index].NomeClasse === classeDaProiettare) {
          listaMaterie = data[index].Materie.split(",");
        }
      }
      for (let index = 0; index < data2.length; index++) {
        if (data2[index].NomeClasse === classeDaProiettare) {
          let obj = {
            id: data2[index].Id,
            nome: data2[index].Nome,
            cognome: data2[index].Cognome,
          };
          listaStudenti.push(obj);
        }
      }
      creaTitolo(classeDaProiettare); //titolo con classe caricata
      aggiungiSelect(listaStudenti, listaMaterie); //aggiunta select all'html
      creaTabella(listaMaterie, listaStudenti, data3); //tabella con materie, studenti e voti
    });
  });
});

/*
load("/classi").then((data) => {
  console.log(data);
});


let dati = {};

document.getElementById("salva").onclick = () => {
  if (
    document.getElementById("voto").value > -1 &&
    document.getElementById("voto").value < 11
  ) {
    //solo numeri da 0 a 10
    let stud = document.getElementById("studenti").value;
    let mat = document.getElementById("materie").value;
    dati.studenti.forEach((studente) => {
      //ciclo per ricerca e modifica del voto
      if (
        studente.nome + " " + studente.cognome == stud &&
        studente.materia[mat] != undefined
      ) {
        studente.materia[mat] = document.getElementById("voto").value; //modifica del voto nella classe
        creaTabella(dati);
      }
    });
    caricaDati(dati, "registro-classe"); //salvataggio su cache
  } else {
    alert("Bisogna inserire un numero da 0 a 10."); //messaggio di errore
  }
};

*/
