let a = 0; //mouse not on logo
let b = 0; //.start not active

const input = document.getElementById("input");
const submit = document.querySelector(".search input[type=submit]");
const navbar = document.querySelector("nav");
const divup = document.querySelector("div ul up");

window.addEventListener("load", function () {
  submit.classList.add("inactive");
  divup.classList.add("hiddenup");
  b = 1;

  setTimeout(() => {
    b = 0;
  }, 5000); // Remove .start after 5 seconds
});

window.addEventListener("scroll", function () {

  if (window.scrollY > 0 && b === 1) {
    //if scroll and .start is active, remove it
    b = 0;
  }

  if (window.scrollY > 475 && b === 0) { //up button removed when scrollpos > 475px
    divup.classList.remove("hiddenup");
  } else {
    divup.classList.add("hiddenup");
  }

  if (window.scrollY > 475 && a === 0 && b === 0) { //if scrollpos > 475px, mouse isn't on logo and .start isn't active
    navbar.classList.add("hiddennav");
  } else {
    navbar.classList.remove("hiddennav");
  }

});

navbar.addEventListener("mouseenter", function () { //if hover on logo, remove .hiddennav
  a = 1
  navbar.classList.remove("hiddennav")
});

navbar.addEventListener("mouseleave", function () { //if no longer hovering on logo and scrollpos > 476px, add hiddennav
  a = 0
  if (window.scrollY > 476) {
    navbar.classList.add("hiddennav")
  }
});

input.addEventListener("input", () => {
  if (input.value.trim() === "") {
    submit.classList.add("inactive");
  } else {
    submit.classList.remove("inactive");
  }
});

async function handleSearch(event) {
  event.preventDefault(); //essential
  event = event || window.event;

  const query = document.getElementById('input').value.toLowerCase().trim(); //query = input without spaces and lowercase

  if (query === "") { //if there's no input, don't do anything
    return false;
  }

  try {
    const response = await fetch('products.json'); //product list
    const products = await response.json();

    const match = products.find(product =>
      product.name.toLowerCase().trim() === query //if the search matches a product in the json file, match gets named to the name of that .html match. If there's no match, it's nothing.
    );

    if (match) { //if match exists (so not nothing)
      window.location.href = match.url; //product name from .json file turns into .url
    } else {
      alert("We couldn't find what you were looking for.");
    }

  } catch (error) {
    alert("Search failed."); //error message
  }

  return false;
}

let hue = 0;

function hueRed() {
    hue = 0;
    document.getElementById("productImage").style.filter = `hue-rotate(${hue}deg)`;
}

function hueBlue() {
    hue = 225;
    document.getElementById("productImage").style.filter = `hue-rotate(${hue}deg)`;
}

function hueGreen() {
    hue = 90;
    document.getElementById("productImage").style.filter = `hue-rotate(${hue}deg)`;
}

function hueWhite() {
    document.getElementById("productImage").style.filter = `saturate(0) brightness(200%)`;
}

function hueBlack() {
    document.getElementById("productImage").style.filter = `saturate(0) brightness(0.3)`;
}

const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function addToCart(itemName) { //adds itemname to cart
  const quantitySelect = document.getElementById('productAmount');
  const quantity = parseInt(quantitySelect.value);

  //if item is already in cart
  const existingItem = cart.find(item => item.name === itemName);

  if (existingItem) {
    existingItem.quantity = quantity; // Replace quantity
  } else {
    cart.push({ name: itemName, quantity: quantity }); // Add new item
  }

  saveCart();            // Save after adding
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';

  cart.forEach(item => {
    const li = document.createElement('li');


    // Item name
    li.textContent = (item.name + "     ");


    // Decrease button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '–';
    decreaseBtn.onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(cart.indexOf(item), 1); // remove if 0
      }
      saveCart();
      updateCartDisplay();
    };
    li.appendChild(decreaseBtn);


    // Quantity display
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = item.quantity > 0 ? ` (x${item.quantity})` : '';
    li.appendChild(quantitySpan);


    // Increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.onclick = () => {
      item.quantity++;
      saveCart();
      updateCartDisplay();
    };
    li.appendChild(increaseBtn);

    cartList.appendChild(li);
  });
}

function removeFromCart(itemName) {
  const index = cart.findIndex(item => item.name === itemName);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();          // Save after removing
    updateCartDisplay();
  }
}

// Call on page load to show saved cart
updateCartDisplay();
