import React from 'react';
import { Routes, Route } from "react-router-dom";

import StartingPage from '../Pages/StartingPage/Starting';
import MainPage from '../Pages/MainPage/MainPage';
import BattlePage from '../Pages/Battle/Battle';

function RouterComponent() {
    return (
        <>
            {/* All possible routes */}
            <Routes>
                <Route path="" element={<StartingPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/battle" element={<BattlePage />} />
            </Routes >
        </>
    );
}

export default RouterComponent;