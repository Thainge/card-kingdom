import React, { useContext, useState, useEffect, useReducer, createContext } from 'react';
import GameData from '../Data/GameData';
import ls from 'local-storage';
import mapFile from '../Assets/sounds/starting/mapMusic.mp3';
import battleFile from '../Assets/sounds/starting/battleMusic.mp3';

const { userData, cardsData } = GameData;

const Context = createContext();

export function ContextFunction() {
    return useContext(Context)
}

export function InputProvider({ children }) {
    // Initial localStorageValues
    const storedUser = ls.get('user');
    const storedCards = ls.get('cards');
    const storedDeck = ls.get('deck');

    // User data like gold, upgrades, stars, and current deck
    let userDefaultData = userData;
    if (storedUser) {
        userDefaultData = storedUser;
    }
    const [user, setUser] = useState(userDefaultData);

    // All cards
    let cardsDefaultData = cardsData;
    if (storedCards) {
        cardsDefaultData = storedCards;
    }
    const [cards, setCards] = useState(cardsDefaultData);

    let defaultDeck = [
        cardsData[0],
        cardsData[1],
        cardsData[2],
        cardsData[3],
    ]
    defaultDeck.forEach((item) => {
        item.owned = true;
        item.indeck = true;
    })

    // Deck cards
    if (storedDeck) {
        defaultDeck = storedDeck;
    }
    const [deck, setDeck] = useState(defaultDeck);

    const [music, setMusic] = useState({
        playingMusic1: false,
        playingMusic2: false,
    });

    const [battleAudio] = useState(new Audio(battleFile));
    const [mapAudio] = useState(new Audio(mapFile));
    const [muteIsActive, setMuteIsActive] = useState(false);

    useEffect(() => {
        if (music.playingMusic1 === true && muteIsActive === false) {
            battleAudio.pause();
            mapAudio.load();
            mapAudio.play();
            mapAudio.loop = true;
            mapAudio.volume = mapAudio.volume = .2;
        } else if (music.playingMusic1 === false) {
            mapAudio.pause();
        }
    }, [music.playingMusic1]);

    useEffect(() => {
        if (music.playingMusic2 === true && muteIsActive === false) {
            mapAudio.pause();
            battleAudio.load();
            battleAudio.play();
            battleAudio.loop = true;
            battleAudio.volume = mapAudio.volume = .2;
        } else if (music.playingMusic2 === false) {
            battleAudio.pause();
        }
    }, [music.playingMusic2]);

    // Update localStorage on change
    // useEffect(() => {
    //     ls.set('cards', cards);
    // }, [cards])

    // useEffect(() => {
    //     ls.set('deck', deck);
    // }, [deck])

    // useEffect(() => {
    //     ls.set('user', user);
    // }, [user])

    let obj = {
        user: user,
        setUser: setUser,
        cards: cards,
        setCards: setCards,
        deck: deck,
        setDeck: setDeck,
        music: music,
        setMusic: setMusic,
        muteIsActive: muteIsActive,
        setMuteIsActive: setMuteIsActive,
    }

    return (
        <Context.Provider value={obj}>
            {children}
        </Context.Provider>
    )
}