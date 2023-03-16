// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { createShip } from './ship'
import createBoard from './gameboard'
import { check } from 'prettier'

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
  const isHorizontal = Math.random() < 0.5
  console.log(isHorizontal)

  let validIndex = randomIndex <= (100 - shipLength) ? randomIndex : (100 - shipLength)

  let splitValidindex = [...validIndex + '']
  
  if(splitValidindex[1] === '0' ) {
    validIndex = validIndex + 1
  }
  else if (splitValidindex[1] === undefined) {
    if(Number(splitValidindex[0]) + Number(shipLength) > 10) {
      validIndex = validIndex - shipLength
    }
  }
  else if(Number(splitValidindex[1]) + Number(shipLength) > 10 ) {
    let newNum = Number(splitValidindex[1] - shipLength)
    validIndex = Number(`${splitValidindex[0]}${newNum}`)
  }

  validIndex === 0 ? validIndex = validIndex + 1 : validIndex
  const inBounds = validIndex + (shipLength * 10) > 100
  if(!isHorizontal && inBounds){
    validIndex = validIndex - (shipLength * 10)
  }

  let shipCoord = []

  for (let i = 0; i < shipLength; i++) {
    if(isHorizontal){
      shipCoord.push(compSquare[validIndex + i - 1])
    } else shipCoord.push(compSquare[validIndex + i * 10 ])
  }

  const notTaken = shipCoord.every(ship => !ship.classList.contains('taken'))
  
  if ( notTaken ) {
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
compSquare.forEach(square => {
  square.addEventListener('click',handleGuess)
})

let sunkShips = []

function handleGuess (e) {
  
  let shipName
  let square = e.target

  if( square.classList.contains('taken') ){

    shipName = square.classList[1]
    let shipArrIndex = shipArr.findIndex(ship => ship.name === shipName)
    let targetShip = shipArr[shipArrIndex]

    targetShip.hitAndSink ()
    square.classList.add('target-hit')

    if(targetShip.isSunk === true){
      sunkShips.push(targetShip)
      console.log(" You sunk the " + shipName)
      checkWin()
    }
  }else
  square.classList.add('target-miss')
  square.removeEventListener ('click', handleGuess)
}

function checkWin () {
  if(sunkShips.length === shipArr.length)
    console.log("=================You Win==================")
}

export { playGame }
