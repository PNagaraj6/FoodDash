// ===============================
// CART HELPERS
// ===============================
function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// RENDER CART
// ===============================
function renderCart(){

    const CartItems = document.getElementById("cart-items");
    CartItems.innerHTML = "";

    let cart = getCart();

    if(cart.length === 0){
        CartItems.innerHTML = "<h2>Your cart is empty 😢</h2>";
        updateOrderSummary();
        return;
    }

    cart.forEach((item,index)=>{

        let card = document.createElement("div");
        card.className = "cart-item";

        card.innerHTML = `
        <div class="img-cart">
            <img src="${item.img}">
            <div class="name-price">
                <h2>${item.name}</h2>
                <p>$${item.price} each</p>
            </div>
        </div>

        <div class="counter-price-delete">
            <div class="counter">
                <span class="minus counter-btn">-</span>
                <span>${item.qty}</span>
                <span class="plus counter-btn">+</span>
            </div>

            <h3>$${(item.price * item.qty).toFixed(2)}</h3>

            <img class="delete-btn"
            src="https://img.icons8.com/?size=32&id=GLSif9qTdoSW&format=png&color=ff4d6d">
        </div>
        `;

        // PLUS
       card.querySelector(".plus").onclick = ()=>{
    cart[index].qty++;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    toggleCartView();
};

card.querySelector(".minus").onclick = ()=>{
    if(cart[index].qty > 1){
        cart[index].qty--;
    }else{
        cart.splice(index,1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    toggleCartView();
};

card.querySelector(".delete-btn").onclick = ()=>{
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    toggleCartView();
};

        CartItems.append(card);
    });

    updateOrderSummary();
    toggleCartView();
}


// ===============================
// ORDER SUMMARY
// ===============================
function updateOrderSummary(){

    let cart = getCart();

    let subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
    console.log(subtotal);
    let items = cart.reduce((s,i)=>s+i.qty,0);

    let tax = subtotal * 0.08;
    let total = subtotal + tax;

    document.getElementById("total").innerText =
        "$" + subtotal.toFixed(2);

    document.getElementById("tax").innerText =
        "$" + tax.toFixed(2);

    document.getElementById("net-total").innerText =
        "$" + total.toFixed(2);
    document.getElementById("no-of-items").innerHTML=
    items + " items";

    // const itemText =
    //     document.querySelector(".order-summary p:last-child");

    // if(itemText)
    //     itemText.innerText = items + " items";
}
function toggleCartView(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const emptyBox = document.getElementById("carti");
    const cartBox  = document.getElementById("your-cart");

    if(cart.length === 0){
        emptyBox.style.display = "flex";
        cartBox.style.display  = "none";
    }else{
        emptyBox.style.display = "none";
        cartBox.style.display  = "";
    }
}
// ===============================
// LOAD CART ON PAGE OPEN
// ===============================
renderCart();
toggleCartView();