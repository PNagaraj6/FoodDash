// ========== CART HELPERS ==========
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // ========== UPDATE ORDER SUMMARY ==========
  function updateOrderSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Update totals
    document.getElementById("total").innerText = "$" + subtotal.toFixed(2);
    document.getElementById("tax").innerText = "$" + tax.toFixed(2);
    document.getElementById("net-total").innerText = "$" + total.toFixed(2);

    // Render order items
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

  // ========== SHOW/HIDE CARD DETAILS ==========
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
  });