// burn check opponnent
const burnPhaseOpponnent = async (setPlayedCards, givenDelay, burnCard) => new Promise(resolve => {
    // burn check
    let burnEnemies = new Promise((resolveBurnEnemies, reject) => {
        setPlayedCards((prevVal) => {
            if (prevVal.length > 0) {
                let oppCards = [...prevVal];
                oppCards.forEach((item, index) => {
                    setPlayedCards((prevPlayedCardsOp) => {
                        let newOppCards = [...prevPlayedCardsOp];
                        let newHealth = item.health - 1;
                        let newBurnedItem = { ...item, health: newHealth, animationFire: true, justEntered: false, };
                        newOppCards[index] = newBurnedItem;
                        if (index === prevPlayedCardsOp.length - 1) resolveBurnEnemies();
                        burnCard();
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
            setPlayedCards((prevState, props) => {
                let newArr = [...prevState];
                if (prevState.length > 0) {
                    setTimeout(() => {
                        newArr.forEach((item, index) => {
                            setPlayedCards((prevState, props) => {
                                let readyToDelete = prevState;
                                if (item.health < 1) {
                                    let deletedIndex = readyToDelete.findIndex(x => x.id === item.id);
                                    readyToDelete.splice(deletedIndex, 1)
                                }
                                if (index === newArr.length - 1) resolveBurnRemove();
                                return readyToDelete;
                            });
                        });
                    }, givenDelay);
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

// burn check player
const burnPhasePlayer = async (setPlayedCardsOpponent, givenDelay, burnCard) => new Promise(resolve => {
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
                                return readyToDelete;
                            });
                        });
                    }, givenDelay);
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

const fightCardsPlayer = async (setPlayedCards, setPlayedCardsOpponent, setHealthOpponent, givenDelay, attackCard, freezeCard, blockCard, cardDestroyed) => new Promise(resolve => {
    let attackPhase = new Promise((resolveFirst, reject) => {
        setPlayedCards((prevPlayed, props) => {
            // Loop over your own cards
            if (prevPlayed.length > 1) {
                prevPlayed.forEach((item, index) => {
                    let delay = givenDelay * (index + 1)
                    let stopDelay = givenDelay + 100;
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
                                    return newAnimation;
                                });
                                // if there is an enemy card in front of it attack it
                                if (prevState[index]) {
                                    let newHealth = prevState[index].health - item.attack;
                                    let newAttack = prevState[index].attack;
                                    let newArrCard = { ...prevState[index], justEntered: false, };

                                    // block check
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
                                        freezeCard();
                                        newArrCard = { ...newArrCard, animationFrost: true };
                                    }

                                    // trample
                                    if (item.orbType === 'desert' && item.orbUpgrade) {
                                        let difference = item.attack - newHealth;
                                        if (difference > 0) {
                                            setHealthOpponent((prevState, props) => {
                                                let newHealth = prevState - difference;
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
                                        return prevVal;
                                    });
                                }, stopDelay);
                                resolveFirst();
                            }
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
        let newDelay = 1 * (givenDelay);
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

const fightCardsOpponnent = (setPlayedCardsOpponent, setPlayedCards, setHealthPlayer, givenDelay, attackCard, freezeCard, blockCard, cardDestroyed) => new Promise(resolve => {
    let attackPhase = new Promise((resolveFirst, reject) => {
        setPlayedCardsOpponent((prevPlayed, props) => {
            // Loop over your own cards
            if (prevPlayed.length > 1) {
                prevPlayed.forEach((item, index) => {
                    let delay = givenDelay * (index + 1)
                    let stopDelay = givenDelay + 100;
                    setTimeout(() => {
                        setPlayedCards((prevState, props) => {
                            // Take opponnents cards and put them in an array
                            let newState = [...prevState];
                            // If the card is active, then attack
                            if (item.active) {
                                // Animation player's card
                                setPlayedCardsOpponent((prevCards) => {
                                    let newAnimation = [...prevCards];
                                    let newAttackCard = { ...item, animation: true };
                                    newAnimation[index] = newAttackCard;
                                    return newAnimation;
                                });
                                // if there is an enemy card in front of it attack it
                                if (prevState[index]) {
                                    let newHealth = prevState[index].health - item.attack;
                                    let newAttack = prevState[index].attack;
                                    let newArrCard = { ...prevState[index], justEntered: false, };

                                    // block check
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
                                        freezeCard();
                                        newArrCard = { ...newArrCard, animationFrost: true };
                                    }

                                    // trample
                                    if (item.orbType === 'desert' && item.orbUpgrade) {
                                        let difference = item.attack - newHealth;
                                        if (difference > 0) {
                                            setHealthPlayer((prevState, props) => {
                                                let newHealth = prevState - difference;
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
                                    setHealthPlayer((prevState) => {
                                        let newHealth = prevState - item.attack;
                                        return newHealth;
                                    });
                                    attackCard();
                                }
                            }
                            if (index === prevPlayed.length - 1) {
                                setTimeout(() => {
                                    setPlayedCards((prevVal) => {
                                        let oppCards = [...prevVal];

                                        oppCards.forEach((item) => {
                                            item.animationFire = false;
                                            item.animationFrost = false;
                                            item.animationTrample = false;
                                            item.animationBlock = false;
                                            item.animationHeal = false;
                                        });

                                        return oppCards
                                    });
                                }, stopDelay * 4);
                                setTimeout(() => {
                                    setPlayedCardsOpponent((prevVal) => {
                                        let newCards = [...prevVal];
                                        newCards.forEach((item, index) => {
                                            item.animation = false;
                                            item.justEntered = false;
                                        });
                                        resolveFirst();
                                        return prevVal;
                                    });
                                }, stopDelay);
                                resolveFirst();
                            }
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
        let newDelay = 1 * (givenDelay);
        let removePhase = new Promise((resolveSecond, reject) => {
            // Remove cards that have health less than 0
            setTimeout(() => {
                setPlayedCards((prevState) => {
                    let newestCardsState = [...prevState];

                    if (newestCardsState.length > 0) {
                        newestCardsState.forEach((item, index) => {
                            setPlayedCards((prevVal) => {
                                let readyToDelete = prevVal;
                                if (item.health < 1) {
                                    let deletedIndex = readyToDelete.findIndex(x => x.id === item.id);
                                    readyToDelete.splice(deletedIndex, 1)
                                }
                                if (index === newestCardsState.length - 1) resolveSecond();
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

export default {
    burnPhaseOpponnent,
    burnPhasePlayer,
    fightCardsPlayer,
    fightCardsOpponnent,
}