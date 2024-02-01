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
