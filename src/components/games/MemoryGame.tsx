import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Progress, Badge, message } from 'antd';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/gameStore';

interface MemoryGameProps {
  onComplete: (score: number, duration: number) => void;
  isMultiplayer?: boolean;
}

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, isMultiplayer = false }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);

  const { completeGame } = useGameStore();

  // Card symbols
  const symbols = ['🎮', '🎯', '🎲', '🃏', '🎪', '🎨', '🎭', '🎸'];

  // Initialize game
  const initializeGame = useCallback(() => {
    const gameCards: GameCard[] = [];
    symbols.forEach((symbol, index) => {
      // Add pairs of cards
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameEnded(false);
    setScore(0);
  }, []);

  // Start game
  const startGame = () => {
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameEnded) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId]?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          // Add points for match
          const timeBonus = Math.floor(timeLeft / 10);
          const matchPoints = 100 + timeBonus;
          setScore(prev => prev + matchPoints);

          message.success(`Match! +${matchPoints} points`);
        }, 1000);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  // Check win condition
  useEffect(() => {
    if (matches === symbols.length && gameStarted && !gameEnded) {
      setGameEnded(true);
      
      // Calculate final score
      const timeBonus = timeLeft * 10;
      const moveBonus = Math.max(0, (20 - moves) * 50);
      const finalScore = score + timeBonus + moveBonus;
      setScore(finalScore);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      message.success('🎉 Congratulations! You won!');

      // Complete game
      const duration = 60 - timeLeft;
      completeGame('memory-game', finalScore, duration, isMultiplayer, 'win');
      
      setTimeout(() => {
        onComplete(finalScore, duration);
      }, 2000);
    }
  }, [matches, symbols.length, gameStarted, gameEnded, score, timeLeft, moves, completeGame, onComplete, isMultiplayer]);

  // Game over effect
  useEffect(() => {
    if (gameEnded && matches < symbols.length) {
      // Game over - time's up
      message.error('⏰ Time\'s up! Game over!');
      
      const duration = 60;
      completeGame('memory-game', score, duration, isMultiplayer, 'lose');
      
      setTimeout(() => {
        onComplete(score, duration);
      }, 2000);
    }
  }, [gameEnded, matches, symbols.length, score, completeGame, onComplete, isMultiplayer]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const getCardVariants = (index: number) => ({
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: 180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: { 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  });

  const cardFlipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  if (!gameStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8"
      >
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-3xl font-bold">Memory Master</h2>
        {isMultiplayer && (
          <Badge count="MULTIPLAYER" style={{ backgroundColor: '#722ed1' }} />
        )}
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Find all matching pairs before time runs out! 
          {isMultiplayer && ' Compete against your opponent for extra points!'}
        </p>
        <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-left space-y-1">
            <li>• Click cards to flip them over</li>
            <li>• Find matching pairs of symbols</li>
            <li>• Complete faster for bonus points</li>
            <li>• Use fewer moves for higher score</li>
            {isMultiplayer && <li>• Beat your opponent to win!</li>}
          </ul>
        </div>
        <Button 
          type="primary" 
          size="large" 
          onClick={startGame}
          className="px-8 py-2 h-auto text-lg"
        >
          Start Game
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4"
    >
      {/* Game Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Memory Master</h2>
          {isMultiplayer && (
            <Badge count="MULTIPLAYER" style={{ backgroundColor: '#722ed1' }} />
          )}
        </div>
        <div className="text-right space-y-2">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-blue-600">{timeLeft}s</div>
          <div className="text-xs text-gray-600">Time Left</div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-green-600">{matches}</div>
          <div className="text-xs text-gray-600">Matches</div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-orange-600">{moves}</div>
          <div className="text-xs text-gray-600">Moves</div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {symbols.length - matches}
          </div>
          <div className="text-xs text-gray-600">Remaining</div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{matches}/{symbols.length} pairs</span>
        </div>
        <Progress 
          percent={(matches / symbols.length) * 100} 
          strokeColor="#52c41a"
          className="mb-2"
        />
        <div className="flex justify-between text-sm mb-2">
          <span>Time</span>
          <span>{timeLeft}/60s</span>
        </div>
        <Progress 
          percent={(timeLeft / 60) * 100} 
          strokeColor={timeLeft > 20 ? "#1890ff" : timeLeft > 10 ? "#fa8c16" : "#f5222d"}
        />
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={getCardVariants(index)}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative w-16 h-16 cursor-pointer"
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`absolute inset-0 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  card.isMatched 
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : card.isFlipped 
                      ? 'bg-white border-blue-300 shadow-md'
                      : 'bg-gradient-to-br from-blue-400 to-purple-500 border-blue-400 text-white cursor-pointer hover:from-blue-500 hover:to-purple-600'
                }`}
                variants={cardFlipVariants}
                animate={card.isFlipped || card.isMatched ? "front" : "back"}
                style={{ 
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden"
                }}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Game End Modal */}
      {gameEnded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Card className="max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {matches === symbols.length ? '🏆' : '⏰'}
              </div>
              <h3 className="text-2xl font-bold">
                {matches === symbols.length ? 'Victory!' : 'Time\'s Up!'}
              </h3>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">{score}</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold">{matches}</div>
                  <div className="text-gray-600">Matches Found</div>
                </div>
                <div>
                  <div className="font-bold">{moves}</div>
                  <div className="text-gray-600">Total Moves</div>
                </div>
              </div>
              {isMultiplayer && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-700 font-bold">
                    Multiplayer Bonus: +50 points!
                  </div>
                </div>
              )}
              <Button 
                type="primary" 
                onClick={() => onComplete(score, 60 - timeLeft)}
                block
              >
                Continue
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemoryGame; 