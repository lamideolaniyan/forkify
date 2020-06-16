import axios from 'axios';

export default class {
  constructor(query) {
    this.query = query;
  }
  async getResults(query) {
    try {
      const result = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.recipe = result.data.recipes;

      //console.log(this.recipe);
    } catch (error) {
      alert(error);
    }
  }
}
