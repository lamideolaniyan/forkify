import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader, clearButtons } from './views/base';

/* Global app state
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

window.state = state;
/**
 * SEARCH CONTROLLER
 */

const ctrlSearch = async () => {
  //1. Read search query from UI
  const query = searchView.getInput();

  if (query) {
    //2. Create a new class and store in state
    state.search = new Search(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    searchView.clearButtons();
    clearLoader();
    renderLoader(elements.searchResDiv);

    try {
      //4. Fetch recipes
      await state.search.getResults();

      //5. Render recipes on UI
      clearLoader();
      searchView.renderResult(state.search.result);
    } catch (error) {
      alert('Something went wrong with search!');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  ctrlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.clearButtons();
    searchView.renderResult(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const ctrlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected
    if (state.search) searchView.highlightSelected(id);

    //Create recipe object
    state.recipe = new Recipe(id);

    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calc time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, ctrlRecipe));

/**
 * LIST CONTROLLER
 */

const ctrlList = () => {
  // Create a new list IF none exists
  if (!state.list) state.list = new List();

  // Add ingredients to list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderList(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    // Handle count update
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

// Recipe button events
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-dec, .btn-dec *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-inc, .btn-inc *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    ctrlList();
  }

  //console.log(state.recipe);
});

// TESTING
window.l = new List();
