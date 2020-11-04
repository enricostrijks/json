const uitvoer = document.getElementById("boeken");
const xhr = new XMLHttpRequest();
const taalKeuze = document.querySelectorAll('.besturing__cb-taal');

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

  taalFilter: ['Engels', 'Duits', 'Nederlands'],
  es: 'auteurs',
  filteren( gegevens ) {
    this.data = gegevens.filter( (bk) => {
      let bool = false;
        this.taalFilter.forEach( (taal) => {
          if( bk.taal == taal ) { bool = true}
        })
      return bool;
    } )
  },
  sorteren() {
    if(this.es == 'titel') {this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? 1 : -1);}
    else if (this.es == 'paginas') {this.data.sort( (a,b) => ( a.paginas > b.paginas) ? 1 : -1);}
    else if (this.es == 'uitgave') {this.data.sort( (a,b) => ( a.uitgave > b.uitgave) ? 1 : -1);}
    else if (this.es == 'prijs') {this.data.sort( (a,b) => ( a.prijs > b.prijs) ? 1 : -1);}
    else if (this.es == 'auteurs') {this.data.sort( (a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam) ? 1 : -1);}
  },

  uitvoeren() {
    this.sorteren();


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

const pasFilterAan = () => {
  let gecheckteTaalKeuze = [];
  taalKeuze.forEach( cb => {
    if(cb.checked) gecheckteTaalKeuze.push( cb.value);
  });
  boeken.taalFilter = gecheckteTaalKeuze;
  boeken.filteren(JSON.parse(xhr.responseText));
  boeken.uitvoeren();
}

taalKeuze.forEach( cb => cb.addEventListener('change', pasFilterAan) );