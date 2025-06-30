// Products
const products = [
    { id: 1, name: "Headphones", price: 59.99, img: "images/headphones.jpg" },
    { id: 2, name: "Camera", price: 199.99, img: "images/camera.jpg" },
    { id: 3, name: "Watch", price: 129.99, img: "images/watch.jpg" }
];

let cart = [], currentUser = null;

// Element references
const productList = document.getElementById("product-list"),
    cartItems = document.getElementById("cart-items"),
    cartCount = document.getElementById("cart-count"),
    cartTotal = document.getElementById("cart-total"),
    cartSidebar = document.getElementById("cart-sidebar"),
    cartToggle = document.getElementById("cart-toggle"),
    closeCart = document.getElementById("close-cart"),
    buyBtn = document.getElementById("buy-btn"),
    loginBtn = document.getElementById("login-btn"),
    registerBtn = document.getElementById("register-btn"),
    signoutBtn = document.getElementById("signout-btn"),
    authModal = new bootstrap.Modal(document.getElementById("auth-modal")),
    confirmModal = new bootstrap.Modal(document.getElementById("confirm-modal")),
    successModal = new bootstrap.Modal(document.getElementById("success-modal")),
    authTitle = document.getElementById("auth-modal-title"),
    authEmail = document.getElementById("auth-email"),
    authPass = document.getElementById("auth-pass"),
    authSubmit = document.getElementById("auth-submit"),
    authCancel = document.getElementById("auth-cancel"),
    confirmCancel = document.getElementById("confirm-cancel"),
    confirmPay = document.getElementById("confirm-pay"),
    toastEl = new bootstrap.Toast(document.getElementById("cart-toast"));
const paymentModal = new bootstrap.Modal(document.getElementById("payment-modal"));
const finalPriceText = document.getElementById("final-price-text");
const paymentCancel = document.getElementById("payment-cancel");
const paymentConfirm = document.getElementById("payment-confirm");

confirmPay.onclick = () => {
    confirmModal.hide();

    // Calculate and show total in payment modal
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    finalPriceText.textContent = `Total: ₹${total.toFixed(2)}`;

    paymentModal.show();
};

paymentCancel.onclick = () => {
    paymentModal.hide();
};

paymentConfirm.onclick = () => {
    paymentModal.hide();
    cart = [];
    renderCart();
    cartSidebar.style.display = 'none';
    successModal.show();
};


// Render Store Items
function renderStore() {
    productList.innerHTML = '';
    products.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4 d-flex"; // Flex container for equal height cards
        col.innerHTML = `
      <div class="card w-100 h-100 d-flex flex-column">
        <img src="${p.img}" height="280px" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">₹${p.price.toFixed(2)}</p>
          <button class="btn btn-primary mt-auto" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    `;
        productList.appendChild(col);
    });
}




// Add to Cart
function addToCart(id) {
    if (!currentUser) { promptAuth('Login'); return; }
    const item = cart.find(i => i.id === id);
    item ? item.qty++ : cart.push({ ...products.find(p => p.id === id), qty: 1 });
    renderCart();
    toastEl.show();
}

// Render Cart Sidebar
function renderCart() {
    cartItems.innerHTML = '';
    let total = 0, count = 0;
    cart.forEach(i => {
        count += i.qty;
        total += i.qty * i.price;
        const item = document.createElement("div");
        item.className = "list-group-item d-flex align-items-center";
        item.innerHTML = `
      <img src="${i.img}" alt="${i.name}">
      <div class="flex-grow-1">
        ${i.name} x${i.qty}<br><small>₹${(i.price * i.qty).toFixed(2)}</small>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary" onclick="changeQty(${i.id},-1)"><i class="bi bi-dash-lg"></i></button>
        <button class="btn btn-outline-secondary" onclick="changeQty(${i.id},+1)">  <i class="bi bi-plus-lg"></i></button>
        <button class="btn btn-outline-danger" onclick="changeQty(${i.id},0)">  <i class="bi bi-x-lg"></i></button>
      </div>`;
        cartItems.append(item);
    });
    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
}

// Change Quantity
window.changeQty = (id, delta) => {
    const i = cart.find(x => x.id === id);
    if (!i) return;
    if (delta === 0 || i.qty + delta < 1) cart = cart.filter(x => x.id !== id);
    else i.qty += delta;
    renderCart();
};

// Toggle Cart Sidebar
cartToggle.onclick = () => cartSidebar.style.display = cartSidebar.style.display === 'block' ? 'none' : 'block';
closeCart.onclick = () => cartSidebar.style.display = 'none';

// Auth & Sign out
loginBtn.onclick = () => promptAuth('Login');
registerBtn.onclick = () => promptAuth('Register');
signoutBtn.onclick = () => {
    currentUser = null;
    loginBtn.classList.remove('d-none');
    registerBtn.classList.remove('d-none');
    signoutBtn.classList.add('d-none');
    alert('Signed out!');
};

// Auth Modal
function promptAuth(type) {
    authTitle.textContent = type;
    authSubmit.textContent = type;
    authSubmit.onclick = () => {
        const e = authEmail.value.trim(), p = authPass.value;
        if (!e || !p) return alert('Enter both fields.');
        if (type === 'Register') {
            if (localStorage.getItem(e)) return alert('User already exists.');
            localStorage.setItem(e, p);
            alert('Registered successfully');
        } else {
            if (localStorage.getItem(e) !== p) return alert('Invalid credentials.');
            currentUser = e;
            loginBtn.classList.add('d-none');
            registerBtn.classList.add('d-none');
            signoutBtn.classList.remove('d-none');
            alert('Logged in as ' + e);
        }
        authModal.hide();
        authEmail.value = authPass.value = '';
    };
    authCancel.onclick = () => authModal.hide();
    authModal.show();
}

// Buy Flow
buyBtn.onclick = () => {
    if (cart.length === 0) { alert('Cart is empty'); return; }
    confirmModal.show();
};

confirmCancel.onclick = () => confirmModal.hide();

// confirmPay.onclick = () => {
//     confirmModal.hide();
//     cart = [];
//     renderCart();
//     cartSidebar.style.display = 'none';
//     successModal.show();
// };

// Initialization
renderStore();
renderCart();
