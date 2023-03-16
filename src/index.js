// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { createShip } from './ship'
import createBoard from './gameboard'
import { check } from 'prettier'

const container = document.querySelector('.container')
const userGrid = document.createElement('div')
const compGrid = document.createElement('div')
const placerBTN = document.querySelector('.placerBTN')
  placerBTN.addEventListener('click', placeShips)
const flipBTN = document.querySelector('.flipBTN')
  flipBTN.addEventListener('click', flipShips)

userGrid.classList.add('grid-user')
userGrid.classList.add('battleship-grid')
compGrid.classList.add('battleship-grid')
compGrid.classList.add('grid-user')
container.appendChild(userGrid)
container.appendChild(compGrid)

const userBoard = []
const compBoard = []

createBoard(userGrid, userBoard)
createBoard(compGrid, compBoard)

const destroyer = createShip(2, 'destroyer')
const submarine = createShip(3, 'submarine')
const cruiser = createShip(3, 'cruiser')
const battleship = createShip(4, 'battleship')
const carrier = createShip(5, 'carrier')
const shipArr = [destroyer, submarine, cruiser, battleship, carrier]

function validatePlacement (startIndex, shipLength, isHorizontal, user) {

  let validIndex = startIndex <= (100 - shipLength) ? startIndex : (100 - shipLength)
  let splitValidindex = [...validIndex + '']
  
  if(isHorizontal && splitValidindex[1] === '0' ) {
    if(user === 'user'){
      return
    }
    validIndex = validIndex + 1
  }

  if (isHorizontal && splitValidindex[1] === undefined) {
    if(Number(splitValidindex[0]) + (Number(shipLength) - 1 ) > 10  ) {
      if(user === 'user'){
        return
      }
      validIndex = validIndex - shipLength
    }
  }

  if(isHorizontal && Number(splitValidindex[1]) + (Number(shipLength) - 1 ) > 10  ) {
    if(user === 'user'){
      return
    }
    let newNum = Number(splitValidindex[1] - shipLength)
    validIndex = Number(`${splitValidindex[0]}${newNum}`)
    }  
  if(!isHorizontal && validIndex + (shipLength * 10) - 10 > 100){

  }
  validIndex === 0 ? validIndex = validIndex + 1 : validIndex

  const inBounds = validIndex + (shipLength * 10) - 10 > 100

  if(!isHorizontal && inBounds){
    if(user === 'user'){
      return
    }
    validIndex = validIndex - (shipLength * 10)
  }
  return validIndex
}

function placeComputerShips (shipName, shipLength, startIndex) {

  const randomIndex = Math.floor(Math.random() * 100)
  const isHorizontal = Math.random() < 0.5
  startIndex = randomIndex

  let validIndex = validatePlacement (startIndex, shipLength, isHorizontal)

  let shipCoord = []
  for (let i = 0; i < shipLength; i++) {
    if( isHorizontal ){
      shipCoord.push(compBoard[validIndex + i - 1])
    } else shipCoord.push(compBoard[validIndex + i * 10 ])
  }

  const notTaken = shipCoord.every(ship => !ship.classList.contains('taken'))

  if (notTaken) {
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
compBoard.forEach(square => {
  square.addEventListener('click',handleGuess)
})



function handleGuess (e) {
  let sunkShips = []
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
      checkWin(sunkShips)
    }
  }else
  square.classList.add('target-miss')
  square.removeEventListener ('click', handleGuess)
}

function checkWin (sunkShips) {
  if(sunkShips.length === shipArr.length)
    console.log("=================You Win==================")
}

userBoard.forEach(square => {
  square.addEventListener('click', placeShips)
})

let isHorizontal = true
let placementPhase = false

function placeShips (e) {

  let placedShipsContainer = shipArr
  let ship = shipArr[0]
  let shipName = ship.name
  console.log(userBoard[50], "===userboard===")
  console.log(ship.length, "===ship===")

  let square = e.target
  let startIndex = Number(e.target.id)
  
  let validIndex = validatePlacement (startIndex, ship.length, isHorizontal, 'user')

  console.log(validIndex,e.target.id, "===index and id===")
  let userCoord = []

  
    for( let i = 0; i < ship.length; i++){
      if(isHorizontal){
      userCoord.push(userBoard[validIndex + i -1 ])
    } else userCoord.push(userBoard[validIndex - 1 + i * 10])
    
  }

  console.log(userCoord, "===usercoord===")
  const notTaken = userCoord.every(ship => !ship.classList.contains('taken'))

  if(notTaken){
    userCoord.forEach(ship => {
        ship.classList.add(shipName)
        ship.classList.add('taken')
      })
      placedShipsContainer.shift()
  }
    
    console.log(placedShipsContainer )
    if( placedShipsContainer.length === 0){
      console.log("=====all ships placed ====")
      userBoard.forEach(square => {
        square.removeEventListener('click', placeShips)
      })
      userBoard.forEach(square => {
        square.removeEventListener('click', handleGuess)
      })
    }
    console.log(userCoord)
}
function flipShips () {
  isHorizontal = !isHorizontal
  console.log("flip ships",  isHorizontal)
}

export { playGame }
