import React, { useState } from 'react';
import { FirebaseProvider } from './context/FirebaseContext';
import LoginScreen from './screens/LoginScreen';
import LandingScreen from './screens/LandingScreen';
import JournalScreen from './screens/JournalScreen';
import GoalTrackerScreen from './screens/GoalTrackerScreen';
import CommunityScreen from './screens/CommunityScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import GamesScreen from './screens/GamesScreen';
import { PAGES } from './utils/constants';
import Sidebar from './components/Sidebar';

function App(){
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [authPage, setAuthPage] = useState(null);

  return (
    <FirebaseProvider>
      <div className="app-shell">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setAuthPage={setAuthPage}
        />

        <main className="app-main">
          {currentPage === PAGES.HOME && <LandingScreen setCurrentPage={setCurrentPage} />}
          {currentPage === PAGES.JOURNAL && <JournalScreen />}
          {currentPage === PAGES.GOALS && <GoalTrackerScreen />}
          {currentPage === PAGES.GAMES && <GamesScreen />}
          {currentPage === PAGES.COMMUNITY && <CommunityScreen />}
          {currentPage === PAGES.CHAT && <ChatbotScreen />}
        </main>

        {/* Auth modal */}
        {authPage === 'login' && (
          <LoginScreen
            setAuthPage={setAuthPage}
            setCurrentPage={setCurrentPage}
          />
        )}

      </div>
    </FirebaseProvider>
  );
}

export default App;
