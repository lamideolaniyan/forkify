import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader, clearButtons } from './views/base';

/* Global app state
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/**
 * SEARCH LIST
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
 * RECIPE
 */

const ctrlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    //Prepare UI for changes

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
      console.log(state.recipe);
    } catch (error) {
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, ctrlRecipe));
