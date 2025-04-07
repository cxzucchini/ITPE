// home.js - Homepage specific functionality
 
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    setupNewsletterForm();
    initializeHeroSlider();
});

// Sample featured products data (in a real app, this would come from an API/backend)
const featuredProducts = [
    {
        id: 'fp1',
        name: 'Classic White T-Shirt',
        price: 29.99,
        image: 'images/products/tshirt-white.jpg',
        category: 'men',
        rating: 4.5,
        isNew: true,
        isSale: false,
        discount: 0
    },
    {
        id: 'fp2',
        name: 'Summer Floral Dress',
        price: 49.99,
        image: 'images/products/dress-floral.jpg',
        category: 'women',
        rating: 4.8,
        isNew: true,
        isSale: false,
        discount: 0
    },
    {
        id: 'fp3',
        name: 'Casual Denim Jacket',
        price: 79.99,
        image: 'images/products/jacket-denim.jpg',
        category: 'men',
        rating: 4.2,
        isNew: false,
        isSale: true,
        discount: 15
    },
    {
        id: 'fp4',
        name: 'Leather Crossbody Bag',
        price: 39.99,
        image: 'images/products/bag-crossbody.jpg',
        category: 'accessories',
        rating: 4.7,
        isNew: false,
        isSale: false,
        discount: 0
    },
    {
        id: 'fp5',
        name: 'Kids Graphic Tee',
        price: 19.99,
        image: 'images/products/kids-tee.jpg',
        category: 'kids',
        rating: 4.4,
        isNew: true,
        isSale: false,
        discount: 0
    },
    {
        id: 'fp6',
        name: 'Slim Fit Chinos',
        price: 59.99,
        image: 'images/products/chinos-beige.jpg',
        category: 'men',
        rating: 4.3,
        isNew: false,
        isSale: true,
        discount: 20
    },
    {
        id: 'fp7',
        name: 'Silver Hoop Earrings',
        price: 24.99,
        image: 'images/products/earrings-silver.jpg',
        category: 'accessories',
        rating: 4.9,
        isNew: false,
        isSale: false,
        discount: 0
    },
    {
        id: 'fp8',
        name: 'Striped Polo Shirt',
        price: 34.99,
        image: 'images/products/polo-striped.jpg',
        category: 'men',
        rating: 4.1,
        isNew: true,
        isSale: false,
        discount: 0
    }
];

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Get 4 random products from the array
    const shuffled = [...featuredProducts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    // Add products to the container
    selected.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // Initialize product animation
    initProductAnimation();
}

