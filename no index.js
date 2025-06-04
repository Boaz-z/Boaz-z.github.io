let a = 0; //mouse not on logo
let b = 0; //.start not active

const input = document.getElementById("input");
const submit = document.querySelector(".search input[type=submit]");
const navbar = document.querySelector("nav");
const divup = document.querySelector("div ul up");

window.addEventListener("load", function () { //Big logo on load
  submit.classList.add("inactive");
  divup.classList.add("hiddenup");
  b = 1;

  setTimeout(() => {
    b = 0;
  }, 5000); // Remove .start after 5 seconds
});

window.addEventListener("scroll", function () { //big logo on scroll

  if (window.scrollY > 0 && b === 1) {
    //if scroll and .start is active, remove it
    b = 0;
  }

  if (window.scrollY > 475 && b === 0) { //up button on scroll
    divup.classList.remove("hiddenup");
  } else {
    divup.classList.add("hiddenup");
  }

  if (window.scrollY > 475 && a === 0 && b === 0) { //if scrollpos > 475px, mouse isn't on logo and .start isn't active, add hiddennav
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



// ----------------- SEARCH ----------------

// Listen for user input in the search box
input.addEventListener("input", () => {
  // If the input is empty (only whitespace), disable the submit button (by adding 'inactive' class)
  if (input.value.trim() === "") {
    submit.classList.add("inactive");
  } else {
    // Otherwise, enable the submit button
    submit.classList.remove("inactive");
  }
});

// Handle the search when the form is submitted
async function handleSearch(event) {
  event.preventDefault(); // Prevent default form submission (e.g., page reload)
  event = event || window.event; // Fallback for older browsers (not usually needed anymore)

  // Get the search input, convert to lowercase, and trim whitespace
  const query = document.getElementById('input').value.toLowerCase().trim();

  // If the input is empty, do nothing
  if (query === "") {
    return false;
  }

  try {
    // Fetch the list of products from the JSON file (absolute path from root)
    const response = await fetch('/products.json');
    const products = await response.json();

    // Try to find a product whose name exactly matches the query
    const match = products.find(product =>
      product.name.toLowerCase().trim() === query
    );

    if (match) {
      // If a match is found, redirect the user to the matched product's URL
      window.location.href = match.url;
    } else {
      // If no match is found, notify the user
      alert("We couldn't find what you were looking for.");
    }

  } catch (error) {
    // If the fetch fails (file not found, offline, etc.), show an error message
    alert("We couldn't find what you were looking for.");
  }

  return false; // Prevent further default form behavior
}


//-------------- PRODUCT COLOR ---------------

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


//------------ SHOPPING CART ------------


// Retrieve cart from localStorage or initialize an empty array if none exists
const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// Save the current cart state to localStorage
function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Add an item to the cart (or update quantity if it already exists)
function addToCart(itemName) {
  const quantitySelect = document.getElementById('productAmount'); // Quantity selector element
  const quantity = parseInt(quantitySelect.value);                 // Selected quantity

  // Check if the item already exists in the cart
  const existingItem = cart.find(item => item.name === itemName);

  if (existingItem) {
    // If it exists, replace the quantity with the new one
    existingItem.quantity = quantity;
  } else {
    // If it's a new item, add it to the cart
    cart.push({ name: itemName, quantity: quantity });
  }

  saveCart();            // Save changes to localStorage
  updateCartDisplay();   // Refresh the cart UI
}

// Update the cart list in the DOM
function updateCartDisplay() {
  const cartList = document.getElementById('cartList'); // UL or DIV where cart items are listed
  cartList.innerHTML = ''; // Clear the current list

  cart.forEach(item => {
    const li = document.createElement('li'); // Create new list item for each cart entry

    // Display the item name
    li.textContent = item.name + "     ";

    // Create "decrease" (-) button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '–';
    decreaseBtn.onclick = () => {
      if (item.quantity > 1) {
        item.quantity--; // Decrease quantity
      } else {
        cart.splice(cart.indexOf(item), 1); // Remove item from cart if quantity reaches 0
      }
      saveCart();          // Save updated cart
      updateCartDisplay(); // Refresh display
    };
    li.appendChild(decreaseBtn); // Add button to list item

    // Show current quantity
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = item.quantity > 0 ? ` (x${item.quantity})` : '';
    li.appendChild(quantitySpan);

    // Create "increase" (+) button
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.onclick = () => {
      item.quantity++;     // Increase quantity
      saveCart();          // Save updated cart
      updateCartDisplay(); // Refresh display
    };
    li.appendChild(increaseBtn);

    // Add the completed list item to the cart display
    cartList.appendChild(li);
  });
}

// Remove an item from the cart by name
function removeFromCart(itemName) {
  const index = cart.findIndex(item => item.name === itemName);
  if (index !== -1) {
    cart.splice(index, 1); // Remove item from array
    saveCart();            // Save updated cart
    updateCartDisplay();   // Refresh display
  }
}

// on page load, update cart display
updateCartDisplay();
