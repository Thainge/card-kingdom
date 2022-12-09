import React, { useEffect, useRef, useState } from 'react';
import styles from './Deck.module.css';
import deckHook from '../../Hooks/deckHook';
import { ContextFunction } from '../../Contexts/contextProvider';
import Fade from 'react-reveal/Fade';

import backgroundImage1 from '../../Assets/MenuTabs/Deck/back1.png';
import backgroundImage2 from '../../Assets/box.png';
import DeckCard from '../DeckCard/DeckCard';
import DeckCardDeck from '../DeckCardDeck/DeckCardDeck';

import buttonSound from '../../Assets/sounds/starting/button.mp3';
import buttonCloseSound from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';
import TutorialModal from '../tutorial/tutorial';

const lockedCard = require('../../Assets/lockedBack.png');

const close = require('../../Assets/MainMenu/close.png');
const closeActive = require('../../Assets/MainMenu/closeActive.png');

function DeckModal({ setIsOpen, isOpen }) {
    const [soundButton] = useSound(buttonSound, { volume: .5 });
    const [closeButton] = useSound(buttonCloseSound, { volume: .5 });

    const obj = ContextFunction();
    const { user, cards, deck, setUser } = obj;

    const {
        deckAddCard,
        deckRemoveCard,
        deckReset,
    } = deckHook();

    // error message
    const [error, setError] = useState('');

    useEffect(() => {
        if (error.length > 1) {
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    }, [error])

    // Difference in deck cards
    const [differenceArray, setDifferenceArray] = useState([]);
    let v1 = user.special[2].bought ? 1 : 0;
    let v2 = user.special[3].bought ? 1 : 0;
    let v3 = user.special[4].bought ? 1 : 0;
    let v4 = user.special[5].bought ? 1 : 0;
    let initalVal = v1 + v2 + v3 + v4;

    // Closes modal
    const [state, setState] = useState(close);
    const setStateFunction = (value) => {
        const newVal = value;
        setState(newVal);
    }

    function closeModal() {
        closeButton();
        setIsOpen(false);
    }

    /* ----------------- UseEffect Logic Start ----------------- */

    let allCards = cards;
    let filteredCards = allCards.filter((item, index) => {
        return item.owned === true;
    })
    const [currentCards, setCurrentCards] = useState(filteredCards);
    const [deckCards, setdeckCards] = useState(deck);

    const [currentSortIndex, setCurrentSortIndex] = useState(0);
    const [currentSortName, setCurrentSortName] = useState('color');

    const ref = useRef();

    // Sort filters
    const sortFilters = [
        'color',
        'common',
        'rare',
        'epic',
        'legendary',
        'attack',
        'health',
    ]

    // Whenever cards change in any way, update cards list and then sort by current sort
    useEffect(() => {
        setCurrentCards((currentCardsPrev) => {
            let filteredCards = cards.filter((item, index) => {
                return item.owned === true;
            })
            const sorted = [...filteredCards].sort((a, b) => b[currentSortName] - a[currentSortName]);
            return sorted;
        });
    }, [cards])

    const updateDeckFunction = () => {
        let total = 8 + initalVal;
        if (deck.length > total) {
            return;
        } else {
            let difference = total - deck.length;
            let newArr = Array.from(Array(difference).keys())
            let updatedArray = [...deck, ...newArr];
            setdeckCards(updatedArray);
        }
    }

    // Whenever deck changes, update deckCards state
    useEffect(() => {
        updateDeckFunction();
    }, [deck])

    // If shop item is bought and sent to user, check for deck slot
    useEffect(() => {
        let difference = 4 - v1 - v2 - v3 - v4;
        let newArr = Array.from(Array(difference).keys())
        let updatedArray = [...newArr];
        setDifferenceArray(updatedArray)
        updateDeckFunction();
    }, [user])

    // Sort current cards
    const sortCurrentCards = () => {
        let newSortValue = 0;
        if (currentSortIndex < sortFilters.length - 1) {
            newSortValue = currentSortIndex + 1;
        }
        setCurrentSortIndex(newSortValue);


        let newName = sortFilters[currentSortIndex];
        setCurrentSortName(newName);

        setCurrentCards((prevValue) => {
            let filteredCards = cards.filter((item, index) => {
                return item.owned === true;
            })
            const sorted = [...filteredCards].sort((a, b) => b[newName] - a[newName]);
            return sorted;
        });

        ref.current.scrollTop = 0;
    }

    let tutorialArr = [
        {
            text: 'This is the place where you can build an amazing deck with all of your collected cards!',
            top: '0',
            left: '0',
        },
        {
            text: 'Simply double click a card to add it or remove it from your deck.',
            top: '0',
            left: '0',
        },
        {
            text: 'You can also reset your deck or sort your collected cards.',
            top: '0',
            left: '0',
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);

    useEffect(() => {
        if (user && isOpen && user.firstTimeDeck) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeDeck: false };
                return newUserObj;
            });

            setTimeout(() => {
                setReadyToShow(true);
            }, 500)
        }
    }, [isOpen]);

    const [finished, setFinished] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const moveOnToNextStep = () => {
        // if it is finished, move on to next step
        if (finished && currentStep < tutorialArr.length) {
            setFinished(() => false);
            setShowAll(() => false);
            setCurrentStep((prevStep) => {
                let newStep = prevStep + 1;
                return newStep;
            });
        } else if (!finished) {
            setFinished(() => true);
            setShowAll(() => true);
        } else {
            setFinished(false);
            setShowAll(false);
            setCurrentStep(4);
        }
    }

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            {
                tutorialArr.map((item, index) => (
                    <div key={index} onClick={moveOnToNextStep} className={currentStep === index + 1 ? styles.overlayModalTut : styles.fadeInOutTut}>
                        {currentStep === index + 1 && readyToShow ? <TutorialModal setFinished={setFinished} showAll={showAll} index={index + 1} item={item} /> : <></>}
                    </div>
                ))
            }
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <div className={styles.closeButton}>
                    <img src={state}
                        className={styles.close3}
                        onMouseDown={() => setStateFunction(closeActive)}
                        onMouseUp={() => setStateFunction(closeActive)}
                        onMouseOut={() => setStateFunction(closeActive)}
                        onMouseOver={() => setStateFunction(closeActive)}
                        onMouseLeave={() => setStateFunction(close)}
                        onClick={() => closeModal()}>
                    </img>
                </div>
                <div className={styles.Header}>
                    <h1 className={styles.deckHeader}>My Deck</h1>
                </div>
                <div className={styles.cardContainer}>
                    <img src={backgroundImage1} className={styles.backgroundImage}></img>
                    <div className={styles.scrollContainer2}>
                        <img src={backgroundImage2} className={styles.backgroundImage2}></img>
                        <div className={styles.scroll}>
                            <div className={styles.deckButtons3}>
                                <div className={`${styles.overlayBtnText} ${styles.overlayBtn3}`} onClick={() => {
                                    soundButton();
                                    deckReset();
                                }}>
                                    <div className={`${styles.text} ${styles.textBtn3}`}>Reset</div>
                                    <img className={`${styles.btn3} ${styles.sortBtn}`} src={require('../../Assets/MainMenu/button.png')}></img>
                                </div>
                                <div className={styles.deckLength1}>
                                    {deck.length} / {initalVal + 8}
                                </div>
                                {
                                    error.length > 1 ? <Fade right delay={2} duration={500}><div className={styles.error}>
                                        {error}
                                    </div></Fade> : <></>
                                }
                            </div>
                            <div className={styles.overflow}>
                                <div className={styles.paddingOverflow}>
                                    {
                                        deckCards.map((item, index) => (
                                            <DeckCardDeck key={index} item={item} deckRemoveCard={deckRemoveCard} />
                                        ))
                                    }
                                    {
                                        differenceArray.map((item, index) => (
                                            <img key={index} className={`${styles.card} ${styles.deckDisabled}`} src={lockedCard} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.scrollContainer}>
                        <img src={backgroundImage2} className={styles.backgroundImage2}></img>
                        <div className={`${styles.scroll} ${styles.overflow2}`}>
                            <div className={styles.deckButtons3}>
                                <div className={styles.sortContainer}>
                                    <div className={styles.overlayBtnText} onMouseDownCapture={() => {
                                        soundButton();
                                        sortCurrentCards();
                                    }}>
                                        <div className={`${styles.text} ${styles.textBtn3}`}>Sort By:</div>
                                        <img className={`${styles.btn3} ${styles.sortBtn}`} src={require('../../Assets/MainMenu/button.png')}></img>
                                    </div>
                                    <div className={styles.sortText}>{currentSortName}</div>
                                </div>
                                <div className={styles.deckLength1}>
                                    {currentCards.length - deck.length} / {currentCards.length}
                                </div>
                            </div>
                            <div className={styles.overflow}>
                                <div className={styles.paddingOverflow}>
                                    {
                                        currentCards.map((item, index) => (
                                            <DeckCard key={index} deckAddCard={deckAddCard} setError={setError} deckLength={deck.length} initalVal={initalVal} item={item} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeckModal;