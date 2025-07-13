import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch,
  Upload,
  DatePicker,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Popconfirm,
  Tooltip,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  UploadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';
import { AdminGameConfig } from '../../types/admin';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const GameConfiguration: React.FC = () => {
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [editingGame, setEditingGame] = useState<AdminGameConfig | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<AdminGameConfig | null>(null);
  const [form] = Form.useForm();

  const {
    games,
    loading,
    filters,
    fetchGames,
    createGame,
    updateGame,
    deleteGame,
    toggleGameStatus,
    setFilter,
    clearFilter
  } = useAdminStore();

  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreateGame = () => {
    setEditingGame(null);
    setGameModalVisible(true);
    form.resetFields();
  };

  const handleEditGame = (game: AdminGameConfig) => {
    setEditingGame(game);
    setGameModalVisible(true);
    form.setFieldsValue({
      ...game,
      dateRange: game.startDate && game.endDate ? [game.startDate, game.endDate] : undefined
    });
  };

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId);
    fetchGames(filters);
  };

  const handleToggleStatus = async (gameId: string, currentStatus: AdminGameConfig['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await toggleGameStatus(gameId, newStatus);
    fetchGames(filters);
  };

  const handleSubmitGame = async (values: any) => {
    try {
      const gameData = {
        ...values,
        startDate: values.dateRange?.[0],
        endDate: values.dateRange?.[1],
        requirements: {
          minLevel: values.minLevel,
          minStreak: values.minStreak,
          achievements: values.requiredAchievements
        },
        rewards: {
          points: values.rewardPoints,
          experience: values.rewardExperience,
          vouchers: values.rewardVouchers,
          achievements: values.rewardAchievements
        }
      };

      if (editingGame) {
        await updateGame(editingGame.id, gameData);
      } else {
        await createGame(gameData);
      }

      setGameModalVisible(false);
      form.resetFields();
      fetchGames(filters);
    } catch (error) {
      message.error('Failed to save game');
    }
  };

  const handlePreviewGame = (game: AdminGameConfig) => {
    setSelectedGame(game);
    setPreviewModalVisible(true);
  };

  const getStatusColor = (status: AdminGameConfig['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'scheduled': return 'blue';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty: AdminGameConfig['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const columns: ColumnsType<AdminGameConfig> = [
    {
      title: 'Game',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: AdminGameConfig) => (
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{record.icon}</div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{record.code}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminGameConfig['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: AdminGameConfig['difficulty']) => (
        <Tag color={getDifficultyColor(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Time Active',
      key: 'timeActive',
      render: (_, record: AdminGameConfig) => {
        if (!record.startDate || !record.endDate) return 'No schedule';
        const start = new Date(record.startDate).toLocaleDateString();
        const end = new Date(record.endDate).toLocaleDateString();
        return `${start} - ${end}`;
      }
    },
    {
      title: 'High Score',
      dataIndex: 'highScore',
      key: 'highScore',
      render: (score: number) => (
        <div className="flex items-center space-x-1">
          <TrophyOutlined className="text-yellow-500" />
          <span className="font-medium">{score.toLocaleString()}</span>
        </div>
      ),
      sorter: (a, b) => a.highScore - b.highScore
    },
    {
      title: 'Play Count',
      dataIndex: 'playCount',
      key: 'playCount',
      render: (count: number) => (
        <div className="flex items-center space-x-1">
          <PlayCircleOutlined className="text-blue-500" />
          <span className="font-medium">{count.toLocaleString()}</span>
        </div>
      ),
      sorter: (a, b) => a.playCount - b.playCount
    },
    {
      title: 'Avg Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number) => score.toFixed(0),
      sorter: (a, b) => a.averageScore - b.averageScore
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record: AdminGameConfig) => (
        <Space size="small">
          <Tooltip title="Preview">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handlePreviewGame(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditGame(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button 
              type="text" 
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this game?"
            onConfirm={() => handleDeleteGame(record.id)}
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderGameModal = () => (
    <Modal
      title={editingGame ? 'Edit Game' : 'Create New Game'}
      open={gameModalVisible}
      onCancel={() => {
        setGameModalVisible(false);
        form.resetFields();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitGame}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Game Name"
              name="name"
              rules={[{ required: true, message: 'Please enter game name' }]}
            >
              <Input placeholder="Enter game name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Game Code"
              name="code"
              rules={[{ required: true, message: 'Please enter game code' }]}
            >
              <Input placeholder="Enter game code" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={3} placeholder="Enter game description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Icon"
              name="icon"
            >
              <Input placeholder="Enter emoji icon" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="scheduled">Scheduled</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Difficulty"
              name="difficulty"
              rules={[{ required: true, message: 'Please select difficulty' }]}
            >
              <Select placeholder="Select difficulty">
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Active Period"
          name="dateRange"
        >
          <RangePicker showTime />
        </Form.Item>

        <Divider>Game Rules</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Daily Play Limit"
              name="dailyPlayLimit"
              rules={[{ required: true, message: 'Please enter daily play limit' }]}
            >
              <InputNumber min={1} max={50} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Time Limit (seconds)"
              name="timeLimit"
              rules={[{ required: true, message: 'Please enter time limit' }]}
            >
              <InputNumber min={30} max={3600} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Base Points"
              name="basePoints"
              rules={[{ required: true, message: 'Please enter base points' }]}
            >
              <InputNumber min={1} max={1000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Bonus Multiplier"
              name="bonusMultiplier"
              rules={[{ required: true, message: 'Please enter bonus multiplier' }]}
            >
              <InputNumber min={1} max={10} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Requirements</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Min Level"
              name="minLevel"
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Min Streak"
              name="minStreak"
            >
              <InputNumber min={0} max={365} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Rewards</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Points Reward"
              name="rewardPoints"
              rules={[{ required: true, message: 'Please enter points reward' }]}
            >
              <InputNumber min={0} max={10000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Experience Reward"
              name="rewardExperience"
              rules={[{ required: true, message: 'Please enter experience reward' }]}
            >
              <InputNumber min={0} max={1000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingGame ? 'Update Game' : 'Create Game'}
            </Button>
            <Button onClick={() => {
              setGameModalVisible(false);
              form.resetFields();
            }}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderPreviewModal = () => (
    <Modal
      title="Game Preview"
      open={previewModalVisible}
      onCancel={() => setPreviewModalVisible(false)}
      footer={null}
      width={600}
    >
      {selectedGame && (
        <div>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{selectedGame.icon}</div>
            <h3 className="text-2xl font-bold">{selectedGame.name}</h3>
            <p className="text-gray-600">{selectedGame.description}</p>
          </div>

          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Difficulty"
                  value={selectedGame.difficulty}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Time Limit"
                  value={selectedGame.timeLimit}
                  suffix="s"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Play Count"
                  value={selectedGame.playCount}
                  prefix={<PlayCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="High Score"
                  value={selectedGame.highScore}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Game Configuration" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-2">
                  <strong>Status:</strong> 
                  <Tag color={getStatusColor(selectedGame.status)} className="ml-2">
                    {selectedGame.status}
                  </Tag>
                </div>
                <div className="mb-2">
                  <strong>Daily Limit:</strong> {selectedGame.dailyPlayLimit} plays
                </div>
                <div className="mb-2">
                  <strong>Base Points:</strong> {selectedGame.basePoints}
                </div>
                <div className="mb-2">
                  <strong>Bonus Multiplier:</strong> {selectedGame.bonusMultiplier}x
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-2">
                  <strong>Min Level:</strong> {selectedGame.requirements.minLevel || 'Any'}
                </div>
                <div className="mb-2">
                  <strong>Min Streak:</strong> {selectedGame.requirements.minStreak || 'Any'}
                </div>
                <div className="mb-2">
                  <strong>Points Reward:</strong> {selectedGame.rewards.points}
                </div>
                <div className="mb-2">
                  <strong>Experience Reward:</strong> {selectedGame.rewards.experience}
                </div>
              </Col>
            </Row>
          </Card>

          {selectedGame.startDate && selectedGame.endDate && (
            <Card title="Schedule" size="small" className="mt-4">
              <div>
                <strong>Start:</strong> {new Date(selectedGame.startDate).toLocaleString()}
              </div>
              <div>
                <strong>End:</strong> {new Date(selectedGame.endDate).toLocaleString()}
              </div>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Game Configuration</h2>
              <p className="text-gray-600">Manage games, configure rules, and track performance</p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateGame}
              >
                Create Game
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchGames(filters)}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {/* Game Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Total Games"
                  value={games.length}
                  prefix={<SettingOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Active Games"
                  value={games.filter(g => g.status === 'active').length}
                  prefix={<PlayCircleOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Total Plays"
                  value={games.reduce((sum, g) => sum + g.playCount, 0)}
                  prefix={<UserOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Avg Score"
                  value={games.reduce((sum, g) => sum + g.averageScore, 0) / games.length || 0}
                  precision={0}
                  prefix={<TrophyOutlined className="text-yellow-500" />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={games}
          rowKey="id"
          loading={loading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: games.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} games`
          }}
          onChange={(pagination) => {
            setFilter({
              page: pagination.current,
              pageSize: pagination.pageSize
            });
          }}
        />
      </Card>

      {renderGameModal()}
      {renderPreviewModal()}
    </motion.div>
  );
};

export default GameConfiguration; 