import React from 'react';
import { Routes, Route } from "react-router-dom";

import StartingPage from '../Pages/StartingPage/Starting';
import MainPage from '../Pages/MainPage/MainPage';
import BattlePage from '../Pages/Battle/Battle';
import MultiplayerBattlePage from '../Pages/Multiplayer/MultiplayerBattle';

function RouterComponent() {
    return (
        <>
            {/* All possible routes */}
            <Routes>
                <Route path="" element={<StartingPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/multiplayer" element={<MultiplayerBattlePage />} />
            </Routes >
        </>
    );
}

export default RouterComponent;