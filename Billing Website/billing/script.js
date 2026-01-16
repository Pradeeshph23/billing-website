// Data Models
let menu = [];
let cart = [];
let salesHistory = [];

// Initialize App
function initApp() {
    loadMenuFromStorage();
    if (menu.length === 0) {
        initializeDefaultMenu();
    }
    loadCartFromStorage();
    loadSalesHistoryFromStorage();
    
    setupEventListeners();
    showSection('menu');
    loadMenu();
    updateCartDisplay();
    updateCartCount();
}

// Initialize Default Menu
function initializeDefaultMenu() {
    const defaultMenu = [
        { id: 1, name: 'Chicken Rice', price: 120, image: 'https://www.kannammacooks.com/wp-content/uploads/street-style-chicken-rice-recipe-1-3.jpg' },
        { id: 2, name: 'Chicken 65 (100g)', price: 50, image: 'https://myfoodstory.com/wp-content/uploads/2021/05/Chicken-65-Spicy-Crispy-3.jpg' },
        { id: 3, name: 'Egg Rice', price: 100, image: 'https://cjeatsrecipes.com/wp-content/uploads/2023/11/Egg-Fried-Rice-in-a-bowl.jpg' },
        { id: 4, name: 'Normal Soup', price: 50, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyU-kH7SnnT_iljcGgFeu7Ly6STlgo1n490A&s' },
        { id: 5, name: 'Egg Soup', price: 70, image: 'https://www.allrecipes.com/thmb/0fNGb9QzHwnDRAxk_ZwiSXgVakU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/173738-easy-egg-drop-soup-046-4x3-249ca24d05d64a77ba8c581e9c6df107.jpg' },
        { id: 6, name: 'Mutton leg Soup', price: 100, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa0txZasSXBGXqEz1DIMIWC3KYJ_ZGLg-5bQ&s' },
        { id: 7, name: 'Egg Fry (1 piece)', price: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8S_ae_wxXwMVFBmNyvL44_x19vtCZhoViQw&s' }
    ];
    menu = defaultMenu;
    saveMenuToStorage();
}

// LocalStorage Functions
function saveMenuToStorage() {
    localStorage.setItem('restaurantMenu', JSON.stringify(menu));
}

function loadMenuFromStorage() {
    const stored = localStorage.getItem('restaurantMenu');
    if (stored) {
        menu = JSON.parse(stored);
    }
}

function saveCartToStorage() {
    localStorage.setItem('currentCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('currentCart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

function saveSalesHistoryToStorage() {
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function loadSalesHistoryFromStorage() {
    const stored = localStorage.getItem('salesHistory');
    if (stored) {
        salesHistory = JSON.parse(stored);
    }
}

// Navigation
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            showSection(section);
        });
    });

    // Cart toggle
    document.getElementById('cart-toggle-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);

    // Cart actions
    document.getElementById('pay-now-btn').addEventListener('click', payNow);
    document.getElementById('print-bill-btn').addEventListener('click', printBill);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

    // Menu form
    document.getElementById('menu-form').addEventListener('submit', handleMenuFormSubmit);
    document.getElementById('cancel-btn').addEventListener('click', resetMenuForm);

    // Sales report
    document.getElementById('generate-report-btn').addEventListener('click', generateSalesReport);

    // Bill modal
    document.getElementById('close-bill-btn').addEventListener('click', closeBillModal);
    document.getElementById('close-bill-modal-btn').addEventListener('click', closeBillModal);
    document.getElementById('print-bill-modal-btn').addEventListener('click', () => {
        window.print();
    });

    // Set default dates for sales report
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('start-date').value = formatDateForInput(firstDay);
    document.getElementById('end-date').value = formatDateForInput(lastDay);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }

    // Activate corresponding tab
    const tab = document.querySelector(`[data-section="${sectionName}"]`);
    if (tab) {
        tab.classList.add('active');
    }

    // Load section-specific content
    if (sectionName === 'manage-menu') {
        loadManageMenu();
    } else if (sectionName === 'sales-report') {
        // Sales report will be generated on button click
    }
}

// Menu Display
function loadMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    if (menu.length === 0) {
        menuGrid.innerHTML = '<p>No menu items available. Add items in Manage Menu.</p>';
        return;
    }

    menu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/250x200?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}" 
                 class="menu-item-image"
                 onerror="this.src='https://via.placeholder.com/250x200?text=' + encodeURIComponent('${item.name}')">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Cart Functions
function addToCart(itemId) {
    const item = menu.find(m => m.id === itemId);
    if (!item) return;

    const existingItem = cart.find(c => c.itemId === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    updateCartCount();
    showMessage('Item added to cart!', 'success');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.itemId}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.itemId}, 1)">+</button>
            </div>
            <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItems.appendChild(cartItem);
    });

    const total = calculateTotal();
    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(itemId, change) {
    const item = cart.find(c => c.itemId === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(c => c.itemId !== itemId);
    }

    saveCartToStorage();
    updateCartDisplay();
    updateCartCount();
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function clearCart() {
    if (cart.length === 0) {
        showMessage('Cart is already empty!', 'error');
        return;
    }

    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        updateCartCount();
        showMessage('Cart cleared!', 'success');
    }
}

