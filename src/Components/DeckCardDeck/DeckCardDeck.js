import { useEffect, useState } from 'react';
import styles from './DeckCardDeck.module.css';
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

function DeckCardDeck({ item, deckRemoveCard }) {

    let defaultVal = false;
    const [toggledTwo, setToggledTwo] = useState(defaultVal);

    const [currentImages, setCurrentImages] = useState([]);

    const [cardFlip] = useSound(flipCardSound, { volume: 1 });

    useEffect(() => {
        setToggledTwo(false);

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
    }, [item])

    let defaultData = {
        health: 0,
        attack: 0,
        baseHealth: 0,
        baseAttack: 0,
    }
    const [data, setData] = useState(defaultData);

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
    }, [item]);

    const { health, attack, baseAttack, baseHealth } = data;

    return (
        <div className={styles.papa}>
            {
                item.indeck
                    ? <div className={styles.relativeBox1} onDoubleClick={() => {
                        cardFlip();
                        deckRemoveCard(item);
                    }}>
                        <img className={`${toggledTwo ? styles.cardActive : styles.card1} ${toggledTwo
                            ? item.legendary ? styles.legendary
                                : item.epic ? styles.epic
                                    : item.rare ? styles.rare
                                        : item.common ? styles.common : styles.nothingatall
                            : styles.nothingatall
                            }`} src={item.border} onMouseEnter={() => setToggledTwo(true)} onMouseLeave={() => setToggledTwo(false)} />
                        <img className={styles.cardImage1} src={item.backImage} />
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
                        <div className={styles.absolute}>
                            <div className={styles.relative}>
                                <img src={delayImage} className={styles.delay} />
                                <div className={styles.delayText}>{item.delay}</div>
                            </div>
                        </div>
                        {
                            <div className={currentImages.image1 || currentImages.image2 ? styles.specialAbilties : styles.specialField}>
                                {
                                    currentImages.image1 ? <img src={currentImages.image1} className={styles.specialImage} /> : <></>
                                }
                                {
                                    currentImages.image2 ? <img src={currentImages.image2} className={styles.specialImage} /> : <></>
                                }
                            </div>
                        }
                    </div>
                    : <div className={`${styles.card} ${styles.deckDisabled2}`} />
            }
        </div >
    )
}

export default DeckCardDeck;