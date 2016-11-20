import commonStyles from 'src/common.css'

export function allFillColors() {
  return Object.keys(commonStyles)
    .filter(s => s.startsWith('fill-'))
    .map(s => s.substring('fill-'.length))
}

export function fillClass(color) {
  return color && commonStyles[`fill-${color}`]
}

export function allStrokeColors() {
  return Object.keys(commonStyles)
    .filter(s => s.startsWith('stroke-'))
    .map(s => s.substring('stroke-'.length))
}

export function strokeClass(color) {
  return color && commonStyles[`stroke-${color}`]
}

export function allBackgroundColors() {
  return Object.keys(commonStyles)
    .filter(s => s.startsWith('background-color-'))
    .map(s => s.substring('background-color-'.length))
}

export function backgroundClass(color) {
  return color && commonStyles[`background-color-${color}`]
}

export function allTextColors() {
  return Object.keys(commonStyles)
    .filter(s => s.startsWith('color-'))
    .map(s => s.substring('color-'.length))
}

export function textColorClass(color) {
  return color && commonStyles[`color-${color}`]
}
