import React, { useEffect, useState } from 'react';
import styles from './DeckCard.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
import pureCardsData from '../../Data/PureCards';
import useSound from 'use-sound';
import flipCardSound from '../../Assets/sounds/starting/cardFlip.mp3';

const healthImage = require('../../Assets/heart.png')
const attackImage = require('../../Assets/shield.png')
const delayImage = require('../../Assets/Timer.png')
const forestImage = require('../../Assets/greenAbility.png');
const frozenImage = require('../../Assets/frozenAbility.png');
const desertImage = require('../../Assets/yellowAbility.png');
const fireImage = require('../../Assets/fireAbility.png');
const blockImage = require('../../Assets/blockAbility.png');

function DeckCard({ item, deckAddCard, setError, deckLength, initalVal }) {
    const obj = ContextFunction();
    const { setCards } = obj;

    const [cardFlip] = useSound(flipCardSound, { volume: 1 });

    // Set new to false on card
    const setNewToFalse = (item) => {
        if (item.new === true) {
            let newItem = { ...item, new: false };

            // Update cards array
            setCards((prevVal) => {
                let newArray = [...prevVal];
                let foundIndex = prevVal.findIndex(x => x.id == item.id);
                newArray[foundIndex] = newItem;
                return newArray;
            });
        } else {
            return;
        }
    }

    const addNewItem = (item) => {
        let newItem = { ...item, new: false };

        if (deckLength === 4 + initalVal) {
            setError('Deck limit reached')
        } else {
            setToggled(false);
            deckAddCard(newItem)
        }
    }

    const [toggled, setToggled] = useState(false)
    const [currentImages, setCurrentImages] = useState([]);

    useEffect(() => {
        if (item.owned) {
            let foundIndex = pureCardsData.findIndex(x => x.id === item.id);

            let health = item.health;
            let attack = item.attack;

            let baseHealth = pureCardsData[foundIndex].health;
            let baseAttack = pureCardsData[foundIndex].attack;
            let newData = {
                health: health,
                attack: attack,
                baseHealth: baseHealth,
                baseAttack: baseAttack,
            }
            setData(newData)
        }

        let defaultImage = '';
        let defaultImage2 = '';
        if (item.orbUpgrade) {
            if (item.orbType === 'forest') {
                defaultImage = forestImage;
            }
            if (item.orbType === 'frozen') {
                defaultImage = frozenImage;
            }
            if (item.orbType === 'desert') {
                defaultImage = desertImage;
            }
            if (item.orbType === 'fire') {
                defaultImage = fireImage;
            }
        }
        if (item.blockEnabled || item.blockPermaEnabled) {
            defaultImage2 = blockImage;
        }
        let newState = {
            image1: defaultImage,
            image2: defaultImage2,
        }
        setCurrentImages(newState)
    }, [item]);

    let defaultData = {
        health: 0,
        attack: 0,
        baseHealth: 0,
        baseAttack: 0,
    }
    const [data, setData] = useState(defaultData);

    const { health, attack, baseAttack, baseHealth } = data;

    return (
        <div className={styles.container} onMouseLeave={() => setNewToFalse(item)}>
            {
                item.indeck
                    ?
                    <div className={styles.relativeBox}>
                        <img src={item.backImage} className={styles.cardImageDisabled} />
                        <img onDoubleClick={() => {
                            cardFlip();
                            addNewItem(item);
                        }} className={`${styles.card} ${styles.cardDisabled}`} src={item.border} />
                        <div className={styles.healthBox}>
                            <img className={`${styles.healthImage} ${styles.disabled}`} src={healthImage} />
                            <div className={`
                            ${health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth}
                            ${item.health === 1 ? styles.specialText1 : item.health.toString().length === 1 ? styles.healthText : styles.healthTextBig} ${styles.disabled}`}>{item.health}</div>
                        </div>
                        <div className={styles.attackBox}>
                            <img className={`${styles.attackImage} ${styles.disabled}`} src={attackImage} />
                            <div className={`
                            ${attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack}
                            ${item.attack.toString().length === 1 ? styles.attackText : styles.attackTextBig} ${styles.disabled}`}>{item.attack}</div>
                        </div>
                        <div className={`${styles.absolute} ${styles.disabled}`}>
                            <div className={styles.relative}>
                                <img src={delayImage} className={styles.delay} />
                                <div className={styles.delayText}>{item.delay}</div>
                            </div>
                        </div>
                        {
                            <div className={`${currentImages.image1 || currentImages.image2 ? styles.specialAbilties : styles.specialField} ${styles.disabled}`} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                                {
                                    currentImages.image1 ? <img src={currentImages.image1} className={styles.specialImage} /> : <></>
                                }
                                {
                                    currentImages.image2 ? <img src={currentImages.image2} className={styles.specialImage} /> : <></>
                                }
                            </div>
                        }
                    </div>

                    : <div className={item.new ? styles.relative : styles.nothing} onDoubleClick={() => {
                        cardFlip();
                        addNewItem(item);
                    }}>
                        <div className={styles.relativeBox} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img src={item.backImage} className={styles.cardImage} />
                            <img src={item.border} className={`${styles.card} ${toggled ? styles.cardActive : styles.nothingat} ${toggled
                                ? item.legendary ? styles.legendary
                                    : item.epic ? styles.epic
                                        : item.rare ? styles.rare
                                            : item.common ? styles.common : styles.nothingatall
                                : styles.nothingatall
                                }`} />
                        </div>
                        <div className={styles.healthBox} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img className={styles.healthImage} src={healthImage} />
                            <div className={`${health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth} ${item.health === 1 ? styles.specialText1 : item.health.toString().length === 1 ? styles.healthText : styles.healthTextBig}`}>{item.health}</div>
                        </div>
                        <div className={styles.attackBox} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img className={styles.attackImage} src={attackImage} />
                            <div className={`${attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack} ${item.attack.toString().length === 1 ? styles.attackText : styles.attackTextBig}`}>{item.attack}</div>
                        </div>
                        <div className={styles.absolute} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <div className={styles.relative}>
                                <img src={delayImage} className={styles.delay} />
                                <div className={styles.delayText}>{item.delay}</div>
                            </div>
                        </div>
                        {
                            <div className={currentImages.image1 || currentImages.image2 ? styles.specialAbilties : styles.specialField} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                                {
                                    currentImages.image1 ? <img src={currentImages.image1} className={styles.specialImage} /> : <></>
                                }
                                {
                                    currentImages.image2 ? <img src={currentImages.image2} className={styles.specialImage} /> : <></>
                                }
                            </div>
                        }
                        {/* New Status */}
                        {
                            item.new ? <img
                                onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}
                                className={styles.new}
                                src={require('../../Assets/new.png')}
                            /> : <></>
                        }
                    </div>
            }
        </div>
    )
}

export default DeckCard;