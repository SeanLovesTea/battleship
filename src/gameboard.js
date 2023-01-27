const size = 10

export default function createBoard (grid, squares) {
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div')
    square.classList = 'square'
    square.dataset.id = i
    grid.appendChild(square)
    squares.push(square)
  }
}