// Create product card element
function createProductCard(product) {
    // Create product card element
    const card = document.createElement('div');
    card.className = 'product-card animate-on-scroll';
    card.dataset.id = product.id;
    
    // Calculate final price
    const finalPrice = product.isSale 
        ? product.price * (1 - product.discount / 100)
        : product.price;
    
    // Generate HTML for card
    card.innerHTML = `
        <div class="product-badges">
            ${product.isNew ? '<span class="badge new">New</span>' : ''}
            ${product.isSale ? `<span class="badge sale">-${product.discount}%</span>` : ''}
        </div>
        <div class="product-img-container">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-actions">
                <button class="product-action-btn add-to-cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="product-action-btn add-to-wishlist">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="product-action-btn quick-view">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price-container">
                ${product.isSale ? 
                    `<span class="product-old-price">$${product.price.toFixed(2)}</span>
                     <span class="product-price">$${finalPrice.toFixed(2)}</span>` :
                    `<span class="product-price">$${product.price.toFixed(2)}</span>`
                }
            </div>
            <div class="product-rating">
                ${generateRatingStars(product.rating)}
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart');
    const addToWishlistBtn = card.querySelector('.add-to-wishlist');
    const quickViewBtn = card.querySelector('.quick-view');
    
    addToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Cart logic is in main.js
    });
    
    addToWishlistBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    });
    
    quickViewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showQuickView(product);
    });
    
    // Make entire card clickable
    card.addEventListener('click', function() {
        window.location.href = `product-details.html?id=${product.id}`;
    });
    
    return card;
}

// Generate star rating HTML
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
        
        // Add empty stars
        for (let i = 0; i < 5 - fullStars - 1; i++) {
            stars += '<i class="far fa-star"></i>';
        }
    } else {
        // Add empty stars
        for (let i = 0; i < 5 - fullStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Wishlist functionality
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('stylehub_wishlist')) || [];
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        // Remove from wishlist
        wishlist.splice(index, 1);
        showNotification('Item removed from wishlist!');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        showNotification('Item added to wishlist!');
    }
    
    localStorage.setItem('stylehub_wishlist', JSON.stringify(wishlist));
}

// Quick view functionality
function showQuickView(product) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    // Calculate final price
    const finalPrice = product.isSale 
        ? product.price * (1 - product.discount / 100)
        : product.price;
    
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">
                <i class="fas fa-times"></i>
            </button>
            <div class="quick-view-grid">
                <div class="quick-view-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="product-price-container">
                        ${product.isSale ? 
                            `<span class="product-old-price">$${product.price.toFixed(2)}</span>
                             <span class="product-price">$${finalPrice.toFixed(2)}</span>` :
                            `<span class="product-price">$${product.price.toFixed(2)}</span>`
                        }
                    </div>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                    </div>
                    <div class="product-description">
                        <p>This trendy ${product.name.toLowerCase()} is perfect for any occasion. Made with high-quality materials for comfort and durability.</p>
                    </div>
                    <div class="product-actions-large">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="btn add-to-cart-btn">Add to Cart</button>
                    </div>
                    <div class="product-meta">
                        <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                        <p><strong>Tags:</strong> Fashion, ${product.category}, Trending</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-quick-view');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });
    
    // Handle quantity buttons
    const minusBtn = modal.querySelector('.minus');
    const plusBtn = modal.querySelector('.plus');
    const quantityInput = modal.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // Add to cart from modal
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        
        let cart = JSON.parse(localStorage.getItem('stylehub_cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.isSale ? finalPrice : product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem('stylehub_cart', JSON.stringify(cart));
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
        
        // Show notification
        showNotification('Item added to cart!');
        
        // Close modal
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });
}

// Product animation on scroll
function initProductAnimation() {
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    productCards.forEach(card => {
        observer.observe(card);
    });
}

// Newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const emailInput = this.querySelector('#email');
                const email = emailInput.value.trim();
                
                // In a real app, this would send the email to a server
                // For now, just save to localStorage and show success message
                const subscribers = JSON.parse(localStorage.getItem('stylehub_subscribers')) || [];
                
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('stylehub_subscribers', JSON.stringify(subscribers));
                    
                    showSuccessMessage(newsletterForm, 'Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                } else {
                    showSuccessMessage(newsletterForm, 'You are already subscribed!');
                }
            }
        });
    }
}

// Show success message
function showSuccessMessage(form, message) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    
    // Add to DOM
    form.appendChild(successMessage);
    
    // Remove after delay
    setTimeout(() => {
        successMessage.classList.add('fade-out');
        setTimeout(() => {
            if (form.contains(successMessage)) {
                form.removeChild(successMessage);
            }
        }, 500);
    }, 3000);
}

// Hero slider functionality
function initializeHeroSlider() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Create slider content
    const slides = [
        {
            bgImage: 'images/hero/spring-collection.jpg',
            title: 'Spring Collection 2025',
            description: 'Discover the latest trends and styles',
            buttonText: 'Shop Now',
            buttonLink: 'pages/new-arrivals.html'
        },
        {
            bgImage: 'images/hero/summer-sale.jpg',
            title: 'Summer Sale',
            description: 'Up to 50% off on selected items',
            buttonText: 'Shop Sale',
            buttonLink: 'pages/sale.html'
        },
        {
            bgImage: 'images/hero/accessories.jpg',
            title: 'Complete Your Look',
            description: 'Explore our new accessories collection',
            buttonText: 'Shop Accessories',
            buttonLink: 'pages/accessories.html'
        }
    ];
    
    // Create slider HTML
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'hero-slider';
    
    // Add slides
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slideElement.style.backgroundImage = `url(${slide.bgImage})`;
        
        slideElement.innerHTML = `
            <div class="container">
                <div class="hero-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.description}</p>
                    <a href="${slide.buttonLink}" class="btn">${slide.buttonText}</a>
                </div>
            </div>
        `;
        
        sliderContainer.appendChild(slideElement);
    });
    
    // Add navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.slide = index;
        dotsContainer.appendChild(dot);
    });
    
    sliderContainer.appendChild(dotsContainer);
    
    // Replace existing hero content with slider
    heroSection.innerHTML = '';
    heroSection.appendChild(sliderContainer);
    
    // Add click events to dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide);
            goToSlide(slideIndex);
        });
    });
    
    // Automatic sliding
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function goToSlide(index) {
        // Update current slide
        document.querySelector('.hero-slide.active').classList.remove('active');
        document.querySelector(`.hero-slide:nth-child(${index + 1})`).classList.add('active');
        
        // Update dots
        document.querySelector('.slider-dot.active').classList.remove('active');
        document.querySelector(`.slider-dot:nth-child(${index + 1})`).classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    
    // Start auto-sliding
    const slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        setInterval(nextSlide, 5000);
    });
}

// Show notification helper
function showNotification(message) {
    // Check if notification already exists
    let notification = document.querySelector('.notification');
    
    if (notification) {
        // Update existing notification
        notification.textContent = message;
        
        // Restart animation
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    } else {
        // Create new notification
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}