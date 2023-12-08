function refreshTime() {
    const timeDisplay = document.getElementsByClassName("local-time");
    const dateString = new Date().toLocaleString();
    const formattedString = dateString.replace(", ", " - ");
    timeDisplay[0].innerHTML = "Local time: " + formattedString;
}
refreshTime();
setInterval(refreshTime, 1000);
const userinfo = {
    username: "ccc",
    userId: "3"
}
let userType = ""
let transactionInfo = { id: "", valid: false };
// init login form
function initLoginForm() {
    // form div
    let formDiv = document.createElement("div")
    formDiv.id = "login-form-div"
    // username label
    let labelForUsername = document.createElement("label")
    labelForUsername.textContent = "Username"
    // username input
    let inputUsername = document.createElement("input")
    inputUsername.type = "text"
    // password label
    let labelForPassword = document.createElement("label")
    labelForPassword.textContent = "Password"
    // password input
    let inputPassword = document.createElement("input")
    inputPassword.type = "password"
    // Login button
    let loginButton = document.createElement("input")
    loginButton.type = "submit"
    loginButton.value = "Login"
    loginButton.addEventListener("click", () => {
        let username = inputUsername.value
        let password = inputPassword.value
        loginRequest(username, password)
    })
    // add register
    let registerButton = document.createElement("input")
    registerButton.type = "submit"
    registerButton.value = "Register"
    registerButton.addEventListener("click", () => initRegister())
    // add into formDiv
    formDiv.appendChild(labelForUsername)
    formDiv.appendChild(inputUsername)
    formDiv.appendChild(labelForPassword)
    formDiv.appendChild(inputPassword)
    formDiv.appendChild(loginButton)
    formDiv.appendChild(registerButton)
    formDiv.style.float = "right"
    // add to html
    document.getElementById("welcome-p").after(formDiv)
}
initLoginForm()
function loginRequest(username, password) {
    // Create an object with the data to send
    let requestData = {
        username: username,
        password: password
    };

    // Use fetch to send a POST request to login.php
    fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            // Check the success key in the response JSON
            if (data.success === true) {
                // Display usertype in the alert
                alert("Login successfully! User Type: " + data.usertype);
                initLoginedUser(username)
                userType = data.usertype
            } else {
                // login failed
                alert("Login failed. " + data.error);
            }
        })
        .catch(error => {
            console.error('Error during login request:', error);
            // Handle other errors, if any
            alert("An error occurred. Please try again later.");
        });
}
function initLoginedUser(username) {
    storeUserInfo(username)
    let welcomeUserLabel = document.createElement("label")
    welcomeUserLabel.textContent = "You logined as: " + username
    welcomeUserLabel.style.color = "white"
    welcomeUserLabel.style.float = "right"
    welcomeUserLabel.style.fontWeight = "bold"
    // Remove login form and dispaly username
    let formDiv = document.getElementById("login-form-div")
    formDiv.remove()
    document.getElementById("welcome-p").after(welcomeUserLabel)
}
function storeUserInfo(username) {
    // Create the URL with the username parameter
    const url = `getUserInfo.php?username=${encodeURIComponent(username)}`;

    // Send a GET request to getUserInfo.php
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Check if the response is successful and contains userId
            if (data.success === true && data.userId !== undefined) {
                userinfo.username = username;
                userinfo.userId = data.userId;
                console.log('User information stored:', userinfo);
            } else {
                console.error('Failed to retrieve user information.');
            }
        })
        .catch(error => {
            console.error('Error during user information retrieval:', error);
        });
}

function submitContactInfo() {
    let firstname = document.getElementById("contact-first-name").value;
    let lastname = document.getElementById("contact-last-name").value;
    let phone = document.getElementById("contact-phone-number").value;
    let email = document.getElementById("contact-email-addr").value;
    let form_gender = document.getElementById("contact-gender-form");
    let gender_check_male = document.getElementById("gender-male-radio-btn").checked;
    let gender_check_female = document.getElementById("gender-female-radio-btn").checked;
    let comment = document.getElementById("contact-comment").value;
    //invalid prompt
    let prompt = "Information is not valid. Requirements: "
    //check flag
    let check_flag = true;
    //check firstname
    if (firstname[0] < 'A' || firstname[0] > 'Z') {
        check_flag = false;
        prompt = prompt.concat("•", "The first letter of first name should be capital;")
    }
    if (!isAlphabetic(firstname)) {
        check_flag = false;
        prompt = prompt.concat("•", "The first name should be alphabetic only;")
    }
    //check lastname
    if (lastname[0] < 'A' || lastname[0] > 'Z') {
        check_flag = false;
        prompt = prompt.concat("•", "The first letter of last name should be capital;")
    }
    if (!isAlphabetic(lastname)) {
        check_flag = false;
        prompt = prompt.concat("•", "The last name should be alphabetic only;")
    }
    if (firstname == lastname) {
        check_flag = false;
        prompt = prompt.concat("•", "The first name and the last name can not be the same;")
    }

    //check phone number
    if (!phone.match(/^\(\d{3}\)\d{3}-\d{4}$/)) {
        check_flag = false;
        prompt = prompt.concat("•", "Wrong phone number format( eg.(123)456-7890 )")

    }
    //check email
    if (!checkEmail(email)) {
        check_flag = false;
        prompt = prompt.concat("•", "Wrong email format( eg. abc@amail.com );")
    }
    //check gender select
    if (!gender_check_male && !gender_check_female) {
        check_flag = false;
        prompt = prompt.concat("•", "Gender must be selected;")
    }
    //check comment 
    if (comment.length <= 9) {
        check_flag = false;
        prompt = prompt.concat("•", "The comment must be at least 10 characters;")
    }

    if (check_flag) {
        alert("Information is valid. Submit successfullt!")
    } else {
        alert(prompt);
    }
}

function isAlphabetic(str) {
    return str.match(/^[a-zA-Z]+$/) !== null;
}

function checkEmail(email) {
    let atSymbol = email.indexOf('@');
    let dot = email.indexOf('.');
    if (atSymbol < 1 || dot < atSymbol + 2 || dot + 2 >= email.length) {
        return false;
    }
    return true;
}

// onClick for fresh products side nav
// 1 shop all

// CartItem class
class CartItem {
    // name, amount, price for each item and price for all items
    constructor(name, amount, price) {
        //name
        this.name = name
        this.pname = document.createElement('p')
        this.pname.textContent = name
        //amount
        this.amount = amount
        this.pamount = document.createElement('p')
        this.pamount.textContent = this.amount
        this.pamount.style = "margin:auto;"
        //price
        this.price = Number(price * amount).toFixed(2)
        this.pprice = document.createElement('p')
        this.pprice.textContent = price
        this.pprice.style = "position: absolute;right: 10px;"
    }
    render() {
        const div = document.createElement('div')
        div.style = "display: flex;flex-direction: row;border:dotted;width:100%;flow:left;"
        div.append(this.pname)
        div.append(this.pamount)
        div.append(this.pprice)
        return div
    }
}
// CartItems class
class CartItems {
    constructor() {
        this.cartItems = []
    }
    newCartItem(name, amount, price) {
        let i = new CartItem(name, amount, price)
        this.cartItems.push(i)
    }
    get allCartItems() {
        return this.cartItems
    }
    get numberOfCartItems() {
        return this.cartItems.length
    }
    get priceForAll() {
        let sum = 0;
        for (let i = 0; i < this.numberOfCartItems; i++) {
            sum += this.cartItems[i].price * 100; // Assume price is in cents
        }
        return (sum / 100).toFixed(2); // Convert sum back to dollars and round to 2 decimal places
    }
}
let cartItems = new CartItems()
// Item class
class Item {
    constructor(itemNumber, department, category, name, imgsrc, price, inventory) {
        // ItemNumber
        this.itemNumber = itemNumber
        //department
        this.department = department
        // inventory
        this.inventory = inventory
        // category
        this.category = category
        // img
        this.picture = new Image()
        this.picture.src = imgsrc;
        // amount input
        this.amountInput = document.createElement("input")
        this.amountInput.type = "number"
        this.amountInput.value = 1
        // price
        this.price = price
        this.pprice = document.createElement('p')
        let dollorSign = document.createElement('p')
        dollorSign.style = ""
        this.pprice.textContent = "$" + price
        // name
        this.pname = document.createElement('p')
        // this.pname.textContent = name
        this.name = getImageName(imgsrc)
        this.pname.textContent = getImageName(imgsrc)
        this.pname.style = "font-weight:700"
        // button
        this.button = document.createElement('button')
        this.button.textContent = "Add to cart"
        this.button.style = "background-color: #0071ce;color:white;bolder:none;border-radius:5px;font-size:20px;width:fit-content;"
        this.button.addEventListener("mouseover", function (event) {
            event.target.style.backgroundColor = "#005194";
        }, false);
        this.button.addEventListener("mouseleave", function (event) {
            event.target.style.backgroundColor = "#0071ce";
        }, false);
        this.button.addEventListener("click", () => {
            this.addItemToCart(this.itemNumber, this.department, this.name, this.amountInput.value, this.price)
        })
    }
    render() {
        const div = document.createElement('div')
        div.style = "display: flex;flex-direction: column;border:dotted;width:200px;flow:left;"
        div.append(this.picture)
        div.append(this.amountInput)
        div.append(this.button)
        div.append(this.pprice)
        div.append(this.pname)
        return div
    }
    get amountLeft() {
        return this.inventory
    }

