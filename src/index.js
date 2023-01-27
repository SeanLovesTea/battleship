// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import { createShip } from './ship'

const smallShip = createShip(2)
const medShip = createShip(3)
const largeShip = createShip(5)
console.log(smallShip.randomFunction())
console.log(medShip)
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
largeShip.hitAndSink()
console.log(largeShip)
console.log('index.js')
