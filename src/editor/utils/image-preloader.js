/* eslint-disable no-invalid-this */

import { PALETTE_BRUSHES, PALETTE_IMAGES_PATH } from 'src/utils/ImageLoader'

// TODO: move image map to Redux store and populate on editor mount
const imageMap = []

export function preloadImages() {
  preloadImageLoop(0)
}

export function getImageFromFileName(fileName) {
  for (let i = 0; i < imageMap.length; i++) {
    if (imageMap[i].fileName === fileName) {
      return imageMap[i].image
    }
  }
  return null
}

function preloadImageLoop(index) {
  const fileName = PALETTE_BRUSHES[index].fileName
  const image = new Image()
  image.onload = function () {
    imageMap.push({ fileName, image: this })

    if (index + 1 < PALETTE_BRUSHES.length) {
      preloadImageLoop(index + 1)
    }
  }
  image.src = `${PALETTE_IMAGES_PATH}/${fileName}.png`
}
