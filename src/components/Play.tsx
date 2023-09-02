import { Dispatch } from 'react';
import { DeckAction } from './reducers/deck';
import { Deck } from '../types/deck';

interface PlayProp {
  deck: Deck,
  dispatch: Dispatch<DeckAction>,
}

function Play({
  deck,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch,
}: PlayProp) {
  return (
    <div className="play-component">
      <p>
        {`Deck ${JSON.stringify(deck)}`}
      </p>
    </div>
  );
}

export default Play;
