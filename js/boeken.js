const uitvoer = document.getElementById("boeken");
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let result = JSON.parse(xhr.responseText);
    boeken.data = result
    boeken.uitvoeren();
  }
}
xhr.open("GET", "boeken.json", true);
xhr.send();

const boeken = {

  uitvoeren() {
    let html = "";
    this.data.forEach( boek => {
      let titel = "";
      if ( boek.voortitel ) {
        titel += boek.voortitel + " ";
      }
      titel += boek.titel;

      html += `<section class="boek">`;
      html += `<img class="boek__cover" src="${boek.cover}" alt ="${titel}">`;
      html += `<h3 class="boek_kop">${titel}</h3>`;
      html += `<span class="boek_uitgave">${boek.uitgave}</span>`;
      html += `<span class="boek_ean">EAN: ${boek.ean}</span>`;
      html += `<span class="boek_paginas">${boek.paginas} pagina's</span>`;
      html += `<span class="boek_taal">${boek.taal}</span>`;
      html += `<div class="boek_prijs">${boek.prijs}</div>`;
      html += `</section>`
    });
    uitvoer.innerHTML = html
  }
}
