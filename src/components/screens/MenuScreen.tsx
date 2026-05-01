import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FractionChallenge } from '../challenges/FractionChallenge';
import { MemoryChallenge } from '../challenges/MemoryChallenge';
import { LogicChallenge } from '../challenges/LogicChallenge';

export const MenuScreen: React.FC = () => {
  const { gameState } = useGame();
  const [showStats, setShowStats] = useState(false);
  const { selectRecipe, goToMenu } = useGame();

  const stats = gameState.stats;
  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.correctAnswers / stats.totalAttempts) * 100)
      : 0;

  const handlePlayClick = () => {
    setShowStats(false);
    goToMenu();
    // Navigate to recipe select
    gameState.gameScreen = 'recipe-select';
  };

  return (
    <div className="screen menu-screen">
      <div className="menu-header">
        <div className="menu-title">
          <h1>🧠 Brain Chef</h1>
          <p className="tagline">Learn Through Cooking! 🍳</p>
        </div>
      </div>

      <div className="menu-content">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.level}</div>
            <div className="stat-label">Level</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{stats.totalCoins}</div>
            <div className="stat-label">Coins</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-value">{stats.recipesCompleted}</div>
            <div className="stat-label">Recipes</div>
          </div>
        </div>

        {stats.totalAttempts > 0 && (
          <div className="accuracy-bar">
            <div className="accuracy-label">Accuracy</div>
            <div className="accuracy-progress">
              <div
                className="accuracy-fill"
                style={{
                  width: `${accuracy}%`,
                  background:
                    accuracy >= 80
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : accuracy >= 60
                        ? 'linear-gradient(90deg, #facc15, #f59e0b)'
                        : 'linear-gradient(90deg, #ef4444, #dc2626)',
                }}
              ></div>
            </div>
            <div className="accuracy-value">{accuracy}%</div>
          </div>
        )}

        {stats.achievements.length > 0 && (
          <div className="achievements-section">
            <h3>🏆 Achievements</h3>
            <div className="achievements-list">
              {stats.achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-badge">
                  <div className="badge-emoji">{achievement.emoji}</div>
                  <div className="badge-name">{achievement.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="menu-actions">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            gameState.gameScreen = 'recipe-select';
          }}
        >
          👨‍🍳 Start Cooking!
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowStats(!showStats)}
        >
          📊 {showStats ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {stats.totalAttempts === 0 && (
        <div className="welcome-message">
          <h3>🎮 Welcome to Brain Chef!</h3>
          <p>Cook delicious recipes while solving fun challenges!</p>
          <ul>
            <li>🍕 Learn fractions by slicing pizza</li>
            <li>🧠 Test your memory with recipe steps</li>
            <li>🧩 Solve logic puzzles for rewards</li>
            <li>💰 Earn coins and level up!</li>
          </ul>
        </div>
      )}
    </div>
  );
};
