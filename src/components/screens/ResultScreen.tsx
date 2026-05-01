import React from 'react';
import { useGame } from '../../context/GameContext';

export const ResultScreen: React.FC = () => {
  const { gameState, nextIngredient, goToMenu } = useGame();
  const { lastResult, currentRecipe, currentIngredientIndex } = gameState;

  if (!lastResult) {
    return <div>Loading...</div>;
  }

  const isRecipeComplete =
    currentRecipe && currentIngredientIndex >= currentRecipe.ingredients.length - 1;

  const resultEmoji = lastResult.isCorrect ? '🎉' : '😂';
  const resultMessage = lastResult.isCorrect ? 'Great Job!' : 'Oops!';

  return (
    <div className="screen result-screen">
      <div className={`result-emoji ${lastResult.isCorrect ? 'success' : 'failure'}`}>
        {resultEmoji}
      </div>

      <div className="result-message">{resultMessage}</div>

      <div className="result-submessage">{lastResult.message}</div>

      {lastResult.reward > 0 && (
        <div className="result-reward">
          💰 +{lastResult.reward} Coins!
        </div>
      )}

      <div className="result-actions">
        {isRecipeComplete ? (
          <>
            <button className="btn btn-primary btn-lg" onClick={goToMenu}>
              🏠 Back to Menu
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-lg" onClick={nextIngredient}>
              ➡️ Next Ingredient
            </button>
            <button className="btn btn-secondary" onClick={goToMenu}>
              🏠 Menu
            </button>
          </>
        )}
      </div>
    </div>
  );
};
