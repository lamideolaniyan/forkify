import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/* Global app state
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const ctrlSearch = async () => {
  //1. Read search query from UI
  const query = searchView.getInput();

  if (query) {
    //2. Create a new class and store in state
    state.search = new Search(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();

    //4. Fetch recipes
    await state.search.getResults();

    //5. Render recipes on UI
    searchView.renderResult(state.search.recipe);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  ctrlSearch();
});
