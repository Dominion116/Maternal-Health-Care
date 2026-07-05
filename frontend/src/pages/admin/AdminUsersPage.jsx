import { useState } from 'react'
import { Search, Users, UserCheck, Baby, Stethoscope, Filter, MoreVertical, Mail, Shield } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const mockUsers = [
  { id: 1, name: 'Adaeze Okonkwo', email: 'adaeze@example.com', role: 'pregnant_woman', stage: 'second_trimester', joined: '2026-04-12', lastActive: '2h ago', conversations: 14, status: 'active' },
  { id: 2, name: 'Nurse Fatima Aliyu', email: 'fatima@health.ng', role: 'nurse', stage: null, joined: '2026-03-28', lastActive: '1d ago', conversations: 67, status: 'active' },
  { id: 3, name: 'Chioma Eze', email: 'chioma@gmail.com', role: 'pregnant_woman', stage: 'third_trimester', joined: '2026-05-01', lastActive: '30m ago', conversations: 8, status: 'active' },
  { id: 4, name: 'Dr. Emeka Obi', email: 'emeka@hospital.ng', role: 'nurse', stage: null, joined: '2026-02-14', lastActive: '3d ago', conversations: 122, status: 'active' },
  { id: 5, name: 'Blessing Nwachukwu', email: 'blessing@yahoo.com', role: 'pregnant_woman', stage: 'first_trimester', joined: '2026-05-10', lastActive: '1h ago', conversations: 3, status: 'active' },
  { id: 6, name: 'Halima Musa', email: 'halima@demo.com', role: 'pregnant_woman', stage: 'postpartum', joined: '2026-01-20', lastActive: '5d ago', conversations: 42, status: 'inactive' },
  { id: 7, name: 'Admin Test', email: 'admin@demo.com', role: 'admin', stage: null, joined: '2025-12-01', lastActive: 'Just now', conversations: 0, status: 'active' },
  { id: 8, name: 'Amaka Chibuike', email: 'amaka@example.com', role: 'pregnant_woman', stage: 'second_trimester', joined: '2026-04-22', lastActive: '6h ago', conversations: 19, status: 'active' },
]

const roleConfig = {
  pregnant_woman: { label: 'Pregnant Woman', icon: Baby, variant: 'rose', color: 'text-rose-600 bg-rose-100' },
  nurse: { label: 'ANC Nurse', icon: Stethoscope, variant: 'sage', color: 'text-sage-600 bg-sage-100' },
  admin: { label: 'Administrator', icon: Shield, variant: 'info', color: 'text-blue-600 bg-blue-100' },
  researcher: { label: 'Researcher', icon: Users, variant: 'neutral', color: 'text-gray-600 bg-gray-100' },
}

const stageLabels = {
  first_trimester: '1st Trimester',
  second_trimester: '2nd Trimester',
  third_trimester: '3rd Trimester',
  postpartum: 'Postpartum',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleStats = [
    { role: 'pregnant_woman', count: mockUsers.filter(u => u.role === 'pregnant_woman').length, label: 'Pregnant Women' },
    { role: 'nurse', count: mockUsers.filter(u => u.role === 'nurse').length, label: 'Nurses' },
    { role: 'admin', count: mockUsers.filter(u => u.role === 'admin').length, label: 'Admins' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">{mockUsers.length} registered users</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {roleStats.map(s => (
          <div key={s.role} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="font-display font-extrabold text-2xl text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-2 focus:outline-rose-500"
        >
          <option value="all">All roles</option>
          <option value="pregnant_woman">Pregnant Women</option>
          <option value="nurse">Nurses</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Users list">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Stage</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Last Active</th>
                <th className="text-center text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Chats</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => {
                const role = roleConfig[user.role] || roleConfig.researcher
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700 shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={role.variant} size="sm">{role.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{user.stage ? stageLabels[user.stage] : '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{new Date(user.joined).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{user.lastActive}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-center">
                      <span className="text-xs font-semibold text-gray-700">{user.conversations}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', user.status === 'active' ? 'bg-green-500' : 'bg-gray-400')} />
                        {user.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No users match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
