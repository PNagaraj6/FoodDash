const sizeBtns = document.querySelectorAll('.size-btn');
const pizzaWrapper = document.getElementById('pizza-wrapper');
const toppingsCards = document.querySelectorAll('.topping-card');
const toppingsLayer = document.getElementById('toppings-layer');
const addedToppingsList = document.querySelector('.added-toppings-list');
const totalPriceEl = document.getElementById('total-price');
const summarySizePriceEl = document.getElementById('summary-size-price');
const resetBtn = document.querySelector('.start-over-btn');
const addToCartBtn = document.querySelector('.add-to-cart-btn');


const TOPPING_PRICE = 1.50; 
let currentSize = { id: 'medium', name: 'Medium', price: 11.99 };
let selectedToppings = {}; 
let toppingsData = {}; 


function initToppings() {
    
    for (let i = 0; i < toppingsCards.length; i++) {
        let card = toppingsCards[i];
        let id = card.getAttribute('data-id');
        let name = card.querySelector('span').innerText;
        let src = card.querySelector('img').src;

    
        toppingsData[id] = { name: name, src: src };

    
        let badge = document.createElement('div');
        badge.className = 'topping-count-badge';
        badge.innerText = '0'; 
        card.appendChild(badge);


        card.addEventListener('click', function () {
            addTopping(id, card);
        });
        card.setAttribute('draggable', true);

        card.addEventListener('dragstart', function (event) {

            event.dataTransfer.setData('text/plain', id);
            card.style.opacity = '0.5'; 
        });

        card.addEventListener('dragend', function () {
            card.style.opacity = '1'; 
        });
    }
}

for (let i = 0; i < sizeBtns.length; i++) {
    let btn = sizeBtns[i];

    btn.addEventListener('click', function () {
        for (let j = 0; j < sizeBtns.length; j++) {
            sizeBtns[j].classList.remove('active');
        }
        btn.classList.add('active');
        currentSize.id = btn.getAttribute('data-size');
        currentSize.name = currentSize.id.charAt(0).toUpperCase() + currentSize.id.slice(1);
        currentSize.price = parseFloat(btn.getAttribute('data-price'));
        pizzaWrapper.className = 'pizza-wrapper size-' + currentSize.id;
        updateSummary();
    });
}


pizzaWrapper.addEventListener('dragover', function (event) {
    event.preventDefault();

    if (currentSize.id === 'small') {
        pizzaWrapper.style.transform = 'scale(0.88)';
    } else if (currentSize.id === 'large') {
        pizzaWrapper.style.transform = 'scale(1.18)';
    } else {
        pizzaWrapper.style.transform = 'scale(1.03)';
    }
});


pizzaWrapper.addEventListener('dragleave', function () {
    resetPizzaScale();
});


function resetPizzaScale() {
    if (currentSize.id === 'small') {
        pizzaWrapper.style.transform = 'scale(0.85)';
    } else if (currentSize.id === 'large') {
        pizzaWrapper.style.transform = 'scale(1.15)';
    } else {
        pizzaWrapper.style.transform = 'scale(1)';
    }
}

pizzaWrapper.addEventListener('drop', function (event) {
    event.preventDefault();
    resetPizzaScale(); 


    let id = event.dataTransfer.getData('text/plain');

    if (id) {
        let rect = pizzaWrapper.getBoundingClientRect();
        let dropX = event.clientX - rect.left;
        let dropY = event.clientY - rect.top;

        if (selectedToppings[id] === undefined) {
            selectedToppings[id] = 0;
            document.querySelector('.topping-card[data-id="' + id + '"]').classList.add('active');
        }

        selectedToppings[id] += 1;
        addToppingAtCoords(id, dropX, dropY);
        updateSummary();
    }
});


function addTopping(id, cardEl) {
    if (selectedToppings[id] === undefined) {
        selectedToppings[id] = 0;
        cardEl.classList.add('active');
    }
    selectedToppings[id] += 1;
    let centerX = 130;
    let centerY = 130;
    let randomRadius = Math.random() * 95;

   
    let randomAngle = Math.random() * 2 * Math.PI;

    
    let x = centerX + (randomRadius * Math.cos(randomAngle));
    let y = centerY + (randomRadius * Math.sin(randomAngle));

    addToppingAtCoords(id, x, y);
    updateSummary();
}

function addToppingAtCoords(id, x, y) {
    let data = toppingsData[id];

    let img = document.createElement('img');
    img.src = data.src;
    img.className = 'topping-piece topping-group-' + id;


    if (x < 20) x = 20;
    if (x > 240) x = 240;
    if (y < 20) y = 20;
    if (y > 240) y = 240;
    img.style.left = (x - 16) + 'px';
    img.style.top = (y - 16) + 'px';
    let rotation = Math.random() * 360;
    img.style.transform = 'rotate(' + rotation + 'deg) scale(0)';
    toppingsLayer.appendChild(img);
    setTimeout(function () {
        img.style.transform = 'rotate(' + rotation + 'deg) scale(1)';
    }, 10);
}

