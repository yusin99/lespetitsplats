import { recipes } from '../utils/recipes.js'
/**
 * Checks if a given value is an object and not an array.
 *
 * @param {*} obj - The value to be checked.
 * @returns {boolean} - Returns true if the value is an object and not an array, otherwise returns false.
 */
const isObject = (obj) =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj)

/**
 * Extracts and deduplicates values from the specified property of an array of recipes, converting strings to uppercase.
 *
 * @param {Array} recipes - An array of recipe objects.
 * @param {string} type - The property to extract values from ('ingredients', 'ustensils', or 'appliance').
 * @returns {Array} - An array containing unique values extracted from the specified property, with strings converted to uppercase.
 */
const get = (recipes, type) => {
  return [...new Set(
    recipes.flatMap((r) =>
      Array.isArray(r[type])
        ? r[type].map((i) =>
          isObject(i) ? i.ingredient : i
        )
        : [r[type]]
    )
  )]
}

/**
 * Factory function for creating and initializing filter dropdowns in the DOM based on recipe data.
 *
 * @returns {Object} - An object with an 'init' method for initializing filter dropdowns in the DOM.
 */
export const filterFactory = () => {
  // Extract unique ingredients, ustensils, and appliances from recipes
  const ingredients = get(recipes, 'ingredients')
  const ustensils = get(recipes, 'ustensils')
  const appliances = get(recipes, 'appliance')

  /**
     * Initializes filter dropdowns in the DOM based on specified categories and their corresponding lists of values.
     */
  const init = () => {
    const dropdownContainer = document.querySelector(
      '.custom-dropdown-container'
    )

    // Menu configuration with categories and their respective lists of values
    const menu = [
      { name: 'Ingrédients', list: ingredients },
      { name: 'Appareils', list: appliances },
      { name: 'Ustensiles', list: ustensils }
    ]

    // Create and append filter dropdowns to the DOM
    menu.forEach((el) => {
      const filterHTML = create(el.name, el.list)
      dropdownContainer.innerHTML += filterHTML
    })
  }

  /**
     * Creates the HTML structure for a filter dropdown based on a specified title and list of elements.
     *
     * @param {string} title - The title of the filter dropdown.
     * @param {Array} elements - The list of elements to be displayed in the dropdown.
     * @returns {string} - The HTML string representing the filter dropdown.
     */
  const create = (title, elements) => {
    const dropdownHTML = `
      <div class="custom-dropdown">
          <div class="custom-dropdown-title">
              <p>${title}</p>
              <img src="./assets/images/Arrow.svg" alt="Arrow">
          </div>
          <div class="custom-dropdown-content">
              <div class="custom-dropdown-searchbar">
                  <input type="text" name="${title}" id="${title}-search">
                  <img src="./assets/images/Loupe.svg" alt="Loupe">
              </div>
              <div class="custom-dropdown-elements">
                  ${elements.map((e) => `<p>${e}</p>`).join('')}
              </div>
          </div>
      </div>
    `
    return dropdownHTML
  }

  // Expose the 'init' method to initialize filter dropdowns
  return { init }
}
