import { recipeFactory, filterFactory } from '../index.js'

/**
 * This script provides functions for creating recipe cards, filtering algorithms,
 * debouncing function calls, handling the removal of cross symbols, creating HTML elements,
 * and handling the appearance and removal of cross symbols on input fields.
 */

/**
 * Creates a card HTML markup for a recipe.
 * @param {Object} recipe - The recipe data.
 * @returns {string} - The HTML markup for the recipe card.
 */
export const createCard = (recipe) => {
  const picture = `<img src="./assets/images/recettes/${recipe.image}" alt="${recipe.name} image">`
  const time = `<span>${recipe.time}min</span>`
  const media = `<div class="custom-card-img-container">${picture}${time}</div>`

  const name = `<h3>${recipe.name}</h3>`

  const firstSubtitle = '<p class="custom-card-subtitle">RECETTE</p>'
  const desc = `<p class="custom-card-desc">${recipe.description.substring(
        0,
        200
    )}...</p>`
  const descriptions = `<div class="custom-card-section">${firstSubtitle}${desc}</div>`

  const secondSubtitle = '<p class="custom-card-subtitle">Ingrédients</p>'
  const ingredientsContainer = `<div class="custom-card-column-container">${recipe.ingredients
        .map(
            (i) =>
                `<div class="custom-card-column"><p>${i.ingredient}</p><span>${
                    i.quantity ? i.quantity : ''
                }${
                    i.unit ? (i.unit.length > 2 ? ` ${i.unit}` : i.unit) : ''
                }</span></div>`
        )
        .join('')}</div>`

  const ingredients = `<div class="custom-card-section">${secondSubtitle}${ingredientsContainer}</div>`
  const content = `<div class="custom-card-content">${name}${descriptions}${ingredients}</div>`

  const card = `<div class="custom-card">${media}${content}</div>`
  return card
}

/**
 * Filters recipes based on the search input or selected tags.
 * @param {Array} recipes - The list of recipes to filter.
 * @param {Array} keywords - The keywords to search for.
 * @param {string} searchType - Type of search: 'tag' or 'input'.
 * @returns {Array} - The filtered recipes.
 */
// Algo2
export const filterAlgorithm = (recipes, keywords, searchType) => {
  const filteredRecipes = []

  for (const recipe of recipes) {
    let isMatched = true

    for (const keyword of keywords) {
      if (searchType === 'tag') {
        if (
          !(
            recipe.appliance
              .toLowerCase()
              .includes(keyword.toLowerCase()) ||
                        recipe.ustensils.some((ustensil) =>
                          ustensil
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                        ) ||
                        recipe.ingredients.some((ingredient) =>
                          ingredient.ingredient
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                        )
          )
        ) {
          isMatched = false
          break
        }
      } else if (searchType === 'input') {
        const titleDescriptionString = (
          recipe.name +
                    ' ' +
                    recipe.description
        ).toLowerCase()
        const allIngredientsString = recipe.ingredients
          .map((ingredient) => ingredient.ingredient.toLowerCase())
          .join(' ')

        if (
          !(
            titleDescriptionString.includes(
              keyword.toLowerCase()
            ) ||
                        allIngredientsString.includes(keyword.toLowerCase())
          )
        ) {
          isMatched = false
          break
        }
      }
    }

    if (isMatched) {
      filteredRecipes.push(recipe)
    }
  }

  return filteredRecipes
}

// export const filterAlgorithm = (recipes, keywords, searchType) => {
//   return recipes.filter((recipe) => {
//     // eslint-disable-next-line array-callback-return
//     return keywords.every((keyword) => {
//       if (searchType === 'tag') {
//         return (
//           recipe.appliance
//             .toLowerCase()
//             .includes(keyword.toLowerCase()) ||
//                     recipe.ustensils.some((ustensil) =>
//                       ustensil.toLowerCase().includes(keyword.toLowerCase())
//                     ) ||
//                     recipe.ingredients.some((ingredient) =>
//                       ingredient.ingredient
//                         .toLowerCase()
//                         .includes(keyword.toLowerCase())
//                     )
//         )
//       } else if (searchType === 'input') {
//         const titleDescriptionString = (
//           recipe.name +
//                     ' ' +
//                     recipe.description
//         ).toLowerCase()
//         const allIngredientsString = recipe.ingredients
//           .map((ingredient) => ingredient.ingredient.toLowerCase())
//           .join(' ')

//         return (
//           titleDescriptionString.includes(keyword.toLowerCase()) ||
//                     allIngredientsString.includes(keyword.toLowerCase())
//         )
//       }
//     })
//   })
// }

/**
 * Debounces a function call to limit the rate of execution.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Handles the removal of cross symbols and triggers the update of recipe cards and filter selections.
 * @param {HTMLElement} i - The input element.
 */
export const eraseCross = (e, i) => {
  i.value = ''
  i.parentElement.lastElementChild.style.marginLeft =
        i.id === 'search' ? '-60px' : '-22px'
  e.remove()

  recipeFactory.updateCards()
  filterFactory.updateDropdownOptions(i)
}

/**
 * Creates an HTML element with specified attributes and children.
 * @param {string} type - The type of HTML element.
 * @param {Object} attributes - The attributes to apply to the element.
 * @param {Array} children - The child elements or text nodes.
 * @returns {HTMLElement} - The created HTML element.
 */
export const createElement = (type, attributes = {}, children = []) => {
  const element = document.createElement(type)

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value)
  }

  for (const child of children) {
    if (child instanceof HTMLElement) {
      element.appendChild(child)
    } else {
      const textNode = document.createTextNode(child)
      element.appendChild(textNode)
    }
  }

  return element
}

/**
 * Handles the removal of cross symbols and triggers the update of recipe cards and filter selections.
 * @param {HTMLElement} i - The input element.
 */
export const handleCross = (i) => {
  const cross = i.parentElement.querySelector('.cross')

  const crossPicture = createElement('img', {
    class: i.id === 'search' ? 'cross' : 'cross cross-dropdown',
    src: './assets/images/Cross.svg',
    alt: 'Croix'
  })
  crossPicture.addEventListener('click', () => eraseCross(crossPicture, i))

  if (i.value.length < 1) return cross ? eraseCross(cross, i) : 0
  if (cross) return

  i.parentElement.lastElementChild.style.marginLeft = 'unset'
  i.parentElement.insertBefore(
    crossPicture,
    i.parentElement.lastElementChild
  )
}
