import React, { useEffect, useState, useReducer, useRef } from 'react';
import Loader from '../../Components/Loader/Loader';
import { useLocation } from "react-router-dom";
import styles from './Battle.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
import battleLogic from './BattleLogic';
import Victory from '../../Components/Victory/Victory';
import Defeat from '../../Components/Defeat/Defeat';
import Surrender from '../../Components/Surrender/Surrender';
import Fade from 'react-reveal/Fade';
import Rubberband from 'react-reveal/RubberBand';
import buttonSound from '../../Assets/sounds/starting/button.mp3';
import flipCardSound from '../../Assets/sounds/starting/cardFlip.mp3';
import healCardAudio from '../../Assets/sounds/starting/heal.mp3';
import victorySound from '../../Assets/sounds/starting/victory.mp3';
import defeatSound from '../../Assets/sounds/starting/defeat.mp3';
import destroyedCardSound from '../../Assets/sounds/starting/cardDestroyed.mp3';
import burnCardAudio from '../../Assets/sounds/starting/fire.mp3';
import freezeCardAudio from '../../Assets/sounds/starting/freeze.mp3';
import attackCardAudio from '../../Assets/sounds/starting/attack.mp3';
import blockCardAudio from '../../Assets/sounds/starting/block.mp3';
import cardOpenSound from '../../Assets/sounds/starting/cardOpen.mp3';
import useSound from 'use-sound';
import TutorialModal from '../../Components/tutorial/tutorial';

import speedUpImg from '../../Assets/speed1x.png';
import homeImg from '../../Assets/surrender.png';
import BattleCard from '../../Components/BattleCard/BattleCard';
import heart from '../../Assets/tiltedHeart.png';
import arrow from '../../Assets/arrow.png';
import forestImage from '../../Assets/Combat/forest.png';
import snowImage from '../../Assets/Combat/snow.png';
import desertImage from '../../Assets/Combat/desert.png';
import fireImage from '../../Assets/Combat/fire.png';
import arrowActive from '../../Assets/arrowActive.png';
import healImg from '../../Assets/healGIF.gif';
import freezeImg from '../../Assets/flakeGIF.png';
import TrampleImg from '../../Assets/attackGIF.png';
import fireImg from '../../Assets/fireGif.gif';
import blockImg from '../../Assets/blockGIF.png';
import forestBG from '../../Assets/forestBG.png';
import playerBG from '../../Assets/playerBG.png';
import snowBG from '../../Assets/snowBG.png';
import desertBG from '../../Assets/desertBG.png';
import fireBG from '../../Assets/desertBG.png';
import VictoryBossCard from '../../Components/VictoryBossCard/VictoryBossCard';

