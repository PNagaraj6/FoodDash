// const params = new URLSearchParams(window.location.search);
// const mealId = params.get("id");
// fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
// .then(res => res.json())
// .then(data => {

//     const meal = data.meals[0];

//     // title
//     document.getElementById("mealName").innerText = meal.strMeal;

//     // image
//     document.querySelector(".product-hero-left img").src = meal.strMealThumb;
//     const price=document.getElementById('product-hero-left-price');
//     // price.innerHTML=`${price}`;
//     // category + area
//     document.querySelector(".varites").innerHTML =
//         `<p>${meal.strCategory}</p>
//          <p style="color=#f36244">${meal.strArea}</p>`;
//     const ingredient_object=getIngredients(meal);
//     const ingredients=document.getElementById('ingredients');
    
//     ingredient_object.forEach(item=> {
//         const ingredient=document.createElement("div");
//   ingredient.className="ingredient";
//     ingredient.innerHTML=`<p class="ingredient-left">${item.name}</p>
//                     <p class="ingredient-right">${item.measure}</p>`
//     ingredients.append(ingredient);
// });
//     // document.getElementById('instructions').innerHTML=`${meal.strInstructions}`;
//     const paragraphs = meal.strInstructions
//   .split(/\r?\n/)
//   .filter(p => p.trim() !== "");

// document.getElementById("instructions").innerHTML =
//   paragraphs.map(p => `<p class="instruction-step">${p}</p>`).join("");
//     // youtube button
//     document.querySelector(".product-cart-button").onclick = () => {
//         window.open(meal.strYoutube);
//     };
// foodCards=document.getElementById('product-food-cards');
// loadMeals(meal.strCategory);


// });
// function loadMeals(categorie){
//     fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorie}`)
//     .then((res) => res.json())
//     .then(data => {
//        const allmeals=data.meals;
//         // data.meals.forEach(food => createFoodCard(food));
//        const nextMeals=allmeals.slice(0,4); 
//        nextMeals.forEach(food => createFoodCard(food));

//         // const countnumber=document.createElement("p");
//         // countnumber.innerHTML=`${allmeals.length} meals found`;
//         // count.append(countnumber);

//       });
//   }
//   function createFoodCard(food){
//     const card = document.createElement("div");
//     card.className = "food_card";
//     card.onclick = () => {
//     window.location.href = `product.html?id=${food.idMeal}&price=${price}`;
// };


//     card.innerHTML = `
//         <img src="${food.strMealThumb}" alt="${food.strMeal}">
//         <div class="food-card-matter">
//             <h3>${food.strMeal}</h3>
//             <div class="rate-addcart">
//                 <p>$${(Math.random()*10+5).toFixed(2)}</p>
//                 <button class="cart-button">
//                     <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff" alt="">
//                         <p>Add</p>
//                 </button>
//             </div>
//         </div>
//     `;

//     foodCards.appendChild(card);
//   }
// function getIngredients(meal){
//     let ingredients = [];

//     for(let i=1; i<=20; i++){

//         let name = meal[`strIngredient${i}`];
//         let measure = meal[`strMeasure${i}`];

//         if(name && name.trim() !== ""){
//             ingredients.push({
//                 name: name.trim(),
//                 measure: measure ? measure.trim() : ""
//             });
//         }
//     }

//     return ingredients;
// }
const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

function loadMeal(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      // Set meal title
      document.getElementById("mealName").innerText = meal.strMeal;

      // Set meal image
      document.querySelector(".product-hero-left img").src = meal.strMealThumb;

      // Set category + area
      document.querySelector(".varites").innerHTML = `
          <p>${meal.strCategory}</p>
          <p style="color:#f36244">${meal.strArea}</p>
      `;

      // Clear and set ingredients list
      const ingredients = document.getElementById('ingredients');
      ingredients.innerHTML = ''; // Clear old ingredients
      const ingredient_object = getIngredients(meal);
      ingredient_object.forEach(item => {
        const ingredient = document.createElement("div");
        ingredient.className = "ingredient";
        ingredient.innerHTML = `
          <p class="ingredient-left">${item.name}</p>
          <p class="ingredient-right">${item.measure}</p>
        `;
        ingredients.append(ingredient);
      });

      // Set instructions (split by paragraphs)
      const paragraphs = meal.strInstructions
        .split(/\r?\n/)
        .filter(p => p.trim() !== "");
      document.getElementById("instructions").innerHTML =
        paragraphs.map(p => `<p class="instruction-step">${p}</p>`).join("");

      // Youtube button open
      document.querySelector(".product-cart-button").onclick = () => {
        window.open(meal.strYoutube);
      };

      // Load related meals/cards below
      const foodCards = document.getElementById('product-food-cards');
      foodCards.innerHTML = ''; // Clear old cards
      loadMeals(meal.strCategory);
    })
    .catch(error => console.log("Error loading meal:", error));
}

function loadMeals(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => {
      const allMeals = data.meals;
      const nextMeals = allMeals.slice(0, 4);
      nextMeals.forEach(food => createFoodCard(food));
    })
    .catch(error => console.log("Error loading related meals:", error));
}

// function createFoodCard(food) {
//   const foodCards = document.getElementById('product-food-cards');
//   const card = document.createElement("div");
//   card.className = "food_card";

//   // Clicking card navigates to new product page with that meal's id, causing reload & update
//   card.onclick = () => {
//     window.location.href = `product.html?id=${food.idMeal}`;
//   };

//   card.innerHTML = `
//       <img src="${food.strMealThumb}" alt="${food.strMeal}">
//       <div class="food-card-matter">
//           <h3>${food.strMeal}</h3>
//           <div class="rate-addcart">
//               <p>$${(Math.random() * 10 + 5).toFixed(2)}</p>
//               <button class="cart-button">
//                   <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff" alt="cart-icon">
//                   <p>Add</p>
//               </button>
//           </div>
//       </div>
//   `;

//   foodCards.appendChild(card);
// }
function createFoodCard(food) {
  const foodCards = document.getElementById('product-food-cards');
  const card = document.createElement("div");
  card.className = "food_card";

  // Clicking anywhere on the card except the "Add" button goes to product page
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.cart-button')) { // ignore clicks on Add button
      window.location.href = `product.html?id=${food.idMeal}`;
    }
  });

  card.innerHTML = `
      <img src="${food.strMealThumb}" alt="${food.strMeal}">
      <div class="food-card-matter">
          <h3>${food.strMeal}</h3>
          <div class="rate-addcart">
              <p>$${(Math.random() * 10 + 5).toFixed(2)}</p>
              <button class="cart-button">
                  <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff" alt="cart-icon">
                  <p>Add</p>
              </button>
          </div>
      </div>
  `;

  foodCards.appendChild(card);

  // Optional: handle Add button click separately
  const addBtn = card.querySelector('.cart-button');
  addBtn.onclick = (e) => {
    e.stopPropagation(); // prevent card click
    console.log(`${food.strMeal} added to cart!`);
    // You can add your cart logic here
  };
}

function getIngredients(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    let name = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (name && name.trim() !== "") {
      ingredients.push({
        name: name.trim(),
        measure: measure ? measure.trim() : ""
      });
    }
  }
  return ingredients;
}

// Initial load with current mealId from URL
loadMeal(mealId);