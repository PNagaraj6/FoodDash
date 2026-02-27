// document.addEventListener("click", function(e){

//     if(e.target.classList.contains("add-cart")){

//         const mealId = e.target.dataset.id;

//         fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
//         .then(res => res.json())
//         .then(data => {

//             const meal = data.meals[0];

//             const item = {
//                 id: meal.idMeal,
//                 name: meal.strMeal,
//                 img: meal.strMealThumb,
//                 price: (Math.random()*10+5).toFixed(2),
//                 qty: 1
//             };

//             let cart = JSON.parse(localStorage.getItem("cart")) || [];

//             const exist = cart.find(x => x.id === item.id);

//             if(exist) exist.qty++;
//             else cart.push(item);

//             localStorage.setItem("cart", JSON.stringify(cart));

//             alert("Added to cart ✔");
//         });
//     }
// });

// function renderCart(){

//     const cartBox = document.getElementById("cart-purchase");
//     if(!cartBox) return;   // important for other pages

//     cartBox.innerHTML = "";

//     const cart = JSON.parse(localStorage.getItem("cart")) || [];

//     cart.forEach(item => {

//         const div = document.createElement("div");
//         div.className = "cart-item";

//         div.innerHTML = `
//             <img src="${item.img}" class="cart-img">

//             <div class="cart-info">
//                 <h3>${item.name}</h3>
//                 <p>$${item.price} each</p>
//             </div>

//             <div class="cart-actions">
//                 <span>Qty: ${item.qty}</span>
//                 <p>Total $${(item.qty*item.price).toFixed(2)}</p>
//             </div>
//         `;

//         cartBox.appendChild(div);
//     });
// }

// const cart=document.getElementById("cart");
// // cart.style.display="none";
// document.querySelectorAll(".plus").forEach(btn=>{
//     btn.addEventListener("click", ()=>{
//         let count = btn.parentElement.querySelector(".count");
//         count.innerText = Number(count.innerText) + 1;
//     });
// });

// document.querySelectorAll(".minus").forEach(btn=>{
//     btn.addEventListener("click", ()=>{
//         let count = btn.parentElement.querySelector(".count");
//         let val = Number(count.innerText);
//         if(val > 1){
//             count.innerText = val - 1;
//         }
//     });
// });
document.addEventListener("click", function(e) {
  // Check if clicked element is an add-cart button
  if (e.target.closest(".cart-button")) {
    const card = e.target.closest(".food_card"); // get the parent card
    const mealId = card.dataset.id; // store meal id in card data-id

    // If data-id not set, fallback to generating from inner data
    const mealName = card.querySelector("h3").innerText;
    const mealImg = card.querySelector("img").src;
    const mealPrice = parseFloat(card.querySelector(".rate-addcart p").innerText.replace("$",""));

    const item = {
      id: mealId || mealName, // unique id
      name: mealName,
      img: mealImg,
      price: mealPrice,
      qty: 1
    };

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find(x => x.id === item.id);
    if (exist) exist.qty++;
    else cart.push(item);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`Added "${item.name}" to cart ✔`);
    renderCart(); // update cart on page
  }
});

// Function to render cart content in the cart section
function renderCart() {
  const cartBox = document.getElementById("cart-purchase");
  if (!cartBox) return; // skip if cart container not on page

  cartBox.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.img}" class="cart-img">
      <div class="cart-info">
          <h3>${item.name}</h3>
          <p>$${item.price} each</p>
      </div>
      <div class="cart-actions">
          <button class="minus">-</button>
          <span class="count">${item.qty}</span>
          <button class="plus">+</button>
          <p>Total $${(item.qty * item.price).toFixed(2)}</p>
      </div>
    `;

    cartBox.appendChild(div);
  });

  // Add + / - functionality dynamically
  cartBox.querySelectorAll(".plus").forEach(btn => {
    btn.onclick = () => {
      const count = btn.parentElement.querySelector(".count");
      count.innerText = Number(count.innerText) + 1;

      updateCartItem(btn, 1);
    };
  });

  cartBox.querySelectorAll(".minus").forEach(btn => {
    btn.onclick = () => {
      const count = btn.parentElement.querySelector(".count");
      let val = Number(count.innerText);
      if (val > 1) {
        count.innerText = val - 1;
        updateCartItem(btn, -1);
      }
    };
  });
}

// Update localStorage cart after changing quantity
function updateCartItem(btn, change) {
  const itemName = btn.parentElement.parentElement.querySelector(".cart-info h3").innerText;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(x => x.name === itemName);
  if (item) {
    item.qty += change;
    if (item.qty < 1) item.qty = 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update total price display
  const totalP = btn.parentElement.querySelector("p");
  totalP.innerText = `Total $${(item.qty * item.price).toFixed(2)}`;
}

// Initial render
renderCart();