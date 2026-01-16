# Restaurant Billing Website

A complete restaurant billing system built with HTML, CSS, and JavaScript. Features menu management, cart functionality, billing, and sales reporting.

## Features

- **Menu Display**: View all menu items with images, names, and prices
- **Shopping Cart**: Add items to cart, adjust quantities, view total
- **Billing**: Pay now, print bills, clear cart
- **Menu Management**: Full CRUD operations (Create, Read, Update, Delete) for menu items
- **Sales Reports**: Monthly sales reports with:
  - Total revenue and order count
  - Item-wise sales breakdown
  - Date-wise sales breakdown

## Setup Instructions

1. **Download/Clone the project** to your local machine

2. **Add Menu Item Images** (Optional):
   - Place menu item images in the `images/` folder
   - Recommended image names:
     - `chicken-rice.jpg`
     - `chicken-65.jpg`
     - `egg-rice.jpg`
     - `normal-soup.jpg`
     - `egg-soup.jpg`
     - `mutton-leg-soup.jpg`
     - `egg-fry.jpg`
   - If images are not available, the system will use placeholder images
   - You can also use image URLs in the "Manage Menu" section

3. **Open the Website**:
   - Simply open `index.html` in your web browser
   - No server setup required - works directly in the browser

## Usage

### Viewing Menu
- Click on "Menu" tab to view all available items
- Click "Add to Cart" button on any item to add it to your cart

### Cart Operations
- Click the cart icon (🛒) in the bottom right to open the cart
- Use +/- buttons to adjust item quantities
- Click "Pay Now" to complete the transaction
- Click "Print Bill" to generate and print a bill
- Click "Clear Cart" to remove all items

### Managing Menu
- Click "Manage Menu" tab
- **Add Item**: Fill in the form (name, price, image URL) and click "Add Item"
- **Edit Item**: Click "Edit" button on any item, modify the form, and click "Update Item"
- **Delete Item**: Click "Delete" button on any item and confirm

### Sales Reports
- Click "Sales Report" tab
- Select start and end dates (defaults to current month)
- Click "Generate Report" to view:
  - Total revenue and orders
  - Item-wise sales statistics
  - Date-wise breakdown

## Default Menu Items

The system comes pre-loaded with:
- Chicken Rice (₹150)
- Chicken 65 (₹200)
- Egg Rice (₹100)
- Normal Soup (₹80)
- Egg Soup (₹90)
- Mutton leg Soup (₹250)
- Egg Fry (₹120)

## Data Storage

All data is stored in browser's localStorage:
- Menu items persist across sessions
- Sales history is saved for reporting
- Cart state is maintained

**Note**: Data is stored locally in your browser. Clearing browser data will remove all stored information.

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Edge
- Safari

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── script.js           # Application logic
├── images/             # Menu item images folder
└── README.md           # This file
```

## Customization

- **Restaurant Name**: Edit the logo text in `index.html` (line with "Restaurant Billing")
- **Colors**: Modify CSS variables in `styles.css` (`:root` section)
- **Currency**: Currently uses ₹ (INR). To change, search and replace "₹" in `script.js` and `index.html`

## Support

For issues or questions, please check the code comments in `script.js` for detailed function descriptions.
