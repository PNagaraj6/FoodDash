// fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")
//   .then(response => response.json())
//   .then(data => {

//     const container = document.getElementById("mealContainer");

    
//     const firstEight = data.meals.slice(0, 8);

// firstEight.forEach(meal => {

//   meal.price = (Math.random() * (50 - 10) + 10).toFixed(2);

//   const card = document.createElement("div");
//   card.classList.add("specials");

//   card.innerHTML = `
//     <img class="chicken" src="${meal.strMealThumb}">
//     <p class="mandi">${meal.strMeal}</p>
//     <p class="bill">
//       $${meal.price} <span>🛒 Add</span>
//     </p>
//   `;

//   // 🔥 When clicked → go to product page
//   card.addEventListener("click", () => {
//     window.location.href = `product.html?id=${meal.idMeal}`;
//   });

//   container.appendChild(card);
// });
//  })

//   .catch(error => console.log("Error:", error));
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("mealContainer");

    
    const firstEight = data.meals.slice(0, 8);

firstEight.forEach(meal => {

  meal.price = (Math.random() * (50 - 10) + 10).toFixed(2);

  const card = document.createElement("div");
  card.classList.add("specials");

  card.innerHTML = `
    <img class="chicken" src="${meal.strMealThumb}">
    <p class="mandi">${meal.strMeal}</p>
    <p class="bill">
      $${meal.price} <span>🛒 Add</span>
    </p>
  `;

  // 🔥 When clicked → go to product page
  card.addEventListener("click", () => {
    window.location.href = `product.html?id=${meal.idMeal}`;
  });

  container.appendChild(card);
});
 })
 
  .catch(error => console.log("Error:", error));

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(response => response.json())
  .then(fooddata => {
      const store = document.getElementById("categorieContainer");
      const firstsix = fooddata.categories.slice(0, 6); 

      firstsix.forEach(categories => {
          const cards = document.createElement("div");
          cards.classList.add("meat");

          cards.innerHTML = `

             <a href="menu.html"${categories.strCategory}>
              <img class="item" src="${categories.strCategoryThumb}">
              <p>${categories.strCategory}</p>
             </a>
          `;

          store.appendChild(cards);
      });
  })
  .catch(error => console.log("Error:", error));

  