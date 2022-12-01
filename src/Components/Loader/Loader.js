import React from 'react';
import styles from './Loader.module.css';

function Loader({ loading, time }) {
    return (
        <>
            {
                time
                    ? <div className={loading ? styles.loader : styles.fadeOutLoader}>
                        <div className={styles.barImageContainer}>
                            <div className={styles.Bar2}></div>
                            <img className={styles.loaderBar} src={require('../../Assets/loader.png')}></img>
                        </div>
                    </div>
                    :
                    <div className={loading ? styles.loader : styles.fadeOutLoader}>
                        <div className={styles.barImageContainer}>
                            <div className={styles.Bar}></div>
                            <img className={styles.loaderBar} src={require('../../Assets/loader.png')}></img>
                        </div>
                    </div>
            }
        </>
    );
}

export default Loader;