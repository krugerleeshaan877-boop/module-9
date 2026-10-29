
import { getAllData } from "../../db/db.js";

// Store all food products loaded from Firestore so they can be reused for filtering.
let allProducts = [];

// Get a field even if its name contains extra spaces
function getField(product, fieldName) {
    // Find the field name without considering extra spaces or capitalisation.
    const key = Object.keys(product).find(
        (key) =>
            key.trim().toLowerCase() === fieldName.trim().toLowerCase()
    );

    // Return the field value if the field exists; otherwise return undefined.
    return key ? product[key] : undefined;
}

// Load food products from Firestore
async function displayProducts() {
    // Find the HTML container where the food products will be displayed.
    const container = document.querySelector("#products-container");

    // Stop if the products container cannot be found.
    if (!container) {
        console.error("Products container not found.");
        return;
    }

    // Show a loading message while retrieving food products.
    container.textContent = "Loading food products...";

    try {
        // Retrieve all food products from the Firestore food collection.
        const products = await getAllData("food");

        // Make sure the retrieved data is stored as an array.
        allProducts = Array.isArray(products) ? products : [];

        // Display the products and activate the category filters.
        renderProducts(allProducts);
        setupFoodFilters();

    } catch (error) {
        // Display an error in the console and inform the user if loading fails.
        console.error("Error loading food products:", error);
        container.textContent =
            "Unable to load food products. Please try again.";
    }
}

// Display products, including the selected category
function renderProducts(products) {
    // Find the container where the product cards will appear.
    const container = document.querySelector("#products-container");

    // Stop if the container does not exist.
    if (!container) return;

    // Clear the previous products before displaying the new results.
    container.replaceChildren();

    // Show a message if no food matches the filter
    if (products.length === 0) {
        const message = document.createElement("p");
        message.className = "no-products";
        message.textContent =
            "Sorry, this type of food is currently not available.";

        // Add the message to the products container.
        container.appendChild(message);

        // Refresh the cart button and stop displaying products.
        updateCartButton();
        return;
    }

    // Loop through every product and create its display card.
    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "card";

        // Retrieve the meal name or use a default name if it is missing.
        const mealName =
            getField(product, "mealName") || "Unnamed meal";

        // Convert the meal price into a number, using zero if invalid.
        const price = Number(getField(product, "price")) || 0;

        // Build the path to the food image stored in the images folder.
        const imagePath =
            "../../../images/" +
            (getField(product, "product-image") || "");

        // Product image
        const image = document.createElement("img");
        image.className = "product-image";
        image.src = imagePath;

        // Use the meal name as alternative text for accessibility.
        image.alt = mealName;

        // Display a fallback logo if the food image cannot load.
        image.onerror = () => {
            image.onerror = null;
            image.src = "images/logo.png";
        };

        // Product name
        const title = document.createElement("h3");
        title.textContent = mealName;

        // Product category
        const category = document.createElement("p");

        // Display the category or a default description if missing.
        category.textContent =
            getField(product, "category") ||
            "South African favourites";

        // Product price
        const priceElement = document.createElement("p");
        priceElement.className = "product-price";

        // Display the price in South African rand with two decimal places.
        priceElement.textContent = `R${price.toFixed(2)}`;
        
        // Add to cart button
        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-to-cart";
        button.textContent = "Add to Cart";

        // Run the following logic when the customer clicks Add to Cart.
        button.addEventListener("click", () => {
            try {
                // Retrieve the saved cart from localStorage or start with an empty cart.
                const cart = JSON.parse(
                    localStorage.getItem("foodDashCart") || "[]"
                );

                // Check whether the selected meal is already in the cart.
                const existingItem = cart.find(
                    (item) => item.id === product.id
                );

                if (existingItem) {
                    // Increase the quantity if the meal is already in the cart.
                    existingItem.quantity += 1;
                } else {
                    // Add the meal and its details to the cart with quantity one.
                    cart.push({
                        id: product.id,
                        mealName,
                        price,
                        image: imagePath,
                        quantity: 1
                    });
                }

                // Save the updated cart in the browser's local storage.
                localStorage.setItem(
                    "foodDashCart",
                    JSON.stringify(cart)
                );

                // Refresh the cart total and show that the meal was added.
                updateCartButton();
                button.textContent = "Added ✓";

            } catch (error) {
                // Report errors if the cart cannot be updated.
                console.error("Could not update cart:", error);
                button.textContent = "Cart unavailable";
            }
        });

        // Place the image, name, category, price and button inside the card.
        card.append(
            image,
            title,
            category,
            priceElement,
            button
        );

        // Add the completed product card to the webpage.
        container.appendChild(card);
    });

    // Update the cart total after displaying the products.
    updateCartButton();
}

