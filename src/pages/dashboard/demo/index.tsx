import { useState, useMemo, useCallback } from 'react';
import type { ColumnDefinition } from '../../../components/Table/Table';
import DynamicServerTable from '../../../components/Table/Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UserTableExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  // ✅ Memoized mock data
  const mockUsers: User[] = useMemo(
    () => [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive' },
    ],
    []
  );

  // ✅ Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return mockUsers;

    return [...mockUsers].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [mockUsers, sortKey, sortDirection]);

  // ✅ Memoized columns
  const columns: ColumnDefinition<User>[] = useMemo(() => [
    { key: 'id', title: 'ID', width: '80px', align: 'center', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role', sortable: true },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {String(value)}
        </span>
      ),
    },
  ], []);

  // ✅ Memoized sort handler
  const handleSort = useCallback((key: keyof User, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  }, []);

  return (
    <div className="p-6">
      <DynamicServerTable<User>
        data={sortedData}
        columns={columns}
        currentPage={currentPage}
        pageSize={10}
        totalCount={sortedData.length}
        onPageChange={setCurrentPage}
        onSort={handleSort}
      />
    </div>
  );
};

export default UserTableExample;
