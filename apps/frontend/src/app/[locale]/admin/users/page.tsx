'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Mail,
  Shield,
  ShieldOff,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'COUNSELOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'inactive';
  companyCode?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default function UsersManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulated users data
      const mockUsers: User[] = [
        {
          id: '1',
          name: '山田太郎',
          email: 'yamada@example.com',
          role: 'USER',
          status: 'active',
          createdAt: '2024-01-15',
          lastLoginAt: '2024-03-20',
        },
        {
          id: '2',
          name: '佐藤花子',
          email: 'sato@example.com',
          role: 'USER',
          status: 'active',
          companyCode: 'COMP001',
          createdAt: '2024-02-10',
          lastLoginAt: '2024-03-19',
        },
        {
          id: '3',
          name: '田中一郎',
          email: 'tanaka@example.com',
          role: 'COUNSELOR',
          status: 'active',
          createdAt: '2024-01-20',
          lastLoginAt: '2024-03-20',
        },
        {
          id: '4',
          name: '鈴木美咲',
          email: 'suzuki@example.com',
          role: 'USER',
          status: 'inactive',
          createdAt: '2024-02-05',
        },
        {
          id: '5',
          name: '高橋健太',
          email: 'takahashi@example.com',
          role: 'ADMIN',
          status: 'active',
          createdAt: '2023-12-01',
          lastLoginAt: '2024-03-20',
        },
        {
          id: '6',
          name: '伊藤さくら',
          email: 'ito@example.com',
          role: 'USER',
          status: 'active',
          companyCode: 'COMP002',
          createdAt: '2024-03-01',
          lastLoginAt: '2024-03-18',
        },
        {
          id: '7',
          name: '渡辺大輔',
          email: 'watanabe@example.com',
          role: 'USER',
          status: 'active',
          createdAt: '2024-02-28',
          lastLoginAt: '2024-03-17',
        },
        {
          id: '8',
          name: '小林真理',
          email: 'kobayashi@example.com',
          role: 'COUNSELOR',
          status: 'inactive',
          createdAt: '2024-01-10',
        },
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="error">スーパー管理者</Badge>;
      case 'ADMIN':
        return <Badge variant="warning">管理者</Badge>;
      case 'COUNSELOR':
        return <Badge variant="info">相談員</Badge>;
      default:
        return <Badge variant="default">ユーザー</Badge>;
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="text-gray-500 mt-1">全ユーザーの管理と権限設定</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            エクスポート
          </Button>
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>新規ユーザー</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前またはメールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべての役割</option>
              <option value="USER">ユーザー</option>
              <option value="COUNSELOR">相談員</option>
              <option value="ADMIN">管理者</option>
              <option value="SUPER_ADMIN">スーパー管理者</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deep-navy text-white p-4 rounded-lg flex items-center justify-between"
        >
          <span>{selectedUsers.length}件選択中</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Mail className="w-4 h-4 mr-2" />
              メール送信
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ShieldOff className="w-4 h-4 mr-2" />
              無効化
            </Button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">役割</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">企業コード</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ステータス</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">登録日</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">最終ログイン</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4" colSpan={8}>
                        <div className="h-10 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      ユーザーが見つかりませんでした
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-deep-navy rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-4">
                        {user.companyCode ? (
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {user.companyCode}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                          {user.status === 'active' ? '有効' : '無効'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{user.createdAt}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.lastLoginAt || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="詳細"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="編集"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title={user.status === 'active' ? '無効化' : '有効化'}
                          >
                            {user.status === 'active' ? (
                              <ShieldOff className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Shield className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredUsers.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}件を表示
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm',
                      currentPage === i + 1
                        ? 'bg-deep-navy text-white'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