// Set up the food category filters
function setupFoodFilters() {
    // Find all category elements inside the food categories section.
    const categories = document.querySelectorAll(
        "#foodCategories .category"
    );

    // Warn the developer if the category elements cannot be found.
    if (categories.length === 0) {
        console.warn(
            "Food categories not found. Check the foodCategories HTML ID."
        );
        return;
    }

    // Add selection functionality to each food category.
    categories.forEach((categoryElement) => {
        function selectCategory() {
            // Read the selected category and standardise its text.
            const selectedCategory = (
                categoryElement.dataset.category || ""
            ).trim().toLowerCase();

            // Highlight the selected category by removing other active states.
            categories.forEach((category) => {
                category.classList.remove("active");
            });

            categoryElement.classList.add("active");

            // Show all products when the All category is selected.
            if (selectedCategory === "all") {
                renderProducts(allProducts);
                return;
            }

            // Filter the stored products to match the selected category.
            const filteredProducts = allProducts.filter((product) => {
                const productCategory = String(
                    getField(product, "category") || ""
                ).trim().toLowerCase();

                return productCategory === selectedCategory;
            });

            // Display only the products matching the selected category.
            renderProducts(filteredProducts);
        }

        // Run the category filter when the customer clicks a category.
        categoryElement.addEventListener("click", selectCategory);

        // Allow keyboard users to select a category using Enter or Space.
        categoryElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectCategory();
            }
        });
    });
}

// Update the cart total in the navigation bar
function updateCartButton() {
    // Find the cart button in the navigation bar.
    const cartButton = document.querySelector(".cart-button");

    // Stop if the cart button is not present on the page.
    if (!cartButton) return;

    try {
        // Retrieve the cart information saved in localStorage.
        const cart = JSON.parse(
            localStorage.getItem("foodDashCart") || "[]"
        );

        // Find the cart button again and attach navigation to the cart page.
        const cartButton = document.querySelector(".cart-button");

if (cartButton) {
    // Open cart.html when the cart button is clicked.
    cartButton.addEventListener("click", () => {
        window.location.href = "./cart.html";
    });
}
        // Calculate the total price of all meals using price and quantity.
        const total = cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );

        // Calculate the total number of items in the cart.
        const count = cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

        // Display the cart item count and total price in the navigation bar.
        cartButton.textContent =
            `🛒 ${count} items · R${total.toFixed(2)}`;

    } catch (error) {
        // Report errors if the cart total cannot be displayed.
        console.error("Could not display cart total:", error);
    }
}

// Start the homepage by loading the food products.
displayProducts();

// Save the cart information in localStorage.
localStorage.setItem(
    "foodDashCart",
    JSON.stringify(cart)
);

// Add food to the shopping cart
function addToCart(product) {
    // Retrieve the saved cart or create an empty array.
    let cart = JSON.parse(localStorage.getItem("foodDashCart")) || [];

    // Check whether the same meal name already exists in the cart.
    const existingItem = cart.find(
        item => item.mealName === product.mealName
    );

    if (existingItem) {
        // Increase the quantity if the meal already exists.
        existingItem.quantity += 1;
    } else {
        // Add the meal details to the cart with an initial quantity of one.
        cart.push({
            mealName: product.mealName,
            price: Number(product.price),
            image: product.image || "images/logo.png",
            quantity: 1
        });
    }

    // Save the updated shopping cart in localStorage.
    localStorage.setItem("foodDashCart", JSON.stringify(cart));

    // Notify the customer that the meal was added successfully.
    alert(`${product.mealName} added to your cart!`);
}