function BattlePage() {
    const { burnPhaseOpponnent,
        burnPhasePlayer,
        fightCardsPlayer,
        fightCardsOpponnent, } = battleLogic;

    const location = useLocation();
    const deckOpponent = location.state.cards;

    const obj = ContextFunction();
    const { deck, user, setUser, cards, music, setMusic } = obj;

    // Loading effect on page load
    const [loading, setLoading] = useState(true);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    // stops loading once page loaded
    const stopLoading = async () => {
        await timeout(1000);
        setLoading(false);
    }

    // Sound logic
    const [soundButton] = useSound(buttonSound, { volume: .2 });
    const [cardOpen] = useSound(cardOpenSound, { volume: .2 });
    const [cardFlip] = useSound(flipCardSound, { volume: .5 });
    const [victoryAudio] = useSound(victorySound, { volume: .1 });
    const [defeatAudio] = useSound(defeatSound, { volume: .1 });
    const [healCard] = useSound(healCardAudio, { volume: .2 });
    const [burnCard] = useSound(burnCardAudio, { volume: .3 });
    const [freezeCard] = useSound(freezeCardAudio, { volume: .3 });
    const [attackCard] = useSound(attackCardAudio, { volume: .1 });
    const [blockCard] = useSound(blockCardAudio, { volume: .3 });
    const [cardDestroyed] = useSound(destroyedCardSound, { volume: .3 });

    // Randomize deck
    let shuffledCards = shuffle(deck);
    let shuffledCardsOpponent = shuffle(deckOpponent);

    let hand = [];
    let handDiscard = [];

    let handOpponent = [];
    let handDiscardOpponent = [];

    shuffledCards.forEach((item, index) => {
        if (index < 3) {
            hand.push(item);
        } else {
            handDiscard.push(item);
        }
    });

    shuffledCardsOpponent.forEach((item, index) => {
        if (index < 1) {
            handOpponent.push(item);
        } else {
            handDiscardOpponent.push(item);
        }
    });

    // Opponents hand and your hand
    const [currentHandOpponent, setCurrentHandOpponent] = useState(handOpponent);
    const [currentHand, setCurrentHand] = useState(hand);

    // Opponents discard and your discard
    const [currentDiscard, setCurrentDiscard] = useState(handDiscard);
    const [currentDiscardOpponent, setCurrentDiscardOpponent] = useState(handDiscardOpponent);

    // Opponents played cards and your played cards
    const [playedCards, setPlayedCards] = useState([]);
    const [playedCardsOpponent, setPlayedCardsOpponent] = useState([]);

    let initialPlayerTurn = user.special[1].bought ? true : false;
    let initialTime = user.special[1].bought ? false : true;
    let initialCardsShow = user.special[1].bought ? true : false;

    // Who goes first
    const [playerTurn, setPlayerTurn] = useState(initialPlayerTurn);
    const [healthPlayer, setHealthPlayer] = useState(30);
    const [healthOpponent, setHealthOpponent] = useState(30);
    const [currentRound, setCurrentRound] = useState(1);
    const [firstTime, setFirstTime] = useState(initialTime);
    const [showCards, setShowCards] = useState(initialCardsShow);

    // starts loading
    // Default opponent deck and default deck hand
    useEffect(() => {
        stopLoading();

        if (playerTurn === false && firstTime) {
            setTimeout(() => {
                startOpponnentUpKeep();
            }, DELAY)
        }
    }, []);

    const numberInit = 500;
    const [DELAY, setDELAY] = useState(numberInit)

    // Speeds up delays
    const speedUpGame = () => {
        if (DELAY === 500) {
            setDELAY(250);
        } else {
            setDELAY(500);
        }
    }

    const startGame = (item, index, isPlayerTurn) => {
        if (isPlayerTurn) { // Players turn
            // Add card to field and remove from deck
            AddCardPlayer(item, index);
        } else { // Opponents turn
            setTimeout(() => {
                // Add card to field and remove from deck
                AddCardOpponent();
            }, DELAY)
        }
    }

    const [firstAddTimeOpponnent, setFirstAddTimeOpponnent] = useState(true);
    const [firstGreen, setFirstGreen] = useState(true);
    const [firstBlue, setFirstBlue] = useState(true);
    const [firstYellow, setFirstYellow] = useState(true);
    const [firstRed, setFirstRed] = useState(true);

    // Player functions
    const AddCardPlayer = async (item, index) => {
        setShowCards(false);

        // Add card to field
        setPlayedCards((prevState, props) => {
            let newItem = { ...item, dead: false };
            let newPlayedCards = [...prevState, newItem];
            cardFlip();
            return newPlayedCards;
        })

        // Remove card from hand
        setCurrentHand((prevState, props) => {
            let newHand = [...prevState];
            newHand.splice(index, 1);
            return newHand;
        })

        // First played bonuses
        setPlayedCards((prevVal) => {
            let newArr = [...prevVal];
            let itemIndex = newArr.findIndex(x => x.id === item.id);

            // Check for green
            if (firstGreen && item.color === 'green') {
                let newItem = item;
                if (item.blockUpgrade) {
                    newItem = { ...newItem, blockEnabled: true };
                    newArr[itemIndex] = newItem;
                }
                if (item.firstUpgrade) {
                    let newHealth = newItem.health + 1;
                    let newAttack = newItem.attack + 1;
                    newItem = { ...newItem, attack: newAttack, health: newHealth };
                    newArr[itemIndex] = newItem;
                }
                if (newItem.firstUpgrade || item.blockUpgrade) {
                    setFirstGreen((prevVal) => {
                        return false;
                    });
                }
            }

            // Check for blue
            if (firstBlue && item.color === 'blue') {
                let newItem = item;
                if (item.blockUpgrade) {
                    newItem = { ...newItem, blockEnabled: true };
                    newArr[itemIndex] = newItem;
                }
                if (item.firstUpgrade) {
                    let newHealth = newItem.health + 1;
                    let newAttack = newItem.attack + 1;
                    newItem = { ...newItem, attack: newAttack, health: newHealth };
                    newArr[itemIndex] = newItem;
                }
                if (newItem.firstUpgrade || item.blockUpgrade) {
                    setFirstBlue((prevVal) => {
                        return false;
                    });
                }
            }

            // Check for yellow
            if (firstYellow && item.color === 'yellow') {
                let newItem = item;
                if (item.blockUpgrade) {
                    newItem = { ...newItem, blockEnabled: true };
                    newArr[itemIndex] = newItem;
                }
                if (item.firstUpgrade) {
                    let newHealth = newItem.health + 1;
                    let newAttack = newItem.attack + 1;
                    newItem = { ...newItem, attack: newAttack, health: newHealth };
                    newArr[itemIndex] = newItem;
                }
                if (newItem.firstUpgrade || item.blockUpgrade) {
                    setFirstYellow((prevVal) => {
                        return false;
                    });
                }
            }

            // Check for red
            if (firstRed && item.color === 'red') {
                let newItem = item;
                if (item.blockUpgrade) {
                    newItem = { ...newItem, blockEnabled: true };
                    newArr[itemIndex] = newItem;
                }
                if (item.firstUpgrade) {
                    let newHealth = newItem.health + 1;
                    let newAttack = newItem.attack + 1;
                    newItem = { ...newItem, attack: newAttack, health: newHealth };
                    newArr[itemIndex] = newItem;
                }
                if (newItem.firstUpgrade || item.blockUpgrade) {
                    setFirstRed((prevVal) => {
                        return false;
                    });
                }
            }
            return newArr;
        });

        // burn check
        if (item.orbType === 'fire' && item.orbUpgrade) {
            await burnPhasePlayer(setPlayedCardsOpponent, DELAY, burnCard);
        }

        // Update discard array
        setCurrentDiscard((prevState, props) => {
            let readyDiscard = [];
            prevState.forEach((item, index) => {
                if (index !== 0) {
                    readyDiscard.push(item);
                }
            })
            readyDiscard.push(item);
            return readyDiscard;
        })

        // Start next phase
        setTimeout(() => {
            AttackPhasePlayer(item);
        }, DELAY)
    }

    const AttackPhasePlayer = async () => {
        await fightCardsPlayer(setPlayedCards, setPlayedCardsOpponent, setHealthOpponent, DELAY, attackCard, freezeCard, blockCard, cardDestroyed);

        // Forest Heal check
        setPlayedCards((prevVal) => {
            let healedCards = [...prevVal];
            healedCards.forEach((item, index) => {
                if (item.orbType === 'forest' && item.orbUpgrade) {
                    let cardIndex = cards.findIndex(x => x.id === item.id);
                    let newHealth = item.health;
                    let baseHealth = cards[cardIndex].health;
                    let healedItem = { ...item };

                    if (newHealth < baseHealth) {
                        healCard();
                        newHealth = newHealth + 1;
                        healedItem = { ...healedItem, health: newHealth, animationHeal: true };
                    }

                    healedCards[index] = healedItem;
                }
            });
            return healedCards;
        });

        setTimeout(() => {
            startOpponnentUpKeep();
        }, [DELAY * 2])
    }

    const AttackPhaseOpponent = async () => {
        await fightCardsOpponnent(setPlayedCardsOpponent, setPlayedCards, setHealthPlayer, DELAY, attackCard, freezeCard, blockCard, cardDestroyed);
        // Forest Heal check
        setPlayedCardsOpponent((prevVal) => {
            let healedCards = [...prevVal];
            healedCards.forEach((item, index) => {
                if (item.orbType === 'forest' && item.orbUpgrade) {
                    let cardIndex = cards.findIndex(x => x.id === item.id);
                    let newHealth = item.health;
                    let baseHealth = cards[cardIndex].health;
                    let healedItem = { ...item };

                    if (newHealth < baseHealth) {
                        healCard();
                        newHealth = newHealth + 1;
                        healedItem = { ...healedItem, health: newHealth, animationHeal: true };
                    }

                    healedCards[index] = healedItem;
                }
            });
            return healedCards;
        });

        setTimeout(() => {
            startPlayerUpKeep();
        }, [DELAY * 2])
    }

    // Opponent functions
    const AddCardOpponent = async () => {
        // Add card to field
        let item = currentHandOpponent[0];
        let newItem = currentDiscardOpponent[0];
        let discardItems = [];

        // Update discard
        currentDiscardOpponent.forEach((item, index) => {
            if (index !== 0) {
                discardItems.push(item);
            }
        })

        // Add new card to field
        setPlayedCardsOpponent((prevState, props) => {
            let newItem = { ...item, dead: false };
            let newPlayedCards = [...prevState, newItem];
            if (firstAddTimeOpponnent) {
                setFirstAddTimeOpponnent(false);
            }
            cardFlip();
            return newPlayedCards;
        });

        // burn check
        if (item.orbType === 'fire' && item.orbUpgrade) {
            await burnPhaseOpponnent(setPlayedCards, DELAY, burnCard);
        }

        let newCurrentHand = [newItem];
        let newCurrentDiscard = [...discardItems, item]
        setCurrentHandOpponent(newCurrentHand);
        setCurrentDiscardOpponent(newCurrentDiscard)

        // Start next phase
        AttackPhaseOpponent(newItem);
    }

    const startPlayerUpKeep = () => {
        // Subtract all timers, and enable cards that pass
        setPlayedCards((prevState, props) => {
            let readyNewCards = [...prevState];
            prevState.forEach((item, index) => {
                if (!item.active) {
                    let newDelay = item.delay - 1;
                    if (newDelay < 1) {
                        let newItem = { ...item, active: true };
                        readyNewCards[index] = newItem;
                    } else {
                        let newItem = { ...item, delay: newDelay };
                        readyNewCards[index] = newItem;
                    }
                }
            });
            return readyNewCards;
        });

        if (firstTime) {
            setFirstTime(false);
        } else {
            // Update hand
            setCurrentHand((prevState, props) => {
                let newCard = currentDiscard.shift();
                let newHand = [...prevState, newCard];
                cardFlip();
                return newHand;
            })
        }

        setPlayerTurn(true);
        setCurrentRound((prevState, props) => {
            let newRound = prevState + 1;
            return newRound;
        })
        setShowCards(true);
    }

    const startOpponnentUpKeep = () => {
        // Subtract all timers, and enable cards that pass
        setPlayedCardsOpponent((prevState, props) => {
            let readyNewCards = [...prevState];
            prevState.forEach((item, index) => {
                if (!item.active) {
                    let newDelay = item.delay - 1;
                    if (newDelay < 1) {
                        let newItem = { ...item, active: true };
                        readyNewCards[index] = newItem;
                    } else {
                        let newItem = { ...item, delay: newDelay };
                        readyNewCards[index] = newItem;
                    }
                }
            });
            return readyNewCards;
        });

        setTimeout(() => {
            setPlayerTurn(false);
            startGame(0, 0, false)
        }, DELAY)
    }

    const [victoryBossCardModalState, setVictoryBossCardModalState] = useState(false);

    const handleVictory = () => {
        victoryAudio();
        let goldValue = user.special[0].bought
            ? ((Math.floor(Math.random() * (location.state.max - location.state.min + 1)) + location.state.min) * 2)
            : Math.floor(Math.random() * (location.state.max - location.state.min + 1)) + location.state.min;
        if (location.state.boss) {
            goldValue = goldValue * 3;
        }
        if (location.state.complete) {
            let newObj = {
                open: true,
                gold: goldValue,
                stars: false,
            }
            setVictoryModalState(newObj);
            let userGold = user.diamonds + goldValue;
            let updatedUser = { ...user, diamonds: userGold }
            setUser(updatedUser);
        } else {
            let newObj = {
                open: true,
                gold: goldValue,
                stars: true,
            }
            let userGold = user.diamonds + goldValue;
            let userStars = user.stars + 3;
            let userFlags = [...user.flags];
            let givenIndex = userFlags.findIndex(item => item.id === location.state.id);

            userFlags.forEach((item, index) => {
                let nextIndex = givenIndex + 1;

                if (index === givenIndex) {
                    let newItem = { ...item, next: false, complete: true }
                    userFlags[index] = newItem;
                }
                if (userFlags[nextIndex]) {
                    if (index === nextIndex) {
                        let newItem = { ...item, next: true, complete: false }
                        userFlags[nextIndex] = newItem;
                    }
                }
            })
            let updatedUser = { ...user, diamonds: userGold, stars: userStars, flags: userFlags }
            if (location.state.boss) {
                let cardPackToUnlock =
                    location.state.green ? 'green' :
                        location.state.blue ? 'blue' :
                            location.state.yellow ? 'yellow' :
                                location.state.red ? 'red' :
                                    'nothing'
                let newPacks = updatedUser.packs;
                if (cardPackToUnlock === 'green') {
                    newPacks[1] = { ...newPacks[1], unlocked: true };
                }
                if (cardPackToUnlock === 'blue') {
                    newPacks[2] = { ...newPacks[2], unlocked: true };
                }
                if (cardPackToUnlock === 'yellow') {
                    newPacks[3] = { ...newPacks[3], unlocked: true };
                }
                updatedUser = { ...updatedUser, packs: newPacks };
                cardOpen();
                setVictoryBossCardModalState(true);
            }
            setVictoryModalState(newObj);
            setUser(updatedUser);
        }
    }

    useEffect(() => {
        if (healthOpponent < 1) {
            if (!victoryModalState.open) {
                handleVictory();
            }
        } else if (healthPlayer < 1) {
            defeatAudio();
            setDefeatModalState(true);
        }
    }, [healthOpponent, healthPlayer])

    const [victoryModalState, setVictoryModalState] = useState({
        open: false,
        gold: 0,
        stars: false,
    });
    const [defeatModalState, setDefeatModalState] = useState(false);

    const ref = useRef();

    const [scrollLeft, setScrollLeft] = useState(false);

    const scroll = () => {
        let maxWidth = ref.current.scrollWidth;
        if (scrollLeft) {
            let newWidth = maxWidth - maxWidth;
            ref.current.scrollLeft = newWidth;
        } else {
            ref.current.scrollLeft = maxWidth;
        }
        let newVal = !scrollLeft;
        setScrollLeft(newVal);
    };

    const [surrenderModal, setSurrenderModal] = useState(false);

    const setDefeatedTrue = () => {
        setSurrenderModal(false);
        setHealthPlayer(0);
    }

    let currentImage =
        location.state.green ? forestImage
            : location.state.blue ? snowImage
                : location.state.yellow ? desertImage
                    : location.state.red ? fireImage
                        : forestImage

    let currentOppBG =
        location.state.green ? forestBG
            : location.state.blue ? snowBG
                : location.state.yellow ? desertBG
                    : location.state.red ? fireBG
                        : forestBG

    const [opponnentAttacked, setOpponnentAttacked] = useState(false);
    const [playerAttacked, setPlayerAttacked] = useState(false);

    useEffect(() => {
        if (!firstTime) {
            let delay = 300;
            if (DELAY === 500) {
                delay = 600;
            }
            if (DELAY === 250) {
                delay = 300;
            }
            setOpponnentAttacked((prevVal) => {
                let newVal = !prevVal;
                return newVal;
            });
            setTimeout(() => {
                setOpponnentAttacked((prevVal) => {
                    let newVal = !prevVal;
                    return newVal;
                });
            }, delay);
        }
    }, [healthOpponent])

    useEffect(() => {
        if (!firstTime) {
            let delay = 300;
            if (DELAY === 500) {
                delay = 600;
            }
            if (DELAY === 250) {
                delay = 300;
            }
            setPlayerAttacked((prevVal) => {
                let newVal = !prevVal;
                return newVal;
            });
            setTimeout(() => {
                setPlayerAttacked((prevVal) => {
                    let newVal = !prevVal;
                    return newVal;
                });
            }, delay);
        }
    }, [healthPlayer])

    const startMusic = () => {
        if (music.playingMusic2 === false) {
            // Start music 2
            let newObj = {
                playingMusic1: false,
                playingMusic2: true,
            }
            // end music 1
            setMusic(newObj);
        }
    }

    let tutorialArr = [
        {
            text: 'Welcome to combat! Lets get you started on the basics.',
            top: '0',
            left: '0',
        },
        {
            text: 'The enemy will place their cards above your cards.',
            top: '0',
            left: '0',
        },
        {
            text: 'Each player can play one card per turn, and each card has a delay until it can fight.',
            top: '0',
            left: '0',
        },
        {
            text: 'After a card is placed, the attack phase begins, and if a card is active, it will attack the enemy card or opponent.',
            top: '0',
            left: '0',
        },
        {
            text: 'There are also custom powers that you will run into while you play.',
            top: '0',
            left: '0',
        },
        {
            text: 'Block: Blocks 1 damage whenever the creature is attacked.',
            top: '0',
            left: '0',
            image: require('../../Assets/blockAbility.png')
        },
        {
            text: 'Heal: Heals each friendly creature for 1 damage on turn end.',
            top: '0',
            left: '0',
            image: require('../../Assets/greenAbility.png')
        },
        {
            text: 'Frostbite: When this creature attacks an enemy creature, subtract the opposing creature\'s attack by 1.',
            top: '0',
            left: '0',
            image: require('../../Assets/frozenAbility.png')
        },
        {
            text: 'Trample: All excess damage inflicted on an enemy will hit the opponent.',
            top: '0',
            left: '0',
            image: require('../../Assets/yellowAbility.png')
        },
        {
            text: 'Burn: Deal 1 damage to each enemy creature when played.',
            top: '0',
            left: '0',
            image: require('../../Assets/fireAbility.png')
        },
        {
            text: 'That\s it, good luck soldier!',
            top: '0',
            left: '0',
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);

    useEffect(() => {
        if (user && user.firstTimeBattle) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeBattle: false };
                return newUserObj;
            });

            setTimeout(() => {
                setReadyToShow(true);
            }, 1000)
        }
    }, [])

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
            setCurrentStep(0);
        }
    }

    return (
        <div className={styles.container} onClick={startMusic} style={{ backgroundImage: "url(" + currentImage + ")" }}>
            {
                tutorialArr.map((item, index) => (
                    <div key={index} onClick={moveOnToNextStep} className={currentStep === index + 1 ? styles.overlayModalTut : styles.fadeInOutTut}>
                        {currentStep === index + 1 && readyToShow ? <TutorialModal setFinished={setFinished} showAll={showAll} index={index + 1} item={item} /> : <></>}
                    </div>
                ))
            }
            <Loader loading={loading} time={1000} />
            <div className={victoryModalState.open ? styles.overlayModal : styles.fadeInOut}>
                <Victory data={victoryModalState} item={location.state} />
            </div>
            <div className={`${victoryBossCardModalState ? styles.overlayModal : styles.fadeInOut} ${styles.overTheOthers}`}>
                <VictoryBossCard item={location.state} setVictoryBossCardModalState={setVictoryBossCardModalState} />
            </div>
            <div className={defeatModalState ? styles.overlayModal : styles.fadeInOut}>
                <Defeat item={location.state} />
            </div>
            <div className={surrenderModal ? styles.overlayModal : styles.fadeInOut} onClick={() => setSurrenderModal(false)}>
                <Surrender setIsOpen={setSurrenderModal} setDefeatModal={setDefeatedTrue} />
            </div>
            <div className={styles.overlayImage}>
                {/* Fixed buttons */}
                <img className={styles.home} src={homeImg} onClickCapture={() => {
                    soundButton();
                    setSurrenderModal(true);
                }} />
                <div className={styles.absoluteSpeed}>
                    <div className={styles.relativeSpeed} onClickCapture={() => {
                        soundButton();
                        speedUpGame();
                    }} >
                        {
                            DELAY > 300
                                ? <h1 className={styles.speedText}>1x</h1>
                                : <h1 className={styles.speedText}>2x</h1>
                        }
                        <img className={styles.speedUpImg} src={speedUpImg} />
                    </div>
                </div>
                <div className={styles.overflowButton}>
                    <img className={styles.arrowButton} onClickCapture={() => {
                        soundButton();
                        scroll();
                    }} src={scrollLeft ? arrowActive : arrow} />
                </div>

                {/* Progress bars */}
                <div className={styles.progressBar}>
                    <div className={styles.fillProgress} style={{
                        width: `${healthOpponent > 0 ? (((30 - (30 - healthOpponent)) / 30) * 97) : 0}%`
                    }}>
                        <img className={styles.heart1} src={heart} />
                        <div className={`${styles.heartText} ${healthOpponent < 10 ? styles.heartTextSmall : styles.nothingatallo}`}>{healthOpponent}</div>
                    </div>
                </div>
                <div className={styles.progressBarOpponent}>
                    <div className={styles.fillProgress} style={{ width: `${healthPlayer > 0 ? (((30 - (30 - healthPlayer)) / 30) * 97) : 0}%` }}>
                        <img className={styles.heart1} src={heart} />
                        <div className={`${styles.heartText} ${healthPlayer < 10 ? styles.heartTextSmall : styles.nothingatallo}`}>{healthPlayer}</div>
                    </div>
                </div>

                {/* Background cards left side */}
                <div className={styles.backCardsContainer}>
                    <div className={styles.backCards1} />
                    <div className={styles.backCards2} />
                </div>

                {/* Left side health info */}
                <div className={styles.leftSideContainer}>
                    <div className={styles.leftTop} style={{ backgroundImage: "url(" + currentOppBG + ")" }} />
                    <div className={styles.leftMiddle} />
                    {
                        opponnentAttacked ? <img src={TrampleImg} className={styles.clawsOpp} /> : <></>
                    }
                    {
                        playerAttacked ? <img src={TrampleImg} className={styles.claws} /> : <></>
                    }
                    <div className={styles.turn}>Turn: {currentRound}</div>
                    <div className={styles.currentTurn}>
                        <div className={styles.arrowTurn}>
                            <div className={`${styles.arrow} ${playerTurn ? styles.arrowRed1 : styles.arrowRed2}`}></div>
                            <div className={`${styles.arrow2} ${playerTurn ? styles.arrowGreen2 : styles.arrowGreen1}`}></div>
                        </div>
                    </div>
                    <img className={styles.avatar} src={require('../../Assets/avatar.png')} />
                    <img className={styles.avatarOpponnent} src={require('../../Assets/skull.png')} />
                    <div className={styles.leftMiddle2} />
                    <div className={styles.leftBottom} style={{ backgroundImage: "url(" + playerBG + ")" }} />
                </div>

                {/* Played cards */}
                <div className={styles.playedCardsContainer} ref={ref}>
                    <div className={styles.overflowplayedCards}>
                        {/* Opponnents played cards */}
                        <div className={styles.playedCards}>
                            {
                                playedCardsOpponent.map((item, index) => (
                                    <div key={index}>
                                        {
                                            item.shown ? <div className={styles.playedCardItem}>
                                                {
                                                    item.animation
                                                        ?
                                                        <div className={styles.attackCardOpponnent}>
                                                            <Rubberband duration={DELAY + 500}>
                                                                <div className={styles.relative}>
                                                                    <BattleCard item={item} onField={true} />
                                                                </div>
                                                            </Rubberband>
                                                        </div>
                                                        : <div className={styles.relative}>
                                                            {
                                                                item.justEntered
                                                                    ? <div className={styles.justEnteredField}><BattleCard item={item} onField={true} /></div>
                                                                    : item.dead
                                                                        ? <div className={styles.dead}><BattleCard item={item} onField={true} /></div>
                                                                        : <BattleCard item={item} onField={true} />
                                                            }
                                                            {
                                                                item.animationBlock ? <img src={blockImg} className={`${styles.centerImgBlock} ${styles.centerImg}`} /> : <></>
                                                            }
                                                            {
                                                                item.animationFrost ? <div className={styles.freezeContainer}>
                                                                    <img src={freezeImg} className={`${styles.centerImgFreeze} ${styles.centerImg}`} />
                                                                </div> : <></>
                                                            }
                                                            {
                                                                item.animationTrample ? <img src={TrampleImg} className={`${styles.centerImgTrample} ${styles.centerImg}`} /> : <></>
                                                            }
                                                            {
                                                                item.animationFire ? <div className={styles.fireContainer}>
                                                                    <img src={fireImg} className={`${styles.centerImgFire} ${styles.centerImg}`} />
                                                                </div> : <></>
                                                            }
                                                            {
                                                                item.animationHeal ? <img src={healImg} className={styles.imgHeal} /> : <></>
                                                            }
                                                        </div>
                                                }
                                                {
                                                    item.active
                                                        ? <></>
                                                        : <div className={styles.delay}>
                                                            <img className={styles.relativeImage} src={require('../../Assets/Timer.png')} />
                                                            <div className={styles.timerCount}>{item.delay}</div>
                                                        </div>
                                                }
                                            </div> : <></>
                                        }
                                    </div>
                                ))
                            }
                        </div>

                        {/* Player's played cards */}
                        <div className={styles.playedCards}>
                            {
                                playedCards.map((item, index) => (
                                    <div key={index} className={styles.playedCardItem}>
                                        {
                                            item.animation
                                                ?
                                                <div className={styles.attackCard}>
                                                    <Rubberband duration={DELAY + 500}>
                                                        <div className={styles.relative}>
                                                            <BattleCard item={item} onField={true} />
                                                        </div>
                                                    </Rubberband>
                                                </div>
                                                : <div className={styles.relative}>
                                                    {
                                                        item.justEntered
                                                            ? <div className={styles.justEnteredField}><BattleCard item={item} onField={true} /></div>
                                                            : item.dead
                                                                ? <div className={styles.dead}><BattleCard item={item} onField={true} /></div>
                                                                : <BattleCard item={item} onField={true} />
                                                    }
                                                    {
                                                        item.animationBlock ? <img src={blockImg} className={`${styles.centerImgBlock} ${styles.centerImg}`} /> : <></>
                                                    }
                                                    {
                                                        item.animationFrost ? <div className={styles.freezeContainer}>
                                                            <img src={freezeImg} className={`${styles.centerImgFreeze} ${styles.centerImg}`} />
                                                        </div> : <></>
                                                    }
                                                    {
                                                        item.animationTrample ? <img src={TrampleImg} className={`${styles.centerImgTrample} ${styles.centerImg}`} /> : <></>
                                                    }
                                                    {
                                                        item.animationFire ? <div className={styles.fireContainer}>
                                                            <img src={fireImg} className={`${styles.centerImgFreeze} ${styles.centerImg}`} />
                                                        </div> : <></>
                                                    }
                                                    {
                                                        item.animationHeal ? <img src={healImg} className={styles.imgHeal} /> : <></>
                                                    }
                                                </div>
                                        }
                                        {
                                            item.active
                                                ? <></>
                                                : <div className={styles.delay}>
                                                    <img className={styles.relativeImage} src={require('../../Assets/Timer.png')} />
                                                    <div className={styles.timerCount}>{item.delay}</div>
                                                </div>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Cards in hand */}
                {
                    showCards && !defeatModalState && !victoryModalState.open ? <div className={styles.cardsContainer}>
                        {
                            currentHand.map((item, index) => (
                                <Fade key={index} up delay={index * 100} duration={500}>
                                    <div className={styles.cardInHand} onClick={() => startGame(item, index, playerTurn)}> <BattleCard item={item} onField={false} />
                                    </div>
                                </Fade>
                            ))
                        }
                    </div>
                        : <></>
                }
            </div>
        </div >
    );
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export default BattlePage;