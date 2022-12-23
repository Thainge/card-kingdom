import React, { useEffect, useState, useReducer, useRef } from 'react';
import Loader from '../../Components/Loader/Loader';
import styles from './MultiplayerBattle.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
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
import burnCardAudio from '../../Assets/sounds/starting/fire.mp3';
import freezeCardAudio from '../../Assets/sounds/starting/freeze.mp3';
import attackCardAudio from '../../Assets/sounds/starting/attack.mp3';
import blockCardAudio from '../../Assets/sounds/starting/block.mp3';
import cardOpenSound from '../../Assets/sounds/starting/cardOpen.mp3';
import useSound from 'use-sound';

import surrenderImg from '../../Assets/surrender.png';
import BattleCard from '../../Components/BattleCard/BattleCard';
import heart from '../../Assets/tiltedHeart.png';
import arrow from '../../Assets/arrow.png';
import forestImage from '../../Assets/Combat/forest.png';
import arrowActive from '../../Assets/arrowActive.png';
import healImg from '../../Assets/healGIF.gif';
import freezeImg from '../../Assets/flakeGIF.png';
import TrampleImg from '../../Assets/attackGIF.png';
import fireImg from '../../Assets/fireGif.gif';
import blockImg from '../../Assets/blockGIF.png';
import forestBG from '../../Assets/forestBG.png';
import playerBG from '../../Assets/playerBG.png';

const socketIo = require('socket.io-client');

