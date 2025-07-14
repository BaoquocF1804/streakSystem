import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Badge, Button, Progress, Modal, Input, message } from 'antd';
import { RocketOutlined, TrophyOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAppStore } from '../../stores/appStore';
import { useGameConfig, useFeatureConfig, useUserLimits } from '../../hooks/useRealTimeConfig';
import MemoryGame from './MemoryGame';
import MathQuiz from './MathQuiz';
import CommunityTrees from './CommunityTrees';
import MultiplayerLobby from './MultiplayerLobby';

const GameHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(false);
  const [showMultiplayerModal, setShowMultiplayerModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(0);
  
  const { 
    games, 
    playerLevel, 
    totalPoints, 
    gamesUnlocked, 
    achievements,
    achievementsUnlocked,
    currentGameStreak,
    communityTrees,
    playGame,
    createMultiplayerMatch,
    joinMultiplayerMatch,
    getPlayerStats,
    getMultiplayerStats
  } = useGameStore();
  
  const { isAuthenticated } = useAppStore();
  
  // Use real-time config hooks
  const { 
    maxDailyPlays, 
    enableMultiplayer, 
    streakBonusMultiplier, 
    isMultiplayerEnabled, 
    timeouts,
    pointsPerGame,
    experiencePerGame
  } = useGameConfig();
  
  const { 
    communityTrees: communityTreesEnabled,
    multiplayerGames: multiplayerGamesEnabled
  } = useFeatureConfig();
  
  const { isActionAllowed, getRemainingLimit } = useUserLimits();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleGameSelect = (gameId: string, multiplayer = false) => {
    if (!isAuthenticated) {
      message.error('Please login to play games');
      return;
    }
    
    // Check daily games limit using real-time config
    if (!isActionAllowed('daily_games', dailyGamesPlayed)) {
      const remaining = getRemainingLimit('daily_games', dailyGamesPlayed);
      message.warning(`You've reached the daily limit! You can play ${remaining} more games today.`);
      return;
    }
    
    // Check if multiplayer is enabled in config
    if (multiplayer && !isMultiplayerEnabled) {
      message.error('Multiplayer games are currently disabled');
      return;
    }
    
    if (multiplayer && !multiplayerGamesEnabled) {
      message.error('Multiplayer feature is not available');
      return;
    }
    
    if (multiplayer) {
      setIsMultiplayerMode(true);
      setShowMultiplayerModal(true);
    } else {
      setIsMultiplayerMode(false);
      playGame(gameId);
      setDailyGamesPlayed(prev => prev + 1);
    }
    
    setActiveGame(gameId);
  };

  const handleCreateMultiplayerRoom = (gameId: string) => {
    const code = createMultiplayerMatch(gameId);
    setRoomCode(code);
    setShowMultiplayerModal(false);
    message.success(`Room created! Code: ${code}`);
  };

  const handleJoinMultiplayerRoom = () => {
    if (!roomCode) {
      message.error('Please enter a room code');
      return;
    }
    
    const success = joinMultiplayerMatch(roomCode);
    if (success) {
      setShowMultiplayerModal(false);
      message.success('Joined room successfully!');
    } else {
      message.error('Failed to join room. Please check the code.');
    }
  };

  const renderGame = () => {
    if (!activeGame) return null;
    
    const gameProps = {
      onGameComplete: () => {
        setActiveGame(null);
        setIsMultiplayerMode(false);
      },
      isMultiplayer: isMultiplayerMode
    };
    
    switch (activeGame) {
      case 'memory-game':
        return <MemoryGame {...gameProps} />;
      case 'math-quiz':
        return <MathQuiz {...gameProps} />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#fa8c16';
      case 'hard': return '#f5222d';
      case 'expert': return '#722ed1';
      default: return '#1890ff';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#52c41a';
      case 'rare': return '#1890ff';
      case 'epic': return '#722ed1';
      case 'legendary': return '#fa8c16';
      default: return '#8c8c8c';
    }
  };

  if (activeGame) {
    return (
      <div className="game-container">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => setActiveGame(null)}>
            ← Back to Game Hub
          </Button>
          {isMultiplayerMode && (
            <Badge count="MULTIPLAYER" style={{ backgroundColor: '#722ed1' }} />
          )}
        </div>
        {renderGame()}
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <RocketOutlined />
          Games
        </span>
      ),
      children: (
        <div className="space-y-6">
          {/* Player Stats */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{playerLevel.level}</div>
                    <div className="text-sm text-gray-600">Level</div>
                    <div className="text-xs text-gray-500">{playerLevel.title}</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{currentGameStreak}</div>
                    <div className="text-sm text-gray-600">Game Streak</div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{achievementsUnlocked.length}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Available Games */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Available Games</h3>
            <Row gutter={[16, 16]}>
              {games.map((game) => {
                const isUnlocked = gamesUnlocked.includes(game.id);
                return (
                  <Col key={game.id} xs={24} sm={12} md={8} lg={6}>
                    <Card 
                      className={`game-card ${!isUnlocked ? 'opacity-50' : 'hover:shadow-lg'} transition-all cursor-pointer`}
                      style={{ borderColor: game.color }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{game.icon}</div>
                        <h4 className="text-lg font-bold mb-2">{game.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span>Difficulty:</span>
                            <Badge color={getDifficultyColor(game.difficulty)} text={game.difficulty} />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Points:</span>
                            <span className="font-bold">{game.pointsReward}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Best Score:</span>
                            <span className="font-bold">{game.bestScore}</span>
                          </div>
                          {game.multiplayerSupport && (
                            <div className="flex justify-between text-xs">
                              <span>MP Bonus:</span>
                              <span className="font-bold text-purple-600">+{game.multiplayerBonus}</span>
                            </div>
                          )}
                        </div>

                        {isUnlocked ? (
                          <div className="space-y-2">
                            <Button 
                              type="primary" 
                              block 
                              onClick={() => handleGameSelect(game.id)}
                              style={{ backgroundColor: game.color, borderColor: game.color }}
                            >
                              Play Solo
                            </Button>
                            {game.multiplayerSupport && (
                              <div className="flex space-x-1">
                                <Button 
                                  size="small" 
                                  block
                                  onClick={() => handleCreateMultiplayerRoom(game.id)}
                                  className="text-purple-600 border-purple-600"
                                >
                                  Create Room
                                </Button>
                                <Button 
                                  size="small" 
                                  block
                                  onClick={() => setShowMultiplayerModal(true)}
                                  className="text-purple-600 border-purple-600"
                                >
                                  Join Room
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <Button disabled block>🔒 Locked</Button>
                            {game.requirements && (
                              <div className="text-xs text-gray-500 mt-2">
                                {game.requirements[0].description}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </motion.div>
        </div>
      )
    },
    {
      key: '2',
      label: (
        <span>
          <TeamOutlined />
          Multiplayer
        </span>
      ),
      children: <MultiplayerLobby />
    },
    {
      key: '3',
      label: (
        <span>
          <TrophyOutlined />
          Achievements
        </span>
      ),
      children: (
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Your Achievements</h3>
            <Row gutter={[16, 16]}>
              {achievements.map((achievement) => {
                const isUnlocked = achievementsUnlocked.includes(achievement.id);
                return (
                  <Col key={achievement.id} xs={24} sm={12} md={8}>
                    <Card className={`${!isUnlocked ? 'opacity-60' : ''} transition-all`}>
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex justify-between items-center mb-2">
                            <Badge color={getRarityColor(achievement.rarity)} text={achievement.rarity} />
                            <span className="text-sm font-bold text-green-600">+{achievement.pointsReward}</span>
                          </div>
                          {!isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                percent={(achievement.progress / achievement.maxProgress) * 100} 
                                size="small"
                                strokeColor={getRarityColor(achievement.rarity)}
                              />
                            </div>
                          )}
                          {isUnlocked && (
                            <div className="text-green-600 text-sm font-bold">✅ Unlocked!</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </motion.div>
        </div>
      )
    },
    {
      key: '4',
      label: (
        <span>
          <EnvironmentOutlined />
          Community Trees
        </span>
      ),
      children: <CommunityTrees />
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Game Hub 🎮
          </h1>
          <p className="text-lg text-gray-600">
            Play games, compete with friends, and grow community trees together
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="text-2xl font-bold text-blue-600">{getPlayerStats().gamesPlayed}</div>
              <div className="text-gray-600">Games Played</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="text-2xl font-bold text-purple-600">{getMultiplayerStats().wins}</div>
              <div className="text-gray-600">Multiplayer Wins</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-gradient-to-r from-green-50 to-green-100">
              <div className="text-2xl font-bold text-green-600">{communityTrees.filter(t => t.isUnlocked).length}</div>
              <div className="text-gray-600">Trees Unlocked</div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <Tabs 
            defaultActiveKey="1" 
            items={tabItems}
            size="large"
            className="min-h-96"
          />
        </Card>
      </motion.div>

      {/* Multiplayer Modal */}
      <Modal
        title="Join Multiplayer Room"
        open={showMultiplayerModal}
        onOk={handleJoinMultiplayerRoom}
        onCancel={() => {
          setShowMultiplayerModal(false);
          setRoomCode('');
        }}
        okText="Join Room"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Room Code</label>
            <Input
              placeholder="Enter 6-character room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-lg font-mono"
            />
          </div>
          <div className="text-sm text-gray-500">
            Ask your friend for the room code to join their game!
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default GameHub; 