    addItemToCart(itemNumber, department, itemName, itemAmount, unitPrice) {
        if (!transactionInfo.valid) {
            // Fetch to get the current max transaction id
            fetch('http://localhost:8080/wpl-frontend-as5/getMaxTransactionId.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success === true && data.maxTransactionId !== undefined) {
                        transactionInfo.id = parseInt(data.maxTransactionId) + 1;
                        transactionInfo.valid = true;
                        this.addToCartWithTransactionId(itemNumber, department, itemName, itemAmount, unitPrice, transactionInfo.id);
                    } else {
                        alert('Failed to retrieve transaction information.');
                    }
                })
                .catch(error => console.error('Error fetching max transaction id:', error));
        } else {
            this.addToCartWithTransactionId(parseInt(itemNumber), department, itemName, parseInt(itemAmount), unitPrice, transactionInfo.id);
        }
    }

    addToCartWithTransactionId(itemNumber, department, itemName, itemAmount, unitPrice, transactionId) {
        // Fetch to update inventory, cart, and transaction tables
        var formData = new FormData();
        formData.append('itemNumber', itemNumber);
        formData.append('itemName', itemName);
        formData.append('itemAmount', itemAmount);
        formData.append('transactionId', transactionId);
        formData.append('userId', userinfo.userId);
        formData.append('unitPrice', unitPrice);
        fetch('http://localhost:8080/wpl-frontend-as5/addItemToCart.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    alert('Item added to cart! Inventory left: ' + data.inventory);
                    cartItems.newCartItem(this.pname.textContent, Number(this.amountInput.value), this.price);
                } else {
                    alert('Failed to update: ' + data.message);
                }
            })
            .catch(error => console.error('Error updating cart:', error));
    }

}
// Items class
class Items {
    constructor() {
        this.items = []
    }
    // eg. items.newItem("fresh_products", "new_items", "Beef Chuck Roast", "images/Beef-Chuck-Roast.png", 14.94, 5)
    newItem(itemNumber, department, category, name, picture, price, inventory) {
        let i = new Item(itemNumber, department, category, name, picture, price, inventory)
        this.items.push(i)
        return i
    }
    get allItems() {
        return this.items;
    }
    get numberOfItems() {
        return this.items.length
    }
    searchItem(department, nameFromInput) {
        let result = []
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].department === department && this.items[i].name.toLowerCase().includes(nameFromInput.toLowerCase())) {
                result.push(this.items[i])
            }
        }
        return result
    }
    numberOfSearchItem(department, nameFromInput) {
        let result = 0
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].department === department && this.items[i].name.toLowerCase().includes(nameFromInput.toLowerCase())) {
                result++
            }
        }
        return result
    }
    findItem(department, category) {
        let result = []
        if (category === "shop all") {
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].department === department) {
                    result.push(this.items[i])
                }
            }
            return result
        }
        if (department === "fresh_products" && category === "all fruits") {
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].department === department && this.items[i].category.includes("fruit")) {
                    result.push(this.items[i])
                }
            }
            return result
        }
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].department === department && this.items[i].category == category) {
                result.push(this.items[i])
            }
        }
        return result
    }
    numOfFindItem(department, category) {
        let result = 0
        if (category === "shop all") {
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].department === department) {
                    result++
                }
            }
            return result
        }
        if (department === "fresh_products" && category === "all fruits") {
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].department === department && this.items[i].category.includes("fruit")) {
                    result++
                }
            }
            return result
        }
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].department === department && this.items[i].category === category) {
                result++
            }
        }
        return result
    }
    specificCategoryOfItems(category) {
        let specItems = []
        if (category === "all") {
            return this.allItems
        }
        if (category === "all_fruits") {
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].category.includes("fruit")) {
                    specItems.push(this.items[i])
                }
            }
            return specItems
        }
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].category == category) {
                specItems.push(this.items[i])
            }
        }
        return specItems
    }
    numberOfSpecificItems(category) {
        if (category === "all") {
            return this.numberOfItems
        }
        if (category === "all_fruits") {
            let num = 0
            for (let i = 0; i < this.numberOfItems; i++) {
                if (this.items[i].category.includes("fruits")) {
                    num++
                }
            }
            return num
        }
        let num = 0
        for (let i = 0; i < this.numberOfItems; i++) {
            if (this.items[i].category == category) {
                num++
            }
        }
        return num

    }
}


let items = new Items()

function loadItemsByDatabase(items) {
    fetch('loadItems.php')
        .then(response => response.json())
        .then(data => {
            // Process the retrieved data and add items
            data.forEach(item => {
                // Convert numeric strings to numbers
                item.price = parseFloat(item.price);
                item.inventory = parseInt(item.inventory);

                // Add the item
                items.newItem(item.itemNumber, item.department, item.category, item.name, item.picture, item.price, item.inventory);
            });
        })
        .catch(error => console.error('Error loading items:', error));
}

loadItemsByDatabase(items)


function containsNumber(str) {
    return /\d/.test(str);
}



function switchToCart() {
    // Empty the side-content-div
    const sideContentDiv = document.getElementsByClassName("side-content-div")[0];
    emptyInternalElements(sideContentDiv);

    if (!transactionInfo.valid) {
        var headerForEmptyCart = document.createElement("h1");
        headerForEmptyCart.textContent = "Empty cart.";
        sideContentDiv.appendChild(headerForEmptyCart);
    } else {
        var transactionId = transactionInfo.id;
        var userId = userinfo.userId;

        // Create a FormData object
        var formData = new FormData();
        formData.append('userId', userId);
        formData.append('transactionId', transactionId);

        // Fetch data from getCart.php
        fetch('getCart.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayCartTable(data.cart);
                } else {
                    var headerForEmptyCart = document.createElement("h1");
                    headerForEmptyCart.textContent = "Empty cart.";
                    sideContentDiv.appendChild(headerForEmptyCart);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Function to display cart data in the table
function displayCartTable(cartData) {
    // Create a table element
    let cartTable = document.createElement("table");
    cartTable.id = "cartTable";
    cartTable.classList.add("table"); // Add Bootstrap table class for styling

    // Create the table head
    let tableHead = cartTable.createTHead();
    let headerRow = tableHead.insertRow();
    let headers = ["Item ID", "Category", "Subcategory", "Name", "Amount", "Unit Price"];

    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    let tableBody = cartTable.createTBody();

    // Populate the table with cart data
    cartData.forEach(item => {
        let row = tableBody.insertRow();
        let keys = Object.keys(item);

        keys.forEach(key => {
            let cell = row.insertCell();
            cell.textContent = item[key];
            cell.style.textAlign = "center";
        });
    });

    // Append the table to the side-content-div
    const sideContentDiv = document.getElementsByClassName("side-content-div")[0];
    sideContentDiv.style.flexDirection = "column"
    sideContentDiv.appendChild(cartTable);
    // Display Transaction ID
    let transactionIdLabel = document.createElement("label");
    transactionIdLabel.textContent = "Transaction ID: ";
    let transactionIdValue = document.createElement("span");
    transactionIdValue.textContent = transactionInfo.id;

    // Display Price for all items
    let priceForAllItemsLabel = document.createElement("label");
    priceForAllItemsLabel.textContent = "Price for all items: ";
    let totalPriceValue = document.createElement("span");
    totalPriceValue.textContent = calculateTotalPrice(cartData);

    // Create a div to hold the cart summary
    let cartSummaryDiv = document.createElement("div");
    cartSummaryDiv.appendChild(transactionIdLabel);
    cartSummaryDiv.appendChild(transactionIdValue);
    cartSummaryDiv.appendChild(document.createElement("br"));
    cartSummaryDiv.appendChild(priceForAllItemsLabel);
    cartSummaryDiv.appendChild(totalPriceValue);
    // Create a Shop button
    let shopButton = document.createElement("button");
    shopButton.textContent = "Shop all";
    shopButton.addEventListener("click", () => shopCart(transactionInfo.id));
    cartSummaryDiv.appendChild(document.createElement("br"));
    cartSummaryDiv.appendChild(shopButton);
    // Create a Cancel button
    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel all";
    cancelButton.addEventListener("click", () => {
        // Get the cart data from the table
        let cartData = getCartDataFromTable();

        // Extract item records from cart data
        let itemRecords = cartData.map(item => ({
            itemNumber: item["Item ID"],
            quantity: item["Amount"],
        }));

        // Call the cancelAllCart function with transactionId and itemRecords
        cancelAllCart(transactionInfo.id, itemRecords);
    });
    cartSummaryDiv.appendChild(document.createElement("br"));
    cartSummaryDiv.appendChild(cancelButton);
    // Append cartSummaryDiv into sideContentDiv
    sideContentDiv.appendChild(cartSummaryDiv);


}
function getCartDataFromTable() {
    // Get the cart table
    let cartTable = document.getElementById("cartTable");

    // Get the table body
    let tableBody = cartTable.tBodies[0];

    // Initialize an array to store cart data
    let cartData = [];

    // Iterate through rows in the table
    for (let i = 0; i < tableBody.rows.length; i++) {
        let row = tableBody.rows[i];

        // Create an object to store data for each row
        let rowData = {};

        // Iterate through cells in the row
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];
            let headerText = cartTable.tHead.rows[0].cells[j].textContent.trim();
            rowData[headerText] = cell.textContent.trim();
        }

        // Add the row data to the cartData array
        cartData.push(rowData);
    }

    return cartData;
}



function cancelAllCart(transactionId) {
    // Get cart data from the table
    let cartData = getCartDataFromTable();

    // Extract item IDs and quantities from the table
    let itemRecords = [];
    cartData.forEach(item => {
        let itemNumber = item["Item ID"];
        let quantity = item["Amount"];
        itemRecords.push({ itemNumber, quantity });
    });

    // Make a request to cancelAllCart.php with transactionId and itemRecords
    fetch('cancelAllCart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            transactionId: transactionId,
            itemRecords: itemRecords,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Cancel successful');
                transactionInfo.valid = false;
                switchToCart();
            } else {
                alert('Cancel failed');
            }
        })
        .catch(error => console.error('Error:', error));
}



