function placeOrder() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const zipcode = document.getElementById("zipcode").value;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){
        alert("Cart is empty!");
        return;
    }

    const orderDetails = {
        name,
        email,
        phone,
        street,
        city,
        zipcode,
        cart
    };

    
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    
    localStorage.removeItem("cart");

    
    window.location.href = "order.html";
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}


function updateOrderSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  
  document.getElementById("total").innerText = "$" + subtotal.toFixed(2);
  document.getElementById("tax").innerText = "$" + tax.toFixed(2);
  document.getElementById("net-total").innerText = "$" + total.toFixed(2);

  
  const orderItemsContainer = document.getElementById("order-items");
  orderItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "order-item";

    itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <div class="order-item-details">
          <strong>${item.name}</strong>
          <span>Qty: ${item.qty}</span>
        </div>
        <div class="order-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      `;

    orderItemsContainer.appendChild(itemDiv);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const cardRadio = document.getElementById("card");
  const cashRadio = document.getElementById("cash");
  const cardDetails = document.getElementById("card-details");

  cardRadio.addEventListener("change", () => {
    cardDetails.style.display = cardRadio.checked ? "block" : "none";
  });
  cashRadio.addEventListener("change", () => {
    cardDetails.style.display = cashRadio.checked ? "none" : "block";
  });

  updateOrderSummary();

 
  const form = document.querySelector(".summary_form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value || "";
      const street = document.getElementById("street")?.value || "";
      const apt = document.getElementById("apt")?.value || "";
      const city = document.getElementById("city")?.value || "";
      const zipcode = document.getElementById("zipcode")?.value || "";
      const phone = document.getElementById("phone")?.value || "";

      const isCash = document.getElementById("cash")?.checked;

      let addressHTML = `${street}`;
      if (apt) addressHTML += `, ${apt}`;
      if (city) addressHTML += `<br>${city}`;
      if (zipcode) addressHTML += ` ${zipcode}`;
      if (phone) addressHTML += `<br>${phone}`;

      const orderData = {
        name,
        address: addressHTML,
        payment: isCash ? "Cash on Delivery" : "Debit / Credit Cards"
      };

      localStorage.setItem("orderData", JSON.stringify(orderData));

      
      // localStorage.removeItem("cart");
      window.location.href = "order.html";
    });
  }
});