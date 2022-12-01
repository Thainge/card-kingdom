import React, { useState } from 'react';
import styles from './ShopBox.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
import Fade from 'react-reveal/Fade';
import buttonBuySound from '../../Assets/sounds/starting/buyItem.mp3';
import useSound from 'use-sound';

function ShopBox({ index, item }) {
    const obj = ContextFunction();
    const { user, setUser } = obj;

    const [buyButton] = useSound(buttonBuySound, { volume: .1 });

    // Buys special upgrade
    const buySpecialUpgrade = (item) => {
        if (user.diamonds >= item.cost) {
            buyButton();
            let newItem = {
                ...item,
                bought: true,
            }
            let newDiamonds = user.diamonds - item.cost;

            let newSpecial = [...user.special];
            let foundIndex = user.special.findIndex(x => x.id == item.id);
            newSpecial[foundIndex] = newItem;

            let readyUserObj = { ...user, diamonds: newDiamonds, special: newSpecial };
            setUser(readyUserObj);
        }
    }

    const [isHovering, setIsHovering] = useState(false);

    return (
        <>
            {
                item.bought
                    ? <div className={styles.relative}>
                        {
                            isHovering
                                ? <Fade duration={500}>
                                    <div className={styles.hoverStuff}>
                                        <div className={styles.row}>
                                            <div>{item.name}</div>
                                            <div className={styles.row}>
                                                <img className={styles.star} src={require('../../Assets/diamond.png')}></img>
                                                {item.cost}
                                            </div>
                                        </div>
                                        <div className={styles.text}>{item.text}</div>
                                    </div>
                                </Fade>
                                : <></>
                        }
                        <img src={item.backgroundImage} onClick={() => buySpecialUpgrade(item, index)} className={styles.boxBought}></img>
                        <div className={styles.backgroundGreen} onMouseOver={() => setIsHovering(true)}
                            onMouseOut={() => setIsHovering(false)}>
                            <img className={styles.check} src={require('../../Assets/check.png')}></img>
                        </div>
                    </div>
                    : <div className={styles.relative}>
                        {
                            isHovering
                                ? <Fade duration={500}>
                                    <div className={styles.hoverStuff}>
                                        <div className={styles.row}>
                                            <div>{item.name}</div>
                                            <div className={styles.row}>
                                                <img className={styles.star} src={require('../../Assets/diamond.png')}></img>
                                                {item.cost}
                                            </div>
                                        </div>
                                        <div className={styles.text}>{item.text}</div>
                                    </div>
                                </Fade>
                                : <></>
                        }<img onMouseOver={() => setIsHovering(true)}
                            onMouseOut={() => setIsHovering(false)} src={item.backgroundImage} onClick={() => buySpecialUpgrade(item, index)} className={styles.box}></img>
                    </div>

            }
        </>
    );
}

export default ShopBox;