import React, { useState } from 'react';
import { Row, Col, Card, Button, Badge, Avatar, Progress, Tabs, Empty, Input, message } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

const MultiplayerLobby: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  
  const { 
    multiplayerMatches, 
    getMultiplayerStats,
    createMultiplayerMatch,
    joinMultiplayerMatch,
    games
  } = useGameStore();

  const rawMultiplayerStats = getMultiplayerStats();
  const multiplayerGames = games.filter(g => g.multiplayerSupport);
  
  // Calculate derived stats
  const multiplayerStats = {
    ...rawMultiplayerStats,
    winRate: rawMultiplayerStats.totalMatches > 0 ? (rawMultiplayerStats.wins / rawMultiplayerStats.totalMatches) * 100 : 0,
    currentStreak: 0 // For now, we'll set this to 0. Could be calculated from recent match results
  };

  const handleCreateRoom = (gameId: string) => {
    const code = createMultiplayerMatch(gameId);
    message.success(`Room created! Share code: ${code}`);
  };

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      const success = joinMultiplayerMatch(roomCode);
      if (success) {
        message.success('Joined room successfully!');
        setRoomCode('');
      } else {
        message.error('Failed to join room. Check the code.');
      }
    } else {
      message.error('Please enter a valid 6-character room code.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

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
      transition: { duration: 0.5 }
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Quick Match',
      children: (
        <div className="space-y-6">
          {/* Stats Overview */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{multiplayerStats.totalMatches}</div>
                    <div className="text-sm text-gray-600">Total Matches</div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{multiplayerStats.wins}</div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{multiplayerStats.winRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{multiplayerStats.currentStreak}</div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Join Room */}
          <motion.div variants={itemVariants}>
            <Card title="Join Multiplayer Room" className="mb-6">
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter 6-character room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-lg font-mono"
                />
                <Button 
                  type="primary" 
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 6}
                >
                  Join Room
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Available Games */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Create New Match</h3>
            <Row gutter={[16, 16]}>
              {multiplayerGames.map((game) => (
                <Col key={game.id} xs={24} sm={12} md={8}>
                  <Card className="hover:shadow-lg transition-all">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{game.icon}</div>
                      <h4 className="text-lg font-bold mb-2">{game.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span>Base Points:</span>
                          <span className="font-bold">{game.pointsReward}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>MP Bonus:</span>
                          <span className="font-bold text-purple-600">+{game.multiplayerBonus}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Difficulty:</span>
                          <Badge color={game.difficulty === 'easy' ? 'green' : game.difficulty === 'medium' ? 'blue' : 'red'} text={game.difficulty} />
                        </div>
                      </div>

                      <Button 
                        type="primary" 
                        block
                        onClick={() => handleCreateRoom(game.id)}
                        style={{ backgroundColor: game.color, borderColor: game.color }}
                      >
                        Create Room
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      )
    },
    {
      key: '2',
      label: 'Match History',
      children: (
        <div className="space-y-6">
          {multiplayerMatches.length > 0 ? (
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                {multiplayerMatches.map((match) => {
                  const game = games.find(g => g.id === match.gameId);
                  return (
                    <Card key={match.id} className="hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{game?.icon}</div>
                          <div>
                            <h4 className="font-bold">{game?.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Badge color={getStatusColor(match.status)} text={match.status} />
                              {match.roomCode && (
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                  {match.roomCode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar.Group size="small">
                              {match.players.map((player, index) => (
                                <Avatar key={index} icon={<UserOutlined />} />
                              ))}
                            </Avatar.Group>
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.players.length}/2 players
                          </div>
                        </div>
                      </div>

                      {match.status === 'completed' && match.scores.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            {match.scores.map((score, index) => (
                              <div key={index} className="text-center">
                                <div className="font-bold text-lg">
                                  {score.position === 1 ? '🥇' : '🥈'} {score.score}
                                </div>
                                <div className="text-sm text-gray-600">
                                  +{score.pointsEarned} points
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <Empty 
              description="No matches yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )
    },
    {
      key: '3',
      label: 'Leaderboard',
      children: (
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card title="Global Leaderboard" className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <p className="text-gray-600 mb-4">Coming Soon!</p>
              <div className="space-y-3">
                {/* Mock leaderboard data */}
                {[
                  { rank: 1, name: 'GameMaster', score: 15420, icon: '🥇' },
                  { rank: 2, name: 'QuickThink', score: 13280, icon: '🥈' },
                  { rank: 3, name: 'MathWiz', score: 12140, icon: '🥉' },
                  { rank: 4, name: 'MemoryKing', score: 11900, icon: '🏅' },
                  { rank: 5, name: 'You', score: multiplayerStats.totalBonusPoints || 0, icon: '🎯' }
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{player.icon}</div>
                      <div>
                        <div className="font-bold">{player.name}</div>
                        <div className="text-sm text-gray-600">Rank #{player.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{(player.score || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Multiplayer Arena</h2>
          <p className="text-gray-600">
            Challenge friends and compete for the highest scores!
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs 
          items={tabItems}
          size="large"
          className="min-h-96"
        />
      </motion.div>
    </motion.div>
  );
};

export default MultiplayerLobby; 