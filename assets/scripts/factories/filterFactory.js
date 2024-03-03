import { recipeFactory } from '../index.js'
import { recipes } from '../utils/recipes.js'

/**
 * This module provides functions to create and update filters for recipes.
 * It extracts unique values from a recipe list based on specified properties
 * and creates dropdown menus for each category of filters.
 * It also provides functions to create tag elements and render selections based on user input.
 */

/**
 * Checks if a value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} - True if the value is an object, false otherwise.
 */
const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Extracts unique values for a specified property from a list of recipes.
 * @param {Array} recipeList - The list of recipes.
 * @param {string} property - The property to extract unique values from.
 * @returns {Array} - An array of unique values for the specified property.
 */
const extractUniqueValues = (recipeList, property) => {
  return [
    ...new Set(
      recipeList.flatMap((recipe) =>
        Array.isArray(recipe[property])
          ? recipe[property].map((item) =>
            isObject(item) ? item.ingredient.toLowerCase() : item.toLowerCase()
          )
          : [recipe[property].toLowerCase()]
      )
    )
  ]
}

export const FilterFactory = () => {
  /**
   * Initializes the filter factory by updating filters with the provided recipe list.
   */
  const init = () => {
    updateFilters(recipes)
  }

  /**
     * Updates the filters based on the provided recipe list.
     * @param {Array} recipeList - The list of recipes to update filters with.
     */
  const updateFilters = (recipeList) => {
    const ingredients = extractUniqueValues(recipeList, 'ingredients')
    const utensils = extractUniqueValues(recipeList, 'ustensils')
    const appliances = extractUniqueValues(recipeList, 'appliance')
    const dropdownContainer = document.querySelector(
      '.custom-dropdown-container'
    )
    const selectedTags = recipeFactory.getTags()

    const menu = [
      { name: 'Ingrédients', list: ingredients },
      { name: 'Appareils', list: appliances },
      { name: 'Ustensiles', list: utensils }
    ]
    dropdownContainer.innerHTML = ''
    menu.forEach((category) => {
      const filterHTML = createDropdown(category.name, category.list, selectedTags)
      dropdownContainer.appendChild(filterHTML)
    })
  }

  /**
     * Creates a dropdown menu for a specific category of filters.
     * @param {string} title - The title of the dropdown menu.
     * @param {Array} elements - The elements to be included in the dropdown menu.
     * @returns {HTMLElement} - The created dropdown menu.
     */
  const createDropdown = (title, elements, selectedTags) => {
    const dropdownTitle = createElement('div', {
      className: 'custom-dropdown-title'
    })
    const searchInput = createElement('input', {
      type: 'text',
      name: title,
      id: `${title}-search`
    })

    dropdownTitle.appendChild(createElement('p', {}, title))
    dropdownTitle.appendChild(
      createElement('img', {
        src: './assets/images/Arrow.svg',
        alt: 'Arrow'
      })
    )

    const dropdownSearchBar = createElement('div', {
      className: 'custom-dropdown-searchbar'
    })
    searchInput.addEventListener('keyup', (e) =>
      updateDropdownOptions(e.target)
    )
    dropdownSearchBar.appendChild(searchInput)
    dropdownSearchBar.appendChild(
      createElement('img', {
        src: './assets/images/Loupe.svg',
        alt: 'Loupe'
      })
    )

    const dropdownElements = createElement('div', {
      className: 'custom-dropdown-elements'
    })
    elements.forEach((element) => {
      const p = createElement('p', {}, element)
      if (selectedTags.includes(element)) {
        p.classList.add('custom-filter-selected')
      }
      p.addEventListener('click', (event) =>
        recipeFactory.addTag(event.target)
      )
      dropdownElements.appendChild(p)
    })

    const dropdownContent = createElement('div', {
      className: 'custom-dropdown-content'
    })
    dropdownContent.appendChild(dropdownSearchBar)
    dropdownContent.appendChild(dropdownElements)

    const dropdown = createElement('div', { className: 'custom-dropdown' })
    dropdown.appendChild(dropdownTitle)
    dropdown.appendChild(dropdownContent)

    return dropdown
  }

  /**
     * Creates a tag element with the specified name.
     * @param {string} name - The name of the tag.
     * @returns {HTMLElement} - The created tag element.
     */
  const createTagElement = (name) => {
    const title = `<p>${name}</p>`
    const crossPicture =
            '<img src="./assets/images/Cross.svg" alt="Croix" style="pointer-events: initial;" />'

    const crossPictureClickHandler = (e) => {
      recipeFactory.getTags().forEach((tag) => {
        const element = e.target.parentElement.querySelector('p')
        if (tag === element.innerHTML) { recipeFactory.removeTag(tag) }
      })

      e.target.parentElement.remove()
    }

    const selectionDiv = `<div class="selection">${title}${crossPicture}</div>`
    const wrapper = document.createElement('div')
    wrapper.innerHTML = selectionDiv
    const selectionElement = wrapper.firstChild

    const crossImg = selectionElement.querySelector('img')
    crossImg.addEventListener('click', crossPictureClickHandler)

    return selectionElement
  }

  /**
     * Creates an HTML element with the specified tag, attributes, and content.
     * @param {string} tag - The HTML tag name.
     * @param {Object} attributes - The attributes to be applied to the element.
     * @param {string} content - The content to be added to the element.
     * @returns {HTMLElement} - The created HTML element.
     */
  const createElement = (tag, attributes = {}, content = '') => {
    const element = document.createElement(tag)
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value
    })
    if (content) {
      element.textContent = content
    }
    return element
  }

  /**
     * Renders selections in a dropdown based on user input.
     * @param {HTMLInputElement} inputElement - The input element triggering the rendering.
     */
  const updateDropdownOptions = (inputElement) => {
    if (inputElement.id === 'search') return

    const value = inputElement.value.toUpperCase()
    const selections = inputElement
      .closest('.custom-dropdown')
      .querySelector('.custom-dropdown-elements')
      .querySelectorAll('p')

    selections.forEach((selection) => {
      selection.style.display =
                selection.textContent.toUpperCase().indexOf(value) > -1
                  ? ''
                  : 'none'
    })
  }

  return { init, createTagElement, updateDropdownOptions, updateFilters }
}