// Billing Functions
function payNow() {
    if (cart.length === 0) {
        showMessage('Cart is empty!', 'error');
        return;
    }

    const sale = {
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: calculateTotal()
    };

    salesHistory.push(sale);
    saveSalesHistoryToStorage();

    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    updateCartCount();
    toggleCart();

    showMessage('Payment successful! Sale recorded.', 'success');
}

function printBill() {
    if (cart.length === 0) {
        showMessage('Cart is empty!', 'error');
        return;
    }

    const billBody = document.getElementById('bill-body');
    const total = calculateTotal();
    const now = new Date();

    billBody.innerHTML = `
        <div class="bill-info">
            <h2>Thirumal & Co</h2>
            <p>Date: ${formatDate(now)}</p>
            <p>Time: ${formatTime(now)}</p>
        </div>
        <div class="bill-items">
            ${cart.map(item => `
                <div class="bill-item">
                    <div>
                        <strong>${item.name}</strong> x ${item.quantity}
                    </div>
                    <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
        <div class="bill-total">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #7f8c8d;">
            <p>Thank you for your visit!</p>
        </div>
    `;

    document.getElementById('bill-modal').classList.add('show');
}

function closeBillModal() {
    document.getElementById('bill-modal').classList.remove('show');
}

// Manage Menu Functions
function loadManageMenu() {
    const tableBody = document.getElementById('menu-table-body');
    tableBody.innerHTML = '';

    if (menu.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No menu items. Add your first item above.</td></tr>';
        return;
    }

    menu.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${item.image || 'https://via.placeholder.com/60x60?text=' + encodeURIComponent(item.name)}" 
                     alt="${item.name}"
                     onerror="this.src='https://via.placeholder.com/60x60?text=' + encodeURIComponent('${item.name}')">
            </td>
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="editMenuItem(${item.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteMenuItem(${item.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function handleMenuFormSubmit(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const image = document.getElementById('item-image').value;

    if (itemId) {
        updateMenuItem(parseInt(itemId), name, price, image);
    } else {
        addMenuItem(name, price, image);
    }

    resetMenuForm();
}

function addMenuItem(name, price, image) {
    const newId = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;
    const newItem = {
        id: newId,
        name: name,
        price: price,
        image: image || ''
    };
    menu.push(newItem);
    saveMenuToStorage();
    loadMenu();
    loadManageMenu();
    showMessage('Menu item added successfully!', 'success');
}

function editMenuItem(id) {
    const item = menu.find(m => m.id === id);
    if (!item) return;

    document.getElementById('item-id').value = item.id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('submit-btn').textContent = 'Update Item';
    document.getElementById('cancel-btn').style.display = 'block';

    // Scroll to form
    document.querySelector('.menu-form-container').scrollIntoView({ behavior: 'smooth' });
}

function updateMenuItem(id, name, price, image) {
    const item = menu.find(m => m.id === id);
    if (!item) return;

    item.name = name;
    item.price = price;
    item.image = image || '';
    
    saveMenuToStorage();
    loadMenu();
    loadManageMenu();
    showMessage('Menu item updated successfully!', 'success');
}

function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }

    menu = menu.filter(m => m.id !== id);
    saveMenuToStorage();
    loadMenu();
    loadManageMenu();
    showMessage('Menu item deleted successfully!', 'success');
}

function resetMenuForm() {
    document.getElementById('menu-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('submit-btn').textContent = 'Add Item';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Sales Report Functions
function generateSalesReport() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    endDate.setHours(23, 59, 59, 999); // Include full end date

    if (startDate > endDate) {
        showMessage('Start date must be before end date!', 'error');
        return;
    }

    const filteredSales = salesHistory.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
    });

    if (filteredSales.length === 0) {
        document.getElementById('report-results').style.display = 'none';
        showMessage('No sales found for the selected date range!', 'error');
        return;
    }

    // Calculate totals
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;

    // Item-wise breakdown
    const itemWise = {};
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            if (!itemWise[item.name]) {
                itemWise[item.name] = { quantity: 0, revenue: 0 };
            }
            itemWise[item.name].quantity += item.quantity;
            itemWise[item.name].revenue += item.price * item.quantity;
        });
    });

    // Date-wise breakdown
    const dateWise = {};
    filteredSales.forEach(sale => {
        const date = formatDate(new Date(sale.date));
        if (!dateWise[date]) {
            dateWise[date] = { orders: 0, revenue: 0 };
        }
        dateWise[date].orders += 1;
        dateWise[date].revenue += sale.total;
    });

    // Display results
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('total-orders').textContent = totalOrders;

    // Item-wise table
    const itemWiseBody = document.getElementById('item-wise-body');
    itemWiseBody.innerHTML = '';
    Object.entries(itemWise)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .forEach(([name, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>${data.quantity}</td>
                <td>₹${data.revenue.toFixed(2)}</td>
            `;
            itemWiseBody.appendChild(row);
        });

    // Date-wise table
    const dateWiseBody = document.getElementById('date-wise-body');
    dateWiseBody.innerHTML = '';
    Object.entries(dateWise)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .forEach(([date, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${data.orders}</td>
                <td>₹${data.revenue.toFixed(2)}</td>
            `;
            dateWiseBody.appendChild(row);
        });

    document.getElementById('report-results').style.display = 'block';
}

// Utility Functions
function formatDate(date) {
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showMessage(message, type = 'success') {
    const toast = document.getElementById('message-toast');
    toast.textContent = message;
    toast.className = `message-toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
