// Enhanced Category Product Actions - Fixed for all category pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart and wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Function to create product cards with wishlist and cart buttons
    function setupCategoryProducts() {
        // Check if we're on a category page using a more robust method
        const categoryPages = ['men.html', 'women.html', 'kids.html', 'accessories.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        // Debug current page detection
        console.log("Current page detected as:", currentPage);
        
        if (categoryPages.includes(currentPage) || document.querySelector('.product-listing')) {
            console.log("Category page detected");
            
            // Try multiple potential container selectors to ensure we find products
            const productCards = document.querySelectorAll('.product-card, .product-item, .item-card');
            
            console.log("Found product cards:", productCards.length);
            
            if (productCards.length > 0) {
                // Add action buttons to each product card
                productCards.forEach((card, index) => {
                    console.log(`Processing product card ${index + 1}`);
                    
                    // Create action buttons container if it doesn't exist
                    if (!card.querySelector('.product-actions')) {
                        const actionsContainer = document.createElement('div');
                        actionsContainer.className = 'product-actions';
                        
                        // Create wishlist button
                        const wishlistBtn = document.createElement('button');
                        wishlistBtn.className = 'action-btn wishlist-btn';
                        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                        wishlistBtn.title = 'Add to Wishlist';
                        
                        // Create add to cart button
                        const cartBtn = document.createElement('button');
                        cartBtn.className = 'action-btn cart-btn';
                        cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                        cartBtn.title = 'Add to Cart';
                        
                        // Append buttons to actions container
                        actionsContainer.appendChild(wishlistBtn);
                        actionsContainer.appendChild(cartBtn);
                        
                        // Append actions container to product card
                        card.appendChild(actionsContainer);
                        
                        // Add event listeners
                        setupWishlistButton(wishlistBtn, card);
                        setupCartButton(cartBtn, card);
                    }
                });
                
                // Add CSS for the new buttons
                addActionButtonStyles();
            } else {
                // If no product cards found initially, try creating them
                createProductCards();
            }
        }
    }
    
    // Function to create product cards if they don't exist yet
    function createProductCards() {
        console.log("Attempting to create product cards");
        
        // Find the main content area where products should be displayed
        const categoryContainer = document.querySelector('.category-content, .product-grid, .products-container, main');
        
        if (categoryContainer) {
            // Check if we're on a specific category page
            const currentPage = window.location.pathname.split('/').pop();
            let categoryName = "Products";
            
            // Set category name based on page
            if (currentPage === 'men.html') categoryName = "Men's Products";
            else if (currentPage === 'women.html') categoryName = "Women's Products";
            else if (currentPage === 'kids.html') categoryName = "Kids' Products";
            else if (currentPage === 'accessories.html') categoryName = "Accessories";
            
            // Create a product grid container if none exists
            let productsGrid = categoryContainer.querySelector('.products-grid, .product-grid');
            
            if (!productsGrid) {
                console.log("Creating products grid");
                
                // Create section header first
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'section-header';
                sectionHeader.innerHTML = `<h2 class="section-title">${categoryName}</h2>`;
                categoryContainer.appendChild(sectionHeader);
                
                // Create products grid
                productsGrid = document.createElement('div');
                productsGrid.className = 'product-grid';
                categoryContainer.appendChild(productsGrid);
                
                // Add sample products for demonstration purposes
                // In a real site, these would come from your database
                const sampleProducts = [
                    {
                        title: 'Sample Product 1',
                        price: 49.99,
                        image: '/api/placeholder/300/400'
                    },
                    {
                        title: 'Sample Product 2',
                        price: 39.99,
                        image: '/api/placeholder/300/400'
                    },
                    {
                        title: 'Sample Product 3',
                        price: 59.99,
                        image: '/api/placeholder/300/400'
                    },
                    {
                        title: 'Sample Product 4',
                        price: 29.99,
                        image: '/api/placeholder/300/400'
                    }
                ];
                
                // Create product cards
                sampleProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.dataset.id = Date.now() + Math.random().toString(36).substr(2, 9);
                    
                    productCard.innerHTML = `
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                        </div>
                    `;
                    
                    // Add actions container
                    const actionsContainer = document.createElement('div');
                    actionsContainer.className = 'product-actions';
                    
                    // Create wishlist button
                    const wishlistBtn = document.createElement('button');
                    wishlistBtn.className = 'action-btn wishlist-btn';
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    wishlistBtn.title = 'Add to Wishlist';
                    
                    // Create add to cart button
                    const cartBtn = document.createElement('button');
                    cartBtn.className = 'action-btn cart-btn';
                    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
                    cartBtn.title = 'Add to Cart';
                    
                    // Append buttons to actions container
                    actionsContainer.appendChild(wishlistBtn);
                    actionsContainer.appendChild(cartBtn);
                    
                    // Append actions container to product card
                    productCard.appendChild(actionsContainer);
                    
                    // Add product card to grid
                    productsGrid.appendChild(productCard);
                    
                    // Add event listeners
                    setupWishlistButton(wishlistBtn, productCard);
                    setupCartButton(cartBtn, productCard);
                });
                
                // Add styling for the created elements
                addProductGridStyles();
            }
        }
    }
    
    // Setup event listeners for wishlist buttons
    function setupWishlistButton(button, productCard) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get product info
            const productId = productCard.dataset.id || Date.now().toString();
            const productTitle = productCard.querySelector('.product-title')?.textContent || 
                               productCard.querySelector('.product-name')?.textContent || 
                               'Product';
            const priceEl = productCard.querySelector('.product-price') || productCard.querySelector('.price');
            const productPrice = priceEl ? priceEl.textContent.replace('$', '') : '0';
            const imgEl = productCard.querySelector('img');
            const productImage = imgEl ? imgEl.src : '';
            
            // Create product object
            const product = {
                id: productId,
                title: productTitle,
                price: parseFloat(productPrice),
                image: productImage
            };
            
            // Check if product is already in wishlist
            const existingProductIndex = wishlist.findIndex(item => item.id === product.id);
            
            if (existingProductIndex > -1) {
                // Remove from wishlist if already added
                wishlist.splice(existingProductIndex, 1);
                button.classList.remove('active');
                showNotification(`${productTitle} removed from your wishlist!`);
            } else {
                // Add to wishlist
                wishlist.push(product);
                button.classList.add('active');
                showNotification(`${productTitle} added to your wishlist!`);
            }
            
            // Save wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    }
    
    // Setup event listeners for cart buttons
    function setupCartButton(button, productCard) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get product info
            const productId = productCard.dataset.id || Date.now().toString();
            const productTitle = productCard.querySelector('.product-title')?.textContent || 
                               productCard.querySelector('.product-name')?.textContent || 
                               'Product';
            const priceEl = productCard.querySelector('.product-price') || productCard.querySelector('.price');
            const productPrice = priceEl ? priceEl.textContent.replace('$', '') : '0';
            const imgEl = productCard.querySelector('img');
            const productImage = imgEl ? imgEl.src : '';
            
            // Create product object
            const product = {
                id: productId,
                title: productTitle,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            };
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            
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
    }
    
    // Function to update cart count in the header
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Function to show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to show add to cart confirmation
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
        
        // Add styles if they don't exist
        addNotificationStyles();
        
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
    
    // Function to add CSS styles for action buttons
    function addActionButtonStyles() {
        if (!document.getElementById('product-action-styles')) {
            const style = document.createElement('style');
            style.id = 'product-action-styles';
            style.innerHTML = `
                .product-card {
                    position: relative;
                    overflow: hidden;
                }
                
                .product-actions {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    opacity: 0;
                    transform: translateX(20px);
                    transition: all 0.3s ease;
                    z-index: 10;
                }
                
                .product-card:hover .product-actions {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .action-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .action-btn:hover {
                    background-color: #f0f0f0;
                    transform: scale(1.1);
                }
                
                .action-btn.active {
                    background-color: #ff4081;
                    color: white;
                }
                
                .action-btn.wishlist-btn:hover {
                    color: #ff4081;
                }
                
                .action-btn.cart-btn:hover {
                    color: #4CAF50;
                }
                
                .notification {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background-color: #333;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    transform: translateY(100px);
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                
                .notification.show {
                    transform: translateY(0);
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Function to add CSS styles for cart notifications
    function addNotificationStyles() {
        if (!document.getElementById('cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.innerHTML = `
                .cart-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border-left: 4px solid #4CAF50;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 320px;
                    max-width: 90%;
                    transform: translateY(100px);
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                
                .cart-notification.show {
                    transform: translateY(0);
                    opacity: 1;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .notification-content i {
                    color: #4CAF50;
                    font-size: 20px;
                    margin-right: 10px;
                }
                
                .notification-content p {
                    flex: 1 1 100%;
                    margin: 5px 0 10px;
                }
                
                .view-cart-btn {
                    background-color: #000;
                    color: white;
                    padding: 5px 15px;
                    text-decoration: none;
                    font-size: 12px;
                }
                
                .close-notification {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    margin-left: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Function to add styles for product grid (used when creating product cards)
    function addProductGridStyles() {
        if (!document.getElementById('product-grid-styles')) {
            const style = document.createElement('style');
            style.id = 'product-grid-styles';
            style.innerHTML = `
                .section-header {
                    text-align: center;
                    margin: 30px 0 20px;
                }
                
                .section-title {
                    font-size: 24px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px 0;
                }
                
                .product-card {
                    border: 1px solid #eee;
                    background-color: white;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .product-image {
                    overflow: hidden;
                    position: relative;
                    height: 0;
                    padding-bottom: 125%; /* 4:5 aspect ratio */
                }
                
                .product-image img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                .product-card:hover .product-image img {
                    transform: scale(1.1);
                }
                
                .product-info {
                    padding: 15px;
                }
                
                .product-title {
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0 0 5px;
                }
                
                .product-price {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }
                
                @media (max-width: 768px) {
                    .product-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 480px) {
                    .product-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Watch for DOM changes to apply to dynamically loaded content
    function observeDOMChanges() {
        // Create a MutationObserver to watch for changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // If new nodes added, check for product cards
                    setupCategoryProducts();
                }
            });
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener('DOMContentLoaded', function() {
        // Show product actions on hover
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const actions = this.querySelector('.product-actions');
                if (actions) {
                    actions.style.opacity = '1';
                    actions.style.transform = 'translateY(0)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const actions = this.querySelector('.product-actions');
                if (actions) {
                    actions.style.opacity = '0';
                    actions.style.transform = 'translateY(100%)';
                }
            });
        });
        
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const cartCount = document.querySelector('.cart-count');
                const currentCount = parseInt(cartCount.textContent);
                cartCount.textContent = currentCount + 1;
                
                // Here you would typically add logic to actually add the item to cart
                alert('Item added to cart!');
            });
        });
        
        // Add to wishlist functionality
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.innerHTML = '<i class="fas fa-heart"></i>';
                this.style.color = 'red';
                
                // Here you would typically add logic to actually add the item to wishlist
                alert('Item added to wishlist!');
            });
        });
    });
    
    // Run on page load
    setupCategoryProducts();
    
    // Also watch for DOM changes
    observeDOMChanges();
    
    // Additional initialization that can run after a delay
    // This helps with pages that load content dynamically
    setTimeout(setupCategoryProducts, 1000);
});
