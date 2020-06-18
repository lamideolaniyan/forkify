import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
};

export const clearButtons = () => {
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((result) => {
    result.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(' ')} ...`;
  }

  return title; //else statement
};

const renderResList = (result) => {
  const markup = `
    <li>
        <a class="results__link" href="#${result.recipe_id}">
            <figure class="results__fig">
                <img src="${result.image_url}" alt="${result.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(result.title)}</h4>
                <p class="results__author">${result.publisher}</p>
            </div>
        </a>
    </li>
  `;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => ` 
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;

const renderButton = (page, numRes, resPerPage) => {
  const pages = Math.ceil(numRes / resPerPage);
  let button;

  if (page === 1) {
    //Only 1 button to go to the next page
    button = createButton(page, 'next');
  } else if (page < pages && page > 1) {
    //Two buttons, previous and next
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages) {
    //Only 1 button to go to the previous page
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (result, page = 1, resPerPage = 10) => {
  //render results
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  //format recipe title
  result.slice(start, end).forEach(renderResList);

  //render pagination
  renderButton(page, result.length, resPerPage);
};