// Function to handle shopping the cart
function shopCart(transactionId) {
    // Create a FormData object
    let formData = new FormData();
    formData.append('transactionId', transactionId);

    // Make a request to the PHP script to update cart status
    fetch('shopCart.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            // Display the message from the response
            alert(data.message);

            // Set transactionInfo.valid to false
            transactionInfo.valid = false;

            // Reload the page by calling switchToCart
            switchToCart();
        })
        .catch(error => {
            console.error('Error shopping cart:', error);
            // Handle error as needed
        });
}

// Function to calculate the total price of all items in the cart
function calculateTotalPrice(cartData) {
    let totalPrice = 0;
    cartData.forEach(item => {
        totalPrice += parseFloat(item.quantity) * parseFloat(item.unitprice);
    });
    return totalPrice.toFixed(2); // Display total price with two decimal places
}

const freshProductsCategoryList = [
    'shop all',
    'all vegetable',
    'all fruits',
    'pre-cut fruits',
    'flowers',
    'salsa and dips',
    'season produce',
    'new items',
    'rollbacks'
];
const frozenCategoryList = [
    'shop all',
    'frozen breakfast',
    'frozen dessert',
    'frozen meals',
    'frozen pizza',
    'frozen meat',
    'frozen snacks',
    'rollbacks'
];
const pantryCategoryList = [
    'shop all',
    'canned goods',
    'canned vegetable',
    'condiments',
    'peanut butter & spread',
    'pasta & pizza',
    'rollbacks'
];
const BreakfastAndCerealCategoryList = [
    'shop all',
    'the cereal shop',
    'pancakes & waffles',
    'breakfast breads',
    'oatmeal & grits',
    'rollbacks'
];
const bakingCategoryList = [
    'pie fillings',
    'crusts',
    'pudding mixes',
    'pie pans'
]
// fresh_products implement by js
document.getElementById("fresh_products").addEventListener("click", () => initiateSide("fresh_products", freshProductsCategoryList))

// frozen implement by jQuery
document.getElementById("frozen").addEventListener("click", () => initiateSideByJQuery("frozen_products", frozenCategoryList))
// frozen implement by js
// document.getElementById("frozen").addEventListener("click", () => initiateSide("frozen_products", frozenCategoryList))

document.getElementById("pantry").addEventListener("click", () => initiateSide("pantry", pantryCategoryList))

// BreakfastAndCereal implement by jQuery
document.getElementById("BreakfastAndCereal").addEventListener("click", () => initiateSideByJQuery("BreakfastAndCereal", BreakfastAndCerealCategoryList))
// document.getElementById("BreakfastAndCereal").addEventListener("click", () => initiateSide("BreakfastAndCereal", BreakfastAndCerealCategoryList))

document.getElementById("candy").addEventListener("click", () => initiateSearchBar("candy"))
// snack implement by jQuery
document.getElementById("snack").addEventListener("click", () => initiateSearchBar("snack"))
document.getElementById("Specialty shops").addEventListener("click", () => initiateSpecialOffer())
// baking implement by jQuery
document.getElementById("baking").addEventListener("click", () => initiateSideByJQuery("baking", bakingCategoryList))
// document.getElementById("baking").addEventListener("click", () => initiateSide("baking", bakingCategoryList))

document.getElementById("cart").addEventListener("click", () => switchToCart())

document.getElementById("my-account").addEventListener("click", () => initMyaccount())

