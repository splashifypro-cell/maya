'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setData] = useState({ name: '', email: '', role: 'agent' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingMember ? 'PUT' : 'POST';
    const body = editingMember ? { ...formData, id: editingMember._id } : formData;

    try {
      const res = await fetch('/api/admin/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowDialog(false);
        setEditingMember(null);
        setData({ name: '', email: '', role: 'agent' });
        fetchMembers();
      }
    } catch (err) {
      console.error('Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (err) {
      console.error('Failed to delete member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setData({ name: member.name, email: member.email, role: member.role });
    setShowDialog(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h2>
          <p className="text-slate-500">Manage your agents and their permissions.</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2 font-bold uppercase tracking-widest text-xs">
          <UserPlus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Active Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50/30 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                        Loading team members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                        No team members found.
                      </td>
                    </tr>
                  ) : members.map((member) => (
                    <tr key={member._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-primary">
                            {member.name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{member.name}</span>
                            <span className="text-xs text-slate-500">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter",
                          member.role === 'admin' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {member.isOnline ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-xs font-medium text-emerald-600">Online</span></>
                          ) : (
                            <><XCircle className="h-3.5 w-3.5 text-slate-300" /><span className="text-xs font-medium text-slate-400">Offline</span></>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(member)}>
                            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-rose-600" onClick={() => handleDelete(member._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl border-none animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{editingMember ? 'Edit Member' : 'Add Team Member'}</CardTitle>
              <CardDescription>Enter the details below to {editingMember ? 'update' : 'invite'} a team member.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    value={formData.name}
                    onChange={(e) => setData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    value={formData.email}
                    onChange={(e) => setData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Access Role</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none"
                    value={formData.role}
                    onChange={(e) => setData({...formData, role: e.target.value})}
                  >
                    <option value="agent">Agent (Support Only)</option>
                    <option value="admin">Admin (Full Access)</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Button variant="outline" type="button" className="flex-1 py-6 font-bold uppercase tracking-widest text-xs" onClick={() => {setShowDialog(false); setEditingMember(null);}}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
