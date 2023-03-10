import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from './Card';

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const ShuffleCard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const deckIdRef = useRef(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [numCardsDrawn, setNumCardsDrawn] = useState(0);

    useEffect(() => {
        async function getDeckId() {
            let d = await axios.get(`${API_BASE_URL}/new/shuffle`);
            deckIdRef.current = d.data.deck_id;
            setIsLoading(false);
        }
        getDeckId();
    }, []);

    useEffect(() => {
        async function drawCard() {
            if (numCardsDrawn === 52) {
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
            }
        }
        drawCard();
    }, [numCardsDrawn])

    const cards = drawnCards.map(c => (
        <Card key={c.id} name={c.name} image={c.image_url} />
    ));

    return (
        <div>
            <button onClick={() => setNumCardsDrawn(numCardsDrawn + 1)}>Draw a Card</button>
            {cards}
        </div>
    );
}

export default ShuffleCard;