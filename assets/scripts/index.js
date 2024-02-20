import { RecipeFactory } from './factories/RecipeFactory.js'
import { FilterFactory } from './factories/filterFactory.js'
import { debounce, handleCross } from './utils/index.js'

/**
 * This script initializes recipe and filter factories, attaches event listeners to input elements,
 * and debounces the update of recipe cards based on user input.
 */

// Initialize recipe and filter factories
export const recipeFactory = RecipeFactory()
export const filterFactory = FilterFactory()

// Initialize recipe factory
recipeFactory.init()

// Initialize filter factory
filterFactory.init()

// Debounced function to update recipe cards based on user input
const debouncedUpdateCards = debounce((value) => {
  recipeFactory.updateCards(value)
}, 500)

