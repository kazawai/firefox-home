const command = document.getElementById("title-command");
const command_input = document.getElementById("command-input");
command_input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && document.activeElement === command_input) {
    var searchCommand = command_input.innerText;
    searchCommand.replace(/(<([^>]+)>)/gi, "");
    window.location.href = `https://www.google.com/search?q=${searchCommand}`;
  }
});

command.addEventListener("click", () => {
  console.log("clicked");
  command_input.focus();
});

window.onload = () => {
  command_input.focus();
};

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  var container = document.createElement("DIV");
  container.setAttribute("id", this.id + "autocomplete-list");
  container.setAttribute("class", "inner");
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("keyup", function (e) {
    var val = this.innerText;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    this.parentNode.appendChild(container);
    var a = document.createElement("DIV");
    a.setAttribute("id", this.id + "text-autocomplete");
    a.setAttribute("class", "text-autocomplete full-height");
    /*append the DIV element as a child of the autocomplete container:*/
    container.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      if (arr[i]["title"] === null) continue;
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr[i]["title"].substr(0, val.length).toUpperCase() ==
          val.toUpperCase() || arr[i]["url"].includes(val.toLowerCase())
      ) {
        /*create a DIV element for each matching element:*/
        var b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i]["title"].substr(0, val.length) +
          "</strong>";
        b.innerHTML += arr[i]["title"].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i]["title"] +
          "' data-url='" + arr[i]["url"] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          const url = this.getElementsByTagName("input")[0].getAttribute(
            "data-url",
          );
          if (url !== null && url !== "") window.location.href = url;
          /*insert the value for the autocomplete text field:*/
          inp.innerText = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
          /*put the cursor at the end of the text*/
          var range = document.createRange();
          var sel = window.getSelection();
          range.setStart(inp, 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "text-autocomplete");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("text-autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("text-autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("text-autocomplete");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// Check if data is already stored in localStorage
// Would need to run via a server to avoid CORS issues
async function fetchJsonData() {
  try {
    const storedData = localStorage.getItem("jsonData");

    if (storedData) {
      // If data is found, use it directly
      const jsonData = JSON.parse(storedData);
      console.log("Using data from localStorage:", jsonData);
      return jsonData;
    } else {
      // Fetch the JSON file
      const response = await fetch("data.json");

      // Check if the fetch was successful
      if (!response.ok) {
        throw new Error("Failed to fetch the JSON file");
      }

      // Parse the JSON data
      const jsonData = await response.json();

      // Store the data in localStorage for future use
      localStorage.setItem("jsonData", JSON.stringify(jsonData));

      // Now you can use the jsonData variable with your data
      console.log("Fetched data and stored in localStorage:", jsonData);
      return jsonData;
    }
  } catch (error) {
    console.error("Error reading local JSON file:", error.message);
  }
}

var val = fetchJsonData();

const values = autocomplete(command_input, val);