function removeTopping(id) {
    delete selectedToppings[id];
    let card = document.querySelector('.topping-card[data-id="' + id + '"]');
    if (card) {
        card.classList.remove('active');
    }


    let pieces = document.querySelectorAll('.topping-group-' + id);
    for (let i = 0; i < pieces.length; i++) {
        let p = pieces[i];
        p.style.transform = 'scale(0)'; 
        setTimeout(function () {
            p.remove();
        }, 300);
    }

    updateSummary();
}


function updateSummary() {
    let toppingsCount = 0;
    let toppingsTotal = 0;
    let allCards = document.querySelectorAll('.topping-card');
    for (let i = 0; i < allCards.length; i++) {
        let theCard = allCards[i];
        theCard.classList.remove('has-count'); 
        theCard.querySelector('.topping-count-badge').innerText = '0';
    }
    for (let id in selectedToppings) {
        let count = selectedToppings[id];
        toppingsCount += count;
        toppingsTotal += count * TOPPING_PRICE;
        if (count > 0) {
            let activeCard = document.querySelector('.topping-card[data-id="' + id + '"]');
            if (activeCard) {
                activeCard.classList.add('has-count');
                activeCard.querySelector('.topping-count-badge').innerText = count;
            }
        }
    }

    let finalTotal = currentSize.price + toppingsTotal;
    summarySizePriceEl.innerText = currentSize.name + ' Pizza — $' + currentSize.price.toFixed(2);
    if (toppingsCount === 0) {
        addedToppingsList.innerHTML = '<p class="empty-toppings">No toppings added yet</p>';
    } else {
        
        addedToppingsList.innerHTML = '';

        for (let id in selectedToppings) {
            let count = selectedToppings[id];

            if (count > 0) {
                let itemDiv = document.createElement('div');
                itemDiv.className = 'summary-item';

                
                let nameHtml = toppingsData[id].name;
                if (count > 1) {
                    nameHtml += ' <span style="color:gray; font-size:12px;">x' + count + '</span>';
                }

                let priceTotal = (count * TOPPING_PRICE).toFixed(2);

                itemDiv.innerHTML = `
                    <div style="display:flex; align-items:center;">
                        <span>${nameHtml}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span>$${priceTotal}</span>
                        <i class="fas fa-times-circle remove-topping-btn" data-id="${id}" style="color:#ef4444; cursor:pointer;" title="Remove this topping"></i>
                    </div>
                `;

                addedToppingsList.appendChild(itemDiv);
            }
        }

      
        let removeBtns = document.querySelectorAll('.remove-topping-btn');
        for (let i = 0; i < removeBtns.length; i++) {
            removeBtns[i].addEventListener('click', function (event) {
                removeTopping(event.target.getAttribute('data-id'));
            });
        }
    }


    totalPriceEl.innerText = '$' + finalTotal.toFixed(2);
}


resetBtn.addEventListener('click', function () {
    document.querySelector('.size-btn[data-size="medium"]').click();
    selectedToppings = {};


    let cards = document.querySelectorAll('.topping-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('active');
        cards[i].classList.remove('has-count');
        cards[i].querySelector('.topping-count-badge').innerText = '0';
    }

    
    let pieces = document.querySelectorAll('.topping-piece');
    for (let i = 0; i < pieces.length; i++) {
        let p = pieces[i];
        p.style.transform = 'scale(0)';
        setTimeout(function () {
            p.remove();
        }, 300);
    }


    updateSummary();
});

function showToast(message) {

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> <span>' + message + '</span>';

    container.appendChild(toast);
    setTimeout(function () {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(function () {
            toast.remove();
        }, 300); 
    }, 3000); 
}


addToCartBtn.addEventListener('click', function () {
    let finalPrice = totalPriceEl.innerText;


    let pizzaToSave = {
        size: currentSize.name,
        basePrice: currentSize.price,
        toppings: selectedToppings, 
        totalPrice: finalPrice
    };


    let existingCart = localStorage.getItem('pizzaCart');
    let cartArray = [];

    if (existingCart) {
        cartArray = JSON.parse(existingCart);
    }

    cartArray.push(pizzaToSave);

    localStorage.setItem('pizzaCart', JSON.stringify(cartArray));

    showToast('Pizza saved to memory! Checkout page can now read it.');

    setTimeout(function () {
        resetBtn.click();
    }, 1000);
});


initToppings();