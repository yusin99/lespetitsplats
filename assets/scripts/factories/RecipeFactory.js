import { filterFactory } from '../index.js'
import { createCard, filterAlgorithm } from '../utils/index.js'
import { recipes } from '../utils/recipes.js'

/**
 * This module provides functions for managing recipe cards, including updating, filtering, and rendering them.
 * It interacts with the filter factory to update filters based on selected tags and search input.
 */

export const RecipeFactory = () => {
  let cards = []
  const selectedTags = []
  const cardSection = document.querySelector('.custom-card-container')
  const recipesCount = document.getElementById('custom-recipes-count')

  /**
     * Initializes the RecipeFactory by setting up initial state and rendering all recipe cards.
     */
  const init = () => {
    recipesCount.innerText = `${recipes.length} recettes`
    resetCards()
  }

  /**
     * Updates the recipe count element with the number of recipes.
     * @param {Array} recipes - The list of recipes.
     */
  const updateRecipesCount = (recipes) => {
    recipesCount.innerText = `${recipes.length} recettes`
  }

  /**
     * Resets all recipe cards to display all recipes.
     */
  const resetCards = () => {
    cards = []
    filterFactory.updateFilters(recipes)
    recipes.forEach((recipe) => {
      addCard(recipe)
    })
  }

  /**
     * Updates all recipe cards based on selected tags and search input.
     */
  const updateCards = () => {
    console.log('Starting the update of the cards...')
    const startTime = performance.now()
    const errorElement = document.querySelector('.custom-error-section')
    errorElement.innerHTML = ''
    const searchInput = document.getElementById('search').value.trim()
    clearCards()
    const tagsResults = filterByTags()
    const searchResults = filterBySearch(tagsResults, searchInput)
    updateFilters(searchResults)
    renderResults(searchResults, errorElement, searchInput)
    updateRecipesCount(searchResults)
    const endTime = performance.now()
    console.log(
            `Update end. Update took ${endTime - startTime} milliseconds`
    )
  }

  /**
     * Clears all recipe cards from the UI.
     */
  const clearCards = () => {
    cards = []
    cardSection
      .querySelectorAll('.custom-card')
      .forEach((cardElement) => cardElement.remove())
  }

  /**
     * Filters recipes based on selected tags.
     * @returns {Array} - The filtered recipes based on selected tags.
     */
  const filterByTags = () => {
    return selectedTags.length !== 0
      ? filterAlgorithm(recipes, selectedTags, 'tag')
      : []
  }

  /**
     * Filters recipes based on search input and selected tags.
     * @param {Array} tagsResults - The recipes filtered by tags.
     * @param {string} input - The search input.
     * @returns {Array} - The filtered recipes based on search input and selected tags.
     */
  const filterBySearch = (tagsResults, input) => {
    if (input.length >= 3) {
      return filterAlgorithm(
        tagsResults.length !== 0 ? tagsResults : recipes,
        [input],
        'input'
      )
    } else {
      return tagsResults.length !== 0 ? tagsResults : recipes
    }
  }

  /**
     * Updates the filters based on filtered recipes.
     * @param {Array} tagsResults - The recipes filtered by tags.
     * @param {Array} searchResults - The recipes filtered by search input.
     */
  const updateFilters = (searchResults) => {
    filterFactory.updateFilters(searchResults)
  }

  /**
     * Renders search results to the UI.
     * @param {Array} searchResults - The search results to render.
     * @param {HTMLElement} errorElement - The error element to display error messages.
     * @param {string} input - The search input.
     */
  const renderResults = (searchResults, errorElement, input) => {
    if (searchResults.length === 0) {
      errorElement.innerText = `Aucune recette ne contient '${input}'. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`
    } else {
      errorElement.innerText = ''
      searchResults.forEach((result) => addCard(result))
    }
  }

  /**
     * Adds a recipe card to the UI.
     * @param {Object} card - The recipe data to create the card.
     */
  const addCard = (card) => {
    const cardMarkup = createCard(card)
    cardSection.innerHTML += cardMarkup
    cards.push(card)
  }

  /**
     * Retrieves all recipe cards.
     * @returns {Array} - The array of recipe cards.
     */
  const getCards = () => {
    return cards
  }

  /**
     * Adds a tag to the selected tags list.
     * @param {HTMLElement} tag - The tag element to add.
     */
  const addTag = (tag) => {
    const tagText = tag.innerHTML
    if (!selectedTags.includes(tagText)) {
      selectedTags.push(tagText)
      updateTags(tag)
    }
  }

  /**
     * Updates the tags container with the added tag and updates the recipe cards.
     * @param {HTMLElement} tagElement - The tag element to update.
     */
  const updateTags = (tagElement) => {
    const tagsContainer = document.querySelector(
      '.custom-selectors-container'
    )
    tagsContainer.appendChild(
      filterFactory.createTagElement(tagElement.textContent)
    )
    updateCards()
  }

  /**
     * Removes a tag from the selected tags list and updates the recipe cards.
     * @param {HTMLElement} tag - The tag element to remove.
     */
  const removeTag = (tag) => {
    selectedTags.splice(selectedTags.indexOf(tag), 1)
    updateCards()
  }

  /**
     * Retrieves the selected tags.
     * @returns {Array} - The array of selected tag elements.
     */
  const getTags = () => {
    return selectedTags
  }

  return {
    init,
    updateCards,
    addCard,
    getCards,
    addTag,
    updateTags,
    getTags,
    removeTag
  }
}
