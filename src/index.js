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
const winnerDisplay = document.querySelector('.winner-display span')
const shadow = document.createElement('div')

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
const destroyerComp = createShip(2, 'destroyer')
const submarineComp = createShip(3, 'submarine')
const cruiserComp = createShip(3, 'cruiser')
const battleshipComp = createShip(4, 'battleship')
const carrierComp = createShip(5, 'carrier')
const shipArr = [destroyer, submarine, cruiser, battleship, carrier]
const compShipArr = [destroyerComp, submarineComp, cruiserComp, battleshipComp, carrierComp]
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

let placementPhase = false

function startGame () { 
  placementPhase = true
  startBtn.textContent = 'End Game'
  startBtn.removeEventListener('click', startGame)
  startBtn.addEventListener('click', endGame)
  flipBTN.addEventListener('click', flipShips)

  userBoard.forEach(square => {
    square.addEventListener('click', placeShips)})

  compBoard.forEach(square => {
    square.addEventListener('click',handleGuess)})

  turnDisplay.textContent = 'Your Turn'  
  infoDisplay.textContent = 'Place your ships'
  toggleShadow()
}

function endGame () {
  console.log("===end game ===")
  startBtn.textContent = 'Play Again'
  flipBTN.removeEventListener('click', flipShips)
  removeUserBoardListeners ()
  removeCompBoardListeners ()
  startBtn.addEventListener('click', resetGameState)
  turnDisplay.textContent = 'Play Again?'
  infoDisplay.textContent = 'The Game has ended'
}
function resetGameState () {
  winnerDisplay.textContent = ''

  compBoard.every(square => square.className = "square")
  userBoard.every(square => square.className = "square")

  shipArr.forEach(ship => ship.hitCount = 0)
  shipArr.forEach(ship => ship.isSunk = false)

  compShipArr.forEach(ship => ship.hitCount = 0)
  compShipArr.forEach(ship => ship.isSunk = false)

  placedShipsContainer.length = 0
  placedShipsContainer.push(destroyer, submarine, cruiser, battleship, carrier)
  startBtn.removeEventListener('click', resetGameState)
  startBtn.addEventListener('click', startGame)
  startGame()
}

function addCompBoardListeners () {
  compBoard.forEach(square => {
    square.addEventListener('click',handleGuess)})
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
  removeCompBoardListeners()
  userTurn = !userTurn
  if(userTurn){
    addCompBoardListeners ()
    turnDisplay.textContent = 'Your turn'
  }else setTimeout(() => {
    compGuess()}, 2000), turnDisplay.textContent = 'The Computers turn'
 
}

function handleGuess (e) {
  const square = e.target
  let shipName

  if(square.classList.contains('target-miss')
  || square.classList.contains('target-hit')
  ){return}
  
  if( square.classList.contains('taken') ){
    updateUi ('You hit a ship!') 

    shipName = square.classList[1]
    const shipArrIndex = shipArr.findIndex(ship => ship.name === shipName)
    const targetShip = shipArr[shipArrIndex]
    targetShip.hitAndSink()
    square.classList.add('target-hit')
    
    if(targetShip.isSunk === true){
      updateUi (`You sunk the ${shipName}`)
      checkWin()
    }
    
    return
  }else updateUi ('You missed!')
  square.classList.add('target-miss')
  
  setTurn ()
}

function compGuess () {
  let shipName
  let square = userBoard[Math.floor(Math.random() * 100)]
  
  if( square.classList.contains('taken') ){
    updateUi ('The Computer hit a ship!') 

    shipName = square.classList[1]
    let shipArrIndex = compShipArr.findIndex(ship => ship.name === shipName)
    let targetShip = compShipArr[shipArrIndex]
    targetShip.hitAndSink()
    square.classList.add('target-hit')
    console.log(compShipArr)
    console.log(shipArr)
    if(targetShip.isSunk === true){
      updateUi (`You sunk the ${shipName}`)
      checkWin()
    }

    setTurn ()

  }else updateUi ('The Computer missed!'),
  square.classList.add('target-miss')
  
  setTurn ()
  console.log("turn")
}
function updateUi (message) {
  infoDisplay.textContent = message
}

function checkWin (sunkShips) {
  console.log(shipArr, "shipArr")
  let userWin = shipArr.every(item => item.isSunk === true)
  let compWin = compShipArr.every(item => item.isSunk === true)
  if(userWin){
    winnerDisplay.textContent = 'You won!'
    endGame ()
  }else if (compWin){
    winnerDisplay.textContent = 'The Computer won :('
    endGame ()
  }
}
    
let isHorizontal = true

function placeShips (e) {
  console.log(placedShipsContainer,"====placeedsguo======")
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
    toggleShadow()
  }  
}
function toggleShadow(){
  if(placementPhase) {
    userBoard.forEach(square => {
      square.addEventListener('mouseover', shipOnPointer )})  
    userBoard.forEach(square => {
      square.addEventListener('mouseout', shipOnPointerOut )})  
  }else userBoard.forEach(square => {
    square.removeEventListener('mouseover', shipOnPointer )}),  
  userBoard.forEach(square => {
    square.removeEventListener('mouseout', shipOnPointerOut )})  

}

function shipOnPointerOut (e) {
  console.log("===========pointer out===========")
  const length = placedShipsContainer[0].length
  const index = e.target.id - 1
  if(isHorizontal){
  for (let i = 0 ; i < length ; i++) {
    userBoard[index + i].classList.remove('square-hover')
  }
}else for (let i = 0 ; i < length ; i++) {
  userBoard[index + i * 10].classList.remove('square-hover')
}
}
function shipOnPointer (e) {
  // square.classList.add('square-hover')
  console.log("e===============", )
  const length = placedShipsContainer[0].length
  const index = e.target.id - 1
  if(isHorizontal){
    for (let i = 0 ; i < length ; i++) {
      userBoard[index + i].classList.add('square-hover')
    }
  } else for (let i = 0 ; i < length ; i++) {
    userBoard[index + i * 10].classList.add('square-hover')
  }
}
function flipShips () {
  isHorizontal = !isHorizontal
}

export { startGame }
