/*
  Bryanna Soh | INST377 | Final Project
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = ""; // wipe out what's in the box
  list.forEach((item) => {
    //functional programming
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  // diff from for each bc it returns a new array
  return (newArray = range.map((item) => {
    //return ensures we're actually using the array
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

function clearThis(target) {
  if (target.value == "") {
    target.value = "";
  }
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
  const loadDataButton = document.querySelector("#data_load");
  const txtBudget = document.querySelector("#budget");
  const ulResult = document.querySelector("#results");
  const updateButton = document.querySelector("#update_data");
  let currentList = []; // this is "scoped" to the main event function
  let dataCollection = [];

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // submitEvent.preventDefault();
    debugger;
    const userBudget = txtBudget ? txtBudget.value : undefined;
    if (!userBudget) {
      alert("please enter your budget");
      return;
    }

    //-----------------------------start api call----------------------------
    const url =
      "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes";
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "1f4eeeaa77msh8cf251f3309a2e0p1927b2jsn9d164de983ae",
        "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      },
    };

    try {
      var html = "";
      const response = await fetch(url, options);
      const result = await response.json();
      const resultArray = result ? result.results : undefined;
      if (resultArray && resultArray.length) {
        //--check that API has returned a valid array not empty
        const resultFiltered = resultArray.filter((elt) => {
          return elt.price?.total / 100 <= parseFloat(userBudget);
        });
        if (resultFiltered && resultFiltered.length) {
          resultFiltered.forEach((elt) => {
            html += `
<li>
<h3 class="rcp-name" >${elt.name}</h3>
</li>
`;
          });
        }
        debugger;
        console.log(resultFiltered);
      }
      ulResult.innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  });
  //-----------------------------end api call----------------------------

  //-------------------start refresh display data------------------------

  function savedData() {
    localStorage.setItem("dataCollection", JSON.stringify(dataCollection));
  }

  function loadSavedData() {
    const savedData = localStorage.getItem("dataCollection");
    if (savedData) {
      dataCollection = JSON.parse(savedData);
    }
  }

  function updateData() {
    fetch(
      "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes"
    )
      .then((response) => response.json())
      .then((data) => {
        dataCollection = data;

        savedData();
        alert("your recipes have been successfully saved :)");
      })
      .catch((error) => {
        console.error(error);
        alert("error updating data :(");
      });
  }

  loadSavedData();

  updateButton.addEventListener("click", updateData);
}
//-----------------------end refresh display data--------------------------
/*
    This adds an event listener that fires our main event only once our page elements have loaded
    The use of the async keyword means we can "await" events before continuing in our scripts
    In this case, we load some data when the form has submitted
  */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
