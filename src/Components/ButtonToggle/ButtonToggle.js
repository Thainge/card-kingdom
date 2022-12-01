import React from 'react';
import styles from './ButtonToggle.module.css';
import openClick from '../../Assets/sounds/starting/open.mp3';
import useSound from 'use-sound';

function ButtonToggle({ initialState, options, setModal }) {
    // Sound logic
    const [openButton] = useSound(openClick, { volume: .5 });
    return (
        <>
            {
                options
                    ? <img className={styles.options} src={initialState}
                        onClick={() => {
                            openButton();
                            setModal();
                        }}
                    ></img>
                    : <img className={styles.button} src={initialState}
                        onClick={() => {
                            openButton();
                            setModal();
                        }}
                    ></img>
            }
        </>
    );
}

export default ButtonToggle;