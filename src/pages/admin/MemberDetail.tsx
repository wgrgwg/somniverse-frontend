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
  const isSelf = me && memberId && me.id === memberId;

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
      {/* Breadcrumb */}
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

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">회원 상세</h2>
            <Link to="/admin/members" className="btn btn-ghost btn-sm">
              목록으로
            </Link>
          </div>

          {notice && <div className="alert alert-success mb-2">{notice}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">ID</span>
              </label>
              <input
                className="input input-bordered"
                value={member.id}
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">사용자명</span>
              </label>
              <input
                className="input input-bordered"
                value={member.username}
                readOnly
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">이메일</span>
              </label>
              <input
                className="input input-bordered"
                value={member.email ?? ''}
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">생성일</span>
              </label>
              <input
                className="input input-bordered"
                value={
                  member.createdAt
                    ? new Date(member.createdAt).toLocaleString()
                    : '-'
                }
                readOnly
              />
            </div>
          </div>

          {/* 권한 변경 */}
          <div className="divider" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">권한(Role)</span>
              </label>
              <select
                className="select select-bordered"
                value={roleDraft}
                onChange={(e) => setRoleDraft(e.target.value as Role)}
                disabled={saving || isSelf || roleDraft === member?.role}
              >
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {isSelf && (
                <label className="label">
                  <span className="label-text-alt text-warning">
                    자기 자신의 권한 변경은 허용되지 않습니다.
                  </span>
                </label>
              )}
            </div>

            <button
              className="btn btn-primary"
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
