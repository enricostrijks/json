const uitvoer = document.getElementById("boeken");
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let result = JSON.parse(xhr.responseText);
    boeken.data = result
    boeken.filteren( result );
    boeken.uitvoeren();
  }
}
xhr.open("GET", "boeken.json", true);
xhr.send();

const boeken = {

  taalFilter: 'Engels',
  filteren( gegevens ) {
    this.data = gegevens.filter( (bk) => {return bk.taal == this.taalFilter } );
  },

  uitvoeren() {
    let html = "";
    this.data.forEach( boek => {
      let titel = "";
      if ( boek.voortitel ) {
        titel += boek.voortitel + " ";
      }
      titel += boek.titel;

      let auteurs = "";
      boek.auteurs.forEach((schrijver, index) => {
        let tv = schrijver.tussenvoegsel ? schrijver.tussenvoegsel+" " : "";
        let separator = ", ";
        if (index >= boek.auteurs.length - 2) {
          separator = " en ";
        }
        if (index >= boek.auteurs.length - 1) {
          separator = "";
        }
        auteurs += schrijver.voornaam + " " + tv + schrijver.achternaam + separator;
      })

      html += `<section class="boek">`;
      html += `<img class="boek__cover" src="${boek.cover}" alt ="${titel}">`;
      html += `<h3 class="boek_kop">${titel}</h3>`;
      html += `<p class="boek_auteurs">${auteurs}</p>`;
      html += `<span class="boek_uitgave">${this.datumOmzetten(boek.uitgave)}</span>`;
      html += `<span class="boek_ean">EAN: ${boek.ean}</span>`;
      html += `<span class="boek_paginas">${boek.paginas} pagina's</span>`;
      html += `<span class="boek_taal">${boek.taal}</span>`;
      html += `<div class="boek_prijs">${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</div>`;
      html += `</section>`
    });
    uitvoer.innerHTML = html
  },
  datumOmzetten(datumString) {
    let datum = new Date(datumString);
    let jaar = datum.getFullYear();
    let maand = this.geefMaandnaam(datum.getMonth());
    return `${maand} ${jaar}`;
  },
  geefMaandnaam(m) {
    let maand = "";
    switch(m) {
      case 0 : maand = 'januari'; break;
      case 1 : maand = 'februari'; break;
      case 2 : maand = 'maart'; break;
      case 3 : maand = 'april'; break;
      case 4 : maand = 'mei'; break;
      case 5 : maand = 'juni'; break;
      case 6 : maand = 'juli'; break;
      case 7 : maand = 'augustus'; break;
      case 8 : maand = 'september'; break;
      case 9 : maand = 'oktober'; break;
      case 10 : maand = 'november'; break;
      case 11 : maand = 'december'; break;
      default : maand = m;
    }
    return maand;
  }
}
