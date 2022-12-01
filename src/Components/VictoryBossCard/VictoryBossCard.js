import React from "react";
import styles from './VictoryBossCard.module.css';
import Fade from 'react-reveal/Fade';

function VictoryBossCard({ item, setVictoryBossCardModalState }) {

    let cardImg =
        item.green ? require('../../Assets/Shop/blue.png') :
            item.blue ? require('../../Assets/Shop/yellow.png') :
                item.yellow ? require('../../Assets/Shop/red.png') :
                    require('../../Assets/Shop/blue.png')

    let cardName =
        item.green ? 'Blue' :
            item.blue ? 'Yellow' :
                item.yellow ? 'Red' :
                    'Blue'

    const closeModal = () => {
        setVictoryBossCardModalState(false);
    }

    return (
        <div className={styles.centerContainer} onClick={closeModal}>
            <Fade up distance={'.5em'}>
                <h1 className={styles.header}>New Booster Pack Unlocked!</h1>
            </Fade>
            <Fade up distance={'1em'}>
                <img className={styles.centerImage} src={cardImg}></img>
            </Fade>
            <Fade up distance={'.5em'}>
                <div className={styles.titleText}>
                    {cardName} Booster Pack
                </div>
            </Fade>
        </div >
    )
}

export default VictoryBossCard;