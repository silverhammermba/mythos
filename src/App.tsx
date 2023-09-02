import { useReducer } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import Setup from './components/Setup';
import { deckReducer, initialDeckState } from './components/reducers/deck';
import Play from './components/Play';

const storageKey = 'deck';

function App() {
  const [deck, dispatch] = useReducer(
    deckReducer,
    initialDeckState,
    (initialState) => {
      try {
        const storedDeck = localStorage.getItem(storageKey);
        if (storedDeck) {
          return JSON.parse(storedDeck);
        }
        return initialState;
      } catch (error) {
        console.error('Error parsing deck', error);
        return initialState;
      }
    },
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup deck={deck} dispatch={dispatch} />} />
        <Route path="/play" element={<Play deck={deck} dispatch={dispatch} />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
