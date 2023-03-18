const size = 10

export default function createBoard (grid, squares) {
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div')
    square.classList = 'square'
    square.id = i + 1
    // square.innerHTML = i + 1
    grid.appendChild(square)
    squares.push(square)
    // squares[i].addEventListener('click', () => {
    //   console.log(square)
    // })
  }
}
