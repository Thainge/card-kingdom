import React from 'react';
import { HashRouter as Router } from 'react-router-dom'
import RouterComponent from './Components/Router';
import { InputProvider } from './Contexts/contextProvider';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <InputProvider>
        <Router basename={''}>
          <RouterComponent />
        </Router>
      </InputProvider>
    </div >
  );
}

export default App;