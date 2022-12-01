import React, { useEffect, useState } from "react";
import styles from './CardAnimation.module.css';
import Flip from 'react-reveal/Flip';
import Pulse from 'react-reveal/Pulse';
import Tada from 'react-reveal/Tada';
import Zoom from 'react-reveal/Zoom';
import pureCardsData from '../../Data/PureCards';

const healthImage = require('../../Assets/heart.png')
const attackImage = require('../../Assets/shield.png')
const commonText = require('../../Assets/rare.png')
const rareText = require('../../Assets/epic.png')
const epicText = require('../../Assets/legendary.png')
const legendaryText = require('../../Assets/mythic.png')
const delayImage = require('../../Assets/Timer.png')
const forestImage = require('../../Assets/greenAbility.png');
const frozenImage = require('../../Assets/frozenAbility.png');
const desertImage = require('../../Assets/yellowAbility.png');
const fireImage = require('../../Assets/fireAbility.png');
const blockImage = require('../../Assets/blockAbility.png');

function CardInsideAnimation({ item, index }) {

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
        if (item) {
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
                item ?
                    item.legendary
                        ? <Flip key={index} duration={800} delay={index === 0 ? 0 : index === 1 ? 200 : 400}>
                            <Tada delay={1000} duration={1000}>
                                <Pulse forever delay={2300} duration={1200} >
                                    <div className={`${styles.hover} ${styles.legendary}`}>
                                        <img className={styles.booster} src={item.backImage}></img>
                                        <img className={styles.cardBorder} src={item.border}></img>
                                        <img className={styles.healthImage} src={healthImage} />
                                        <div className={`${health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth} ${item.health === 1 ? styles.specialText1 : item.health.toString().length === 1 ? styles.healthText : styles.healthTextBig} ${styles.disabled}`}>{item.health}</div>
                                        <img className={styles.attackImage} src={attackImage} />
                                        <div className={`${attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack} ${item.attack.toString().length === 1 ? styles.attackText : styles.attackTextBig}`}>{item.attack}</div>
                                        <div className={styles.textOverlay}>
                                            <Zoom opposite delay={index === 0 ? 600 : index === 1 ? 800 : 1000} duration={400}>
                                                <Tada delay={index === 0 ? 600 : index === 1 ? 800 : 1000} duration={1000}>
                                                    <img src={legendaryText} className={styles.rarityText} />
                                                </Tada>
                                            </Zoom>
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
                                </Pulse>
                            </Tada>
                        </Flip>
                        : <Flip key={index} duration={800} delay={index === 0 ? 0 : index === 1 ? 200 : 400}>
                            <div className={styles.hover}>
                                <img className={`${styles.booster} ${item.epic ? styles.epic
                                    : item.rare ? styles.rare
                                        : item.common ? styles.common : styles.nothingatall}`} src={item.backImage}></img>
                                <img className={styles.cardBorder} src={item.border}></img>
                                <img className={styles.healthImage} src={healthImage} />
                                <div className={`${health === baseHealth ? styles.nothingnew : health > baseHealth ? styles.greaterHealth : styles.lowerHealth} ${item.health === 1 ? styles.specialText1 : item.health.toString().length === 1 ? styles.healthText : styles.healthTextBig} ${styles.disabled}`}>{item.health}</div>
                                <img className={styles.attackImage} src={attackImage} />
                                <div className={`${attack === baseAttack ? styles.nothingnew : attack > baseAttack ? styles.greaterAttack : styles.lowerAttack} ${item.attack.toString().length === 1 ? styles.attackText : styles.attackTextBig}`}>{item.attack}</div>
                                <div className={styles.textOverlay}>
                                    <Zoom opposite delay={index === 0 ? 600 : index === 1 ? 800 : 1000} duration={400}>
                                        <img src={item.common ? commonText : item.rare ? rareText : item.epic ? epicText : legendaryText} className={styles.rarityText} />
                                    </Zoom>
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
                        </Flip>
                    : <></>
            }
        </>
    )
}

export default CardInsideAnimation;