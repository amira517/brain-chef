import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameContextType, GameState, Recipe, PlayerStats, Achievement } from '../types/game';
import { recipes } from '../data/recipes';

const initialStats: PlayerStats = {
  totalCoins: 0,
  totalXP: 0,
  level: 1,
  recipesCompleted: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  currentStreak: 0,
  achievements: [],
};

const initialGameState: GameState = {
  stats: initialStats,
  currentRecipe: null,
  currentIngredientIndex: 0,
  currentChallenge: null,
  gameScreen: 'menu',
  lastResult: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const selectRecipe = (recipe: Recipe) => {
    setGameState((prev) => ({
      ...prev,
      currentRecipe: recipe,
      currentIngredientIndex: 0,
      currentChallenge: recipe.ingredients[0].challenge,
      gameScreen: 'cooking',
      lastResult: null,
    }));
  };

  const submitChallengeAnswer = (answer: string) => {
    if (!gameState.currentRecipe || !gameState.currentChallenge) return;

    const isCorrect = answer === gameState.currentChallenge.correctAnswer;
    const reward = isCorrect ? gameState.currentChallenge.reward : 0;

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalCoins: prev.stats.totalCoins + reward,
        totalXP: prev.stats.totalXP + (isCorrect ? reward : Math.floor(reward / 2)),
        correctAnswers: prev.stats.correctAnswers + (isCorrect ? 1 : 0),
        totalAttempts: prev.stats.totalAttempts + 1,
        currentStreak: isCorrect ? prev.stats.currentStreak + 1 : 0,
      },
      gameScreen: 'result',
      lastResult: {
        isCorrect,
        reward,
        message: isCorrect
          ? `Correct! ${gameState.currentChallenge.explanation || 'Great job!'}`
          : `Oops! The correct answer was ${gameState.currentChallenge.correctAnswer}`,
      },
    }));
  };

  const nextIngredient = () => {
    if (!gameState.currentRecipe) return;

    const nextIndex = gameState.currentIngredientIndex + 1;

    if (nextIndex < gameState.currentRecipe.ingredients.length) {
      setGameState((prev) => ({
        ...prev,
        currentIngredientIndex: nextIndex,
        currentChallenge: gameState.currentRecipe!.ingredients[nextIndex].challenge,
        gameScreen: 'cooking',
        lastResult: null,
      }));
    } else {
      completeRecipe();
    }
  };

  const completeRecipe = () => {
    if (!gameState.currentRecipe) return;

    const achievements: Achievement[] = [];

    // Check for achievements
    if (gameState.stats.recipesCompleted === 0) {
      achievements.push({
        id: 'first-recipe',
        name: 'First Chef',
        emoji: '🍳',
        description: 'Complete your first recipe!',
        unlockedAt: new Date(),
      });
    }

    if (gameState.stats.currentStreak >= 3) {
      achievements.push({
        id: 'streak-3',
        name: '3-Streak Master',
        emoji: '🔥',
        description: 'Get 3 correct answers in a row!',
        unlockedAt: new Date(),
      });
    }

    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        recipesCompleted: prev.stats.recipesCompleted + 1,
        totalCoins: prev.stats.totalCoins + gameState.currentRecipe!.totalReward,
        totalXP: prev.stats.totalXP + gameState.currentRecipe!.totalReward,
        level: Math.floor((prev.stats.totalXP + gameState.currentRecipe!.totalReward) / 100) + 1,
        achievements: [...prev.stats.achievements, ...achievements],
      },
      gameScreen: 'result',
      lastResult: {
        isCorrect: true,
        reward: gameState.currentRecipe.totalReward,
        message: `🎉 Recipe Complete! You earned ${gameState.currentRecipe.totalReward} bonus coins!`,
      },
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const goToMenu = () => {
    setGameState((prev) => ({
      ...prev,
      gameScreen: 'menu',
      currentRecipe: null,
      currentIngredientIndex: 0,
      currentChallenge: null,
      lastResult: null,
    }));
  };

  const value: GameContextType = {
    gameState,
    selectRecipe,
    submitChallengeAnswer,
    nextIngredient,
    completeRecipe,
    resetGame,
    goToMenu,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
