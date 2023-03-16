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

const destroyer = createShip(2, 'destroyer')
const submarine = createShip(3, 'submarine')
const cruiser = createShip(3, 'cruiser')
const battleship = createShip(4, 'battleship')
const carrier = createShip(5, 'carrier')
const shipArr = [destroyer, submarine, cruiser, battleship, carrier]

function placeComputerShips (shipName, shipLength) {

  const randomIndex = Math.floor(Math.random() * 100)

  let validIndex = randomIndex <= (100 - shipLength) ? randomIndex : (100 - shipLength)

  let moreValidindex = [...validIndex + '']
  
  if(moreValidindex[1] === '0' ) {
    validIndex = validIndex + 1
  }
  else if (moreValidindex[1] === undefined) {
    if(Number(moreValidindex[0]) + Number(shipLength) > 10) {
      validIndex = validIndex - shipLength
    }
  }
  else if(Number(moreValidindex[1]) + Number(shipLength) > 10 ) {
    let newNum = Number(moreValidindex[1] - shipLength)
    validIndex = Number(`${moreValidindex[0]}${newNum}`)
  }

  validIndex === 0 ? validIndex + 1 : validIndex

  let shipCoord = []
 

    for (let i = 0; i < shipLength; i++) {
      shipCoord.push(compSquare[validIndex + i - 1])
          // compSquare[validIndex + i - 1].classList.add(shipName)
          // compSquare[validIndex + i - 1].classList.add('taken')
  }
  const notTaken = shipCoord.every(ship => !ship.classList.contains('taken'))
  console.log(shipCoord)
  if ( shipCoord.every(ship => !ship.classList.contains('taken')) ) {
    shipCoord.forEach(ship => {
      ship.classList.add(shipName)
      ship.classList.add('taken')
    })
  } else {
    placeComputerShips(shipName, shipLength)
  }
}
shipArr.forEach(ship => placeComputerShips (ship.name, ship.length))
function playGame () {  
  console.log('playing game')
}

export { playGame }
