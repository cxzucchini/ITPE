// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    loadCartItems();
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Process the order
                processOrder();
            }
        });
    }

    // Function to load cart items in the checkout page
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const checkoutItemsContainer = document.getElementById('checkout-items');
        
        if (checkoutItemsContainer) {
            if (cartItems.length === 0) {
                checkoutItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                document.querySelector('.place-order-btn').disabled = true;
                updateOrderSummary(0, 0);
                return;
            }
            
            checkoutItemsContainer.innerHTML = '';
            let subtotal = 0;
            
            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'checkout-item';
                itemElement.innerHTML = `
                    <div class="item-info">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Size: ${item.size}</p>
                            <p>Qty: ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                
                checkoutItemsContainer.appendChild(itemElement);
            });
            
            // Calculate shipping
            const shipping = subtotal > 100 ? 0 : 10;
            
            // Update order summary
            updateOrderSummary(subtotal, shipping);
        }
    }

    // Update order summary totals
    function updateOrderSummary(subtotal, shipping) {
        const subtotalElement = document.getElementById('subtotal-amount');
        const shippingElement = document.getElementById('shipping-amount');
        const totalElement = document.getElementById('total-amount');
        
        if (subtotalElement && shippingElement && totalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${(subtotal + shipping).toFixed(2)}`;
        }
    }

    // Form validation
    function validateForm() {
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                isValid = false;
            } else {
                field.classList.remove('invalid');
            }
        });
        
        // Credit card validation if selected
        if (document.getElementById('credit-card').checked) {
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            
            // Basic validation - would be more robust in production
            if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
                document.getElementById('card-number').classList.add('invalid');
                isValid = false;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                document.getElementById('expiry').classList.add('invalid');
                isValid = false;
            }
            
            if (!/^\d{3,4}$/.test(cvv)) {
                document.getElementById('cvv').classList.add('invalid');
                isValid = false;
            }
        }
        
        // Terms checkbox
        if (!document.getElementById('terms').checked) {
            document.getElementById('terms').parentNode.classList.add('invalid');
            isValid = false;
        } else {
            document.getElementById('terms').parentNode.classList.remove('invalid');
        }
        
        if (!isValid) {
            showNotification('Please fill in all required fields correctly', 'error');
        }
        
        return isValid;
    }

    // Process the order
    function processOrder() {
        // In a real app, this would send data to a server
        showNotification('Processing your order...', 'info');
        
        // Simulate server processing
        setTimeout(() => {
            // Get form data
            const formData = new FormData(document.getElementById('checkout-form'));
            const orderData = {
                customer: {
                    name: formData.get('full-name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                shipping: {
                    address: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    zip: formData.get('zip'),
                    country: formData.get('country')
                },
                payment: {
                    method: document.querySelector('input[name="payment-method"]:checked').value,
                    cardDetails: document.getElementById('credit-card').checked ? {
                        number: document.getElementById('card-number').value,
                        expiry: document.getElementById('expiry').value,
                        cvv: document.getElementById('cvv').value
                    } : null
                },
                items: JSON.parse(localStorage.getItem('cart')) || [],
                orderTotal: parseFloat(document.getElementById('total-amount').textContent.replace('$', ''))
            };
            
            // For demo purposes - log the order data
            console.log('Order placed:', orderData);
            
            // Show success message
            showNotification('Order placed successfully! Thank you for your purchase.', 'success');
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to confirmation page after a delay
            setTimeout(() => {
                window.location.href = 'order-confirmation.html?order=' + generateOrderId();
            }, 2000);
        }, 1500);
    }
    
    // Generate a random order ID
    function generateOrderId() {
        return 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    // Show notification to user
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Handle payment method selection to show/hide relevant fields
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const creditCardFields = document.getElementById('credit-card-fields');
            if (document.getElementById('credit-card').checked) {
                creditCardFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'none';
            }
        });
    });
    
    // Format credit card number with spaces
    document.getElementById('card-number')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue.slice(0, 19); // Limit to 16 digits + 3 spaces
    });
    
    // Format expiry date (MM/YY)
    document.getElementById('expiry')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                e.target.value = value;
            } else {
                e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
        }
    });
});