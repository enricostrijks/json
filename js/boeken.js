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

      html += `<h3>${titel}</h3>`
    });
    uitvoer.innerHTML = html
  }
}
