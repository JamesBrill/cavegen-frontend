export function positionsBetweenPoints(first, second) {
  const iterations = Math.max(Math.abs(first.x - second.x), Math.abs((first.y - second.y)))
  const xDifference = second.x - first.x
  const yDifference = second.y - first.y
  const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference)
  const xDirectionComponent = xDifference / distance
  const yDirectionComponent = yDifference / distance

  const positions = []
  for (let i = 0.0; i <= 1.0; i += (1.0 / iterations)) {
    if (distance === 0.0) {
      positions.push(first)
    } else {
      const intermediateXCoordinate = Math.round(first.x + xDirectionComponent * distance * i)
      const intermediateYCoordinate = Math.round(first.y + yDirectionComponent * distance * i)

      positions.push({ x: intermediateXCoordinate, y: intermediateYCoordinate })
    }
  }
  return positions
}
