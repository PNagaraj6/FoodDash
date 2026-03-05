// order.js
document.addEventListener('DOMContentLoaded', () => {

    const dateStr = new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const orderDateEl = document.getElementById('order-date');
    if (orderDateEl) orderDateEl.textContent = dateStr;

    
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {
        name: "Guest User",
        address: "No address provided",
        payment: "Not specified"
    };

    const deliveryNameEl = document.getElementById('delivery-name');
    const deliveryAddressEl = document.getElementById('delivery-address');
    const paymentMethodEl = document.getElementById('payment-method');

    if (deliveryNameEl) deliveryNameEl.textContent = orderData.name;
    if (deliveryAddressEl) deliveryAddressEl.innerHTML = orderData.address;
    if (paymentMethodEl) paymentMethodEl.textContent = orderData.payment;


    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsContainer = document.getElementById('receipt-items-container');
    const subtotalEl = document.getElementById('receipt-subtotal');
    const taxEl = document.getElementById('receipt-tax');
    const totalEl = document.getElementById('receipt-total');

    let subtotal = 0;

    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQty = parseInt(item.qty) || 1;
            const itemTotal = itemPrice * itemQty;
            subtotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';

            itemDiv.innerHTML = `
                <img src="${item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80'}" alt="${item.name || 'Food Item'}">
                <div class="summary-item-info">
                    <h4>${item.name || 'Food Item'}</h4>
                    <p>$${itemPrice.toFixed(2)} × ${itemQty}</p>
                </div>
                <div class="summary-item-price">$${itemTotal.toFixed(2)}</div>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }

    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;

    

    console.log("Order confirmed page loaded successfully!");
});
// const order = JSON.parse(localStorage.getItem("orderDetails"));

// if(order){

//     document.getElementById("custName").innerText = order.name;
//     document.getElementById("custEmail").innerText = order.email;
//     document.getElementById("custPhone").innerText = order.phone;

//     document.getElementById("custAddress").innerText =
//         order.street + ", " + order.city + " - " + order.zipcode;
// }