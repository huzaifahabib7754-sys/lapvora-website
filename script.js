/* =========================================================
   LAPVORA WEBSITE - COMPLETE SCRIPT
========================================================= */

"use strict";

/* =========================================================
   WHATSAPP
========================================================= */

const WHATSAPP_NUMBER = "3096794850";

function whatsappNumber() {
    return "92" + WHATSAPP_NUMBER;
}

function openWhatsApp(message) {
    const url =
        "https://wa.me/" +
        whatsappNumber() +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


/* =========================================================
   PRODUCTS
========================================================= */

const products = {
    1: {
        name: "LAPVORA Premium Laptop Backpack",
        price: 4999,
        image: "assets/bag1.png"
    },

    2: {
        name: "LAPVORA Travel Laptop Backpack",
        price: 5499,
        image: "assets/bag2.png"
    },

    3: {
        name: "LAPVORA Business Laptop Bag",
        price: 4499,
        image: "assets/bag3.png"
    },

    4: {
        name: "LAPVORA Executive Laptop Backpack",
        price: 5999,
        image: "assets/bag4.png"
    }
};


/* =========================================================
   PRODUCT QUANTITY
========================================================= */

const quantities = {
    1: 1,
    2: 1,
    3: 1,
    4: 1
};


function changeQty(productId, change) {

    if (!products[productId]) {
        return;
    }

    quantities[productId] =
        Math.max(
            1,
            (quantities[productId] || 1) + Number(change)
        );

    const element =
        document.getElementById("qty-" + productId);

    if (element) {
        element.textContent =
            quantities[productId];
    }
}


/* =========================================================
   CART LOAD
========================================================= */

let cart = loadCart();


function loadCart() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem("lapvoraCart") || "[]"
            );

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved
            .map(item => {

                const id =
                    Number(item.id);

                const product =
                    products[id];

                if (!product) {
                    return null;
                }

                return {

                    id: id,

                    name: product.name,

                    price: Number(product.price),

                    image: product.image,

                    quantity:
                        Math.max(
                            1,
                            Number(item.quantity) || 1
                        )

                };

            })
            .filter(Boolean);

    } catch (error) {

        localStorage.removeItem("lapvoraCart");

        return [];

    }
}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "lapvoraCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    return cart.reduce(

        (total, item) => {

            return total +
                (
                    Number(item.price) || 0
                ) *
                (
                    Number(item.quantity) || 0
                );

        },

        0
    );
}


/* =========================================================
   CART COUNT
========================================================= */

function getCartItemCount() {

    return cart.reduce(

        (total, item) => {

            return total +
                (
                    Number(item.quantity) || 0
                );

        },

        0
    );
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    const quantity =
        Math.max(
            1,
            Number(quantities[productId]) || 1
        );

    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );

    if (existing) {

        existing.quantity =
            (
                Number(existing.quantity) || 0
            ) +
            quantity;

    } else {

        cart.push({

            id: Number(productId),

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: quantity

        });

    }

    quantities[productId] = 1;

    const qtyElement =
        document.getElementById(
            "qty-" + productId
        );

    if (qtyElement) {
        qtyElement.textContent = "1";
    }

    saveCart();

    updateCart();

    openCart();

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartItemQty(index, change) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity =
        (
            Number(cart[index].quantity) || 1
        ) +
        Number(change);

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    updateCart();

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    const cartItems =
        document.getElementById(
            "cart-items"
        );

    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    const count =
        getCartItemCount();

    const total =
        getCartTotal();


    if (cartCount) {

        cartCount.textContent =
            count;

    }


    if (cartTotal) {

        cartTotal.textContent =
            "Rs. " +
            total.toLocaleString("en-PK");

    }


    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>Your Cart is Empty</h3>

                <p>
                    Add a laptop bag to continue.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(
        (item, index) => {

            const itemTotal =
                (
                    Number(item.price) || 0
                ) *
                (
                    Number(item.quantity) || 0
                );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cart-item";


            div.innerHTML = `

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <p>
                        Rs.
                        ${(
                            Number(item.price) || 0
                        ).toLocaleString("en-PK")}
                    </p>

                    <div class="cart-item-controls">

                        <button
                            type="button"
                            onclick="
                                changeCartItemQty(
                                    ${index},
                                    -1
                                )
                            "
                        >
                            −
                        </button>

                        <span>
                            ${Number(item.quantity) || 1}
                        </span>

                        <button
                            type="button"
                            onclick="
                                changeCartItemQty(
                                    ${index},
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="cart-item-right">

                    <strong>
                        Rs.
                        ${itemTotal.toLocaleString("en-PK")}
                    </strong>

                    <br><br>

                    <button
                        type="button"
                        class="remove-cart-item"
                        onclick="
                            removeFromCart(${index})
                        "
                    >
                        Remove
                    </button>

                </div>

            `;


            cartItems.appendChild(div);

        }
    );

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    updateCart();

    const overlay =
        document.getElementById(
            "cart-overlay"
        );

    if (overlay) {

        overlay.classList.add(
            "show"
        );

    }

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    const overlay =
        document.getElementById(
            "cart-overlay"
        );

    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   PROCEED TO CART
