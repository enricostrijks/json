const uitvoer = document.getElementById("boeken");
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let result = JSON.parse(xhr.responseText);
    console.log(result);
  } else {
    console.log("readystate: " + xhr.readyState);
    console.log("status: " + xhr.status);
  }
};
xhr.open("GET", "boeken.json", true);
xhr.send();

console.log("Dit is de laatste regel script nu");
