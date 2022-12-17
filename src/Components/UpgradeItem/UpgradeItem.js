import React, { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import UpgradesHook from "../../Hooks/upgradesHook";
import styles from './UpgradeItem.module.css';
import Fade from 'react-reveal/Fade';
import { ContextFunction } from "../../Contexts/contextProvider";
import buttonSound from '../../Assets/sounds/starting/button.mp3';
import useSound from 'use-sound';

function CircleIcon({ item }) {
    const obj = ContextFunction();
    const { user, cards } = obj;

    const [soundButton] = useSound(buttonSound, { volume: .3 });

    const {
        BuyUpgrade,
    } = UpgradesHook();

    const [isHovering, setIsHovering] = useState(false);

    // Buys an upgrade
    const buySingleUpgrade = (item) => {
        if (user.stars >= item.cost) {
            setIsHovering(false);
            BuyUpgrade(item);
        }
    }

    return (
        <div
            onMouseDown={() => {
                if (item.active && !item.bought) {
                    soundButton();
                    buySingleUpgrade(item)
                }
            }}
            className={styles.relative}
        >
            {
                item.active
                    ? <img className={styles.overlayImage} src={item.backgroundImage} onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)} />
                    : <img className={styles.overlayImageDisabled} src={item.backgroundImage} />

            }
            <div
                className={styles.column}>
                {
                    item.bought
                        ? <img className={styles.circleFinished} src={require('../../Assets/blueActive.png')}></img>
                        : item.active
                            ? <img className={`${styles.circle} ${isHovering ? styles.hoverEffects : styles.nothingatall}`} src={require('../../Assets/blue.png')} onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)}></img>
                            : <img className={styles.circleDisabled} src={require('../../Assets/blue.png')}></img>
                }
            </div>
            {
                item.bought ? <div className={styles.bar} /> : <></>
            }
            {
                isHovering
                    ? <Fade duration={500}>
                        <div className={styles.hoverStuff}>
                            <div className={styles.row}>
                                <div>{item.title}</div>
                                <div className={styles.row}>
                                    <img className={styles.star} src={require('../../Assets/MainMenu/star.png')}></img>
                                    {item.cost}
                                </div>
                            </div>
                            <div className={styles.text}>{item.text}</div>
                        </div>
                    </Fade>
                    : <></>
            }
        </div>
    )
}

function UpgradeItem({ columnData, givenImage }) {
    return (
        <>
            <div className={styles.upgradeColumn}>
                {
                    columnData.map((item, index) => (
                        <div key={index}>
                            <div
                                className={styles.column}
                            >
                                <CircleIcon item={item}></CircleIcon>
                            </div>
                        </div>
                    ))
                }
                <img className={styles.upgrade} src={givenImage}></img>
            </div>
        </>
    );
}

export default UpgradeItem;