// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or as empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    updateCartCount();
    
    // Add event listeners to all add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info from parent elements
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Create product object
            const product = {
                id: Date.now().toString(), // Simple unique ID
                title: productTitle,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            };
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.title === product.title);
            
            if (existingProductIndex > -1) {
                // Increase quantity if product already exists
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push(product);
            }
            
            // Save cart to localStorage
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show confirmation message
            showAddToCartConfirmation(productTitle);
        });
    });
    
    // Function to update cart count in the header
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Function to show confirmation when item is added to cart
    function showAddToCartConfirmation(productTitle) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>${productTitle} has been added to your cart!</p>
                <a href="cart.html" class="view-cart-btn">View Cart</a>
            </div>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add the notification to the page
        document.body.appendChild(notification);
        
        // Show the notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set up the close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
});