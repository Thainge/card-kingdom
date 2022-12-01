import { ContextFunction } from '../Contexts/contextProvider';

function deckHook() {
    const obj = ContextFunction();
    const { cards, setCards, deck, setDeck } = obj;

    // Add card to deck
    const deckAddCard = (value) => {
        let item = { ...value, indeck: true };

        // Update cards array
        setCards((prevVal) => {
            let newArray = [...prevVal];
            let foundIndex = prevVal.findIndex(x => x.id == item.id);
            newArray[foundIndex] = item;
            return newArray;
        });

        // Update deck
        setDeck((prevVal) => {
            let newDeck = [...prevVal, item];
            return newDeck;
        });
    }

    // Removes card from deck
    const deckRemoveCard = (value) => {
        let item = { ...value, indeck: false };

        // Update cards array
        setCards((prevVal) => {
            let newArray = [...prevVal];
            let foundIndex = prevVal.findIndex(x => x.id == item.id);
            newArray[foundIndex] = item;
            return newArray;
        })

        // Update deck
        setDeck((prevVal) => {
            let deckArray = [...deck];
            let foundDeckIndex = deck.findIndex(x => x.id == item.id);
            deckArray.splice(foundDeckIndex, 1);
            return deckArray;
        });
    }

    // Resets deck to default
    const deckReset = () => {
        setDeck((prevVal) => {
            return [];
        });
        setCards((prevVal) => {
            let newData = [];
            prevVal.forEach(element => {
                let newItem = { ...element, indeck: false };
                newData.push(newItem);
            });
            return newData;
        });
    }

    return {
        deckAddCard,
        deckRemoveCard,
        deckReset,
    };
}

export default deckHook;