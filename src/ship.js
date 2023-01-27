const shipMethods = {
  randomFunction () {
    return 'random function'
  },
  hit () {
    this.hitCount++
  }
}

function createShip (length) {
  console.log('ship module')
  const ship = Object.create(shipMethods)
  ship.length = length
  ship.hitCount = 0
  ship.isSunk = false
  return ship
}

const smallShip = createShip(2)
const medShip = createShip(3)
const largeShip = createShip(5)
console.log(smallShip.randomFunction())
console.log(medShip)
largeShip.hit()
largeShip.hit()
console.log(largeShip)

export { shipMethods, createShip }
