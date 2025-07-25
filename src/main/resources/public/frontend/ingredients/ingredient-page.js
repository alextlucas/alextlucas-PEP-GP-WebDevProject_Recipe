/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
addIngredientNameInput = document.getElementById("add-ingredient-name-input");
deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
ingredientListContainer = document.getElementById("ingredient-list");
addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");




/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmitButton.addEventListener("click", addIngredient);
deleteIngredientSubmitButton.addEventListener("click", deleteIngredient);
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredientsArray = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name = addIngredientNameInput.value.trim();
    if (!name){
        alert("Please fill in all the fields");
        return;
    }
    try {
        const requestBody = {
            name: name
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                "X-Admin-Token": sessionStorage.getItem("is-admin")
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (response.ok){
            ingredientsArray.push({name: name});
            addIngredientNameInput.value = "";
            getIngredients();
        }
        else{
            alert("Error adding ingredient");
            }
        }
        catch(error){
            console.error("Adding ingredient error", error);
            alert("An unexpected error occurred");
        }
    }


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                "X-Admin-Token": sessionStorage.getItem("is-admin")
            }
        };
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.ok){
            const ingredients = await response.json();
            ingredientsArray = ingredients;
            refreshIngredientList(ingredients);
        }
        else {
            alert("Error getting ingredients");
        }
    }
    catch(error){
        console.error("Fetching ingredients error", error);
        alert("Unexpected error occurred");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const name = deleteIngredientNameInput.value.trim();
    const ingredientToDelete = ingredientsArray.find(ingredient => {
        return ingredient.name === name;
    });
    if (!ingredientToDelete){
        alert("Ingredient not found");
        return;
    }
    
    try {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token"),
                "X-Admin-Token": sessionStorage.getItem("is-admin")
            }
        };

        const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, requestOptions);

        if (response.ok){
            deleteIngredientNameInput.value = "";
            getIngredients();
        }
        else {
            alert("Error deleting ingredient");
        }
    }
    catch(error){
        console.error("Deleting ingredient error", error);
        alert("An unexpected error occured");
    }


}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList(ingredients) {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(ingredient => {
        const listItem = document.createElement("li");
        const paragraph = document.createElement("p");
        paragraph.textContent = ingredient.name;
        
        listItem.appendChild(paragraph);
        ingredientListContainer.appendChild(listItem);
    })
}
