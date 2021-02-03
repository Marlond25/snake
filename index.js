const { useState, useEffect, useRef } = React;

function Grid({snake, food}) {
  const grid = [];
  let key = -1;

  // Render Grid
  for (let i = 0; i < 40; i++) {
    const column = [];
    for (let j = 0; j < 40; j++) {
      column.push('Space');
    }
    grid.push(column);
  }

  // Display Snake
  for (let i = 0; i < snake.length; i++) {
    grid[snake[i][1]].splice(snake[i][0], 1, 'Snake');
  }
  // Display Food
  for (let i = 0; i < snake.length; i++) {
    grid[food[0]].splice(food[1], 1, 'Food');
  }

  return (
    grid.map((col) => {
      return col.map((row) => {
        key +=1
        return <div key={key} className={row}></div>
      })
    })
  )
}

function App() { 
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState(
    [
      [20, 20], 
      [19, 20], 
      [18, 20]
    ]
  );
  const [food, setFood] = useState([10, 15]);
  const [direction, setDirection] = useState('right');
  const [gameStarted, setGameStarted] = useState(5000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useEffect(() => {
      document.addEventListener('keydown', keydownHandler, false);
      return () => {};
  }, [keydownHandler])

  const keydownHandler = (event) => {
    const { keyCode } = event;
    switch( keyCode ) {
      case 37:
              setDirection('left');
              break;
      case 38:
              setDirection('up');
              break;                   
      case 39:
            setDirection('right');
            break;
      case 40:
            setDirection('down');
            break;
      default:
          break;            
        }
  }

  const moveSnake = () => {
    const newSnake = [...snake];
    if ((newSnake[0][0] === food[1]) && (newSnake[0][1] === food[0])) {
      const tail = newSnake[newSnake.length];
      newSnake.push([tail]);
      console.log(gameStarted);
      setGameStarted(gameStarted - (gameStarted * 0.1));
      console.log(gameStarted);
      setFood([Math.floor(Math.random() * 40 ), Math.floor(Math.random() * 40 )]);
    }
    if (newSnake[0][0] > 39 || newSnake[0][0] < 0 || newSnake[0][1] > 39 || newSnake[0][1] < 0) {
      setGameOver(true);
    } else {
      if (direction === 'left') {
        const head = [newSnake[0][0] - 1, newSnake[0][1]];
        newSnake.unshift(head);
        newSnake.pop();
      } else if (direction === 'up') {
        const head = [newSnake[0][0], newSnake[0][1] - 1];
        newSnake.unshift(head);
        newSnake.pop();
      } else if (direction === 'right') {
        const head = [newSnake[0][0] + 1, newSnake[0][1]];
        newSnake.unshift(head);
        newSnake.pop();
      } else if (direction === 'down') {
        const head = [newSnake[0][0], newSnake[0][1] + 1];
        newSnake.unshift(head);
        newSnake.pop();
      }
      setSnake(newSnake);
    }
  }

  useInterval(moveSnake, gameStarted);
  return (
    gameOver ? 
      <h1>Game Over!</h1> : 
      <div>
        <div className="Grid">
          <Grid snake={snake} food={food} />
        </div>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setGameStarted(200)}
        >
          Start
        </button>
        <div className="Movements">
          <button 
            id="Up"
            type="button" 
            className="btn btn-primary"
            onClick={() => setDirection('up')}
          >
            Up
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setDirection('left')}
          >
            Left
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setDirection('down')}
          >
            Down
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setDirection('right')}
          >
            Right
          </button>
        </div>
      </div>
  )
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);