// Function to initialize My Account page
function initMyaccount() {
    // remove before submit
    //display based on userType
    if (userType === "") {
        alert("Please login first.")
    } else if (userType === "admin") {
        initAdminMyAccount()
    } else if (userType === "customer") {
        initCustomerMyAccount()
    } else {
        alert("Error.")
    }

}
function initCustomerMyAccount() {
    const sideContentDiv = document.getElementsByClassName("side-content-div")[0];
    emptyInternalElements(sideContentDiv)
    sideContentDiv.style.flexDirection = "column"
    // Create transactionStatusDiv
    let transactionStatusDiv = document.createElement("div");
    transactionStatusDiv.id = "transactionStatusDiv"
    let transactionStatusHeader = document.createElement("h1");
    transactionStatusHeader.textContent = "Status of Transactions";

    // Create table for transaction status
    let transactionStatusTable = document.createElement("table");
    transactionStatusTable.id = "transactionStatusTable"; // Assign an ID for easier reference

    // Call a function to fetch and populate data into the table (assuming fetchTransactionStatusData is defined)
    fetchTransactionStatusData(transactionStatusTable);

    transactionStatusDiv.appendChild(transactionStatusHeader);
    transactionStatusDiv.appendChild(transactionStatusTable);
    sideContentDiv.appendChild(transactionStatusDiv);

    // Create itemsInEachTransaction div
    let itemsInEachTransactionDiv = document.createElement("div");
    let itemsInEachTransactionHeader = document.createElement("h1");
    itemsInEachTransactionHeader.textContent = "Items in Each Transaction";

    // Create table for items in each transaction
    let itemsInEachTransactionTable = document.createElement("table");
    itemsInEachTransactionTable.id = "itemsInEachTransactionTable"; // Assign an ID for easier reference

    // Call a function to fetch and populate data into the table (assuming fetchItemsInEachTransactionData is defined)
    fetchItemsInEachTransactionData(itemsInEachTransactionTable);

    itemsInEachTransactionDiv.appendChild(itemsInEachTransactionHeader);
    itemsInEachTransactionDiv.appendChild(itemsInEachTransactionTable);
    sideContentDiv.appendChild(itemsInEachTransactionDiv);

    const cancelTransactionDiv = document.createElement("div");

    // Create header
    let headerForCancelTransaction = document.createElement("h1");
    headerForCancelTransaction.textContent = "Cancel Transaction";
    cancelTransactionDiv.appendChild(headerForCancelTransaction);

    // Create input for transactionId
    let transactionIdInput = document.createElement("input");
    transactionIdInput.type = "number";
    transactionIdInput.placeholder = "Enter Transaction ID";
    cancelTransactionDiv.appendChild(transactionIdInput);

    // Create button to trigger the action
    let cancelTransactionButton = document.createElement("button");
    cancelTransactionButton.textContent = "Cancel Transaction";
    cancelTransactionButton.addEventListener("click", () => cancelTransaction(transactionIdInput.value));
    cancelTransactionDiv.appendChild(cancelTransactionButton);
    sideContentDiv.appendChild(cancelTransactionDiv)

    // Function to cancel transaction
    function cancelTransaction(transactionId) {
        // Make a request to the PHP script to cancel the transaction
        fetch('cancelTransaction.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                transactionId: transactionId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Transaction canceled successfully.');
                } else {
                    // Handle error case, for example, display a message
                    alert('Failed to cancel transaction: ' + data.message);
                }
            })
            .catch(error => {
                // Handle fetch error
                console.error('Error canceling transaction:', error);
            });
    }

    // Create div for periodTransactions
    var periodTransactionsDiv = document.createElement("div");
    periodTransactionsDiv.id = "periodTransactionsDiv";

    // Create header for periodTransactions
    var headerForPeriodTransactions = document.createElement("h1");
    headerForPeriodTransactions.textContent = "Transaction for period of time";
    periodTransactionsDiv.appendChild(headerForPeriodTransactions);

    // Create buttons for different periods
    var allTransactionsButton = document.createElement("button");
    allTransactionsButton.textContent = "See all transactions";
    allTransactionsButton.addEventListener("click", () => fetchTransactionsForPeriod('all'));
    periodTransactionsDiv.appendChild(allTransactionsButton);

    var specificMonthButton = document.createElement("button");
    specificMonthButton.textContent = "See transactions for a specific month";
    specificMonthButton.addEventListener("click", () => fetchTransactionsForPeriod('specificMonth'));
    periodTransactionsDiv.appendChild(specificMonthButton);

    var last3MonthsButton = document.createElement("button");
    last3MonthsButton.textContent = "See transactions for last 3 months";
    last3MonthsButton.addEventListener("click", () => fetchTransactionsForPeriod('last3Months'));
    periodTransactionsDiv.appendChild(last3MonthsButton);

    var specificYearButton = document.createElement("button");
    specificYearButton.textContent = "See transactions for a specific year";
    specificYearButton.addEventListener("click", () => fetchTransactionsForPeriod('specificYear'));
    periodTransactionsDiv.appendChild(specificYearButton);

    // Create a table for displaying transactions
    var transactionsTable = document.createElement("table");
    transactionsTable.id = "transactionsTable";
    transactionsTable.classList.add("table");

    // Append the table to periodTransactionsDiv
    periodTransactionsDiv.appendChild(transactionsTable);

    // Append periodTransactionsDiv to sideContentDiv
    sideContentDiv.appendChild(periodTransactionsDiv);

    function fetchTransactionsForPeriod(period) {
        // Prepare form data
        userid=userinfo.userId
        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('period', period);

        // Make a request to the PHP script with the selected userid and period
        fetch('fetchTransactionsForPeriod.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayTransactionsForPeriod(data.transactions);
                } else {
                    // Handle failed response, e.g., display an error message
                    console.error('Failed to fetch transactions for the selected period');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    // Function to display transactions in a table
    function displayTransactionsTable(transactions) {
        // Get the transactionsTable
        var transactionsTable = document.getElementById("transactionsTable");

        // Clear existing rows
        transactionsTable.innerHTML = '';

        // Create the table head
        var tableHead = transactionsTable.createTHead();
        var headerRow = tableHead.insertRow();
        var headers = ["Transaction ID", "Transaction Date", "Transaction Status"];

        headers.forEach(headerText => {
            var th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Create the table body
        var tableBody = transactionsTable.createTBody();

        // Populate the table with transaction data
        transactions.forEach(transaction => {
            var row = tableBody.insertRow();
            var keys = Object.keys(transaction);

            keys.forEach(key => {
                var cell = row.insertCell();
                cell.textContent = transaction[key];
            });
        });
    }
}
function fetchItemsInEachTransactionData(itemsInEachTransactionTable) {
    // Make a request to the PHP script to get items in each transaction
    fetch('getItemsInEachTransaction.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            userId: userinfo.userId, // Assuming userinfo is defined
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                displayItemsInEachTransaction(data.items, itemsInEachTransactionTable);
            } else {
                // Handle error case, for example, display a message
                console.error('Failed to fetch items in each transaction:', data.message);
            }
        })
        .catch(error => {
            // Handle fetch error
            console.error('Error fetching items in each transaction:', error);
        });
}

function displayItemsInEachTransaction(items, itemsInEachTransactionTable) {
    // Assuming itemsInEachTransactionTable is a table element

    // Clear existing table content
    while (itemsInEachTransactionTable.firstChild) {
        itemsInEachTransactionTable.removeChild(itemsInEachTransactionTable.firstChild);
    }

    // Create the table header
    let headerRow = itemsInEachTransactionTable.createTHead().insertRow();
    let headers = ["Transaction ID", "Item Number", "Item Name"];

    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    let tableBody = itemsInEachTransactionTable.createTBody();

    // Populate the table with item data
    items.forEach(item => {
        let row = tableBody.insertRow();
        let keys = Object.keys(item);

        keys.forEach(key => {
            let cell = row.insertCell();
            cell.textContent = item[key];
        });
    });
}
function fetchTransactionStatusData(customerId) {
    // Create a FormData object to send data in the request body
    let formData = new FormData();
    formData.append('customerId', userinfo.userId);

    // Make a request to the PHP script to fetch transaction status
    fetch('fetchTransactionStatus.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                displayTransactionStatus(data.transactions);
            } else {
                // Handle the case when the request fails
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle network errors
            console.error('Network error:', error);
        });
}

function displayTransactionStatus(transactions) {
    // Get the transactionStatusDiv
    let transactionStatusDiv = document.getElementById('transactionStatusDiv');

    // Create a table element
    let table = document.createElement('table');
    table.classList.add('table');

    // Create the table head
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let headers = ['Transaction ID', 'Transaction Status', 'Transaction Date', 'Total Price'];

    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    let tbody = table.createTBody();

    // Populate the table with transaction data
    transactions.forEach(transaction => {
        let row = tbody.insertRow();
        let keys = Object.keys(transaction);

        keys.forEach(key => {
            let cell = row.insertCell();
            cell.textContent = transaction[key];
        });
    });

    // Append the table to the transactionStatusDiv
    transactionStatusDiv.appendChild(table);
}


