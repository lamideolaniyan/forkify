import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader, clearButtons } from './views/base';

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
    searchView.clearButtons();
    renderLoader(elements.searchResDiv);

    //4. Fetch recipes
    await state.search.getResults();

    //5. Render recipes on UI
    clearLoader();
    searchView.renderResult(state.search.result);
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
