// main.js

document.addEventListener('DOMContentLoaded', function() {
    // ... (Your existing dropdown and mobile menu code here) ...

    // Initialize cart from localStorage on page load
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Function to save cart to localStorage and update cart count
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();
    }

    // Function to update the cart count in the header
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Initial cart count update on page load
    updateCartCount();

    // Product Item Button Functionality
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
        const quickViewBtn = item.querySelector('.quick-view');
        const addToWishlistBtn = item.querySelector('.add-to-wishlist');
        const addToCartBtn = item.querySelector('.add-to-cart');
        const productTitleElement = item.querySelector('.product-title');
        const productPriceElement = item.querySelector('.current-price');
        const productImageElement = item.querySelector('.product-image img'); // Assuming your image has this structure

        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function() {
                const productName = productTitleElement.textContent;
                console.log(`Quick View clicked for: ${productName}`);
                // ... (Quick view logic) ...
            });
        }

        if (addToWishlistBtn) {
            addToWishlistBtn.addEventListener('click', function() {
                const productName = productTitleElement.textContent;
                console.log(`Add to Wishlist clicked for: ${productName}`);
                // ... (Add to wishlist logic) ...
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                if (productTitleElement && productPriceElement && productImageElement) {
                    const title = productTitleElement.textContent;
                    const priceText = productPriceElement.textContent.replace('$', ''); // Remove '$' if present
                    const price = parseFloat(priceText);
                    const imageSrc = productImageElement.src;
                    const productId = item.dataset.productId || title.toLowerCase().replace(/\s+/g, '-'); // Generate a basic ID or use a data-product-id attribute

                    const existingItem = cart.find(item => item.id === productId);

                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id: productId,
                            title: title,
                            price: price,
                            image: imageSrc,
                            quantity: 1
                        });
                    }

                    saveCart();
                    console.log('Cart updated:', cart);
                    alert(`${title} added to cart!`); // Basic feedback
                } else {
                    console.error("Could not find product title, price, or image.");
                }
            });
        }
    });
});