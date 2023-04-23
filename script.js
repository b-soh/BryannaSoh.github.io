/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
  function injectHTML(list){
    console.log('fired injectHTML')
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = ''; // wipe out what's in the box
    list.forEach((item) => { //functional programming
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str
    })
  
  }
  
  /* A quick filter that will return something based on a matching input */
  function filterList(list, query) {
    return list.filter((item) => {
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    })
  }
  
  function cutRestaurantList (list) {
    console.log('fired cut list');
    const range = [...Array(15).keys()];
    // diff from for each bc it returns a new array
    return newArray = range.map((item) => { //return ensures we're actually using the array
      const index = getRandomIntInclusive(0, list.length - 1);
      return list[index]
    }) 
  }
  
  async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    
     // TO DO BRYBRY : FIND WHY DATA_LOAD_ANIMATION ISN'T IN HTML
    // const filterButton = document.querySelector('#filter_button');
    const loadDataButton = document.querySelector('#data_load');
    const txtBudget = document.querySelector('#budget');
    const ulResult = document.querySelector('#results');
    // const generateListButton = document.querySelector('#generate');
  
    // TO DO BRYBRY : FIND WHY DATA_LOAD_ANIMATION ISN'T IN HTML
    // const  loadAnimation = document.querySelector('#data_load_animation');
    // loadAnimation.style.display = 'none';
  
    let currentList = []; // this is "scoped" to the main event function
    
    /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
      // submitEvent.preventDefault();
     debugger; 
     const userBudget = txtBudget ? txtBudget.value : undefined;
     if(!userBudget){
        alert('please enter your budget');
        return;
     }

//-----------------------------start api call
const url = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes';
const options = {
	method: 'GET',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': '1f4eeeaa77msh8cf251f3309a2e0p1927b2jsn9d164de983ae',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

try {
    var html = '';
	const response = await fetch(url, options);
	const result = await response.json();
const resultArray = result ? result.results : undefined;
    if(resultArray && resultArray.length){ //--check that API has returned a valid array not empty  
        const resultFiltered = resultArray.filter(elt => {
            return elt.price?.total/100 <= parseFloat(userBudget);
        });
        if(resultFiltered && resultFiltered.length){
            resultFiltered.forEach(elt => {
html += `
<li>
<img class="rcp-img" src="${elt.thumbnail_url}" />
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
//-----------------------------end api call

    //  console.log('loading data'); 
    
    //   // TO DO BRYBRY : FIND WHY DATA_LOAD_ANIMATION ISN'T IN HTML
    //  //   loadAnimation.style.display = 'inline-block';
  
    //   // Basic GET request - this replaces the form Action
    // //   const results = await fetch('https://dummyjson.com/products');
    // const results = await fetch('https://random-recipes.p.rapidapi.com/ai-quotes/%7Bid%7D',
    // {
    // headers: {
    //     'content-type': 'application/octet-stream',
    //     'X-RapidAPI-Key': '1f4eeeaa77msh8cf251f3309a2e0p1927b2jsn9d164de983ae',
    //     'X-RapidAPI-Host': 'random-recipes.p.rapidapi.com'
    //   }
    // }
    // );

  
    //   // This changes the response from the GET into data we can use - an "object"
    //   currentList = await results.json();
  
    //  // TO DO BRYBRY : FIND WHY DATA_LOAD_ANIMATION ISN'T IN HTML
    //   //   loadAnimation.style.display = 'none';
    //   console.table(currentList);  
    });
  
     // TO DO BRYBRY : FIND WHY DATA_LOAD_ANIMATION ISN'T IN HTML
    // filterButton.addEventListener('click', (event) => {
    //   console.log('clicked FilterButton');
  
    //   const formData = new FormData(mainForm);
    //   const formProps = Object.fromEntries(formData)
  
    //   console.log(formProps);
    //   const newList = filterList(currentList, formProps.resto);
    //   injectHTML(newList); 
  
    //   console.log(newList);
    // })
  
    generateListButton.addEventListener('click', (event) => {
      console.log('generate new list');
      const restaurantList = cutRestaurantList(currentList);
      console.log(restaurantList);
      injectHTML(restaurantList);
    })
  
  
    /*
      Now that you HAVE a list loaded, write an event listener set to your filter button
      it should use the 'new FormData(target-form)' method to read the contents of your main form
      and the Object.fromEntries() method to convert that data to an object we can work with
  
      When you have the contents of the form, use the placeholder at line 7
      to write a list filter
  
      Fire it here and filter for the word "pizza"
      you should get approximately 46 results
    */
  }
  
  /*
    This adds an event listener that fires our main event only once our page elements have loaded
    The use of the async keyword means we can "await" events before continuing in our scripts
    In this case, we load some data when the form has submitted
  */
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
  