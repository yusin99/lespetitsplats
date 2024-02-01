import { recipes } from '../utils/recipes.js'
import { createCard } from '../utils/index.js'

export const cardFactory = () => {
  const cards = []
  const cardSection = document.querySelector('.custom-card-container')

  const init = () => {
    recipes.forEach((r) => {
      addCards(r)
    })
    console.log(cards)
  }

  function addCards (card) {
    const c = createCard(card)

    cardSection.innerHTML += c
    cards.push(card)
  }

  return { init }
}
