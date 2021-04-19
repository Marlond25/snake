const { useState, useEffect, useRef } = React;

function Grid({snake, food, ints}) {
  if (snake[0][0] > 39 || snake[0][0] < 0 || snake[0][1] > 39 || snake[0][1] < 0) {
    return (
      <h1 className="GameOver">Game Over!</h1>
    )
  } else {
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
}

function App() { 
  const [snake, setSnake] = useState(
    [
      [20, 20], 
      [19, 20], 
      [18, 20]
    ]
  );
  const [food, setFood] = useState([10, 15]);
  const [direction, setDirection] = useState('right');
  const [gameSpeed, setGameSpeed] = useState(5000);
  const [score, setScore] = useState(0);

  const reset = () => {
    setSnake(
      [
        [20, 20], 
        [19, 20], 
        [18, 20]
      ]
    );
    setDirection('right');
    setGameSpeed(300);
    setScore(0);
  }

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
    // Game Over
    if (snake[0][0] > 39 || snake[0][0] < 0 || snake[0][1] > 39 || snake[0][1] < 0) {
      return;
    } else {
      const newSnake = [...snake];
      // Grow Snake
      if ((newSnake[0][0] === food[1]) && (newSnake[0][1] === food[0])) {
        const tail = newSnake[newSnake.length];
        setScore(c => c + 1);
        newSnake.push([tail]);
        if (gameSpeed > 40) {
          setGameSpeed(gameSpeed - (gameSpeed * 0.1));
        }
        setFood([Math.floor(Math.random() * 40 ), Math.floor(Math.random() * 40 )]);
      }
      const head = [];
      switch (direction) {
        case 'left':
          head.push(newSnake[0][0] - 1)
          head.push(newSnake[0][1]);
        case 'up':
          head.push(newSnake[0][0])
          head.push(newSnake[0][1] - 1);                   
        case 'right':
          head.push(newSnake[0][0] + 1)
          head.push(newSnake[0][1]);
        case 'down':
          head.push(newSnake[0][0])
          head.push(newSnake[0][1] + 1);
        default:
          newSnake.unshift(head);
          newSnake.pop();
          setSnake(newSnake);
          break;            
      }
    }     
  }

  useInterval(moveSnake, gameSpeed);
  return (
    <div>
      <h1 className="Score">Score: {score}</h1>
      <div className="Grid">
        <Grid snake={snake} food={food} />
      </div>
      <button 
        type="button" 
        className="btn btn-primary"
        onClick={() => setGameSpeed(300)}
      >
        Start
      </button>
      <button 
        type="button" 
        className="btn btn-primary"
        onClick={reset}
      >
        Reset
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