function MultiplayerBattlePage() {
    const obj = ContextFunction();
    const { deck, user, setUser, cards, music, setMusic } = obj;

    let currentImage = forestImage;
    let currentOppBG = forestBG;

    // Loading effect on page load
    const [loading, setLoading] = useState(true);

    // Sound logic
    const [soundButton] = useSound(buttonSound, { volume: .2 });
    const [cardOpen] = useSound(cardOpenSound, { volume: .2 });
    const [cardFlip] = useSound(flipCardSound, { volume: .3 });
    const [victoryAudio] = useSound(victorySound, { volume: .5 });
    const [defeatAudio] = useSound(defeatSound, { volume: .1 });
    const [healCard] = useSound(healCardAudio, { volume: .2 });
    const [burnCard] = useSound(burnCardAudio, { volume: .2 });
    const [freezeCard] = useSound(freezeCardAudio, { volume: .2 });
    const [attackCard] = useSound(attackCardAudio, { volume: .1 });
    const [blockCard] = useSound(blockCardAudio, { volume: .2 });

    // Music
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

    // Randomize deck
    let shuffledCards = shuffle(deck);
    let hand = [];
    let handDiscard = [];

    shuffledCards.forEach((item, index) => {
        if (index < 2) {
            hand.push(item);
        } else {
            handDiscard.push(item);
        }
    });

    // Hand and discard
    const [currentHand, setCurrentHand] = useState(hand);
    const [currentDiscard, setCurrentDiscard] = useState(handDiscard);

    // Played cards
    const [playedCards, setPlayedCards] = useState([]);
    const [playedCardsOpponent, setPlayedCardsOpponent] = useState([]);

    // Who goes first
    const [playerTurn, setPlayerTurn] = useState(false);
    const [healthPlayer, setHealthPlayer] = useState(30);
    const [healthOpponent, setHealthOpponent] = useState(30);
    const [currentRound, setCurrentRound] = useState(0);
    const [showCards, setShowCards] = useState(false);

    const [firstGreen, setFirstGreen] = useState(true);
    const [firstBlue, setFirstBlue] = useState(true);
    const [firstYellow, setFirstYellow] = useState(true);
    const [firstRed, setFirstRed] = useState(true);

    // Attacked animation
    const [opponnentAttacked, setOpponnentAttacked] = useState(false);
    const [playerAttacked, setPlayerAttacked] = useState(false);

    useEffect(() => {
        setOpponnentAttacked((prevVal) => {
            let newVal = !prevVal;
            return newVal;
        });
        setTimeout(() => {
            setOpponnentAttacked((prevVal) => {
                let newVal = !prevVal;
                return newVal;
            });
        }, 300);
    }, [healthOpponent])

    useEffect(() => {
        setPlayerAttacked((prevVal) => {
            let newVal = !prevVal;
            return newVal;
        });
        setTimeout(() => {
            setPlayerAttacked((prevVal) => {
                let newVal = !prevVal;
                return newVal;
            });
        }, 300);
    }, [healthPlayer])

    // starts loading
    const [socket, setSocket] = useState(null);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        const io = socketIo('https://node-card-kingdom.herokuapp.com/');
        io.on('connect', () => {
            console.log('connected')
        });

        io.emit('ready');
        setSocket(io);

        return () => {
            console.log('disconnecting')
            io.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('startGame', id => {
            let admin = id === socket.id ? true : false;
            setShowCards(() => admin);
            setAdmin(() => admin);
            setPlayerTurn(() => admin);
            currentImage = admin ? forestImage : forestBG;
            setLoading(() => false);
            if (admin) {
                startPlayerUpKeep();
            }
        });
        socket.on('playedCards', (socketID, data) => {
            if (socketID !== socket.id) {
                cardFlip();
                setPlayedCardsOpponent(() => data);
            }
        });
        socket.on('oppCards', (socketID, data) => {
            if (socketID !== socket.id) {
                setPlayedCards(() => data);
            }
        });
        socket.on('healthOpp', (socketID, data) => {
            if (socketID !== socket.id) {
                setHealthPlayer(() => data);
            }
        });
        socket.on('healthPlayer', (socketID, data) => {
            if (socket.id === socketID) {
                setHealthPlayer(() => 0);
            }
            if (socket.id !== socketID) {
                setHealthOpponent(() => 0);
            }
        });
        socket.on('turnChange', (socketID) => {
            if (socketID !== socket.id) {
                setPlayerTurn((prev) => !prev);
                startPlayerUpKeep();
            }
        });
        socket.on('roundChange', (data) => {
            setCurrentRound(() => data);
        });
    }, [socket]);

    // Player functions
    const AddCardPlayer = async (item, index) => {
        // Hide Cards
        setShowCards(() => false);

        // Add card to field
        setPlayedCards((prevState, props) => {
            let newItem = { ...item, dead: false };
            let newPlayedCards = [...prevState, newItem];
            socket.emit('playedCards', socket.id, newPlayedCards);
            cardFlip();
            return newPlayedCards;
        });

        // Remove card from hand
        setCurrentHand((prevState, props) => {
            let newHand = [];
            prevState.forEach((item, iIndex) => {
                if (iIndex !== index) {
                    newHand.push(item);
                }
            });
            return newHand
        });

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
            socket.emit('playedCards', socket.id, newArr);
            return newArr;
        });

        // burn check
        if (item.orbType === 'fire' && item.orbUpgrade) {
            await burnPhasePlayer(burnCard, setPlayedCardsOpponent, socket);
        }

        // Update discard array
        setCurrentDiscard((prev) => {
            let newDiscard = [];
            prev.forEach((item, index) => {
                if (index !== 0) {
                    newDiscard.push(item);
                }
            });
            newDiscard.push(item);
            return newDiscard;
        });


        // Start next phase
        setTimeout(() => {
            AttackPhasePlayer(item);
        }, 300)
    }

    const AttackPhasePlayer = async () => {
        let obj = { setPlayedCards, setPlayedCardsOpponent, setHealthPlayer, setHealthOpponent, socket, freezeCard, attackCard, blockCard }
        await fightCardsPlayer(obj);

        let healFunctions = new Promise((resolve) => {
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
                resolve();
                socket.emit('playedCards', socket.id, healedCards);
                return healedCards;
            });
        });
        healFunctions.then(() => {
            // End turn
            setPlayerTurn(() => false);
            socket.emit('turnChange', socket.id);
        });
    }

    const startPlayerUpKeep = () => {
        // Subtract all timers, and enable cards that pass
        let subDelays = new Promise((resolve) => {
            setPlayedCards((prevState) => {
                let readyNewCards = [...prevState];
                if (prevState.length > 0) {
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
                } else {
                    resolve();
                }
                socket.emit('playedCards', socket.id, readyNewCards);
                resolve();
                return readyNewCards;
            });
        });
        subDelays.then(() => {
            // Update hand
            setCurrentDiscard((prevDiscard) => {
                let discardArr = [...prevDiscard];
                setCurrentHand((prevHand) => {
                    let newHand = [...prevHand, discardArr[0]];
                    cardFlip()
                    return newHand;
                });
                return prevDiscard;
            });


            // Increase round number
            setCurrentRound((prevState) => {
                let newRound = prevState + 1;
                socket.emit('roundChange', newRound);
                return newRound;
            })

            // Show hand
            setShowCards(() => true);
        });
    }

    const handleVictory = () => {
        victoryAudio();
        let goldValue = 50;
        let newObj = {
            open: true,
            gold: goldValue,
            stars: false,
        }
        setVictoryModalState(newObj);
        let userGold = user.diamonds + goldValue;
        let updatedUser = { ...user, diamonds: userGold }
        setUser(updatedUser);
    }

    useEffect(() => {
        if (healthOpponent < 1) {
            if (!victoryModalState.open) {
                handleVictory();
            }
        } else if (healthPlayer < 1) {
            if (!defeatModalState) {
                defeatAudio();
                setDefeatModalState(true);
            }
        }
    }, [healthOpponent, healthPlayer])

    let defaultVictoryState = {
        open: false,
        gold: 0,
        stars: false,
    }
    // Victory, defeat modals
    const [victoryModalState, setVictoryModalState] = useState(defaultVictoryState);
    const [defeatModalState, setDefeatModalState] = useState(false);
    const [surrenderModal, setSurrenderModal] = useState(false);

    // Scroll right and left
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

    const setDefeatedTrue = () => {
        setSurrenderModal(false);
        socket.emit('healthPlayer', socket.id, 0);
        setHealthPlayer(0);
    }

    return (
        <div className={styles.container} onClick={startMusic} style={{ backgroundImage: "url(" + currentImage + ")" }}>
            <Loader loading={loading} time={1000} multiplayer={true} socket={socket} />
            <div className={victoryModalState.open ? styles.overlayModal : styles.fadeInOut}>
                <Victory data={victoryModalState} />
            </div>
            <div className={defeatModalState ? styles.overlayModal : styles.fadeInOut}>
                <Defeat />
            </div>
            <div className={surrenderModal ? styles.overlayModal : styles.fadeInOut} onClick={() => setSurrenderModal(false)}>
                <Surrender setIsOpen={setSurrenderModal} setDefeatModal={setDefeatedTrue} />
            </div>
            <div className={styles.overlayImage}>
                {/* Fixed buttons */}
                <img className={styles.home} src={surrenderImg} onClickCapture={() => {
                    soundButton();
                    setSurrenderModal(true);
                }} />
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
                                                            <Rubberband duration={500}>
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
                                                    <Rubberband duration={500}>
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
                                    <div className={styles.cardInHand} onClick={() => AddCardPlayer(item, index)}> <BattleCard item={item} onField={false} />
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

// burn check player
const burnPhasePlayer = async (burnCard, setPlayedCardsOpponent, socket) => new Promise(resolve => {
    // burn check
    let burnEnemies = new Promise((resolveBurnEnemies, reject) => {
        setPlayedCardsOpponent((prevVal) => {
            let oppCards = [...prevVal];
            if (prevVal.length > 0) {
                oppCards.forEach((item, index) => {
                    setPlayedCardsOpponent((prevPlayedCardsOp) => {
                        let newOppCards = [...prevPlayedCardsOp];
                        let newHealth = item.health - 1;
                        let newBurnedItem = { ...item, health: newHealth, animationFire: true, justEntered: false, };
                        newOppCards[index] = newBurnedItem;
                        if (index === prevPlayedCardsOp.length - 1) resolveBurnEnemies();
                        burnCard();
                        socket.emit('oppCards', socket.id, newOppCards, 'burn');
                        return newOppCards;
                    });
                });
            } else {
                resolveBurnEnemies();
            }
            return prevVal;
        });
    });
    burnEnemies.then(() => {
        let burnRemove = new Promise((resolveBurnRemove) => {
            // Remove cards that have health less than 0 health
            setPlayedCardsOpponent((prevState, props) => {
                let newArr = [...prevState];
                if (prevState.length > 0) {
                    setTimeout(() => {
                        newArr.forEach((item, index) => {
                            setPlayedCardsOpponent((prevState, props) => {
                                let readyToDelete = prevState;
                                if (item.health < 1) {
                                    let deletedIndex = readyToDelete.findIndex(x => x.id === item.id);
                                    readyToDelete.splice(deletedIndex, 1)
                                }
                                if (index === newArr.length - 1) resolveBurnRemove();
                                socket.emit('oppCards', socket.id, readyToDelete, 'burn');
                                return readyToDelete;
                            });
                        });
                    }, 300);
                } else {
                    resolveBurnRemove();
                }
                return prevState;
            });
        });
        burnRemove.then(() => {
            resolve();
        });
    });
});

const fightCardsPlayer = async ({ setPlayedCards, setPlayedCardsOpponent, setHealthPlayer, setHealthOpponent, socket, freezeCard, attackCard, blockCard }) => new Promise(resolve => {
    let attackPhase = new Promise((resolveFirst, reject) => {
        setPlayedCards((prevPlayed, props) => {
            // Loop over your own cards
            if (prevPlayed.length > 1) {
                prevPlayed.forEach((item, index) => {
                    let delay = 300 * (index + 1)
                    let stopDelay = 300 + 100;
                    setTimeout(() => {
                        setPlayedCardsOpponent((prevState, props) => {
                            // Take opponnents cards and put them in an array
                            let newState = [...prevState];
                            // If the card is active, then attack
                            if (item.active) {
                                // Animation player's card
                                setPlayedCards((prevCards) => {
                                    let newAnimation = [...prevCards];
                                    let newAttackCard = { ...item, animation: true };
                                    newAnimation[index] = newAttackCard;
                                    socket.emit('playedCards', socket.id, newAnimation);
                                    return newAnimation;
                                });
                                // if there is an enemy card in front of it attack it
                                if (prevState[index]) {
                                    let newHealth = prevState[index].health - item.attack;
                                    let newAttack = prevState[index].attack;
                                    let newArrCard = { ...prevState[index], justEntered: false, };

                                    if (prevState[index].blockEnabled || prevState[index].blockPermaEnabled) {
                                        newHealth = newHealth + 1;
                                        newArrCard = { ...newArrCard, animationBlock: true };
                                        blockCard();
                                    }

                                    // frostbite
                                    if (item.orbType === 'frozen' && item.orbUpgrade) {
                                        let updatedAttack = newAttack - 1;
                                        if (updatedAttack >= 0) {
                                            newAttack = updatedAttack;
                                        }
                                        newArrCard = { ...newArrCard, animationFrost: true };
                                        freezeCard();
                                    }

                                    // trample
                                    if (item.orbType === 'desert' && item.orbUpgrade) {
                                        let difference = item.attack - newHealth;
                                        if (difference > 0) {
                                            setHealthOpponent((prevState) => {
                                                let newHealth = prevState - difference;
                                                socket.emit('healthOpp', socket.id, newHealth);
                                                return newHealth;
                                            });
                                        }
                                        newArrCard = { ...newArrCard, animationTrample: true };
                                    }
                                    newArrCard = { ...newArrCard, health: newHealth, attack: newAttack };
                                    if (newArrCard.health < 1) {
                                        newArrCard = { ...newArrCard, dead: true };
                                    }
                                    newState[index] = newArrCard;
                                    attackCard();
                                } else {
                                    // attack opponent
                                    setHealthOpponent((prevState) => {
                                        let newHealth = prevState - item.attack;
                                        socket.emit('healthOpp', socket.id, newHealth);
                                        return newHealth;
                                    });
                                    attackCard();
                                }
                            }
                            if (index === prevPlayed.length - 1) {
                                setTimeout(() => {
                                    setPlayedCardsOpponent((prevVal) => {
                                        let oppCards = [...prevVal];

                                        oppCards.forEach((item) => {
                                            item.animationFire = false;
                                            item.animationFrost = false;
                                            item.animationTrample = false;
                                            item.animationBlock = false;
                                            item.animationHeal = false;
                                        });
                                        socket.emit('oppCards', socket.id, oppCards);
                                        return oppCards
                                    });
                                }, stopDelay * 4);
                                setTimeout(() => {
                                    setPlayedCards((prevVal) => {
                                        let newCards = [...prevVal];
                                        newCards.forEach((item, index) => {
                                            item.animation = false;
                                            item.justEntered = false;
                                        });
                                        resolveFirst();
                                        socket.emit('playedCards', socket.id, newCards);
                                        return newCards;
                                    });
                                }, stopDelay);
                                resolveFirst();
                            }
                            socket.emit('oppCards', socket.id, newState);
                            return newState;
                        });
                    }, delay);
                });

            } else {
                resolveFirst();
            }
            return prevPlayed;
        });
    });
    attackPhase.then(() => {
        let newDelay = 1 * (300);
        let removePhase = new Promise((resolveSecond, reject) => {
            // Remove cards that have health less than 0
            setTimeout(() => {
                setPlayedCardsOpponent((prevState) => {
                    let newestCardsState = [...prevState];

                    if (newestCardsState.length > 0) {
                        newestCardsState.forEach((item, index) => {
                            setPlayedCardsOpponent((prevVal) => {
                                let readyToDelete = prevVal;
                                if (item.health < 1) {
                                    let deletedIndex = readyToDelete.findIndex(x => x.id === item.id);
                                    readyToDelete.splice(deletedIndex, 1)
                                }
                                if (index === newestCardsState.length - 1) resolveSecond();
                                socket.emit('oppCards', socket.id, readyToDelete);
                                return readyToDelete;
                            });
                        });
                    } else {
                        resolveSecond();
                    }
                    return prevState;
                });
            });
        }, newDelay)
        removePhase.then(() => {
            resolve();
        })
    });
});

export default MultiplayerBattlePage;