========================================================= */

function proceedToCart() {

    closeCart();

    const cartSection =
        document.getElementById(
            "cart-section"
        );

    if (cartSection) {

        cartSection.classList.add(
            "show"
        );

        cartSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } else {

        openCart();

    }

}


/* =========================================================
   BUY NOW
========================================================= */

function buyNow(productId) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    const quantity =
        Math.max(
            1,
            Number(quantities[productId]) || 1
        );


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (existing) {

        existing.quantity +=
            quantity;

    } else {

        cart.push({

            id: Number(productId),

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: quantity

        });

    }


    quantities[productId] = 1;


    const qtyElement =
        document.getElementById(
            "qty-" + productId
        );


    if (qtyElement) {

        qtyElement.textContent =
            "1";

    }


    saveCart();

    updateCart();

    openCheckout();

}


/* =========================================================
   WHATSAPP CART
========================================================= */

function orderCartOnWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    let message =
        "Hello LAPVORA!\n\n" +
        "I want to place an order:\n\n";


    let total = 0;


    cart.forEach(
        (item, index) => {

            const itemTotal =
                (
                    Number(item.price) || 0
                ) *
                (
                    Number(item.quantity) || 0
                );


            message +=
                `${index + 1}. ${item.name}\n`;

            message +=
                `Quantity: ${item.quantity}\n`;

            message +=
                `Price: Rs. ${itemTotal.toLocaleString("en-PK")}\n\n`;


            total +=
                itemTotal;

        }
    );


    message +=
        `TOTAL: Rs. ${total.toLocaleString("en-PK")}`;


    openWhatsApp(message);

}


/* =========================================================
   OLD COMPATIBILITY
========================================================= */

function checkoutWhatsApp() {

    orderCartOnWhatsApp();

}


