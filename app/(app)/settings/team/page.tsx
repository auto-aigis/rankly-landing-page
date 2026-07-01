"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { settingsApi } from '../../_lib/api';
import { useAuth } from '../../_components/AuthProvider';
import { TeamMember, TIER_LIMITS } from '../../_lib/types';
import { Lock, Users, Loader2, Mail, Trash2, AlertCircle, Check } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const tier = user?.tier || 'free';
  const limits = TIER_LIMITS[tier];
  const hasAccess = tier === 'business';

  useEffect(() => {
    if (hasAccess) loadMembers();
    else setLoading(false);
  }, [hasAccess]);

  const loadMembers = async () => {
    try {
      const data = await settingsApi.getTeam();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    if (members.filter((m) => m.status === 'joined').length >= limits.max_seats - 1) {
      setError('Seat limit reached');
      return;
    }
    setInviting(true);
    setError('');
    setSuccess('');
    try {
      await settingsApi.inviteTeamMember(inviteEmail);
      setSuccess('Invitation sent!');
      setInviteEmail('');
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setError('');
    try {
      await settingsApi.removeTeamMember(memberId);
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove');
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
          <p className="text-gray-600">Invite team members to collaborate</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Business Tier Required</h3>
            <p className="text-gray-600 mb-4">This feature is available on Business plan</p>
            <a href="/pricing" className="text-indigo-600 font-medium hover:underline">View plans</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeMembers = members.filter((m) => m.status === 'joined');
  const seatsUsed = activeMembers.length + 1;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
        <p className="text-gray-600">Manage your team members</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {seatsUsed} / {limits.max_seats} seats used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium">{user?.display_name?.[0] || user?.email[0].toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user?.display_name || 'You'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Badge>Owner</Badge>
          </div>

          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.email}</p>
                <p className="text-sm text-gray-500">
                  {member.status === 'joined' ? `Joined ${member.joined_at ? new Date(member.joined_at).toLocaleDateString() : ''}` : 'Pending invitation'}
                </p>
              </div>
              <Badge variant={member.status === 'joined' ? 'default' : 'outline'}>
                {member.status}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(member.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {seatsUsed < limits.max_seats && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
            <CardDescription>Add a new team member</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            />
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invite'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
