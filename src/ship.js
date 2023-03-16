const shipMethods = {
  hitAndSink () {
    if (this.hitCount >= this.length) {
      this.isSunk = true
      return
    } this.hitCount++
  }
}

function createShip (length, name) {
  const ship = Object.create(shipMethods)
  ship.name = name
  ship.length = length
  ship.hitCount = 0
  ship.isSunk = false
  return ship
}

export { shipMethods, createShip }
