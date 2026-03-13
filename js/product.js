// =========================
// GLOBAL CART FUNCTIONS
// =========================
const CART_KEY = "cart";

function getCart(){
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount(){
    const badge = document.getElementById("cartCount");
    if(!badge) return;

    let cart = getCart();
    let total = cart.reduce((s,i)=>s+i.qty,0);
    badge.innerText = total;
}

function addToCart(food, price){
    let cart = getCart();

    let existing = cart.find(i => i.id === food.idMeal);

    if(existing){
        existing.qty++;
    }else{
        cart.push({
            id: food.idMeal,
            name: food.strMeal,
            img: food.strMealThumb,
            price: price,
            qty: 1
        });
    }

    saveCart(cart);
    showToast(`${food.strMeal} added to cart 🛒`);
}

updateCartCount();


// =========================
// GET MEAL ID
// =========================
const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

let priceData = {};
let foodCards;


// =========================
// LOAD PRICE JSON
// =========================
fetch("https://raw.githubusercontent.com/Sravan-2005/food-dash/main/food.json")
.then(res => res.json())
.then(data => {
    data.forEach(item=>{
        priceData[item.id] = item.price;
    });
    loadMealDetails();
})
.catch(err=>{
    console.log("Price JSON error:", err);
    loadMealDetails();
});


// =========================
// LOAD MEAL DETAILS
// =========================
function loadMealDetails(){

fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
.then(res=>res.json())
.then(data=>{

    const meal = data.meals[0];
    const mealPrice = priceData[meal.idMeal] ?? 10;

    document.querySelector(".product-hero-left img").src = meal.strMealThumb;

    const heroRight = document.querySelector(".product-hero-right");

    heroRight.innerHTML = `
        <h1 class="meal-title">${meal.strMeal}</h1>

        <div class="varites">
            <p>${meal.strCategory}</p>
            <p style="color:#f36244">${meal.strArea}</p>
        </div>

        <div class="price-cart-row">
            <h1>$${mealPrice}</h1>

            <button class="cart-button" data-id="${meal.idMeal}">
            <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff">
            <p>Add to cart</p>
        </button>
        </div>

        <h3>Ingredients</h3>
        <div id="ingredients"></div>

        <h3>Instructions</h3>
        <div id="instructions"></div>
    `;

    // INGREDIENTS
    const ingredients = document.getElementById("ingredients");
    getIngredients(meal).forEach(item=>{
        ingredients.innerHTML += `
            <div class="ingredient">
                <p>${item.name}</p>
                <p>${item.measure}</p>
            </div>`;
    });

    // INSTRUCTIONS
    document.getElementById("instructions").innerHTML =
        meal.strInstructions
        .split(/\r?\n/)
        .filter(p=>p.trim()!=="")
        .map(p=>`<p>${p}</p>`).join("");

    // ADD TO CART
    document.querySelector(".cart-button").onclick = ()=>{
        addToCart(meal, mealPrice);
    };

    // SIMILAR MEALS
    foodCards = document.getElementById("product-food-cards");
    foodCards.innerHTML = "";
    loadMeals(meal.strCategory);
});
}


// =========================
// LOAD SIMILAR MEALS
// =========================
function loadMeals(category){

fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
.then(res=>res.json())
.then(data=>{

    data.meals
    .filter(m=>m.idMeal !== mealId)
    .slice(0,4)
    .forEach(food=>createFoodCard(food));
});
}


// =========================
// CREATE FOOD CARD
// =========================
function createFoodCard(food){

const price = priceData[food.idMeal] ?? 10;

const card=document.createElement("div");
card.className="food_card";

card.innerHTML=`
<div class="card-click-area">
    <img src="${food.strMealThumb}">
    <h3>${food.strMeal}</h3>
</div>

<div class="food-card-matter">
    <div class="rate-addcart">
        <p>$${price}</p>
        <button class="cart-button" data-id="${food.idMeal}">
            <img src="https://img.icons8.com/?size=16&id=9671&format=png&color=ffffff">
            <p>Add</p>
    </div>
</div>
`;

card.querySelector(".card-click-area").onclick=()=>{
    window.location.href=`product.html?id=${food.idMeal}`;
};

card.querySelector(".cart-button").onclick=(e)=>{
    e.stopPropagation();
    addToCart(food, price);
};

foodCards.appendChild(card);
}


// =========================
// INGREDIENTS
// =========================
function getIngredients(meal){

let arr=[];
for(let i=1;i<=20;i++){
    let name=meal[`strIngredient${i}`];
    let measure=meal[`strMeasure${i}`];
    if(name && name.trim()!==""){
        arr.push({
            name:name.trim(),
            measure:measure?measure.trim():""
        });
    }
}
return arr;
}


// =========================
// TOAST
// =========================
function showToast(message,type="success"){

const container=document.getElementById("toast-container");
if(!container) return;

const toast=document.createElement("div");
toast.className=`toast ${type}`;
toast.innerText=message;

container.appendChild(toast);

setTimeout(()=>toast.remove(),3000);
}