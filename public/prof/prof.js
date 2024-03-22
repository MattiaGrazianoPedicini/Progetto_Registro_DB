import { load, send } from "../comune.js"; //importazione

const url = new URL(window.location.href);
const classeDaProiettare = url.searchParams.get("nomeClasse"); //classe selezionata nella home
renderPagina();

function creaTabella(materie, studenti, valutazioni) { //creazione della tabella con studenti, materie e voti
  let tabella = "<tr><th>Studenti</th>";
  materie.forEach((materia) => {
    // Creazione dell'intestazione con le materie
    tabella += "<th>" + materia.materia + "</th>";
  });
  tabella += "</tr>";

  studenti.forEach((studente) => {
    // riempimento della tabella con studenti e voti
    tabella += "<tr><td>" + studente.nome + " " + studente.cognome + "</td>";
    materie.forEach((materia) => {
      let trova = false; //boolean per controllo presenza valutazione
      valutazioni.forEach((valutazione) => { // riempimento celle con voti
        if (
          materia.materia === valutazione.NomeMateria &&
          studente.id === valutazione.Studente_Id
        ) {
          tabella += "<td>" + valutazione.Voto + "</td>";
          trova = true;
        }
      });
      if (!trova) { //in caso non ci fosse il voto
        tabella += "<td> </td>";
      } else {
        trova = false;
      }
    });
    tabella += "</tr>";
  });
  document.getElementById("tabella").innerHTML = tabella; // Aggiunta della tabella al documento
}

function creaTitolo(nome) { //funzione per creazione titolo
  let titolo = "<h1>" + nome + "</h1>";
  document.getElementById("title-container").innerHTML = titolo;
}

function aggiungiSelect(studenti, materie) { //funzione per creare select dinamici
  let output = "";
  studenti.forEach((studente) => {
    //ciclo per creazione select per studente
    output +=
      `<option value="` +
      studente.id +
      `">` +
      studente.nome +
      " " +
      studente.cognome +
      "</option>";
  });
  document.getElementById("studenti").innerHTML = output; //aggiunta select all'html
  let output2 = "";
  materie.forEach((materia) => {
    //ciclo per creazione select per materie
    output2 +=
      `<option value="` + materia.id + `">` + materia.materia + "</option>";
  });
  document.getElementById("materie").innerHTML = output2; //aggiunta select all'html
}

function renderPagina() {
  load("/materieXclassi").then((data) => { //data=materie
    load("/studentiXclassi").then((data2) => { //data2=studenti
      load("/valutazioniXmaterie").then((data3) => { //data3=voti
        const listaMaterie = [];
        const listaStudenti = [];
        for (let index = 0; index < data.length; index++) {
          if (data[index].NomeClasse === classeDaProiettare) { //selezione delle materie per la classe selezionata
            let obj = {
              id: data[index].Id,
              materia: data[index].Materia,
            };
            listaMaterie.push(obj);
          }
        }
        for (let index = 0; index < data2.length; index++) {
          if (data2[index].NomeClasse === classeDaProiettare) { //selezione degli studenti per la classe selezionata
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
}

document.getElementById("salva").onclick = () => { //modifica voto
  let check = document.getElementById("voto").value % 0.25;
  if (
    document.getElementById("voto").value >= 1 &&
    document.getElementById("voto").value <= 10 &&
    check === 0
  ) { //accettati i voti da 1 a 10 e con 0.25, 
    let obj = {
      studente: document.getElementById("studenti").value,
      materia: document.getElementById("materie").value,
      voto: document.getElementById("voto").value,
    };
    send(obj, "/modificaValutazione");
    renderPagina();
  } else {
    alert("Bisogna inserire un voto da 1 a 10 e multiplo di 0.25"); //messaggio di errore
  }
  document.getElementById("voto").value = "";
};

const loginControllo = (user, pass) => { //metodo per controllo dell'accesso
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: user,
      password: pass,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.result == "Unauthorized") {
        window.location.href = "../login/login.html"; //se non ha effettuato l'accesso, la pagina non viene visualizzata e reindirizza al login
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

loginControllo( //richiamo funzione nel momento in cui si va in prof.html
  sessionStorage.getItem("username"),
  sessionStorage.getItem("password")
);