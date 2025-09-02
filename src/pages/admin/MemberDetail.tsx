// src/pages/admin/MemberDetail.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Member } from '../../features/members/api';
import { getMember, updateRole } from '../../features/members/api';
import type { Role } from '../../static/roles';
import { useAuthContext } from '../../features/auth/AuthContext';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const memberId = Number(id);

  const { user: me } = useAuthContext();
  const isSelf = me ? me.id === Number(id) : false;

  const [member, setMember] = useState<Member | null>(null);
  const [roleDraft, setRoleDraft] = useState<Role>('USER');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchMember = async () => {
    if (!Number.isFinite(memberId)) {
      setError('잘못된 회원 ID 입니다.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getMember(memberId);
      setMember(data);
      setRoleDraft(data.role);
    } catch {
      setError('회원 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const handleRoleSave = async () => {
    if (!member) return;
    if (roleDraft === member.role) {
      setNotice('변경된 내용이 없습니다.');
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const updated = await updateRole(member.id, roleDraft);
      setMember(updated);
      setRoleDraft(updated.role);
      setNotice('권한을 변경했습니다.');
    } catch {
      setError('권한 변경에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="alert alert-error mb-4">{error}</div>
        <Link to="/admin/members" className="btn">
          목록으로
        </Link>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="alert">회원을 찾을 수 없습니다.</div>
        <Link to="/admin/members" className="btn">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/admin/members">회원관리</Link>
          </li>
          <li>회원 상세</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base-content">회원 상세</h2>
            <Link to="/admin/members" className="btn btn-ghost btn-sm">
              목록으로
            </Link>
          </div>

          {notice && <div className="alert alert-success mb-3">{notice}</div>}
          {error && <div className="alert alert-error mb-3">{error}</div>}

          <div className="space-y-4">
            {/* ID */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="label-text text-base-content font-semibold w-28 shrink-0">
                ID
              </span>
              <p className="text-base-content/70">{member.id}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="label-text text-base-content font-semibold w-28 shrink-0">
                사용자명
              </span>
              <p className="text-base-content/70">{member.username}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="label-text text-base-content font-semibold w-28 shrink-0">
                이메일
              </span>
              <p className="text-base-content/70">{member.email ?? '-'}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="label-text text-base-content font-semibold w-28 shrink-0">
                생성일
              </span>
              <p className="text-base-content/70">
                {member.createdAt
                  ? new Date(member.createdAt).toLocaleString()
                  : '-'}
              </p>
            </div>
          </div>

          <div className="divider my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div className="form-control md:col-span-2">
              <label className="label pb-1">
                <span className="label-text text-base-content font-semibold">
                  권한(Role)
                </span>
              </label>
              <select
                className="select select-bordered select-sm ml-2"
                value={roleDraft}
                onChange={(e) => setRoleDraft(e.target.value as Role)}
                disabled={saving || isSelf}
              >
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
              </select>
              {isSelf && (
                <label className="label mt-1">
                  <span className="label-text-alt text-warning">
                    자기 자신의 권한 변경은 허용되지 않습니다.
                  </span>
                </label>
              )}
            </div>

            <button
              className="btn btn-primary btn-sm mt-6 md:mt-0"
              onClick={handleRoleSave}
              disabled={saving || isSelf || roleDraft === member?.role}
            >
              {saving ? (
                <span className="loading loading-spinner" />
              ) : (
                '권한 저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
