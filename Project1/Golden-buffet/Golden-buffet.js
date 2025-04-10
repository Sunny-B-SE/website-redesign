let cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

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

// Event listener for all add-to-cart links
document.querySelectorAll('.add-to-cart').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));

        // Add item to cart
        cartItems.push({ name, price });
        
        // Update total price
        cartTotal += price;

        // Update the floating cart display
        updateCartTotal();
        updateCartItems();
    });
});

// Event listener for removing an item from the cart
document.getElementById('cart-items').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('remove-item')) {
        const itemIndex = e.target.getAttribute('data-index');
        const removedItem = cartItems[itemIndex];

        // Remove the item from the cart
        cartItems.splice(itemIndex, 1);

        // Subtract the price of the removed item from the total
        cartTotal -= removedItem.price;

        updateCartTotal();
        updateCartItems();
    }
});

// Event listener for clearing the cart
document.getElementById('clear-cart').addEventListener('click', function() {
    cartItems = [];
    cartTotal = 0;

    updateCartTotal();
    updateCartItems();
});

// Event listener for going to checkout
document.getElementById('go-to-checkout').addEventListener('click', function() {
    window.location.href = 'Golden-buffet-checkout.html';
});

updateCartTotal();
updateCartItems();

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
} //end formatData

function formatTime(timeString) {
    let [hours, minutes] = timeString.split(":");
    hours = parseInt(hours);

    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
} //end formatTime

document.addEventListener("DOMContentLoaded", function () {
    const reservationForm = document.getElementById("reservationForm");

    if (reservationForm) {
        reservationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let phone = document.getElementById("phone").value;
            let date = document.getElementById("date").value;
            let time = document.getElementById("time").value;
            let guests = document.getElementById("guests").value;

            let formattedDate = formatDate(date);
            let formattedTime = formatTime(time);

            let reservationData = {
                name: name,
                phone: phone,
                date: date,
                time: time,
                guests: guests
            };

            fetch("http://localhost:3000/api/reservation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData)
            }) //end fetch
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    document.getElementById("confirmation").innerText =
                `Reservation confirmed for ${name} on ${formattedDate} at ${formattedTime} for ${guests} guests.`;
                } else {
                    document.getElementById("confirmation").innerText =
                    "An error occurred while saving your reservation. Please try again.";
                }
                document.getElementById("confirmation").style.visibility = "visible";
            }) //end then data
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("confirmation").innerText =
                    "An error occurred. Please check your internet connection and try again.";
                document.getElementById("confirmation").style.visibility = "visible";
            }); //end catch error

        }); //end reservationForm eventListener
    } //end if
}); //end document eventListener