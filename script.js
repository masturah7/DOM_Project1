//------------------------------------------------------------------------------------------------------------------------
//                                          1. CALCULATE & RENDER PRICES
//------------------------------------------------------------------------------------------------------------------------

let subtotalPrice = 0;
let shippingPrice = 0;
let totalPrice = 0;
let itemsCount = 0;

function calculatePrices(subtotal, shipping, total, count) {
  subtotalPrice = subtotal;
  shippingPrice = shipping;
  totalPrice = total;
  itemsCount = count;
}

const footerEl = document.querySelector("footer");
const itemsCountEl = document.querySelector(".items-count").querySelector("span");

function renderPrices(subtotal, shipping, total, count) {
  calculatePrices(subtotal, shipping, total, count);
  footerEl.innerHTML = `
          <h3 class="subtitle">SubTotal: <span class="subtotal-price">${subtotal}</span> $</h3>
          <h3 class="subtitle">Shipping: <span class="shipping-price">${shipping}</span> $</h3>
          <h2 class="title">Total: <span class="total-price">${total}</span> $</h2>
      `;
  itemsCountEl.innerText = count;
}

//------------------------------------------------------------------------------------------------------------------------
//                                            2. RENDERING PRODUCTS
//------------------------------------------------------------------------------------------------------------------------

const productsWrapper = document.querySelector(".products-wrapper");

function renderProducts() {
  const initialSubtotal =
    products[0].price + products[1].price + products[2].price;
  const initialShipping =
    products[0].shipping + products[1].shipping + products[2].shipping;
  const initialTotal = initialSubtotal + initialShipping;
  const initialItemsCount = 3;

  calculatePrices(initialSubtotal, initialShipping, initialTotal, initialItemsCount);
  renderPrices(initialSubtotal, initialShipping, initialTotal, initialItemsCount);

  let emptyCart = document.querySelector(".empty-msg");
  if (emptyCart !== null) {
    productsWrapper.removeChild(emptyCart);
  }

  products.forEach((product) => {
    productsWrapper.innerHTML += `
        <div class="product-row" id=${product.id}>
            <div class="product-column product-img">
                <img src=${product.img} alt="" />
            </div>
            <div class="product-column product-name">
                <h2>${product.name}</h2>
            </div>
            <div class="product-column unit-price ">
                <span>${product.price} </span> $
            </div>
            <div class="product-column product-price">
                <span>${product.price} </span> $
            </div>
            <div class="product-column product-quantity">
                <button class="btn plus" onclick="decreaseQtyAndPrice(${product.id})">-</button>
                <span class="qty-number">1</span>
                <button class="btn minus" onclick="increaseQtyAndPrice(${product.id})">+</button>
            </div>
            <div class="product-column product-action">
                <button class="btn like" onclick="toggleLike(this)">
                    <i class="fa-regular fa-heart"></i> Like
                </button>
                <button class="btn remove" onclick="removeProduct(${product.id})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
  });
}

renderProducts();

//------------------------------------------------------------------------------------------------------------------------
//                                            3. REMOVE PRODUCTS FROM CART
//------------------------------------------------------------------------------------------------------------------------

function removeProduct(id) {
  const elementToRemove = document.getElementById(id);

  const qty = Number(elementToRemove.querySelector(".qty-number").innerText);
  const priceToRemove = products[id].price * qty;
  const shippingToRemove = products[id].shipping;

  subtotalPrice = Number((subtotalPrice - priceToRemove).toFixed(2));
  shippingPrice = Number((shippingPrice - shippingToRemove).toFixed(2));
  totalPrice = Number((subtotalPrice + shippingPrice).toFixed(2));
  itemsCount -= qty;

  renderPrices(subtotalPrice, shippingPrice, totalPrice, itemsCount);

  productsWrapper.removeChild(elementToRemove);

  if (productsWrapper.querySelector("[id]") === null) {
    productsWrapper.innerHTML = `<div class="empty-msg"><h1>Empty Cart!</h1> <button class="show-products btn remove" onclick="renderProducts()">Show products again!</button></div>`;
  }
}

//------------------------------------------------------------------------------------------------------------------------
//                                            4. CHANGE LIKE BUTTON ON CLICK
//------------------------------------------------------------------------------------------------------------------------

function toggleLike(button) {
  button.classList.toggle("liked");

  const buttonIcon = button.querySelector(".fa-heart");
  if (buttonIcon) {
    buttonIcon.classList.toggle("fa-solid");
    buttonIcon.classList.toggle("fa-regular");
  }
}

//------------------------------------------------------------------------------------------------------------------------
//                                            5. CHANGE PRODUCT QUANTITY
//------------------------------------------------------------------------------------------------------------------------

function increaseQtyAndPrice(id) {
  const currentProduct = document.getElementById(`${id}`);

  const currentStock = products[id].stock;
  const UnitPrice = products[id].price;

  const currentPriceSpan = currentProduct.querySelector(".product-price span");
  const qtySpan = currentProduct.querySelector(".qty-number");
  let qty = Number(qtySpan.innerText);

  if (qty < currentStock) {
    qty++;
    qtySpan.innerText = qty;

    currentPriceSpan.innerText = Number((UnitPrice * qty).toFixed(2));

    subtotalPrice = Number((subtotalPrice + UnitPrice).toFixed(2));
    totalPrice = Number((totalPrice + UnitPrice).toFixed(2));
    itemsCount++;

    renderPrices(subtotalPrice, shippingPrice, totalPrice, itemsCount);
  } else {
    alert("This product is out of stock!");
  }
}

function decreaseQtyAndPrice(id) {
  const currentProduct = document.getElementById(`${id}`);

  const UnitPrice = products[id].price;

  const currentPriceSpan = currentProduct.querySelector(".product-price span");
  const qtySpan = currentProduct.querySelector(".qty-number");
  let qty = Number(qtySpan.innerText);

  qty--;
  if (qty > 0) {
    qtySpan.innerText = qty;

    currentPriceSpan.innerText = Number((UnitPrice * qty).toFixed(2));

    subtotalPrice = Number((subtotalPrice - UnitPrice).toFixed(2));
    totalPrice = Number((totalPrice - UnitPrice).toFixed(2));
    itemsCount--;

    renderPrices(subtotalPrice, shippingPrice, totalPrice, itemsCount);
  } else {
    removeProduct(id);
  }
}