// Helper function to clear all rows from a table except the header row
function clearTableRows(table) {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function initAdminMyAccount() {
    // Get the side content div
    const sideContentDiv = document.getElementsByClassName("side-content-div")[0];
    sideContentDiv.style.flexDirection = "column"

    // Empty the internal elements of the side content div
    emptyInternalElements(sideContentDiv);

    // Header for Add new inventory (XML)
    let headerForAddInventoryXml = document.createElement("h1");
    headerForAddInventoryXml.textContent = "Add new inventory";

    // Paragraph for XML instructions
    let pForXml = document.createElement("p");
    pForXml.textContent = "For fresh products, frozen products, candies, and snacks:";

    // Create elements for uploading XML file
    let labelForUploadXml = document.createElement("label");
    labelForUploadXml.textContent = "Upload XML file";

    let inputForUploadXml = document.createElement("input");
    inputForUploadXml.type = "file"; // Use type "file" for file input
    inputForUploadXml.id = "fileInputXml"; // Set an id for easier reference
    inputForUploadXml.addEventListener("change", () => handleFileSelection('XML'))

    // Create a div to hold the XML elements
    let xmlDiv = document.createElement("div");
    xmlDiv.appendChild(headerForAddInventoryXml);
    xmlDiv.appendChild(pForXml);
    xmlDiv.appendChild(labelForUploadXml);
    xmlDiv.appendChild(inputForUploadXml);

    // Paragraph for JSON instructions
    let pForJson = document.createElement("p");
    pForJson.textContent = "For baking products, breakfast products, and pantry:";

    // Create elements for uploading JSON file
    let labelForUploadJson = document.createElement("label");
    labelForUploadJson.textContent = "Upload JSON file";

    let inputForUploadJson = document.createElement("input");
    inputForUploadJson.type = "file"; // Use type "file" for file input
    inputForUploadJson.id = "fileInputJson"; // Set an id for easier reference
    inputForUploadJson.addEventListener("change", () => handleFileSelection('JSON'))

    // Create a div to hold the JSON elements
    let jsonDiv = document.createElement("div");
    jsonDiv.appendChild(pForJson);
    jsonDiv.appendChild(labelForUploadJson);
    jsonDiv.appendChild(inputForUploadJson);

    // Append both XML and JSON divs to the side content div
    sideContentDiv.appendChild(xmlDiv);
    sideContentDiv.appendChild(jsonDiv);

    // show inventory table
    // Header for show inventory
    let headerForShowInventory = document.createElement("h1");
    headerForShowInventory.textContent = "Show inventory";
    // Create showInventoryButtonDiv
    let showInventoryButtonDiv = document.createElement("div");
    showInventoryButtonDiv.id = "showInventoryButtonDiv";

    // Create "Show inventory" button
    let showInventoryButton = document.createElement("button");
    showInventoryButton.textContent = "Show inventory";
    showInventoryButton.addEventListener("click", () => fetchInventoryTable());

    // Create "Filter less than 3" button
    let filterLessThan3Button = document.createElement("button");
    filterLessThan3Button.textContent = "Filter less than 3";
    filterLessThan3Button.addEventListener("click", () => fetchLessInventoryTable());

    // Append buttons to showInventoryButtonDiv
    showInventoryButtonDiv.appendChild(showInventoryButton);
    showInventoryButtonDiv.appendChild(filterLessThan3Button);

    // Append showInventoryButtonDiv to body
    sideContentDiv.appendChild(headerForShowInventory)
    sideContentDiv.appendChild(showInventoryButtonDiv);

    // Create inventoryTableDiv
    let inventoryTableDiv = document.createElement("div");
    inventoryTableDiv.id = "inventoryTableDiv";

    // Append inventoryTableDiv to body
    sideContentDiv.appendChild(inventoryTableDiv);

    // The admin should be able to enter a specific date and see the list of customers with more than 2 transactions.
    let headerForDateAndListCustomer = document.createElement("h1");
    headerForDateAndListCustomer.textContent = "Enter a specific date and see the list of customers with more than 2 transactions";
    // Create a div to hold date input and button
    let customerListDiv = document.createElement("div");
    customerListDiv.id = "customerListDiv";

    // Create input for entering a specific date
    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "specificDateInput";
    dateInput.value = new Date().toISOString().split('T')[0];

    // Create button to trigger the action
    let showTransactionsButton = document.createElement("button");
    showTransactionsButton.textContent = "Show Transactions";
    showTransactionsButton.addEventListener("click", () => showCustomerListForDate(dateInput.value));

    // Append the input and button to the div
    customerListDiv.appendChild(headerForDateAndListCustomer);
    customerListDiv.appendChild(dateInput);
    customerListDiv.appendChild(showTransactionsButton);

    // Append the div to the side content div
    sideContentDiv.appendChild(customerListDiv);

    // The admin should be able to enter a zip code and a month and see the customers who live in the zip code 
    // and with more than 2 transactions in the specified month.
    var customerZipcodeDiv = document.createElement("div")
    customerZipcodeDiv.id = "customerZipcodeDiv"

    var headerForCustomerInZipcode = document.createElement("h1")
    headerForCustomerInZipcode.textContent = "Enter a zip code and a month and see the customers who live in the zip code \
    and with more than 2 transactions in the specified month"

    // Create input for entering a zip code
    let zipcodeInput = document.createElement("input");
    zipcodeInput.type = "text";
    zipcodeInput.placeholder = "Enter Zip Code";
    zipcodeInput.id = "zipcodeInput";

    // Create select element for choosing a year
    let yearSelect = document.createElement("select");
    yearSelect.id = "yearSelect";

    // Get the current year
    let currentYear = new Date().getFullYear();

    // Set the range from 10 years ago to the current year
    for (let year = currentYear - 10; year <= currentYear; year++) {
        let option = document.createElement("option");
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    }

    // Create select element for choosing a month
    let monthSelect = document.createElement("select");
    monthSelect.id = "monthSelect";

    // Create options for each month
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i < 10 ? `0${i}` : `${i}`;
        option.text = i < 10 ? `0${i}` : `${i}`;
        monthSelect.appendChild(option);
    }



    // Create button to trigger the action
    let submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () => {
        showCustomersInZipcode(zipcodeInput.value, yearSelect.value, monthSelect.value);
    });


    customerZipcodeDiv.appendChild(headerForCustomerInZipcode)
    // Append the inputs and button to the customerZipcodeDiv
    zipcodeInput.value = "75080"
    yearSelect.value = 2023
    monthSelect.value = 12
    customerZipcodeDiv.appendChild(zipcodeInput);
    customerZipcodeDiv.appendChild(yearSelect);
    customerZipcodeDiv.appendChild(monthSelect);
    customerZipcodeDiv.appendChild(submitButton);

    sideContentDiv.appendChild(customerZipcodeDiv)

    //The admin should be able to enter a item number and modify the unit 
    //price and/or the Quantity in inventory for the item in the inventory table
    var modifyInventoryDiv = document.createElement("div")
    modifyInventoryDiv.id = "modifyInventoryDiv"

    var headerForModifyInventory = document.createElement("h1")
    headerForModifyInventory.textContent = "Enter a item number and modify the unit \
    price and/or the Quantity in inventory for the item in the inventory table"

    // Create input for item number
    let itemNumberInput = document.createElement("input");
    itemNumberInput.type = "number";
    itemNumberInput.placeholder = "Enter Item Number";
    itemNumberInput.id = "itemNumberInput";

    // Create input for unit price
    let unitPriceInput = document.createElement("input");
    unitPriceInput.type = "number";
    unitPriceInput.placeholder = "Enter Unit Price";
    unitPriceInput.step = "0.01"; // Allow decimal values
    unitPriceInput.id = "unitPriceInput";

    // Create input for Quantity in inventory
    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.placeholder = "Enter Quantity in Inventory";
    quantityInput.id = "quantityInput";

    // Create button to trigger the action
    let submitButtonForModifyInventory = document.createElement("button");
    submitButtonForModifyInventory.textContent = "Submit";
    submitButtonForModifyInventory.addEventListener("click", () => modifyInventoryAdmin(itemNumberInput.value, unitPriceInput.value, quantityInput.value));

    // Append inputs and button to modifyInventoryDiv
    modifyInventoryDiv.appendChild(headerForModifyInventory)

    modifyInventoryDiv.appendChild(itemNumberInput);
    modifyInventoryDiv.appendChild(unitPriceInput);
    modifyInventoryDiv.appendChild(quantityInput);
    modifyInventoryDiv.appendChild(submitButtonForModifyInventory);


    sideContentDiv.appendChild(modifyInventoryDiv)

    // The admin should be able to see the list of the customers who are older than 20 years 
    //old and have move than 3 transactions.
    // Create a div for customers above age
    var customerAboveAgeDiv = document.createElement("div");
    customerAboveAgeDiv.id = "customerAboveAgeDiv";

    // Create a header for customers above age
    var headerForCustomerAboveAge = document.createElement("h1");
    headerForCustomerAboveAge.textContent = "List of the customers who are older than 20 years old and have more than 3 transactions";

    customerAboveAgeDiv.appendChild(headerForCustomerAboveAge);

    // Create a paragraph for displaying "No such customer"
    var noCustomerParagraph = document.createElement("p");
    noCustomerParagraph.textContent = "No such customer";
    noCustomerParagraph.id = "noCustomerParagraph"; // Set an id for easier reference

    // Create a table for displaying customer data
    var customerAboveAgeTable = document.createElement("table");
    customerAboveAgeTable.id = "customerAboveAgeTable";
    customerAboveAgeTable.classList.add("table"); // Add Bootstrap table class for styling

    // Create the table head
    let tableHead = customerAboveAgeTable.createTHead();
    let headerRow = tableHead.insertRow();
    let headers = ["Customer ID", "First Name", "Last Name", "Age", "Phone Number", "Email", "Address", "Date of Birth"];

    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Append the table to the customerAboveAgeDiv
    customerAboveAgeDiv.appendChild(customerAboveAgeTable);

    // Append the "No such customer" paragraph to the customerAboveAgeDiv
    customerAboveAgeDiv.appendChild(noCustomerParagraph);

    // Append the customerAboveAgeDiv to the side content div
    sideContentDiv.appendChild(customerAboveAgeDiv);

    // Fetch data from customerAboveAgeDiv.php
    fetch('customerAboveAgeDiv.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Remove the "No such customer" paragraph if customers are found
                noCustomerParagraph.style.display = 'none';
                displayCustomerAboveAgeList(data.customers);
            } else {
                // Display the "No such customer" paragraph if status is failed
                noCustomerParagraph.style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));

    // Function to display customer data in the table
    function displayCustomerAboveAgeList(customerList) {
        // Get the table body
        let tableBody = customerAboveAgeTable.createTBody();

        // Populate the table with customer data
        customerList.forEach(customer => {
            let row = tableBody.insertRow();
            let keys = Object.keys(customer);

            keys.forEach(key => {
                let cell = row.insertCell();
                cell.textContent = customer[key];
            });
        });
    }






}
function modifyInventoryAdmin(itemNumber, unitPrice, quantity) {
    // Create a FormData object
    const formData = new FormData();

    // Append the data to the FormData object
    formData.append('itemNumber', parseInt(itemNumber));
    formData.append('unitPrice', parseFloat(unitPrice));
    formData.append('quantity', parseInt(quantity));

    // Make a request to the PHP script with FormData
    fetch('modifyInventory.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Display success message and current Quantity in inventory
                alert('Modify successfully. Current Quantity in Inventory: ' + data.quantityInInventory);
            } else {
                // Display error message
                alert('Modify error: ' + data.message);
            }
        })
        .catch(error => {
            // Handle fetch error
            console.error('Error during fetch:', error);
        });
}

