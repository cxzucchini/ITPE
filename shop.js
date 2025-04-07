// Main JavaScript file for handling the shopping functionality
// This would be included in your HTML files as shop.js

document.addEventListener('DOMContentLoaded', function() {
    // Sample product data - in a real application, this would come from a database
    const products = {
        men: [
            { id: 'm1', name: 'Classic Oxford Shirt', price: 49.99, image: 'oxford-shirt.jpg', category: 'Men', description: 'A timeless oxford shirt perfect for any occasion.', sizes: ['S', 'M', 'L', 'XL'] },
            { id: 'm2', name: 'Slim Fit Chinos', price: 59.99, image: 'slim.jpg', category: 'Men', description: 'Comfortable slim fit chinos for a smart casual look.', sizes: ['30', '32', '34', '36'] },
            { id: 'm3', name: 'Linen Button-Up Shirt', price: 49.99, image: 'linen.jpg', category: 'Men', description: 'Breathable linen shirt, perfect for warm weather.', sizes: ['S', 'M', 'L', 'XL'] },
            { id: 'm4', name: 'Casual Denim Jacket', price: 79.99, image: 'denim-jacket.jpg', category: 'Men', description: 'Versatile denim jacket that goes with everything.', sizes: ['S', 'M', 'L', 'XL'] }
        ],
        women: [
            { id: 'w1', name: 'Spring Denim Jacket', price: 79.99, image: 'springd.jpg', category: 'Women', description: 'Stylish denim jacket perfect for spring weather.', sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'w2', name: 'Floral Summer Dress', price: 69.99, image: 'flor.jpg', category: 'Women', description: 'Beautiful floral dress for summer days.', sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'w3', name: 'High Waist Jeans', price: 65.99, image: 'high-waist.jpg', category: 'Women', description: 'Flattering high waist jeans with stretch fit.', sizes: ['24', '26', '28', '30'] },
            { id: 'w4', name: 'Oversized Sweater', price: 55.99, image: 'sweater.jpg', category: 'Women', description: 'Cozy oversized sweater for cooler days.', sizes: ['S', 'M', 'L'] }
        ],
        kids: [
            { id: 'k1', name: 'Kids Graphic Tee', price: 24.99, image: 'gpt.jpg', category: 'Kids', description: 'Fun graphic tees with playful designs.', sizes: ['3-4Y', '5-6Y', '7-8Y'] },
            { id: 'k2', name: 'Denim Overalls', price: 39.99, image: 'overalls.jpg', category: 'Kids', description: 'Durable denim overalls for active kids.', sizes: ['3-4Y', '5-6Y', '7-8Y'] },
            { id: 'k3', name: 'Rainbow Sweater', price: 34.99, image: 'rainbow.jpg', category: 'Kids', description: 'Colorful sweater to brighten up any day.', sizes: ['3-4Y', '5-6Y', '7-8Y'] },
            { id: 'k4', name: 'School Uniform Set', price: 45.99, image: 'uniform.jpg', category: 'Kids', description: 'Comfortable and durable school uniform set.', sizes: ['3-4Y', '5-6Y', '7-8Y'] }
        ],
        accessories: [
            { id: 'a1', name: 'Leather Crossbody Bag', price: 89.99, image: 'cbb.jpg', category: 'Accessories', description: 'Elegant leather crossbody bag for everyday use.', sizes: ['One Size'] },
            { id: 'a2', name: 'Stainless Steel Watch', price: 129.99, image: 'watch.jpg', category: 'Accessories', description: 'Stylish and durable stainless steel watch.', sizes: ['One Size'] },
            { id: 'a3', name: 'Wool Scarf', price: 29.99, image: 'scarf.jpg', category: 'Accessories', description: 'Warm wool scarf for cold days.', sizes: ['One Size'] },
            { id: 'a4', name: 'Leather Belt', price: 35.99, image: 'belt.jpg', category: 'Accessories', description: 'High-quality leather belt to complete your outfit.', sizes: ['S', 'M', 'L'] }
        ]
    };

    // Get the current page category from URL
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    // Load products for the current category
    if (currentPage === 'men' || currentPage === 'women' || currentPage === 'kids' || currentPage === 'accessories') {
        loadProducts(currentPage);
    }

    // Add event listener for "Add to Cart" buttons - this will be added to dynamically created buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            const category = e.target.getAttribute('data-category').toLowerCase();
            const sizeSelect = document.querySelector(`.size-select[data-product-id="${productId}"]`);
            const selectedSize = sizeSelect ? sizeSelect.value : 'One Size';
            
            // Find the product in our data
            const product = products[category].find(p => p.id === productId);
            
            if (product && selectedSize !== 'Choose Size') {
                addToCart(product, selectedSize);
                showNotification(`${product.name} added to your cart!`);
                updateCartCount();
            } else if (selectedSize === 'Choose Size') {
                showNotification('Please select a size first', 'error');
            }
        }
        
        // Quick buy button
        if (e.target && e.target.classList.contains('buy-now-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            const category = e.target.getAttribute('data-category').toLowerCase();
            const sizeSelect = document.querySelector(`.size-select[data-product-id="${productId}"]`);
            const selectedSize = sizeSelect ? sizeSelect.value : 'One Size';
            
            // Find the product in our data
            const product = products[category].find(p => p.id === productId);
            
            if (product && selectedSize !== 'Choose Size') {
                addToCart(product, selectedSize);
                window.location.href = 'checkout.html';
            } else if (selectedSize === 'Choose Size') {
                showNotification('Please select a size first', 'error');
            }
        }
        
        // Product quick view
        if (e.target && e.target.classList.contains('quick-view-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            const category = e.target.getAttribute('data-category').toLowerCase();
            const product = products[category].find(p => p.id === productId);
            
            if (product) {
                openQuickView(product);
            }
        }
    });

    // Function to load products for a category
    function loadProducts(category) {
        const productContainer = document.getElementById('products-container');
        if (!productContainer) {
            // Create a container if it doesn't exist
            const main = document.querySelector('main');
            const section = document.createElement('section');
            section.className = 'products-grid';
            section.innerHTML = `
                <div class="container">
                    <h2 class="section-title">${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection</h2>
                    <div class="product-grid" id="products-container"></div>
                </div>
            `;
            main.appendChild(section);
        }
        
        const container = document.getElementById('products-container') || productContainer;
        const categoryProducts = products[category.toLowerCase()];
        
        if (categoryProducts && container) {
            container.innerHTML = '';
            
            categoryProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-actions">
                            <button class="action-btn quick-view-btn" data-product-id="${product.id}" data-category="${category}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn add-to-wishlist-btn" data-product-id="${product.id}"><i class="fas fa-heart"></i></button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-options">
                            <select class="size-select" data-product-id="${product.id}">
                                <option value="Choose Size">Choose Size</option>
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                            <div class="buy-buttons">
                                <button class="btn add-to-cart-btn" data-product-id="${product.id}" data-category="${category}">Add to Cart</button>
                                <button class="btn buy-now-btn" data-product-id="${product.id}" data-category="${category}">Buy Now</button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(productCard);
            });
        }
    }

    // Function to show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Function to add item to cart
    function addToCart(product, size) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if this product+size combination is already in cart
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && item.size === size);
        
        if (existingItemIndex > -1) {
            // Update quantity if already in cart
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                size: size,
                quantity: 1
            });
        }
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    // Initialize cart count on page load
    updateCartCount();

    // Quick view modal function
    function openQuickView(product) {
        // Create modal if it doesn't exist yet
        let modal = document.getElementById('quickViewModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quickViewModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Populate modal with product details
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="product-quick-view">
                    <div class="product-quick-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-quick-details">
                        <h2>${product.name}</h2>
                        <p class="category">${product.category}</p>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <p class="description">${product.description}</p>
                        <div class="product-options">
                            <select class="size-select" data-product-id="${product.id}">
                                <option value="Choose Size">Choose Size</option>
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                            <div class="quantity-selector">
                                <span>Quantity:</span>
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus">-</button>
                                    <input type="number" value="1" min="1" class="quantity-input">
                                    <button class="quantity-btn plus">+</button>
                                </div>
                            </div>
                            <div class="quick-view-buttons">
                                <button class="btn add-to-cart-btn" data-product-id="${product.id}" data-category="${product.category}">Add to Cart</button>
                                <button class="btn buy-now-btn" data-product-id="${product.id}" data-category="${product.category}">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Close modal when clicking on X
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close when clicking outside modal
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Quantity controls
        const quantityInput = modal.querySelector('.quantity-input');
        const minusBtn = modal.querySelector('.quantity-btn.minus');
        const plusBtn = modal.querySelector('.quantity-btn.plus');
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
});