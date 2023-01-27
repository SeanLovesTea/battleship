// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { createShip } from './ship'
import createBoard from './gameboard'

const container = document.querySelector('.container')
const userGrid = document.createElement('div')
const compGrid = document.createElement('div')
userGrid.classList.add('grid-user')
userGrid.classList.add('battleship-grid')
compGrid.classList.add('battleship-grid')
compGrid.classList.add('grid-user')
container.appendChild(userGrid)
container.appendChild(compGrid)

const userSquare = []
const compSquare = []

createBoard(userGrid, userSquare)
createBoard(compGrid, compSquare)

const smallShip = createShip(2)
const medShip = createShip(3)
const largeShip = createShip(5)

console.log(smallShip)
console.log(medShip)

largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()

console.log(largeShip)

console.log(userGrid)

console.log(largeShip)
