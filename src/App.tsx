import React from 'react';
import { useGame } from '../context/GameContext';
import { MenuScreen } from './screens/MenuScreen';
import { RecipeSelectScreen } from './screens/RecipeSelectScreen';
import { CookingScreen } from './screens/CookingScreen';
import { ResultScreen } from './screens/ResultScreen';
import '../styles/global.css';
import '../styles/screens.css';
import '../styles/challenges.css';

function App() {
  const { gameState } = useGame();

  const renderScreen = () => {
    switch (gameState.gameScreen) {
      case 'menu':
        return <MenuScreen />;
      case 'recipe-select':
        return <RecipeSelectScreen />;
      case 'cooking':
        return <CookingScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <MenuScreen />;
    }
  };

  return (
    <div className="app-container">
      <div className="game-wrapper">{renderScreen()}</div>
    </div>
  );
}

export default App;