function showCustomersInZipcode(zipcode, year, month) {
    year = parseInt(year);
    month = parseInt(month);

    // Create a FormData object
    const formData = new FormData();
    formData.append('zipcode', zipcode);
    formData.append('year', year);
    formData.append('month', month);

    // Make a request to the PHP script with the FormData
    fetch('getCustomerZipcode.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            displayCustomersInZipcode(data)
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
}



function displayCustomersInZipcode(data) {
    // Get the customerZipcodeDiv
    let customerZipcodeDiv = document.getElementById("customerZipcodeDiv");

    // Check if there is any table inside customerListDiv
    let existingTable = customerZipcodeDiv.querySelector("table");

    // Remove the existing table if it exists
    if (existingTable) {
        customerZipcodeDiv.removeChild(existingTable);
    }



    // Check if the request was successful
    if (data.status === 'success') {
        // Create a table element
        let customerTable = document.createElement("table");
        customerTable.id = "customerTable";
        customerTable.classList.add("table"); // Add Bootstrap table class for styling

        // Create the table header
        let tableHeader = customerTable.createTHead();
        let headerRow = tableHeader.insertRow();
        let headers = ["Customer ID", "First Name", "Last Name", "Age", "Phone Number", "Email", "Address", "Date of Birth"];

        headers.forEach(headerText => {
            let th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Create the table body
        let tableBody = customerTable.createTBody();

        // Populate the table with customer data
        data.customers.forEach(customer => {
            let row = tableBody.insertRow();
            let keys = Object.keys(customer);

            keys.forEach(key => {
                let cell = row.insertCell();
                cell.textContent = customer[key];
            });
        });

        // Append the table to the customerZipcodeDiv
        customerZipcodeDiv.appendChild(customerTable);
    } else {
        // Display an error message if the request fails
        let errorMessage = document.createElement("p");
        errorMessage.textContent = "Error: Unable to fetch customer data.";
        customerZipcodeDiv.appendChild(errorMessage);
    }
}


function showCustomerListForDate(date) {
    // Make a request to the PHP script with the date
    fetch('showCustomerListForDate.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date }),
    })
        .then(response => response.json())
        .then(data => {
            // Call a function to display the customer list
            displayCustomerList(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayCustomerList(data) {
    // Get the customerListDiv
    let customerListDiv = document.getElementById("customerListDiv");
    // Check if there is any table inside customerListDiv
    let existingTable = customerListDiv.querySelector("table");
    // Remove the existing table if it exists
    if (existingTable) {
        customerListDiv.removeChild(existingTable);
    }

    // Check if the status is success and customers array exists
    if (data.status === 'success' && data.customers && data.customers.length > 0) {
        // Create a table element
        let customerTable = document.createElement("table");
        customerTable.id = "customerTable";
        customerTable.classList.add("table");

        // Create the table header
        let tableHeader = customerTable.createTHead();
        let headerRow = tableHeader.insertRow();
        let headers = ["Customer ID", "First Name", "Last Name", "Age", "Phone Number", "Email", "Address", "Date of Birth"];

        headers.forEach(headerText => {
            let th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Create the table body
        let tableBody = customerTable.createTBody();

        // Populate the table with customer data
        data.customers.forEach(customer => {
            let row = tableBody.insertRow();
            let keys = Object.keys(customer);

            keys.forEach(key => {
                let cell = row.insertCell();
                cell.textContent = customer[key];
            });
        });

        // Append the table to the customerListDiv
        customerListDiv.appendChild(customerTable);
    } else {
        // Display a message when no customers are found
        alert("No customers found for the given date.");
    }
}









// Function to fetch and display the full inventory table
function fetchInventoryTable() {
    fetch('getInventoryTable.php')
        .then(response => response.json())
        .then(data => displayInventoryTable(data))
        .catch(error => console.error('Error fetching inventory table:', error));
}
// Function to fetch and display the filtered inventory table
function fetchLessInventoryTable() {
    fetch('getLessInventory.php')
        .then(response => response.json())
        .then(data => displayInventoryTable(data))
        .catch(error => console.error('Error fetching filtered inventory table:', error));
}
// Function to display inventory table in inventoryTableDiv
function displayInventoryTable(data) {
    // Get the inventoryTableDiv
    const inventoryTableDiv = document.getElementById('inventoryTableDiv');

    // Clear existing content
    inventoryTableDiv.innerHTML = "";

    // Check if the data is null or not an array
    if (!Array.isArray(data) || data.length === 0) {
        alert('There is no such result.');
        return;
    }

    // Create a table element
    let table = document.createElement("table");

    // Add border styling to the table
    table.style.border = "1px solid #ddd";
    table.style.borderCollapse = "collapse";

    // Create table header
    let headerRow = table.insertRow();
    let columns = Object.keys(data[0]);

    // Track the current sort column and state
    let currentSortColumn = null;
    let ascending = true;

    // Function to sort data based on a column
    const sortData = (column) => {
        data.sort((a, b) => {
            const valueA = column === "ItemNumber" ? parseInt(a[column]) : a[column];
            const valueB = column === "ItemNumber" ? parseInt(b[column]) : b[column];

            if (valueA < valueB) return ascending ? -1 : 1;
            if (valueA > valueB) return ascending ? 1 : -1;
            return 0;
        });
    };

    // Function to handle column header click
    const handleHeaderClick = (column) => {
        if (currentSortColumn === column) {
            // If the same column is clicked, toggle the sort order
            ascending = !ascending;
        } else {
            // If a different column is clicked, reset the sort order
            ascending = true;
        }

        sortData(column);
        currentSortColumn = column;

        displayInventoryTable(data);
    };

    // Create table header cells
    columns.forEach(column => {
        let headerCell = headerRow.insertCell();
        headerCell.textContent = column;

        // Add border styling to header cells
        headerCell.style.border = "1px solid #ddd";
        headerCell.style.padding = "8px";
        headerCell.style.textAlign = "left";
        headerCell.style.backgroundColor = "#f2f2f2";
        headerCell.style.cursor = "pointer";

        // Add click event listener to header cells
        headerCell.addEventListener("click", () => {
            handleHeaderClick(column);
        });
    });

    // Create table rows and cells
    for (let item of data) {
        let row = table.insertRow();
        columns.forEach(column => {
            let cell = row.insertCell();
            cell.textContent = item[column];

            // Add border styling to cells
            cell.style.border = "1px solid #ddd";
            cell.style.padding = "8px";
            cell.style.textAlign = "left";
        });
    }

    // Append the table to inventoryTableDiv
    inventoryTableDiv.appendChild(table);
}


// Function to handle file selection
function handleFileSelection(fileType) {
    // Get the selected file from the file input based on file type
    let fileInputId = fileType === 'XML' ? 'fileInputXml' : 'fileInputJson';
    let file = document.getElementById(fileInputId).files[0];

    // Do something with the selected file, for example, display its name
    if (file) {
        alert(`Selected ${fileType} file: ${file.name}`);
        // You can call your uploadFile function here if needed
        uploadFile(file, fileType);
        // Reset the value of the file input to allow selecting the same file again
        document.getElementById(fileInputId).value = "";
    } else {
        alert(`No ${fileType} file selected.`);
    }
}

// Function to upload the selected file
function uploadFile(file, fileType) {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    console.log('Before fetch:', formData);

    // Specify the PHP script based on the file type
    const phpScript = fileType === 'XML' ? 'parseXml.php' : 'parseJson.php';

    // Use fetch to send a POST request to the respective PHP script
    fetch(phpScript, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the PHP script
            if (data.success === true) {
                alert(`${fileType} file uploaded and parsed successfully!`);
            } else {
                alert(`Error parsing ${fileType} file. ${data.error}`);
            }
        })
        .catch(error => {
            console.error(`Error during ${fileType} file upload:`, error);
            alert('An error occurred. Please try again later.');
        });
}




function initRegister() {
    sideContentDiv = document.getElementsByClassName("side-content-div")[0]
    sideContentDiv.style.flexDirection = "column"
    emptyInternalElements(sideContentDiv)
    // Add title
    var registerTitle = document.createElement("h1")
    registerTitle.textContent = "Register"
    sideContentDiv.append(registerTitle)
    // Div for form
    var formDiv = document.createElement("div")
    // Add form 
    var form = document.createElement("form");

    // Create labeled input elements
    var userNameInput = createLabeledInput("text", "User Name", "User Name");
    var passwordInput = createLabeledInput("password", "at least 8 characters", "Password");
    var reEnterPasswordInput = createLabeledInput("password", "Re-enter Password", "Re-enter Password");
    var firstNameInput = createLabeledInput("text", "First Name", "First Name");
    var lastNameInput = createLabeledInput("text", "Last Name", "Last Name");
    var ageInput = createLabeledInput("text", "MM/DD/YYYY", "Date of birth");
    var phoneInput = createLabeledInput("text", "must 10 digits", "Phone");
    var emailInput = createLabeledInput("email", "must contain @ and .com", "Email");
    var addressInput = createLabeledInput("text", "Address", "Address");

    // Create submit button
    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Submit";
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the form from submitting immediately

        var userNameValue = userNameInput.querySelector("input").value;
        var passwordValue = passwordInput.querySelector("input").value;
        var reEnterPasswordValue = reEnterPasswordInput.querySelector("input").value;
        var firstNameValue = firstNameInput.querySelector("input").value;
        var lastNameValue = lastNameInput.querySelector("input").value;
        var ageValue = ageInput.querySelector("input").value;
        var emailValue = emailInput.querySelector("input").value;
        var addressValue = addressInput.querySelector("input").value;
        var phoneValue = phoneInput.querySelector("input").value;

        // Check if required fields are filled
        if (!userNameValue || !passwordValue || !reEnterPasswordValue || !firstNameValue || !lastNameValue || !ageValue || !emailValue || !addressValue || !phoneValue) {
            alert("Please fill in all required fields.");
            return;
        }

        // Check if passwords match
        if (passwordValue !== reEnterPasswordValue) {
            alert("Passwords do not match. Please re-enter the passwords.");
            return;
        }

        // Check password length
        if (passwordValue.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }

        // Check date of birth format (MM/DD/YYYY)
        var dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dobRegex.test(ageValue)) {
            alert("Date of birth must be in the format MMDDYYYY.");
            return;
        }

        if (phoneValue.length != 10) {
            alert("Phone must be 10 digits.");
            return;
        }

        // Check email format
        var emailRegex = /\S+@\S+\.com/;
        if (!emailRegex.test(emailValue)) {
            alert("Invalid email format. Please enter a valid email address.");
            return;
        }
        // Create an object with user data
        var userData = {
            userName: userNameValue,
            password: passwordValue,
            firstName: firstNameValue,
            lastName: lastNameValue,
            dob: ageValue,
            email: emailValue,
            address: addressValue,
            reEnterPassword: reEnterPasswordValue,
            phone: phoneValue

        };
        // Perform asynchronous check for existing phone number
        try {
            const phoneExists = await checkPhoneExists(phoneValue);

            if (phoneExists) {
                alert("Phone number already exists");
            } else {
                // Continue with the registration process

                // Check if username already exists
                const isUsernameExists = await checkUsernameExists(userNameValue);
                if (isUsernameExists) {
                    alert("Username already exists. Please choose a different username.");
                } else {
                    // Continue with the registration process
                    sendRegisterRequest(userData);
                }
            }
        } catch (error) {
            console.error('Error checking phone number:', error);
            alert("Error checking phone number. Please try again.");
        }
    });

    // Append labeled input elements and submit button to the form
    form.appendChild(userNameInput);
    form.appendChild(passwordInput);
    form.appendChild(reEnterPasswordInput);
    form.appendChild(firstNameInput);
    form.appendChild(lastNameInput);
    form.appendChild(ageInput);
    form.appendChild(phoneInput)
    form.appendChild(emailInput);
    form.appendChild(addressInput);
    form.appendChild(submitButton);
    // Add event listener to check validation on form submission

    formDiv.appendChild(form)
    sideContentDiv.appendChild(formDiv)
}

function checkUsernameExists(username) {
    return fetch('http://localhost:8080/wpl-frontend-as5/checkUsername.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ userName: username }),
    })
        .then(response => response.json())
        .then(data => {
            return data.usernameExists;
        })
        .catch(error => {
            console.error('Error checking username:', error);
            return false;
        });
}

async function checkPhoneExists(phoneNumber) {
    const response = await fetch('http://localhost:8080/wpl-frontend-as5/checkSamePhone.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ phone: phoneNumber }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
        throw new Error(`Error checking phone number: ${data.message}`);
    }

    return data.phoneExists;
}
function sendRegisterRequest(userData) {
    // Send AJAX request to registerPhp.php using fetch
    fetch('http://localhost:8080/wpl-frontend-as5/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                // Registration successful
                alert(data.message);
            } else if (data.status === 'failed') {
                // Registration failed
                alert(`Registration failed: ${data.message}`);
            } else if (data.status === 'validation') {
                // Validation error
                alert(`Validation error: ${data.message}`);
            } else {
                // Handle other status codes or scenarios
                alert(`Unexpected response: ${JSON.stringify(data)}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error communicating with the server.");
        });
}

function createLabeledInput(type, placeholder, labelText) {
    var container = document.createElement("div");
    container.style.marginBottom = "10px";  // Add margin for spacing

    // Create label element
    var label = document.createElement("label");
    label.innerText = labelText;
    label.style.display = "block";  // Make labels display as blocks for vertical stacking

    // Create input element
    var input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;

    // Append label and input to the container
    container.appendChild(label);
    container.appendChild(input);

    return container;
}
function initiateSpecialOffer() {
    let sdDiv = document.getElementsByClassName("side-content-div")[0]
    emptyInternalElements(sdDiv)
    let soBtn = document.createElement('button')
    soBtn.textContent = "Special offer"
    sdDiv.appendChild(soBtn)
    soBtn.addEventListener("click", () => initiateFirstQuestion())
}

const choiceList = [false, false, false]
const choiceDesList = ["student", "veteran", "in texas"]
const choiceTime = []
function initiateFirstQuestion() {
    let sdDiv = document.getElementsByClassName("side-content-div")[0]
    emptyInternalElements(sdDiv)
    pQuestion = document.createElement('p')
    pQuestion.textContent = "Are you a student?"
    let radioDiv = document.createElement('div')
    let answerList = ["yes", "or", "no"]
    for (let i = 0; i < 3; i++) {
        let radio = document.createElement('input')
        radio.type = "radio"
        radio.id = "radio" + i
        let label = document.createElement('label')
        label.textContent = answerList[i]
        radioDiv.appendChild(radio)
        radioDiv.appendChild(label)
    }
    let nextButton = document.createElement('button')
    nextButton.textContent = "next"
    let skipButton = document.createElement('button')
    skipButton.textContent = "skip"
    sdDiv.appendChild(pQuestion)
    sdDiv.appendChild(radioDiv)
    sdDiv.appendChild(nextButton)
    sdDiv.appendChild(skipButton)
    nextButton.addEventListener("click", () => {
        choiceTime.push(new Date().getTime())
        if (document.getElementById("radio0").checked) {
            choiceList[0] = true
            choiceDesList[0] = "student"

        }
        initiateSecondQuestion()

    })
    skipButton.addEventListener("click", () => {
        initiateSecondQuestion()
        if (document.getElementById("radio0").checked) {
        }
    })
}
function initiateSecondQuestion() {
    let sdDiv = document.getElementsByClassName("side-content-div")[0]
    emptyInternalElements(sdDiv)
    pQuestion = document.createElement('p')
    pQuestion.textContent = "Are you a veteran?"
    let radioDiv = document.createElement('div')
    let answerList = ["yes", "or", "no"]
    for (let i = 0; i < 3; i++) {
        let radio = document.createElement('input')
        radio.type = "radio"
        radio.id = "radio" + i
        let label = document.createElement('label')
        label.textContent = answerList[i]
        radioDiv.appendChild(radio)
        radioDiv.appendChild(label)
    }
    let nextButton = document.createElement('button')
    nextButton.textContent = "next"
    let skipButton = document.createElement('button')
    skipButton.textContent = "skip"
    sdDiv.appendChild(pQuestion)
    sdDiv.appendChild(radioDiv)
    sdDiv.appendChild(nextButton)
    sdDiv.appendChild(skipButton)
    nextButton.addEventListener("click", () => {
        if (document.getElementById("radio0").checked) {
            choiceList[1] = true
            choiceDesList[1] = "veteran"

        }
        initiateThirdQuestion()

    })
    skipButton.addEventListener("click", () => {
        initiateThirdQuestion()
        if (document.getElementById("radio0").checked) {
        }
    })
}

function initiateThirdQuestion() {
    let sdDiv = document.getElementsByClassName("side-content-div")[0]
    emptyInternalElements(sdDiv)
    pQuestion = document.createElement('p')
    pQuestion.textContent = "Are you in Texas?"
    let radioDiv = document.createElement('div')
    let answerList = ["yes", "or", "no"]
    for (let i = 0; i < 3; i++) {
        let radio = document.createElement('input')
        radio.type = "radio"
        radio.id = "radio" + i
        let label = document.createElement('label')
        label.textContent = answerList[i]
        radioDiv.appendChild(radio)
        radioDiv.appendChild(label)
    }
    let nextButton = document.createElement('button')
    nextButton.textContent = "finish"
    let skipButton = document.createElement('button')
    skipButton.textContent = "skip"
    sdDiv.appendChild(pQuestion)
    sdDiv.appendChild(radioDiv)
    sdDiv.appendChild(nextButton)
    nextButton.addEventListener("click", () => {
        choiceTime.push(new Date().getTime())

        if (document.getElementById("radio0").checked) {
            choiceList[2] = true
            choiceDesList[2] = "in texas"

        }
        let alertInfo = ""
        let count = 0
        for (let i = 0; i < 3; i++) {
            if (choiceList[i]) {
                alertInfo += "You are " + choiceDesList[i] + "."
                count += 10
            }
        }
        if (count === 0) {
            alertInfo = "Sorry you are not qualified for special offer."
        } else {
            alertInfo += "You get " + count + " off offer!"
        }
        let timeSpend = ((choiceTime[1] - choiceTime[0]) / 1000).toString()
        alert(alertInfo + "Time you spend is: " + timeSpend + " s")
    })

}

function initiateSearchBar(department) {
    // Implement by js

    // let sideContentDiv = document.getElementsByClassName("side-content-div")[0]
    // // 1 empty all
    // emptyInternalElements(sideContentDiv)
    // // 2 initiate search bar
    // const searchBarDiv = document.createElement('div');
    // // Set div styles
    // searchBarDiv.style.width = '100%';
    // searchBarDiv.style.textAlign = "center"
    // searchBarDiv.style.padding = "20px"
    // searchBarDiv.id = "search-bar-div"
    // searchBarDiv.clear = "both"
    // const input = document.createElement('input');
    // input.placeholder = "try search " + department
    // input.type = 'text';
    // const button = document.createElement('button');
    // button.textContent = 'Search';
    // button.style.width = '100px';
    // button.style.marginLeft = "10px"
    // button.addEventListener("click", () => loadSearchResult(department, input))
    // input.style.width = 'calc(50% - 110px)';
    // // Append input and button to div  
    // searchBarDiv.appendChild(input);
    // searchBarDiv.appendChild(button);
    // // Append div to document body
    // sideContentDiv.appendChild(searchBarDiv);

    // Implement by jQuery

    let sideContentDiv = $(".side-content-div").eq(0);
    // 1 empty all
    sideContentDiv.empty();
    // 2 initiate search bar
    const searchBarDiv = $("<div></div>");
    // Set div styles
    searchBarDiv.css({
        width: '100%',
        textAlign: 'center',
        padding: '20px',
        clear: 'both'
    }).attr('id', 'search-bar-div');

    const input = $("<input>").attr({
        placeholder: "try search " + department,
        type: "text"
    }).css('width', 'calc(50% - 110px)');

    const button = $("<button></button>").text("Search").css({
        width: '100px',
        marginLeft: '10px'
    }).click(() => loadSearchResult(department, input.val()));

    // Append input and button to div
    searchBarDiv.append(input).append(button);

    // Append div to side content div
    sideContentDiv.append(searchBarDiv);

}
function loadSearchResult(department, input) {
    if (containsNumber(input)) {
        alert("You should not enter any number.")
    } else {
        // 1 empty all element 
        let searchBarDiv = document.getElementById("search-bar-div")
        emptySiblingElements(searchBarDiv)
        searchBarDiv.style.clear = "both"
        searchBarDiv.parentElement.style.flexDirection = "column"
        let nameFromInput = input
        // load content
        let searchResultDiv = document.createElement("div")
        searchResultDiv.id = "search-result-div"
        searchResultDiv.style.display = "flex"
        searchResultDiv.style.flexDirection = "row"

        //num of items
        let n = items.numberOfSearchItem(department, nameFromInput)
        //array of items
        let arr = items.searchItem(department, nameFromInput)
        for (let i = 0; i < n; i++) {
            searchResultDiv.appendChild(arr[i].render())
        }
        searchBarDiv.after(searchResultDiv)
    }

}

function loadContent(department, category) {
    let sideDiv = document.getElementsByClassName("side")[0]
    sideDiv.parentElement.style.flexDirection = "row"
    //empty content
    emptySiblingElements(sideDiv)
    // load content
    let contentDiv = document.createElement("div")
    contentDiv.className = "content"
    //num of items
    let n = items.numOfFindItem(department, category)
    //array of items
    let arr = items.findItem(department, category)
    for (let i = 0; i < n; i++) {
        contentDiv.appendChild(arr[i].render())
    }
    sideDiv.after(contentDiv)
}

function initiateSide(department, categoryList) {
    let sideContentDiv = document.getElementsByClassName("side-content-div")[0]
    sideContentDiv.style.flexDirection = "row"
    // 1 empty elements already exists
    emptyInternalElements(sideContentDiv)
    // 2 load department
    // 2.1 load "side"
    // 2.1.1 "side" framework
    let sideDiv = document.createElement("div")
    sideDiv.className = "side"
    sideContentDiv.appendChild(sideDiv)
    // 2.1.2 side content
    const ul = document.createElement('ul');
    // Loop through links array
    for (let category of categoryList) {
        // Create li and a elements
        const li = document.createElement('li');
        const a = document.createElement('a');
        // Set a attributes
        a.textContent = category;
        a.addEventListener("click", () => loadContent(department, category))
        // Append a to li
        li.appendChild(a);
        // Append li to ul
        ul.appendChild(li);
    }
    // Append ul to document
    sideDiv.appendChild(ul)
}

function initiateSideByJQuery(department, categoryList) {
    let sideContentDiv = $(".side-content-div").eq(0);
    // 1 empty elements already exist
    sideContentDiv.empty();
    // 2 load department
    // 2.1 load "side"
    // 2.1.1 "side" framework
    let sideDiv = $("<div></div>").addClass("side");
    sideContentDiv.append(sideDiv);
    // 2.1.2 side content
    const ul = $("<ul></ul>");
    // Loop through links array
    for (let category of categoryList) {
        // Create li and a elements using jQuery
        const li = $("<li></li>");
        const a = $("<a></a>").text(category).click(() => loadContent(department, category));
        // Append a to li
        li.append(a);
        // Append li to ul
        ul.append(li);
    }
    // Append ul to sideDiv
    sideDiv.append(ul);
}


// delete all internal elements
function emptyInternalElements(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild)
    }
}

function emptySiblingElements(div) {
    // Get the parent of the div
    const parent = div.parentNode;
    // Loop through all the parent's children
    for (let child of parent.children) {
        // If the child is not the specified div, remove it
        if (child !== div) {
            parent.removeChild(child);
        }
    }

}

function getImageName(imagePath) {
    // Find index of "images/"
    let imagesIndex = imagePath.indexOf('images/');
    if (imagesIndex == -1) {
        return '';
    }

    // Find index of "." after "images/"
    let dotIndex = imagePath.indexOf('.', imagesIndex);
    if (dotIndex == -1) {
        return '';
    }
    // Extract substring between indices
    return imagePath.substring(imagesIndex + 7, dotIndex);

}
