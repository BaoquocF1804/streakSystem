import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Drawer, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Statistic,
  List,
  Badge,
  message,
  Descriptions,
  Tabs
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  MessageOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  TeamOutlined,
  CrownOutlined,
  SettingOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../../stores/socialStore';
import { SocialGroup, GroupMember } from '../../../types/social';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

const GroupManagement: React.FC = () => {
  const [groupDetailVisible, setGroupDetailVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [transferLeaderVisible, setTransferLeaderVisible] = useState(false);
  const [form] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const {
    groups,
    groupMembers,
    selectedGroup,
    groupFilter,
    loading,
    fetchGroups,
    getGroupDetail,
    getGroupMembers,
    updateGroupStatus,
    transferGroupLeader,
    removeGroupMember,
    deleteGroup,
    sendGroupNotification,
    setGroupFilter
  } = useSocialStore();

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSearch = (value: string) => {
    setGroupFilter({ ...groupFilter, search: value });
    fetchGroups({ ...groupFilter, search: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { ...groupFilter, [key]: value };
    setGroupFilter(newFilter);
    fetchGroups(newFilter);
  };

  const handleViewGroup = async (groupId: string) => {
    setSelectedGroupId(groupId);
    setGroupDetailVisible(true);
    await getGroupDetail(groupId);
    await getGroupMembers(groupId);
  };

  const handleUpdateStatus = async (groupId: string, status: SocialGroup['status']) => {
    await updateGroupStatus(groupId, status);
    message.success(`Group status updated to ${status}`);
    fetchGroups(groupFilter);
  };

  const handleDeleteGroup = async (groupId: string) => {
    await deleteGroup(groupId);
    message.success('Group deleted successfully');
    fetchGroups(groupFilter);
  };

  const handleTransferLeader = async (values: any) => {
    if (selectedGroupId) {
      await transferGroupLeader(selectedGroupId, values.newLeaderId);
      message.success('Group leader transferred successfully');
      setTransferLeaderVisible(false);
      form.resetFields();
      getGroupDetail(selectedGroupId);
      getGroupMembers(selectedGroupId);
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    await removeGroupMember(groupId, userId);
    message.success('Member removed successfully');
    getGroupMembers(groupId);
  };

  const handleSendNotification = async (values: any) => {
    if (selectedGroupId) {
      await sendGroupNotification(selectedGroupId, values.message);
      message.success('Notification sent successfully');
      setNotificationModalVisible(false);
      notificationForm.resetFields();
    }
  };

  const getGroupTypeColor = (type: SocialGroup['type']) => {
    switch (type) {
      case 'group_buying': return 'blue';
      case 'community': return 'green';
      case 'tree_planting': return 'orange';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const getGroupTypeLabel = (type: SocialGroup['type']) => {
    switch (type) {
      case 'group_buying': return 'Mua chung';
      case 'community': return 'Cộng đồng';
      case 'tree_planting': return 'Trồng cây';
      case 'general': return 'Tổng quát';
      default: return type;
    }
  };

  const getStatusColor = (status: SocialGroup['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'suspended': return 'red';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: SocialGroup['status']) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Tạm ngưng';
      case 'suspended': return 'Đình chỉ';
      default: return status;
    }
  };

  const columns: ColumnsType<SocialGroup> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: SocialGroup) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.avatar} 
            className="bg-blue-500"
          >
            {name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: SocialGroup['type']) => (
        <Tag color={getGroupTypeColor(type)}>
          {getGroupTypeLabel(type)}
        </Tag>
      )
    },
    {
      title: 'Thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (count: number) => (
        <div className="flex items-center space-x-1">
          <TeamOutlined className="text-blue-500" />
          <span className="font-medium">{count}</span>
        </div>
      ),
      sorter: (a, b) => a.memberCount - b.memberCount
    },
    {
      title: 'Leader',
      dataIndex: 'leaderName',
      key: 'leaderName',
      render: (leaderName: string) => (
        <div className="flex items-center space-x-1">
          <CrownOutlined className="text-yellow-500" />
          <span>{leaderName}</span>
        </div>
      )
    },
    {
      title: 'Tương tác/7d',
      dataIndex: 'interactions7d',
      key: 'interactions7d',
      render: (interactions: number) => (
        <span className="font-medium">{interactions}</span>
      ),
      sorter: (a, b) => a.interactions7d - b.interactions7d
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: SocialGroup['status']) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Quản lý',
      key: 'actions',
      width: 200,
      render: (_, record: SocialGroup) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewGroup(record.id)}
            />
          </Tooltip>
          <Tooltip title="Gửi thông báo">
            <Button 
              type="text" 
              icon={<MessageOutlined />}
              onClick={() => {
                setSelectedGroupId(record.id);
                setNotificationModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cài đặt">
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              onClick={() => {
                // Handle settings
              }}
            />
          </Tooltip>
          <Popconfirm
            title={`Bạn có chắc muốn ${record.status === 'active' ? 'tạm ngưng' : 'kích hoạt'} nhóm này?`}
            onConfirm={() => handleUpdateStatus(record.id, record.status === 'active' ? 'inactive' : 'active')}
          >
            <Tooltip title={record.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}>
              <Button 
                type="text" 
                danger={record.status === 'active'}
              >
                {record.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhóm này?"
            onConfirm={() => handleDeleteGroup(record.id)}
          >
            <Tooltip title="Xóa nhóm">
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

  const memberColumns: ColumnsType<GroupMember> = [
    {
      title: 'Thành viên',
      render: (_, record: GroupMember) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={32} 
            src={record.avatar} 
            className="bg-blue-500"
          >
            {record.username.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.username}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role: GroupMember['role']) => (
        <Tag color={role === 'leader' ? 'gold' : role === 'admin' ? 'blue' : 'default'}>
          {role === 'leader' ? 'Trưởng nhóm' : role === 'admin' ? 'Quản trị' : 'Thành viên'}
        </Tag>
      )
    },
    {
      title: 'Tham gia',
      dataIndex: 'joinedAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hoạt động cuối',
      dataIndex: 'lastActive',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Đóng góp',
      dataIndex: 'contributions',
      render: (contributions: number) => (
        <span className="font-medium">{contributions}</span>
      )
    },
    {
      title: 'Hành động',
      render: (_, record: GroupMember) => (
        <Space size="small">
          {record.role !== 'leader' && (
            <Tooltip title="Chuyển làm trưởng nhóm">
              <Button 
                type="text" 
                icon={<CrownOutlined />}
                onClick={() => {
                  setSelectedMemberId(record.userId);
                  setTransferLeaderVisible(true);
                }}
              />
            </Tooltip>
          )}
          {record.role !== 'leader' && (
            <Popconfirm
              title="Bạn có chắc muốn xóa thành viên này?"
              onConfirm={() => handleRemoveMember(record.groupId, record.userId)}
            >
              <Tooltip title="Xóa thành viên">
                <Button 
                  type="text" 
                  icon={<UserDeleteOutlined />}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const renderGroupDetail = () => {
    if (!selectedGroup || !selectedGroupId) return null;
    const members = groupMembers[selectedGroupId] || [];

    return (
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <Avatar 
              size={40} 
              src={selectedGroup.avatar} 
              className="bg-blue-500"
            >
              {selectedGroup.name.charAt(0)}
            </Avatar>
            <div>
              <div className="font-medium">{selectedGroup.name}</div>
              <div className="text-sm text-gray-500">
                <Tag color={getGroupTypeColor(selectedGroup.type)}>
                  {getGroupTypeLabel(selectedGroup.type)}
                </Tag>
              </div>
            </div>
          </div>
        }
        width={800}
        open={groupDetailVisible}
        onClose={() => setGroupDetailVisible(false)}
      >
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Tổng quan" key="overview">
            <Row gutter={16} className="mb-6">
              <Col span={8}>
                <Card size="small" className="text-center">
                  <Statistic
                    title="Thành viên"
                    value={selectedGroup.memberCount}
                    prefix={<TeamOutlined className="text-blue-500" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center">
                  <Statistic
                    title="Tương tác 7 ngày"
                    value={selectedGroup.interactions7d}
                    prefix={<MessageOutlined className="text-green-500" />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center">
                  <Statistic
                    title="Trạng thái"
                    value={getStatusLabel(selectedGroup.status)}
                    valueStyle={{ 
                      color: selectedGroup.status === 'active' ? '#52c41a' : '#fa8c16' 
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions title="Thông tin nhóm" bordered>
              <Descriptions.Item label="ID nhóm">{selectedGroup.id}</Descriptions.Item>
              <Descriptions.Item label="Tên nhóm">{selectedGroup.name}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>{selectedGroup.description}</Descriptions.Item>
              <Descriptions.Item label="Loại nhóm">
                <Tag color={getGroupTypeColor(selectedGroup.type)}>
                  {getGroupTypeLabel(selectedGroup.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trưởng nhóm">{selectedGroup.leaderName}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedGroup.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {new Date(selectedGroup.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Riêng tư" span={2}>
                <Tag color={selectedGroup.settings.isPrivate ? 'red' : 'green'}>
                  {selectedGroup.settings.isPrivate ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h3>Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGroup.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </div>
            </div>
          </TabPane>

          <TabPane tab="Thành viên" key="members">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3>Danh sách thành viên ({members.length})</h3>
                <Space>
                  <Button 
                    icon={<UserAddOutlined />}
                    onClick={() => {
                      // Handle add member
                    }}
                  >
                    Thêm thành viên
                  </Button>
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={() => {
                      // Handle export members
                    }}
                  >
                    Xuất danh sách
                  </Button>
                </Space>
              </div>
            </div>

            <Table
              columns={memberColumns}
              dataSource={members}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thành viên`
              }}
            />
          </TabPane>

          <TabPane tab="Cài đặt" key="settings">
            <Card title="Cài đặt nhóm">
              <Descriptions bordered>
                <Descriptions.Item label="Tự động duyệt">
                  <Tag color={selectedGroup.settings.autoApprove ? 'green' : 'red'}>
                    {selectedGroup.settings.autoApprove ? 'Bật' : 'Tắt'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Cho phép mời">
                  <Tag color={selectedGroup.settings.allowInvites ? 'green' : 'red'}>
                    {selectedGroup.settings.allowInvites ? 'Có' : 'Không'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Số thành viên tối đa">
                  {selectedGroup.settings.maxMembers}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </TabPane>
        </Tabs>
      </Drawer>
    );
  };

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
              <h2 className="text-2xl font-bold text-gray-800">Quản lý nhóm/cộng đồng</h2>
              <p className="text-gray-600">Quản lý các nhóm mua chung, cộng đồng và hoạt động</p>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchGroups(groupFilter)}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={() => {
                  // Handle export
                }}
              >
                Xuất dữ liệu
              </Button>
            </Space>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Search
              placeholder="Tìm kiếm nhóm..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            
            <Select
              placeholder="Loại nhóm"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="group_buying">Mua chung</Option>
              <Option value="community">Cộng đồng</Option>
              <Option value="tree_planting">Trồng cây</Option>
              <Option value="general">Tổng quát</Option>
            </Select>

            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Tạm ngưng</Option>
              <Option value="suspended">Đình chỉ</Option>
            </Select>

            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </div>

          {/* Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng số nhóm"
                  value={groups.length}
                  prefix={<TeamOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Nhóm hoạt động"
                  value={groups.filter(g => g.status === 'active').length}
                  prefix={<TeamOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng thành viên"
                  value={groups.reduce((sum, g) => sum + g.memberCount, 0)}
                  prefix={<UserAddOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tương tác tuần"
                  value={groups.reduce((sum, g) => sum + g.interactions7d, 0)}
                  prefix={<MessageOutlined className="text-orange-500" />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={groups}
          rowKey="id"
          loading={loading}
          pagination={{
            current: 1,
            pageSize: 10,
            total: groups.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhóm`
          }}
        />
      </Card>

      {renderGroupDetail()}

      {/* Transfer Leader Modal */}
      <Modal
        title="Chuyển quyền trưởng nhóm"
        open={transferLeaderVisible}
        onCancel={() => {
          setTransferLeaderVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransferLeader}
        >
          <Form.Item
            label="Thành viên mới"
            name="newLeaderId"
            rules={[{ required: true, message: 'Vui lòng chọn thành viên mới' }]}
          >
            <Select placeholder="Chọn thành viên">
              {selectedGroupId && groupMembers[selectedGroupId]?.map(member => (
                <Option key={member.userId} value={member.userId}>
                  {member.username} ({member.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Chuyển quyền
              </Button>
              <Button onClick={() => {
                setTransferLeaderVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notification Modal */}
      <Modal
        title="Gửi thông báo nhóm"
        open={notificationModalVisible}
        onCancel={() => {
          setNotificationModalVisible(false);
          notificationForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={notificationForm}
          layout="vertical"
          onFinish={handleSendNotification}
        >
          <Form.Item
            label="Nội dung thông báo"
            name="message"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung thông báo cho nhóm..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Gửi thông báo
              </Button>
              <Button onClick={() => {
                setNotificationModalVisible(false);
                notificationForm.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default GroupManagement; 