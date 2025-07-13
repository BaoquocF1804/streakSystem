import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Progress, Badge, message, Input } from 'antd';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/gameStore';

interface MathQuizProps {
  onComplete: (score: number, duration: number) => void;
  isMultiplayer?: boolean;
}

interface Question {
  id: number;
  question: string;
  answer: number;
  options: number[];
}

const MathQuiz: React.FC<MathQuizProps> = ({ onComplete, isMultiplayer = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { completeGame } = useGameStore();

  // Generate random question
  const generateQuestion = useCallback((): Question => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number, questionText: string;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        questionText = `${num1} - ${num2}`;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        questionText = `${num1} × ${num2}`;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
        questionText = '1 + 1';
    }

    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return {
      id: Date.now(),
      question: questionText,
      answer,
      options: shuffledOptions
    };
  }, []);

  // Generate new question
  const nextQuestion = useCallback(() => {
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
    setQuestionIndex(prev => prev + 1);
  }, [generateQuestion]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setTimeLeft(30);
    nextQuestion();
  };

  // Handle answer selection
  const handleAnswer = (answer: number) => {
    if (answered || gameEnded) return;

    setSelectedAnswer(answer);
    setAnswered(true);
    setTotalQuestions(prev => prev + 1);

    if (answer === currentQuestion?.answer) {
      // Correct answer
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak * 10;
      const questionPoints = 100 + timeBonus + streakBonus;
      
      setScore(prev => prev + questionPoints);
      setStreak(prev => prev + 1);
      
      message.success(`Correct! +${questionPoints} points`);
      
      // Confetti for long streaks
      if (streak >= 5) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 }
        });
      }
    } else {
      // Wrong answer
      setStreak(0);
      message.error(`Wrong! Correct answer was ${currentQuestion?.answer}`);
    }

    // Next question after delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
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

  // Game end effect
  useEffect(() => {
    if (gameEnded) {
      const accuracy = totalQuestions > 0 ? (score / (totalQuestions * 100)) * 100 : 0;
      
      message.success(`Game Over! Final score: ${score}`);
      
      // Trigger confetti for good performance
      if (score > 500) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Complete game
      const duration = 30;
      const result = accuracy >= 70 ? 'win' : 'lose';
      completeGame('math-quiz', score, duration, isMultiplayer, result);
      
      setTimeout(() => {
        onComplete(score, duration);
      }, 2000);
    }
  }, [gameEnded, score, totalQuestions, completeGame, onComplete, isMultiplayer]);

  // Initialize first question
  useEffect(() => {
    if (gameStarted && !currentQuestion) {
      nextQuestion();
    }
  }, [gameStarted, currentQuestion, nextQuestion]);

  if (!gameStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8"
      >
        <div className="text-6xl mb-4">🔢</div>
        <h2 className="text-3xl font-bold">Quick Math</h2>
        {isMultiplayer && (
          <Badge count="MULTIPLAYER" style={{ backgroundColor: '#722ed1' }} />
        )}
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Solve as many math problems as you can in 30 seconds!
          {isMultiplayer && ' Race against your opponent!'}
        </p>
        <div className="bg-green-50 p-4 rounded-lg max-w-md mx-auto">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-left space-y-1">
            <li>• Solve addition, subtraction, and multiplication</li>
            <li>• Answer quickly for time bonuses</li>
            <li>• Build streaks for extra points</li>
            <li>• 30 seconds to get your best score</li>
            {isMultiplayer && <li>• Highest score wins!</li>}
          </ul>
        </div>
        <Button 
          type="primary" 
          size="large" 
          onClick={startGame}
          className="px-8 py-2 h-auto text-lg"
        >
          Start Quiz
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
          <h2 className="text-2xl font-bold">Quick Math</h2>
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
          <div className="text-lg font-bold text-green-600">{totalQuestions}</div>
          <div className="text-xs text-gray-600">Questions</div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-orange-600">{streak}</div>
          <div className="text-xs text-gray-600">Streak</div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {totalQuestions > 0 ? Math.round((score / (totalQuestions * 100)) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </Card>
      </div>

      {/* Time Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Time Remaining</span>
          <span>{timeLeft}/30s</span>
        </div>
        <Progress 
          percent={(timeLeft / 30) * 100} 
          strokeColor={timeLeft > 15 ? "#52c41a" : timeLeft > 5 ? "#fa8c16" : "#f5222d"}
          className="mb-2"
        />
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="text-center py-8">
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {currentQuestion.question} = ?
            </div>
            {streak > 0 && (
              <div className="text-orange-600 font-bold mb-4">
                🔥 Streak: {streak} (+{streak * 10} bonus points)
              </div>
            )}
          </Card>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="large"
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`w-full h-16 text-2xl font-bold ${
                    answered && selectedAnswer === option
                      ? option === currentQuestion.answer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : answered && option === currentQuestion.answer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : ''
                  }`}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

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
                {score > 500 ? '🏆' : score > 200 ? '🥈' : '🥉'}
              </div>
              <h3 className="text-2xl font-bold">Time's Up!</h3>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">{score}</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold">{totalQuestions}</div>
                  <div className="text-gray-600">Questions Answered</div>
                </div>
                <div>
                  <div className="font-bold">
                    {totalQuestions > 0 ? Math.round((score / (totalQuestions * 100)) * 100) : 0}%
                  </div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
              </div>
              {isMultiplayer && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-700 font-bold">
                    Multiplayer Bonus: +75 points!
                  </div>
                </div>
              )}
              <Button 
                type="primary" 
                onClick={() => onComplete(score, 30)}
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

export default MathQuiz; 