/* =========================================================
   CHECKOUT OPEN
========================================================= */

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Please add a product to your cart first."
        );

        return;

    }


    closeCart();


    const checkout =
        document.getElementById(
            "checkout"
        );


    if (checkout) {

        checkout.classList.add(
            "show"
        );

        checkout.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   SUBMIT CHECKOUT
========================================================= */

function submitCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const nameElement =
        document.getElementById(
            "checkoutName"
        );

    const phoneElement =
        document.getElementById(
            "checkoutPhone"
        );

    const cityElement =
        document.getElementById(
            "checkoutCity"
        );

    const addressElement =
        document.getElementById(
            "checkoutAddress"
        );

    const paymentElement =
        document.getElementById(
            "checkoutPayment"
        );


    if (
        !nameElement ||
        !phoneElement ||
        !cityElement ||
        !addressElement ||
        !paymentElement
    ) {

        alert(
            "Checkout form is not available."
        );

        return;

    }


    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const city =
        cityElement.value.trim();

    const address =
        addressElement.value.trim();

    const payment =
        paymentElement.value;


    if (
        !name ||
        !phone ||
        !city ||
        !address ||
        !payment
    ) {

        alert(
            "Please complete all checkout details."
        );

        return;

    }


    const total =
        getCartTotal();


    let message =
        "Hello LAPVORA!\n\n" +
        "I want to place an order.\n\n" +

        "CUSTOMER DETAILS\n" +

        `Name: ${name}\n` +

        `Phone: ${phone}\n` +

        `City: ${city}\n` +

        `Address: ${address}\n` +

        `Payment: ${payment}\n\n` +

        "ORDER DETAILS\n";


    cart.forEach(
        (item, index) => {

            const itemTotal =
                (
                    Number(item.price) || 0
                ) *
                (
                    Number(item.quantity) || 0
                );


            message +=
                `${index + 1}. ${item.name}\n`;

            message +=
                `Quantity: ${item.quantity}\n`;

            message +=
                `Price: Rs. ${itemTotal.toLocaleString("en-PK")}\n\n`;

        }
    );


    message +=
        `TOTAL: Rs. ${total.toLocaleString("en-PK")}`;


    saveOrder({

        date:
            new Date().toLocaleString("en-PK"),

        name:
            name,

        phone:
            phone,

        city:
            city,

        address:
            address,

        payment:
            payment,

        total:
            total,

        items:
            cart.map(
                item => ({
                    ...item
                })
            )

    });


    openWhatsApp(message);


    cart = [];

    saveCart();

    updateCart();


    nameElement.value = "";

    phoneElement.value = "";

    cityElement.value = "";

    addressElement.value = "";

    paymentElement.value = "";


    const checkout =
        document.getElementById(
            "checkout"
        );


    if (checkout) {

        checkout.classList.remove(
            "show"
        );

    }


    alert(
        "Order details have been sent to WhatsApp."
    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchProducts() {

    const input =
        document.getElementById(
            "productSearch"
        );


    if (!input) {
        return;
    }


    const text =
        input.value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(
        card => {

            const searchableText =
                (
                    card.dataset.name ||
                    card.innerText ||
                    ""
                ).toLowerCase();


            if (
                text === "" ||
                searchableText.includes(text)
            ) {

                card.classList.remove(
                    "hidden"
                );

            } else {

                card.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );

    const overlay =
        document.getElementById(
            "mobileMenuOverlay"
        );


    if (menu) {

        menu.classList.add(
            "show"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "show"
        );

    }


    document.body.classList.add(
        "mobile-menu-open"
    );

}


function closeMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );

    const overlay =
        document.getElementById(
            "mobileMenuOverlay"
        );


    if (menu) {

        menu.classList.remove(
            "show"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "mobile-menu-open"
    );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function mobileNavigate(target) {

    closeMobileMenu();

    setTimeout(
        () => {

            const element =
                document.getElementById(
                    target
                );

            if (element) {

                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        },
        100
    );

}


function mobileOpenCart() {

    closeMobileMenu();

    setTimeout(
        () => {
            openCart();
        },
        100
    );

}


function mobileOpenAccount() {

    closeMobileMenu();

    setTimeout(
        () => {
            openAccount();
        },
        100
    );

}


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount() {

    const account =
        document.getElementById(
            "account"
        );


    if (account) {

        account.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   LOGIN
========================================================= */

function showLogin() {

    const login =
        document.getElementById(
            "loginForm"
        );

    const signup =
        document.getElementById(
            "signupForm"
        );

    const dashboard =
        document.getElementById(
            "accountDashboard"
        );


    if (login) {
        login.style.display =
            "block";
    }

    if (signup) {
        signup.style.display =
            "none";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

}


/* =========================================================
   SIGNUP
========================================================= */

function showSignup() {

    const login =
        document.getElementById(
            "loginForm"
        );

    const signup =
        document.getElementById(
            "signupForm"
        );

    const dashboard =
        document.getElementById(
            "accountDashboard"
        );


    if (login) {
        login.style.display =
            "none";
    }

    if (signup) {
        signup.style.display =
            "block";
    }

    if (dashboard) {
        dashboard.style.display =
            "none";
    }

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

function createAccount() {

    const nameElement =
        document.getElementById(
            "signupName"
        );

    const emailElement =
        document.getElementById(
            "signupEmail"
        );

    const passwordElement =
        document.getElementById(
            "signupPassword"
        );

    const confirmElement =
        document.getElementById(
            "signupConfirmPassword"
        );


    if (
        !nameElement ||
        !emailElement ||
        !passwordElement ||
        !confirmElement
    ) {
        return;
    }


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const password =
        passwordElement.value;

    const confirmPassword =
        confirmElement.value;


    if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }


    if (
        !isValidEmail(email)
    ) {

        alert(
            "Please enter a valid email address."
        );

        return;

    }


    if (
        password.length < 6
    ) {

        alert(
            "Password must be at least 6 characters."
        );

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        alert(
            "Passwords do not match."
        );

        return;

    }


    const user = {

        name:
            name,

        email:
            email,

        password:
            password

    };


    localStorage.setItem(
        "lapvoraUser",
        JSON.stringify(user)
    );


    alert(
        "Account created successfully!"
    );


    showLogin();


    const loginEmail =
        document.getElementById(
            "loginEmail"
        );

    const loginPassword =
        document.getElementById(
            "loginPassword"
        );


    if (loginEmail) {
        loginEmail.value =
            email;
    }

    if (loginPassword) {
        loginPassword.value =
            "";
    }

}


/* =========================================================
   LOGIN ACCOUNT
========================================================= */

function loginAccount() {

    const emailElement =
        document.getElementById(
            "loginEmail"
        );

    const passwordElement =
        document.getElementById(
            "loginPassword"
        );


    if (
        !emailElement ||
        !passwordElement
    ) {
        return;
    }


    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const password =
        passwordElement.value;


    const user =
        getStoredUser();


    if (!user) {

        alert(
            "No account found. Please create an account first."
        );

        showSignup();

        return;

    }


    if (
        email !==
            String(user.email)
                .toLowerCase() ||
        password !==
            user.password
    ) {

        alert(
            "Incorrect email or password."
        );

        return;

    }


    localStorage.setItem(
        "lapvoraLoggedIn",
        "true"
    );


    showDashboard(user);

}


/* =========================================================
   DASHBOARD
========================================================= */

function showDashboard(user) {

    const login =
        document.getElementById(
            "loginForm"
        );

    const signup =
        document.getElementById(
            "signupForm"
        );

    const dashboard =
        document.getElementById(
            "accountDashboard"
        );


    if (login) {
        login.style.display =
            "none";
    }

    if (signup) {
        signup.style.display =
            "none";
    }

    if (dashboard) {
        dashboard.style.display =
            "block";
    }


    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    const dashboardMessage =
        document.getElementById(
            "dashboardMessage"
        );


    if (profileName) {

        profileName.textContent =
            user.name;

    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email;

    }


    if (dashboardMessage) {

        dashboardMessage.textContent =
            "Welcome to your LAPVORA account.";

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutAccount() {

    localStorage.removeItem(
        "lapvoraLoggedIn"
    );

    showLogin();

    alert(
        "You have been logged out."
    );

}


/* =========================================================
   PROFILE
========================================================= */

function showProfile() {

    const user =
        getStoredUser();

    const message =
        document.getElementById(
            "dashboardMessage"
        );


    if (!user || !message) {
        return;
    }


    message.innerHTML = `

        <strong>
            Profile
        </strong>

        <br><br>

        Name:
        ${escapeHTML(user.name)}

        <br>

        Email:
        ${escapeHTML(user.email)}

    `;

}


/* =========================================================
   ORDERS
========================================================= */

function showOrders() {

    const orders =
        getOrders();

    const message =
        document.getElementById(
            "dashboardMessage"
        );


    if (!message) {
        return;
    }


    if (orders.length === 0) {

        message.innerHTML = `

            <strong>
                My Orders
            </strong>

            <br><br>

            You don't have any orders yet.

        `;

        return;

    }


    let html = `

        <strong>
            My Orders
        </strong>

        <br><br>

    `;


    orders.forEach(
        (order, index) => {

            const total =
                Number(order.total) || 0;


            html += `

                <div
                    class="dashboard-order"
                    style="
                        padding:12px 0;
                        border-bottom:1px solid #333;
                    "
                >

                    <strong>
                        Order #${index + 1}
                    </strong>

                    <br>

                    Date:
                    ${escapeHTML(order.date || "")}

                    <br>

                    Total:
                    Rs.
                    ${total.toLocaleString("en-PK")}

                </div>

            `;

        }
    );


    message.innerHTML =
        html;

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function forgotPassword(event) {

    if (event) {
        event.preventDefault();
    }


    const user =
        getStoredUser();


    if (!user) {

        alert(
            "No account found."
        );

        return;

    }


    alert(
        "For this demo website, your registered email is: " +
        user.email
    );

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function togglePassword(id) {

    const input =
        document.getElementById(id);


    if (!input) {
        return;
    }


    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";

    } else {

        input.type =
            "password";

    }

}


/* =========================================================
   REVIEWS
========================================================= */

function getReviews() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "lapvoraReviews"
                ) || "null"
            );


        if (
            Array.isArray(saved)
        ) {

            return saved;

        }

    } catch (error) {}


    return [

        {
            name:
                "Muhammad Ali",

            rating:
                5,

            text:
                "Excellent quality and very stylish bag."
        },

        {
            name:
                "Ahmed Khan",

            rating:
                5,

            text:
                "Very comfortable and perfect for university."
        },

        {
            name:
                "Usman",

            rating:
                4,

            text:
                "Good quality and fast delivery."
        }

    ];

}


let reviews =
    getReviews();


function saveReviews() {

    localStorage.setItem(
        "lapvoraReviews",
        JSON.stringify(reviews)
    );

}


/* =========================================================
   SUBMIT REVIEW
========================================================= */

function submitReview() {

    const nameElement =
        document.getElementById(
            "reviewName"
        );

    const ratingElement =
        document.getElementById(
            "reviewRating"
        );

    const textElement =
        document.getElementById(
            "reviewText"
        );


    if (
        !nameElement ||
        !ratingElement ||
        !textElement
    ) {
        return;
    }


    const name =
        nameElement.value.trim();

    const rating =
        Number(
            ratingElement.value
        );

    const text =
        textElement.value.trim();


    if (
        !name ||
        !text
    ) {

        alert(
            "Please enter your name and review."
        );

        return;

    }


    if (
        rating < 1 ||
        rating > 5
    ) {

        alert(
            "Please select a valid rating."
        );

        return;

    }


    reviews.unshift({

        name:
            name,

        rating:
            rating,

        text:
            text

    });


    saveReviews();

    displayReviews();


    nameElement.value =
        "";

    textElement.value =
        "";


    alert(
        "Thank you for your review!"
    );

}


/* =========================================================
   DISPLAY REVIEWS
========================================================= */

function displayReviews() {

    const list =
        document.getElementById(
            "reviewsList"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        "";


    reviews.forEach(
        review => {

            const rating =
                Math.min(
                    5,
                    Math.max(
                        1,
                        Number(review.rating) || 1
                    )
                );


            const stars =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "review-card";


            div.innerHTML = `

                <h3>
                    ${escapeHTML(review.name)}
                </h3>

                <div>
                    ${stars}
                </div>

                <p>
                    ${escapeHTML(review.text)}
                </p>

            `;


            list.appendChild(div);

        }
    );

}


/* =========================================================
   CONTACT FORM
========================================================= */

function sendMessage(event) {

    if (event) {
        event.preventDefault();
    }


    const name =
        document.getElementById(
            "name"
        )?.value.trim() || "";


    const email =
        document.getElementById(
            "email"
        )?.value.trim() || "";


    const subject =
        document.getElementById(
            "subject"
        )?.value.trim() || "";


    const message =
        document.getElementById(
            "message"
        )?.value.trim() || "";


    if (
        !name ||
        !email ||
        !subject ||
        !message
    ) {

        alert(
            "Please complete all contact fields."
        );

        return;

    }


    const whatsappMessage =

        "Hello LAPVORA!\n\n" +

        `Name: ${name}\n` +

        `Email: ${email}\n` +

        `Subject: ${subject}\n\n` +

        `Message: ${message}`;


    openWhatsApp(
        whatsappMessage
    );

}


/* =========================================================
   STORAGE HELPERS
========================================================= */

function getStoredUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "lapvoraUser"
            ) || "null"
        );

    } catch (error) {

        return null;

    }

}


function getOrders() {

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(
                    "lapvoraOrders"
                ) || "[]"
            );


        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        return [];

    }

}


function saveOrder(order) {

    const orders =
        getOrders();


    orders.unshift(
        order
    );


    localStorage.setItem(
        "lapvoraOrders",
        JSON.stringify(orders)
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

function goToSection(id) {

    closeMobileMenu();

    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

        displayReviews();


        const loggedIn =
            localStorage.getItem(
                "lapvoraLoggedIn"
            );


        const user =
            getStoredUser();


        if (
            loggedIn === "true" &&
            user
        ) {

            showDashboard(
                user
            );

        } else {

            showLogin();

        }


        /* NAV LINKS */

        const navLinks =
            document.querySelectorAll(
                ".navbar nav a"
            );


        navLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    function () {

                        navLinks.forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                        this.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


        /* SEARCH */

        const searchInput =
            document.getElementById(
                "productSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );

        }


        /* MOBILE OVERLAY */

        const mobileOverlay =
            document.getElementById(
                "mobileMenuOverlay"
            );


        if (mobileOverlay) {

            mobileOverlay.addEventListener(
                "click",
                closeMobileMenu
            );

        }


        /* CART OVERLAY */

        const cartOverlay =
            document.getElementById(
                "cart-overlay"
            );


        if (cartOverlay) {

            cartOverlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        cartOverlay
                    ) {

                        closeCart();

                    }

                }
            );

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeCart();

            closeMobileMenu();

        }

    }
);


/* =========================================================
   END
========================================================= */