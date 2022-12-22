import React, { useEffect, useState } from 'react';
import styles from './BattleCard.module.css';
import pureCardsData from '../../Data/PureCards';

import attackImage from '../../Assets/shield.png';
import healthImage from '../../Assets/heart.png';
import delayImage from '../../Assets/Timer.png';
import forestImage from '../../Assets/greenAbility.png';
import frozenImage from '../../Assets/frozenAbility.png';
import desertImage from '../../Assets/yellowAbility.png';
import fireImage from '../../Assets/fireAbility.png';
import blockImage from '../../Assets/blockAbility.png';

function BattleCard({ item, onField }) {

    const [toggled, setToggled] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);

    useEffect(() => {
        if (item) {
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
    }, [item])

    let defaultData = {
        health: 0,
        attack: 0,
        baseHealth: 0,
        baseAttack: 0,
    }
    const [data, setData] = useState(defaultData);

    const { health, attack, baseAttack, baseHealth } = data;

    return (
        <>
            {
                onField
                    ? <>
                        <div className={`${styles.relativeBox} ${item.active ? styles.nothingatallo : styles.activeFalse}`} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img src={item.backImage} className={styles.cardFieldImage} />
                            <img src={item.border} className={styles.cardField} />
                        </div>
                        <div className={styles.healthBoxField} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img className={styles.healthImageField} src={healthImage} />
                            <div className={`
                            ${item.enemy === true ? item.health === item.baseHealth ? styles.nothingnew : item.health > item.baseHealth ? styles.greaterHealth : styles.lowerHealth : styles.nothingnew}
                            ${item.enemy === false ? health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth : styles.nothingnew} ${item.health === 1 ? styles.special1Field : item.health.toString().length === 1 ? styles.healthTextField : styles.healthTextBigField}`}>{item.health}</div>
                        </div>
                        <div className={styles.attackBoxField} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img className={styles.attackImageField} src={attackImage} />
                            <div className={`
                            ${item.enemy === true ? item.attack === item.baseAttack ? styles.nothingnew : item.attack > item.baseAttack ? styles.greaterAttack : styles.lowerAttack : styles.nothingnew}
                            ${item.enemy === false ? attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack : styles.nothingnew} ${item.attack.toString().length === 1 ? styles.attackTextField : styles.attackTextBigField}`}>{item.attack}</div>
                        </div>
                        {
                            <div className={currentImages.image1 || currentImages.image2 ? styles.specialAbiltiesField : styles.specialField}>
                                {
                                    currentImages.image1 ? <img src={currentImages.image1} className={styles.specialImageField} /> : <></>
                                }
                                {
                                    currentImages.image2 ? <img src={currentImages.image2} className={styles.specialImageField} /> : <></>
                                }
                            </div>
                        }
                    </>

                    : <>
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
                            <div className={`${health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth} ${item.health === 1 ? styles.special1 : item.health.toString().length === 1 ? styles.healthText : styles.healthTextBig}`}>{item.health}</div>
                        </div>
                        <div className={styles.attackBox} onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)}>
                            <img className={styles.attackImage} src={attackImage} />
                            <div className={`${attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack} ${item.attack.toString().length === 1 ? styles.attackText : styles.attackTextBig}`}>{item.attack}</div>
                        </div>
                        <div className={styles.absolute}>
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
                    </>
            }
        </>
    );
}

export default BattleCard;