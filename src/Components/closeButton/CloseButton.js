import React, { useState } from 'react';
import styles from './CloseButton.module.css';
import closeClick from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';

const close = require('../../Assets/MainMenu/close.png');
const closeActive = require('../../Assets/MainMenu/closeActive.png');

function CloseModalButton({ closeModal, small, large, smaller }) {
    const [state, setState] = useState(close);

    const setStateFunction = (value) => {
        const newVal = value;
        setState(newVal);
    }

    // Sound logic
    const [playClose] = useSound(closeClick, { volume: .3 });

    return (
        <img src={state}
            className={smaller ? styles.close4 : small ? styles.close2 : large ? styles.close3 : styles.close}
            onMouseDown={() => setStateFunction(closeActive)}
            onMouseUp={() => setStateFunction(closeActive)}
            onMouseOut={() => setStateFunction(closeActive)}
            onMouseOver={() => setStateFunction(closeActive)}
            onMouseLeave={() => setStateFunction(close)}
            onClick={() => {
                playClose();
                closeModal();
            }}></img>
    );
}

export default CloseModalButton;