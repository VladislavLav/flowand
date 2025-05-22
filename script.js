document.addEventListener("DOMContentLoaded", function() {
    let showFlowersBtn = document.querySelector("button[onclick='showFlowers()']");
    if (showFlowersBtn) {
        showFlowersBtn.addEventListener("click", function(event) {
            event.preventDefault();
            let flowersSection = document.getElementById("flowers");
            if (flowersSection) {
                flowersSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    let infoButton = document.querySelector(".info-button");
    let address = document.getElementById("address");

    if (infoButton && address) {
        infoButton.addEventListener("click", function() {
            address.style.display = (address.style.display === "none" || address.style.display === "") ? "block" : "none";
        });
    }

    let images = document.querySelectorAll(".flower img");
    images.forEach(function(img) {
        img.addEventListener("click", function() {
            openModal(this);
        });
    });

    function openModal(imgElement) {
        let modal = document.getElementById("modal");
        let modalImg = document.getElementById("modal-img");
        let modalTitle = document.getElementById("modal-title");
        let modalDescription = document.getElementById("modal-description");
        let modalPrice = document.getElementById("modal-price");
        let orderButton = document.getElementById("order-button");
        let quantitySection = document.getElementById("quantity-section"); 
        let quantityInput = document.getElementById("quantity-input");
        let pricePerItem = imgElement.dataset.price;

        modal.style.display = "flex";
        modalImg.src = imgElement.src;
        modalTitle.innerHTML = imgElement.alt;
        modalDescription.innerHTML = imgElement.dataset.description || 'Опис відсутній';
        modalPrice.innerHTML = "Ціна: " + pricePerItem + " грн";

        quantitySection.style.display = "block";  
        orderButton.style.display = "block"; 
        quantityInput.value = 1;

        let increaseBtn = document.getElementById("increase-quantity");
        increaseBtn.onclick = function() {
            let currentQuantity = parseInt(quantityInput.value, 10);
            quantityInput.value = currentQuantity + 1;
            updateTotalPrice(quantityInput.value, pricePerItem);
        };

        let decreaseBtn = document.getElementById("decrease-quantity");
        decreaseBtn.onclick = function() {
            let currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
                updateTotalPrice(quantityInput.value, pricePerItem);
            }
        };

        quantityInput.addEventListener("input", function() {
            let currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity < 1 || isNaN(currentQuantity)) {
                quantityInput.value = 1;
            }
            updateTotalPrice(quantityInput.value, pricePerItem);
        });

        function updateTotalPrice(quantity, price) {
            let totalPrice = parseInt(quantity, 10) * parseInt(price, 10);
            modalPrice.innerHTML = "Ціна: " + totalPrice + " грн";
        }

        orderButton.onclick = function() {
            let quantity = parseInt(quantityInput.value, 10);
            if (quantity <= 0 || isNaN(quantity)) {
                alert("Будь ласка, введіть правильну кількість.");
                return;
            }
            let totalPrice = parseInt(pricePerItem, 10) * quantity;
            addToCart(modalTitle.innerHTML, pricePerItem, quantity, totalPrice);
            closeModal();
        };
    }

    function closeModal() {
        document.getElementById("modal").style.display = "none";
    }

    let modal = document.getElementById("modal");
    let closeModalButton = document.getElementById("close-modal");

    if (modal) {
        modal.addEventListener("click", function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }
});

let cart = [];

function addToCart(name, price, quantity, totalPrice) {
    cart.push({ name, price, quantity, totalPrice });
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartSection = document.getElementById('cart');
    
    cartList.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart"> аш кошик порожній</li>';
        totalPrice.textContent = 0;
    } else {
        cart.forEach((item, index) => {
            total += item.totalPrice;
            cartList.innerHTML += `<li>${item.name} x${item.quantity} - ${item.totalPrice} грн <button onclick="removeFromCart(${index})">Видалити</button></li>`;
        });
        totalPrice.textContent = total;
    }

    cartSection.style.display = cart.length > 0 ? 'block' : 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();

}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartSection = document.getElementById('cart');
    const checkoutButton = document.getElementById('checkout-button'); // Отримуємо кнопку

    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart">Ваш кошик порожній</li>';
        totalPrice.textContent = "0";
        checkoutButton.style.display = 'none'; // Ховаємо кнопку, якщо кошик порожній
    } else {
        cart.forEach((item, index) => {
            total += item.totalPrice;
            cartList.innerHTML += `<li>${item.name} x${item.quantity} - ${item.totalPrice} грн 
                <button onclick="removeFromCart(${index})">Видалити</button></li>`;
        });
        totalPrice.textContent = total;
        checkoutButton.style.display = 'block'; // Показуємо кнопку, якщо є товари в кошику
    }

    cartSection.style.display = cart.length > 0 ? 'block' : 'none';
}

// Додаємо подію на кнопку "Перейти до оплати"
document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            alert('Ваше замовлення було надіслано в тг... (Перейдіть по одному з посилань нижче, для подальшох вирішення питань, якщо ви вказали номер телефона, то ми вам зателефонуємо)');
        });
    }
});


document.getElementById("checkout-button").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Ваш кошик порожній!");
        return;
    }

    // Отримуємо номер телефону з поля вводу
    let phoneNumber = document.getElementById("phone-number").value;
    let addres = document.getElementById("addres").value; // Отримуємо адресу
    // Перевіряємо, чи ввели номер
    if (!phoneNumber) {
        alert("Будь ласка, введіть номер телефону!");
        return;
    }

    
    
    // Формуємо повідомлення
    let message = "🛒 *Нове замовлення!*\n\n";
    message += `📞 *Номер телефону:* ${phoneNumber}\n\n`; // Додаємо номер телефону
    message += `📍 *Адреса:* ${addres}\n\n`; // Додаємо адресу
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} — ${item.quantity} шт. | ${item.totalPrice} грн\n`;
    });

    let total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    message += `\n💰 *Сума:* ${total} грн`;

    // Заміна URL для надсилання повідомлення в Telegram
    let telegramToken = "1480408192:AAGFs2v04O4oFaGfLon65_xhwSbzFlqCwQg";
    let chatId = "-1002256455670";
    let url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    // Відправка даних
    fetch(url, {
        method: "POST"
    }).then(response => {
        if (response.ok) {
            alert("Замовлення надіслано!");
            cart = []; // Очищення кошика
            updateCart(); // Оновлення відображення
        } else {
            alert("Помилка при надсиланні замовлення!");
        }
    }).catch(error => {
        alert("Помилка з'єднання!");
        console.error(error);
    });
});


//реєстрація
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const user = { username, email, password };
  localStorage.setItem("user", JSON.stringify(user));

  document.getElementById("message").innerText = "Реєстрація успішна! Тепер увійдіть.";
  document.getElementById("registerForm").reset();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser && savedUser.email === email && savedUser.password === password) {
    document.getElementById("message").innerText = `Вітаємо, ${savedUser.username}!`;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("userWelcome").style.display = "block";
    document.getElementById("usernameDisplay").innerText = savedUser.username;
  } else {
    document.getElementById("message").innerText = "Невірний email або пароль.";
  }
});
