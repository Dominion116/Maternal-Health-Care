import { useState, useEffect, useCallback } from 'react'
import { Search, Users, Baby, Stethoscope, Shield, UserPlus, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Alert } from '@/components/atoms/Alert'
import { Spinner } from '@/components/atoms/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { adminService } from '@/services/adminService'

const roleConfig = {
  pregnant_woman: { label: 'Pregnant Woman', icon: Baby, variant: 'rose' },
  nurse: { label: 'ANC Nurse', icon: Stethoscope, variant: 'sage' },
  admin: { label: 'Administrator', icon: Shield, variant: 'info' },
  super_admin: { label: 'Super Admin', icon: ShieldCheck, variant: 'info' },
  researcher: { label: 'Researcher', icon: Users, variant: 'neutral' },
}

const stageLabels = {
  first_trimester: '1st Trimester',
  second_trimester: '2nd Trimester',
  third_trimester: '3rd Trimester',
  postpartum: 'Postpartum',
}

// Only these roles can be granted via the generic role-change endpoint —
// admin/super_admin can only be granted through the invite flow.
const ASSIGNABLE_ROLES = ['pregnant_woman', 'nurse', 'researcher']

function InviteAdminModal({ onClose, onInvited }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('admin')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required'); return }
    setSubmitting(true)
    try {
      await adminService.inviteAdmin(email.trim(), role, fullName.trim() || undefined)
      onInvited(email.trim())
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send invite')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl border border-gray-200 p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-900">Invite Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <Alert variant="error" onDismiss={() => setError('')} className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
          />
          <Input
            label="Full name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
          />
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-2 focus:outline-rose-500"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <Button type="submit" fullWidth loading={submitting} className="mt-2">
            Send Invite
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const { isSuperAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const limit = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit }
      if (roleFilter !== 'all') params.role = roleFilter
      const res = await adminService.getUsers(params)
      setUsers(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleRoleChange(userId, newRole) {
    setUpdatingId(userId)
    try {
      await adminService.updateUserRole(userId, newRole)
      setUsers((prev) => prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  const roleStats = ['pregnant_woman', 'nurse', 'admin'].map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
    label: roleConfig[role].label,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} users on this page</p>
        </div>
        {isSuperAdmin && (
          <Button size="sm" onClick={() => setShowInvite(true)}>
            <UserPlus className="w-4 h-4" />
            Invite Admin
          </Button>
        )}
      </div>

      {error && <Alert variant="error" onDismiss={() => setError('')}>{error}</Alert>}
      {inviteSuccess && <Alert variant="success" onDismiss={() => setInviteSuccess('')}>{inviteSuccess}</Alert>}

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
            placeholder="Search this page by name or email..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-2 focus:outline-rose-500"
        >
          <option value="all">All roles</option>
          <option value="pregnant_woman">Pregnant Women</option>
          <option value="nurse">Nurses</option>
          <option value="researcher">Researchers</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Users list">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Stage</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Joined</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Last Sign-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => {
                  const role = roleConfig[user.role] || roleConfig.researcher
                  const canChangeRole = ASSIGNABLE_ROLES.includes(user.role)
                  return (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700 shrink-0">
                            {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name || 'Unnamed'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {canChangeRole ? (
                          <select
                            value={user.role}
                            disabled={updatingId === user.user_id}
                            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                            className="text-xs font-medium px-2 py-1 rounded-lg border border-gray-200 focus:outline-2 focus:outline-rose-500 disabled:opacity-50"
                          >
                            {ASSIGNABLE_ROLES.map((r) => (
                              <option key={r} value={r}>{roleConfig[r].label}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant={role.variant} size="sm">{role.label}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{user.pregnancy_stage ? stageLabels[user.pregnancy_stage] : '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-500">{user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No users match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <span className="text-xs text-gray-500">Page {page}</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={users.length < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {showInvite && (
        <InviteAdminModal
          onClose={() => setShowInvite(false)}
          onInvited={(email) => {
            setShowInvite(false)
            setInviteSuccess(`Invite sent to ${email}.`)
          }}
        />
      )}
    </div>
  )
}
