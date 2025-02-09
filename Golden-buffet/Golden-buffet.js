let cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Retrieve saved cart items

// Function to save cart data to localStorage
function saveCartData() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', cartTotal.toString());
}

// Function to update the floating cart total
function updateCartTotal() {
    const cartTotalElement = document.getElementById('floating-cart-total');
    cartTotalElement.textContent = 'Total: $' + cartTotal.toFixed(2);
    saveCartData();  // Save cart data every time the total updates
}

// Function to update the cart display with added items
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    // Iterate through cartItems and add each item to the cart display
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
            <button class="remove-item" data-index="${index}">X</button>`;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Show the floating cart if there are items
    if (cartItems.length > 0) {
        document.getElementById('floating-cart').style.display = 'block';
    } else {
        document.getElementById('floating-cart').style.display = 'none';
    }
}

// Event listener for all add-to-cart links (instead of buttons)
document.querySelectorAll('.add-to-cart').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default action of the anchor tag (navigation)

        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));

        // Add item to cart
        cartItems.push({ name, price });
        
        // Update the total price
        cartTotal += price;

        // Update the floating cart display
        updateCartTotal();
        updateCartItems();
    });
});

// Event listener for removing an item from the cart (in the floating cart)
document.getElementById('cart-items').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('remove-item')) {
        const itemIndex = e.target.getAttribute('data-index');
        const removedItem = cartItems[itemIndex];

        // Remove the item from the cart
        cartItems.splice(itemIndex, 1);

        // Subtract the price of the removed item from the total
        cartTotal -= removedItem.price;

        // Update the floating cart display
        updateCartTotal();
        updateCartItems();
    }
});

// Event listener for clearing the cart
document.getElementById('clear-cart').addEventListener('click', function() {
    // Clear all items and reset total
    cartItems = [];
    cartTotal = 0;

    // Update the floating cart display
    updateCartTotal();
    updateCartItems();
});

// Event listener for going to checkout
document.getElementById('go-to-checkout').addEventListener('click', function() {
    // Redirect to the checkout page
    window.location.href = 'Golden-buffet-checkout.html';
});

// Load the cart data on page load
updateCartTotal();
updateCartItems();
