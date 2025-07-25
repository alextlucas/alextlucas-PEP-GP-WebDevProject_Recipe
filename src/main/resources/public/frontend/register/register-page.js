/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
usernameInput = document.getElementById("username-input");
emailInput = document.getElementById("email-input");
passwordInput = document.getElementById("password-input")
repeatPasswordInput = document.getElementById("repeat-password-input");
registerButton = document.getElementById("register-button");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration);

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here

    try {
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;
    
        if((!username && !email) || !password){
            alert("Please fill in all the fields");
            return;
        }
        if (password != repeatPassword){
            alert("Password and Repeat Password do not match");
            return;
        }
        const registerBody = {
            username: username,
            email: email,
            password: password
        };

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",     
                "Access-Control-Allow-Headers": "*"        
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(registerBody)
        };


        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if (response.status == 201){
            window.location.href = "login.html";
            }
        else if (response.status == 409){
            alert("Username or Email already exists");
            }
        else {
            alert("Registration error");
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        alert("An error occurred during registration")
    }
    
    // Example placeholder:
    // const registerBody = { username, email, password };

    // await fetch(...)
}
