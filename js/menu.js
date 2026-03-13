// =====================================
// GLOBAL VARIABLES
// =====================================
let priceData = {};
let allmeals = [];
let currentIndex = 0;
let limit = 12;
const CART_KEY = "cart";

// =====================================
// CART FUNCTIONS
// =====================================
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(food, price) {
  let cart = getCart();

  let existing = cart.find((item) => item.id === food.idMeal);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: food.idMeal,
      name: food.strMeal,
      img: food.strMealThumb,
      price: price,
      qty: 1,
    });
  }

  saveCart(cart);
  showToast(`${food.strMeal} added to cart 🛒`);
}

function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.innerText = total;
}

updateCartCount();

// =====================================
// LOAD PRICE DATA FIRST
// =====================================
fetch("https://raw.githubusercontent.com/Sravan-2005/food-dash/main/food.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      priceData[item.id] = item.price;
    });

    loadCategories();
  })
  .catch((err) => console.log("Price JSON error:", err));

// =====================================
// LOAD CATEGORIES
// =====================================
function loadCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((res) => res.json())
    .then((foodData) => {
      const buttons = document.getElementById("categories_buttons");

      foodData.categories.forEach((food) => {
        let btn = document.createElement("button");
        btn.innerText = food.strCategory;

        btn.onclick = () => {
          document
            .querySelectorAll("#categories_buttons button")
            .forEach((b) => b.classList.remove("active"));

          btn.classList.add("active");
          loadMeals(food.strCategory);
        };

        buttons.appendChild(btn);
      });

      loadMeals("Beef");
    });
}

// =====================================
// LOAD MEALS
// =====================================
const foodCards = document.getElementById("food_cards");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const count = document.getElementById("left");

loadMoreBtn.style.display = "none";

function loadMeals(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
      foodCards.innerHTML = "";
      currentIndex = 0;

      if (!data.meals) {
        foodCards.innerHTML = "<h2>No meals found</h2>";
        return;
      }

      count.innerHTML = `${data.meals.length} meals found`;
      allmeals = data.meals;

      loadNextMeals();
    });
}

// =====================================
// LOAD NEXT MEALS
// =====================================
function loadNextMeals() {
  const nextMeals = allmeals.slice(currentIndex, currentIndex + limit);

  nextMeals.forEach((food) => createFoodCard(food));

  if (currentIndex + limit >= allmeals.length)
    loadMoreBtn.style.display = "none";
  else loadMoreBtn.style.display = "block";

  currentIndex += limit;
}

loadMoreBtn.onclick = loadNextMeals;

// =====================================
// CREATE FOOD CARD
// =====================================
function createFoodCard(food) {
  const card = document.createElement("div");
  card.className = "food_card";

  const price = priceData[food.idMeal] ?? Math.floor(Math.random() * 20) + 5;

  card.innerHTML = `
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
        </button>
    </div>
</div>
`;

  card.querySelector(".card-click-area").onclick = () => {
    window.location.href = `product.html?id=${food.idMeal}`;
  };

  card.querySelector(".cart-button").onclick = (e) => {
    e.stopPropagation();
    addToCart(food, price);
  };

  foodCards.appendChild(card);
}

// =====================================
// SEARCH
// =====================================
const searchvalue = document.getElementById("search-text");

searchvalue.addEventListener("input", function () {
  let value = this.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
    .then((res) => res.json())
    .then((searchdata) => {
      foodCards.innerHTML = "";
      currentIndex = 0;

      if (!searchdata.meals) {
        count.innerHTML = "0 meals found";
        return;
      }

      allmeals = searchdata.meals;
      count.innerHTML = `${searchdata.meals.length} meals found`;

      loadNextMeals();
    });
});

// =====================================
// TOAST
// =====================================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
  }, 2500);

  setTimeout(() => toast.remove(), 3000);
}