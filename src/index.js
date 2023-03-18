// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { createShip } from './ship'
import createBoard from './gameboard'
import { check } from 'prettier'

const container = document.querySelector('.container')
const userGrid = document.createElement('div')
const compGrid = document.createElement('div')
const startBtn = document.querySelector('.placerBTN')
const flipBTN = document.querySelector('.flipBTN')
const turnDisplay = document.querySelector('.turn-display span')
const infoDisplay = document.querySelector('.info-display span')

turnDisplay.textContent = 'Start Game'

startBtn.addEventListener('click', startGame)

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
const compShipArr = [destroyer, submarine, cruiser, battleship, carrier]
const placedShipsContainer = [destroyer, submarine, cruiser, battleship, carrier]

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

function startGame () { 
  flipBTN.addEventListener('click', flipShips)

  userBoard.forEach(square => {
    square.addEventListener('click', placeShips)})

  compBoard.forEach(square => {
    square.addEventListener('click',handleGuess)})

  turnDisplay.textContent = 'Your Turn'  
  infoDisplay.textContent = 'Place your ships'
}

function endGame () {
  console.log("===end game ===")
  flipBTN.removeEventListener('click', flipShips)
  removeUserBoardListeners ()
  removeCompBoardListeners ()
}
function removeUserBoardListeners () {
  userBoard.forEach(square => {
    square.removeEventListener('click', placeShips)})
}
function removeCompBoardListeners () {
  compBoard.forEach(square => {
    square.removeEventListener('click',handleGuess)})  
}
let userTurn = true

function setTurn () {
  userTurn = !userTurn
  if(userTurn){
    turnDisplay.textContent = 'Your turn'
  }else setTimeout(() => {
    compGuess()}, 4000)
  turnDisplay.textContent = 'The Computers turn'

  
}

let sunkShipsComp = []
let sunkShipsUser = []

function handleGuess (e) {

  let shipName
  let square = e.target
  
  if( square.classList.contains('taken') ){
    updateUi ('You hit a ship!') 

    shipName = square.classList[1]
    let shipArrIndex = shipArr.findIndex(ship => ship.name === shipName)
    let targetShip = shipArr[shipArrIndex]
    targetShip.hitAndSink()
    square.classList.add('target-hit')
    
    if(targetShip.isSunk === true){
      sunkShipsUser.push(targetShip)
      updateUi (`You sunk the ${shipName}`)
      console.log(sunkShipsUser)
      checkWin(sunkShipsUser)
    }
    return
  }else updateUi ('You missed!')
  square.classList.add('target-miss')
  setTurn ()
}

function compGuess () {
  setTimeout(()=> {}, 4000)
  let shipName
  let square = userBoard[Math.floor(Math.random() * 100)]
  
  if( square.classList.contains('taken') ){
    updateUi ('The Computer hit a ship!') 

    shipName = square.classList[1]
    let shipArrIndex = compShipArr.findIndex(ship => ship.name === shipName)
    let targetShip = compShipArr[shipArrIndex]
    targetShip.hitAndSink()
    square.classList.add('target-hit')
    
    if(targetShip.isSunk === true){
      sunkShipsComp.push(targetShip)
      updateUi (`You sunk the ${shipName}`)
      console.log(sunkShipsComp)
      checkWin(sunkShipsComp)
    }

    setTimeout(() => {
      compGuess()}, 4000)
  }else updateUi ('The Computer missed!')
  square.classList.add('target-miss')
  
  setTurn ()
  console.log("turn")
}
function updateUi (message) {
  infoDisplay.textContent = message
}
function checkWin (sunkShips) {
  if(sunkShips.length === shipArr.length){
    updateUi('You won')
    endGame ()
  }
}

let isHorizontal = true
let placementPhase = true

function placeShips (e) {
 
  let ship = placedShipsContainer[0]
  let shipName = ship.name
  let square = e.target
  let startIndex = Number(e.target.id)
  
  let validIndex = validatePlacement (startIndex, ship.length, isHorizontal, 'user')

  let userCoord = []
  
    for( let i = 0; i < ship.length; i++){
      if(isHorizontal){
      userCoord.push(userBoard[validIndex + i -1 ])
      } else userCoord.push(userBoard[validIndex - 1 + i * 10])
    }

  const notTaken = userCoord.every(ship => !ship.classList.contains('taken'))

  if(notTaken){
    userCoord.forEach(ship => {
        ship.classList.add(shipName)
        ship.classList.add('taken')
      })
      placedShipsContainer.shift()
  }
    
  if( placedShipsContainer.length === 0){
    placementPhase = false
    userBoard.forEach(square => {
      square.removeEventListener('click', placeShips)
    })
  }
  if(!placementPhase){
    shipArr.forEach(ship => placeComputerShips (ship.name, ship.length))
    infoDisplay.textContent = 'Make your move'
  }
    
}
function flipShips () {
  isHorizontal = !isHorizontal
}

export { startGame }
