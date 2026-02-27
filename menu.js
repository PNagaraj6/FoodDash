fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((res) => res.json())
  .then((foodData) => {
    const cat = foodData.categories;
    const cato = new Set();

    cat.forEach((food) => {
      cato.add(food.strCategory);
    });

    const buttons = document.getElementById("categories_buttons");

    cato.forEach((element) => {
      let btn = document.createElement("button");
      btn.innerText = element;
      loadMeals('Beef');

      btn.onclick = () => {
        document.querySelectorAll("#categories_buttons button").forEach((b) => {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        loadMeals(element);
      };

      buttons.appendChild(btn);
      
    });
  });
  const foodCards = document.getElementById("food_cards");
  const  loadMoreBtn=document.getElementById("loadMoreBtn");
  const count=document.getElementById("left");
  loadMoreBtn.style.display="none";
  function loadMeals(categorie){
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorie}`)
    .then((res) => res.json())
    .then(data => {
        foodCards.innerHTML = "";
        currentIndex=0;
        limit=12;
        if(!data.meals){
            foodCards.innerHTML = "<h2>No meals found</h2>";
            return;
        }
        count.innerHTML=`${data.meals.length} meals found`; 
        // data.meals.forEach(food => createFoodCard(food));
        allmeals=data.meals;
        loadNextMeals();
        // const countnumber=document.createElement("p");
        // countnumber.innerHTML=`${allmeals.length} meals found`;
        // count.append(countnumber);

      });
  }
  function loadNextMeals(){
    const nextMeals=allmeals.slice(currentIndex,currentIndex+limit);
  nextMeals.forEach(food => {
    createFoodCard(food);
      
    });
    if(currentIndex+limit >= allmeals.length){
      loadMoreBtn.style.display="none";
    }
    else{
      loadMoreBtn.style.display="block";
    }
    currentIndex=currentIndex+limit;  
  }
  loadMoreBtn.onclick=loadNextMeals;  
  function createFoodCard(food){
    const card = document.createElement("div");
    card.className = "food_card";
    card.onclick = () => {
    window.location.href = `product.html?id=${food.idMeal}`;
};

    card.innerHTML = `
        <img src="${food.strMealThumb}" alt="${food.strMeal}">
        <div class="food-card-matter">
            <h3>${food.strMeal}</h3>
            <div class="rate-addcart">
                <p>$${(Math.random()*10+5).toFixed(2)}</p>
                  <button class="cart-button" data-id="${food.idMeal}">
                    <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff" alt="">
                    <p>Add</p>
                </button>
            </div>
        </div>
    `;

    foodCards.appendChild(card);
  }
  const searchvalue=document.getElementById("search-text");
  searchvalue.addEventListener("input",function(){
    let value=this.value;
    document.querySelectorAll("#categories_buttons button").forEach((b) => {
          b.classList.remove("active");
        });
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
  .then((res) => res.json())
  .then((searchdata)=>{
    foodCards.innerHTML = "";
     currentIndex=0;
    limit=12;
    allmeals=searchdata.meals;
    loadNextMeals();
    count.innerHTML=`${searchdata.meals.length} meals found`;

  }
  );

  })

  