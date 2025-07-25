/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */


const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitInput = document.getElementById("add-recipe-submit-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitInput = document.getElementById("update-recipe-submit-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitInput = document.getElementById("delete-recipe-submit-input");
    const recipeList = document.getElementById("recipe-list");
    const logoutButton = document.getElementById("logout-button");
    const adminLink = document.getElementById("admin-link");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    
    
    

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    
    if (sessionStorage.getItem("auth-token")){
        logoutButton.style.display = "block";
    }
    else{
        logoutButton.style.display = "none";
    }
    
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
 
    if (sessionStorage.getItem("is-admin") == "true"){
        adminLink.style.display = "block";
    }
    else{
        adminLink.style.display = "none";
    }
    
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitInput.addEventListener("click", addRecipe);
    updateRecipeSubmitInput.addEventListener("click", updateRecipe);
    deleteRecipeSubmitInput.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);
    
    
    

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value;
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerm}`, requestOptions);
            if (response.ok){
                const recipes = await response.json();
                refreshRecipeList(recipes);
            }
            else {
                alert("Failed to search for recipes");
            }
        }   
        catch (error){
            console.error("Search error:", error);
            alert("An unexpected error occurred");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const recipeName = addRecipeNameInput.value;
        const recipeInstructions = addRecipeInstructionsInput.value;

        if (!recipeName || !recipeInstructions){
            alert("Please fill in all the fields");
            return;
        }

        try {
            const requestBody = {
                name: recipeName,
                instructions: recipeInstructions
            }
            const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify(requestBody)
            };
            
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions)
            if (response.ok){
                addRecipeInstructionsInput.value = "";
                addRecipeNameInput.value = "";
                getRecipes();
                
            }
            else {
                alert("Add Recipe failed")
            }
        }
        catch(error){
            console.error("Add Recipe Error", error);
            alert("An unexpected error occurred");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameInput.value;
        const instructions = updateRecipeInstructionsInput.value;

        if (!name || !instructions){
            alert("Please fill in all the fields");
            return;
        }

        try {
            recipes = await getRecipes();
            const recipeToUpdate = recipes.find(recipe =>
                recipe.name === name
            );

            const requestBody = {
                name: name,
                instructions: instructions
            }
            const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
            body: JSON.stringify(requestBody)
            };
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, requestOptions);

            if (response.ok){
                updateRecipeInstructionsInput.value = "";
                updateRecipeNameInput.value = "";

                getRecipes();
            }
            else {
                alert("Error with HTTP response");
            }
        }
        catch(error){
            console.error("Update recipe error", error);
            alert("Unexpected error occurred");
        }

    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameInput.value;

        if (!name){
            alert("Please fill in all the fields");
            return;
        }
        const recipes = await getRecipes();
        const recipeToDelete = recipes.find(recipe =>
            recipe.name == name
        );
        try {
            const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            };
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, requestOptions);

            if (response.ok){
                getRecipes();
            }
            else{
                alert("Error with deleting");
            }
        }
        catch(error){
            console.error("Deletion error", error);
            alert("Unexpected error occurred");
        }
    }
        

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            };
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (response.ok){
                const recipes = await response.json();
                refreshRecipeList(recipes);
                return recipes;
            }
            else{
                alert("Failed to Get Recipes");
            }
        }
        catch(error){
            console.error("Get recipes error:", error);
            alert("An unexpected error occurred");
        }
        


    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipes) {
        // Implement refresh logic here
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const item = document.createElement("li");
            item.innerHTML = recipe.name + ": " + recipe.instructions
            recipeList.appendChild(item);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here

        const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);
            if (response.ok){
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            }
            else{
                alert("Logout failed")
            }
        }
        catch(error){
            alert("Unexpected error occurred");
        }
        
        
    }
    
});
