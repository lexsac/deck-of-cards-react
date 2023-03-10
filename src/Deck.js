import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from './Card';

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const ShuffleCard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const deckIdRef = useRef(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [numCardsDrawn, setNumCardsDrawn] = useState(0);

    const [autoDraw, setAutoDraw] = useState(false);
    const timerId = useRef(null);

    useEffect(() => {
        async function getDeckId() {
            let d = await axios.get(`${API_BASE_URL}/new/shuffle`);
            deckIdRef.current = d.data.deck_id;
            setIsLoading(false);
        }
        getDeckId();
    }, []);

    const drawCard = async () => {
        if (numCardsDrawn === 52) {
            setAutoDraw(false);
            alert('Error: no cards remaining!');
        } else {
            let cardData = await axios.get(`${API_BASE_URL}/${deckIdRef.current}/draw`);
            let card = cardData.data.cards[0];

            setDrawnCards(d => [
                ...d,
                {
                    id: card.code,
                    name: card.value + ' of ' + card.suit,
                    image_url: card.image
                }
            ]);
            setNumCardsDrawn(numCardsDrawn + 1);
        }
    }

    useEffect(() => {
        if (autoDraw) {
            timerId.current = setInterval(() => {
                drawCard();
            }, 1000);
        } else {
            clearInterval(timerId.current);
        }
        return () => clearInterval(timerId.current);
    }, [autoDraw, numCardsDrawn])
      
    const toggleAutoDraw = () => {
        setAutoDraw(autoDraw => !autoDraw);
    }

    const cards = drawnCards.map(c => (
        <Card key={c.id} name={c.name} image={c.image_url} />
    ));

    const restartGame = () => {
        setDrawnCards([]);
        setNumCardsDrawn(0);
        setAutoDraw(false);
    }

    return (
        <div>
            <button onClick={drawCard}>Draw a card</button>
            <button onClick={toggleAutoDraw}>{(autoDraw) ? 'Stop drawing' : 'Start drawing'}</button>
            <button onClick={restartGame}>Restart game</button>
            <p>Number of cards drawn: {numCardsDrawn}</p>
            {cards}
        </div>
    );
}

export default ShuffleCard;