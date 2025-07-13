import React, { useState } from 'react';
import { Row, Col, Card, Button, Progress, Avatar, Badge, message, Modal } from 'antd';
import { EnvironmentOutlined, CloudOutlined, StarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/gameStore';

const CommunityTrees: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState(1);
  const [showContributors, setShowContributors] = useState<string | null>(null);
  
  const { 
    communityTrees, 
    dailyWaterUsed, 
    maxDailyWater,
    waterTree,
    unlockTree,
    getTreeStats 
  } = useGameStore();

  const getTreeEmoji = (type: string, stage: string) => {
    const emojiMap = {
      oak: {
        seed: '🌰',
        sprout: '🌱',
        sapling: '🌿',
        young: '🌳',
        mature: '🌲',
        ancient: '🌳'
      },
      cherry: {
        seed: '🌸',
        sprout: '🌱',
        sapling: '🌸',
        young: '🌸',
        mature: '🌸',
        ancient: '🌸'
      },
      pine: {
        seed: '🌰',
        sprout: '🌱',
        sapling: '🌿',
        young: '🌲',
        mature: '🌲',
        ancient: '🌲'
      },
      bamboo: {
        seed: '🎋',
        sprout: '🌱',
        sapling: '🎋',
        young: '🎋',
        mature: '🎋',
        ancient: '🎋'
      },
      magic: {
        seed: '✨',
        sprout: '🌟',
        sapling: '🔮',
        young: '🌟',
        mature: '⭐',
        ancient: '🌟'
      }
    };
    return emojiMap[type as keyof typeof emojiMap]?.[stage as keyof typeof emojiMap.oak] || '🌱';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#52c41a';
      case 'rare': return '#1890ff';
      case 'epic': return '#722ed1';
      case 'legendary': return '#fa8c16';
      case 'mythic': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = ['seed', 'sprout', 'sapling', 'young', 'mature', 'ancient'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getHealthColor = (health: number, maxHealth: number) => {
    const percentage = (health / maxHealth) * 100;
    if (percentage >= 80) return '#52c41a';
    if (percentage >= 60) return '#fadb14';
    if (percentage >= 40) return '#fa8c16';
    return '#f5222d';
  };

  const handleWaterTree = (treeId: string) => {
    const success = waterTree(treeId, waterAmount);
    if (success) {
      message.success(`🌱 Tree watered! +${waterAmount * 5} points earned!`);
      
      // Trigger confetti for special achievements
      if (waterAmount >= 5) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } else {
      message.warning('💧 Daily water limit reached! Come back tomorrow!');
    }
  };

  const handleUnlockTree = (treeId: string) => {
    unlockTree(treeId);
    message.success('🌳 Tree unlocked! Start watering to help it grow!');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const checkUnlockRequirement = (tree: { unlockRequirement: { type: string; value: number } }) => {
    // Simple mock check - in real app, this would check actual player stats
    switch (tree.unlockRequirement.type) {
      case 'level':
        return true; // Assume player meets level requirement
      case 'multiplayer_wins':
        return false; // Most players won't have 5 wins yet
      case 'achievements':
        return false; // Most players won't have 10 achievements
      default:
        return true;
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

  const unlockedTrees = communityTrees.filter(t => t.isUnlocked);
  const lockedTrees = communityTrees.filter(t => !t.isUnlocked);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Water Status */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CloudOutlined className="text-2xl text-blue-500" />
              <div>
                <h3 className="text-lg font-bold">Daily Water Supply</h3>
                <p className="text-gray-600">Help trees grow with your daily water!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {maxDailyWater - dailyWaterUsed}/{maxDailyWater}
              </div>
              <div className="text-sm text-gray-600">Water Remaining</div>
              <Progress 
                percent={((maxDailyWater - dailyWaterUsed) / maxDailyWater) * 100}
                size="small"
                strokeColor="#1890ff"
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Unlocked Trees */}
      {unlockedTrees.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <EnvironmentOutlined className="mr-2 text-green-500" />
            Community Trees
          </h3>
          <Row gutter={[16, 16]}>
            {unlockedTrees.map((tree) => {
              const treeStats = getTreeStats(tree.id);
              return (
                <Col key={tree.id} xs={24} sm={12} lg={8}>
                  <Card 
                    className="tree-card hover:shadow-lg transition-all cursor-pointer"
                    style={{ borderColor: getRarityColor(tree.rarity) }}
                    onClick={() => setSelectedTree(tree.id)}
                  >
                    <div className="text-center">
                      {/* Tree Emoji */}
                      <div className="text-6xl mb-3">
                        {getTreeEmoji(tree.type, tree.growthStage)}
                      </div>
                      
                      {/* Tree Info */}
                      <h4 className="text-lg font-bold mb-2">{tree.name}</h4>
                      <Badge 
                        color={getRarityColor(tree.rarity)} 
                        text={tree.rarity} 
                        className="mb-3"
                      />
                      
                      {/* Growth Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Growth Stage</span>
                          <span className="capitalize font-bold">{tree.growthStage}</span>
                        </div>
                        <Progress 
                          percent={getStageProgress(tree.growthStage)}
                          strokeColor={getRarityColor(tree.rarity)}
                          size="small"
                        />
                      </div>

                      {/* Health Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Health</span>
                          <span>{tree.health}/{tree.maxHealth}</span>
                        </div>
                        <Progress 
                          percent={(tree.health / tree.maxHealth) * 100}
                          strokeColor={getHealthColor(tree.health, tree.maxHealth)}
                          size="small"
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-green-600">{tree.level}</div>
                          <div className="text-gray-600">Level</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-blue-600">{tree.totalWater}</div>
                          <div className="text-gray-600">Total Water</div>
                        </div>
                      </div>

                      {/* Contributors */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold">Contributors</span>
                          <Button 
                            size="small" 
                            type="link"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowContributors(tree.id);
                            }}
                          >
                            View All
                          </Button>
                        </div>
                        <Avatar.Group size="small" maxCount={4}>
                          {tree.contributors.slice(0, 4).map((contributor) => (
                            <Tooltip key={contributor.userId} title={`${contributor.username}: ${contributor.waterContributed} water`}>
                              <Avatar src={contributor.avatar} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>

                      {/* Water Controls */}
                      {treeStats.canWater && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Water Amount:</span>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWaterAmount(Math.max(1, waterAmount - 1));
                                }}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{waterAmount}</span>
                              <Button 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWaterAmount(Math.min(5, waterAmount + 1));
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button 
                            type="primary"
                            block
                            icon={<CloudOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWaterTree(tree.id);
                            }}
                            disabled={dailyWaterUsed >= maxDailyWater}
                            style={{ backgroundColor: getRarityColor(tree.rarity), borderColor: getRarityColor(tree.rarity) }}
                          >
                            Water Tree (+{waterAmount * 5} pts)
                          </Button>
                        </div>
                      )}

                      {!treeStats.canWater && (
                        <div className="text-center text-gray-500 text-sm">
                          💧 No water remaining today
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </motion.div>
      )}

      {/* Locked Trees */}
      {lockedTrees.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <StarOutlined className="mr-2 text-yellow-500" />
            Unlock New Trees
          </h3>
          <Row gutter={[16, 16]}>
            {lockedTrees.map((tree) => {
              const canUnlock = checkUnlockRequirement(tree);
              return (
                <Col key={tree.id} xs={24} sm={12} lg={8}>
                  <Card 
                    className={`tree-card ${canUnlock ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'} transition-all`}
                    style={{ borderColor: getRarityColor(tree.rarity) }}
                  >
                    <div className="text-center">
                      {/* Locked Tree */}
                      <div className="text-6xl mb-3 opacity-50">
                        {getTreeEmoji(tree.type, 'seed')}
                      </div>
                      
                      <h4 className="text-lg font-bold mb-2">{tree.name}</h4>
                      <Badge 
                        color={getRarityColor(tree.rarity)} 
                        text={tree.rarity} 
                        className="mb-3"
                      />
                      
                      <p className="text-sm text-gray-600 mb-4">{tree.description}</p>

                      {/* Requirements */}
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <div className="text-sm font-bold mb-2">🔒 Unlock Requirement</div>
                        <div className="text-xs text-gray-600">
                          {tree.unlockRequirement.description}
                        </div>
                      </div>

                      {/* Special Effects */}
                      {tree.specialEffects.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-bold mb-2">✨ Special Effects</div>
                          <div className="space-y-1">
                            {tree.specialEffects.map((effect, index) => (
                              <Badge key={index} color="purple" text={effect.replace('_', ' ')} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rewards Preview */}
                      <div className="mb-4">
                        <div className="text-sm font-bold mb-2">🎁 Rewards</div>
                        <div className="space-y-1 text-xs">
                          {tree.rewards.slice(0, 2).map((reward, index) => (
                            <div key={index} className="flex justify-between">
                              <span>Level {reward.level}:</span>
                              <span className="font-bold text-green-600">+{reward.points} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {canUnlock ? (
                        <Button 
                          type="primary"
                          block
                          onClick={() => handleUnlockTree(tree.id)}
                          style={{ backgroundColor: getRarityColor(tree.rarity), borderColor: getRarityColor(tree.rarity) }}
                        >
                          🌱 Plant Tree
                        </Button>
                      ) : (
                        <Button disabled block>
                          🔒 Requirements Not Met
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </motion.div>
      )}

      {/* Contributors Modal */}
      <Modal
        title="Tree Contributors"
        open={!!showContributors}
        onCancel={() => setShowContributors(null)}
        footer={null}
        width={600}
      >
        {showContributors && (
          <div className="space-y-4">
            {communityTrees
              .find(t => t.id === showContributors)
              ?.contributors.map((contributor, index) => (
                <div key={contributor.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                    <Avatar src={contributor.avatar} />
                    <div>
                      <div className="font-bold">{contributor.username}</div>
                      <div className="text-sm text-gray-600">
                        Last contribution: {new Date(contributor.lastContribution).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{contributor.waterContributed} 💧</div>
                    <div className="text-sm text-green-600">+{contributor.pointsEarned} pts</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Modal>

      {/* Empty State */}
      {unlockedTrees.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2">No Trees Yet</h3>
            <p className="text-gray-600 mb-4">
              Unlock your first tree by meeting the requirements!
            </p>
            <Button type="primary" onClick={() => handleUnlockTree('oak-tree-1')}>
              🌳 Plant Your First Tree
            </Button>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CommunityTrees; 