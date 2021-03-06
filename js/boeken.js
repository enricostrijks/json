const uitvoer = document.getElementById("boeken");
const xhr = new XMLHttpRequest();
const taalKeuze = document.querySelectorAll('.besturing__cb-taal');
const selectSort = document.querySelector('.besturing__select');
const aantalInWinkelwagen = document.querySelector('.ww__aantal');

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

const ww = {
  bestelling: [],
  boekToevoegen(obj) {
    let gevonden = this.bestelling.filter( b => b.ean == obj.ean );
    if (gevonden.length == 0) {
      obj.besteldAantal ++;
      ww.bestelling.push(obj);
    } else {
    gevonden[0].besteldAantal ++;
    }
    localStorage.wwBestelling = JSON.stringify(this.bestelling);
    this.uitvoeren();
  },
  dataOphalen() {
    if ( localStorage.wwBestelling ) {
      this.bestelling = JSON.parse(localStorage.wwBestelling);
    }
    this.uitvoeren();
  },
  uitvoeren() {
    let html = '<table>';
    let totaal = 0;
    let totaalBesteld = 0;
      this.bestelling.forEach( boek => {
        let titel = "";
        if ( boek.voortitel ) {
          titel += boek.voortitel + " ";
        }
        titel += boek.titel;
        html += '<tr>';
        html += `<td><img src="${boek.cover}" alt="${titel}" class="bestelformulier__cover"></td>`;
        html += `<td>${titel}</td>`;
        html += `<td class="bestelformulier__aantal">
        <img
        src="https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-arrow-down-thin.png"
        data-role="${boek.ean}"
        class="bestelformulier__verlaag"
        />
        ${boek.besteldAantal}
        <img
        src="https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-arrow-up-thin.png"    
        data-role="${boek.ean}"    
        class="bestelformulier__verhoog"
        /></td>`;
        html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`;
        html += `<td><img
        src="https://cdn4.iconfinder.com/data/icons/complete-common-version-6-4/1024/trash-512.png"
        data-role="${boek.ean}"
        class="bestelformulier__trash"
        /></td>`;
        html += '</tr>';
        totaal += boek.prijs * boek.besteldAantal;
        totaalBesteld += boek.besteldAantal;
      })
    html += `<tr><td colspan="3">Totaal</td><td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td></tr>`;
    html += '</table>';
    document.getElementById('uitvoer').innerHTML = html;
    aantalInWinkelwagen.innerHTML = totaalBesteld;
    this.trashActiveren();
    this.hogerLagerActiveren();
  },
  hogerLagerActiveren() {
    let hogerKnoppen = document.querySelectorAll('.bestelformulier__verhoog');
    hogerKnoppen.forEach(knop => {
      knop.addEventListener('click', e => {
        let ophoogID = e.target.getAttribute('data-role');
        let opTeHogenBoek = this.bestelling.filter( boek => boek.ean == ophoogID);
        opTeHogenBoek[0].besteldAantal ++;
        localStorage.wwBestelling = JSON.stringify(this.bestelling);
        this.uitvoeren();
      })
    })

    let lagerKnoppen = document.querySelectorAll('.bestelformulier__verlaag');
    lagerKnoppen.forEach(knop => {
      knop.addEventListener('click', e => {
        let verlaagID = e.target.getAttribute('data-role');
        let teverlagenBoek = this.bestelling.filter( boek => boek.ean == verlaagID);
        if ( teverlagenBoek[0].besteldAantal > 1 ) {
          teverlagenBoek[0].besteldAantal --;
        } else {
          this.bestelling = this.bestelling.filter( bk => bk.ean != verlaagID );
        }
        localStorage.wwBestelling = JSON.stringify(this.bestelling);
        this.uitvoeren();
      })
    })
  },
  trashActiveren() {
    document.querySelectorAll('.bestelformulier__trash').forEach( trash => {
      trash.addEventListener('click', e => {
        let teVerwijderenBoekID = e.target.getAttribute('data-role');
        this.bestelling = this.bestelling.filter( bk => bk.ean != teVerwijderenBoekID );
        localStorage.wwBestelling = JSON.stringify(this.bestelling);
        this.uitvoeren();
      })
    })
  }
}
ww.dataOphalen();

const boeken = {

  taalFilter: ['Engels', 'Duits', 'Nederlands'],
  es: 'titel',
  oplopend: 1,
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
    if(this.es == 'titel') {this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? this.oplopend : -1*this.oplopend);}
    else if (this.es == 'paginas') {this.data.sort( (a,b) => ( a.paginas > b.paginas) ? this.oplopend : -1*this.oplopend);}
    else if (this.es == 'uitgave') {this.data.sort( (a,b) => ( a.uitgave > b.uitgave) ? this.oplopend : -1*this.oplopend);}
    else if (this.es == 'prijs') {this.data.sort( (a,b) => ( a.prijs > b.prijs) ? this.oplopend : -1*this.oplopend);}
    else if (this.es == 'auteurs') {this.data.sort( (a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam) ? this.oplopend : -1*this.oplopend);}
  },

  uitvoeren() {
    this.sorteren();


    let html = "";
    this.data.forEach( boek => {

      boek.besteldAantal = 0;

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
      html += `<div class="boek__info">`;
      html += `<h3 class="boek_kop">${titel}</h3>`;
      html += `<p class="boek_auteurs">${auteurs}</p>`;
      html += `<span class="boek_uitgave">${this.datumOmzetten(boek.uitgave)}</span>`;
      html += `<span class="boek_ean">EAN: ${boek.ean}</span>`;
      html += `<span class="boek_paginas">${boek.paginas} pagina's</span>`;
      html += `<span class="boek_taal">${boek.taal}</span>`;
      html += `<div class="boek_prijs">${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
              <a href="#" class="boek__bestel-knop" data-role="${boek.ean}">bestellen</a></div>`;
      html += `</div></section>`
    });
    uitvoer.innerHTML = html
    document.querySelectorAll('.boek__bestel-knop').forEach( knop => {
      knop.addEventListener('click', e => {
        e.preventDefault();
        let boekID = e.target.getAttribute('data-role');
        let gekliktBoek = this.data.filter( b => b.ean == boekID);
        ww.boekToevoegen(gekliktBoek[0]);
      })
    });
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

const pasSortEigAan= () => {
  boeken.es = selectSort.value;
  boeken.uitvoeren();
}

taalKeuze.forEach( cb => cb.addEventListener('change', pasFilterAan) );

selectSort.addEventListener('change', pasSortEigAan);

document.querySelectorAll('.besturing__rb').forEach( rb => rb.addEventListener('change', () => {
  boeken.oplopend = rb.value;
  boeken.uitvoeren();
}))