import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, updateUsername } from '../../features/members/api.ts';
import type { Member } from '../../features/auth/types';
import { useState } from 'react';
import type { AxiosError } from 'axios';

export default function Profile() {
  const queryClient = useQueryClient();
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<Member, Error>({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUsername,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      setNewUsername('');
      setErrorMessage('');
      alert('사용자명이 성공적으로 변경되었습니다.');
    },
    onError: (mutationError) => {
      const err = mutationError as AxiosError<{ message: string }>;
      if (err.response?.status === 400) {
        setErrorMessage('유효하지 않은 사용자명입니다. 다시 입력해주세요.');
      } else if (err.response?.status === 409) {
        setErrorMessage(
          '이미 사용 중인 사용자명입니다. 다른 이름을 입력해주세요.',
        );
      } else {
        setErrorMessage(
          '사용자명 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title">내 정보</h1>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-xl mx-auto card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title">내 정보</h1>
          <p>{error?.message || '로그인이 필요합니다.'}</p>
        </div>
      </div>
    );
  }

  const handleUpdateUsername = () => {
    if (!newUsername.trim()) {
      setErrorMessage('새 사용자명을 입력하세요.');
      return;
    }
    setErrorMessage('');
    mutate({ username: newUsername });
  };

  return (
    <div className="max-w-xl mx-auto card bg-base-100 shadow">
      <div className="card-body">
        <h1 className="card-title">내 정보</h1>
        <ul className="menu">
          <li>
            <span>이메일: {user.email}</span>
          </li>

          <li>
            <span>권한: {user.role}</span>
          </li>

          <li className="flex flex-col gap-2 relative">
            <span>사용자명: {user.username}</span>
            <div className="flex gap-2 items-start relative">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className={`input input-bordered input-sm w-full pr-2 ${errorMessage ? 'input-error' : ''}`}
                  placeholder="새 사용자명 입력"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                {errorMessage && (
                  <span className="absolute top-full left-0 mt-1 text-error text-xs whitespace-nowrap">
                    {errorMessage}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleUpdateUsername}
                disabled={isPending}
              >
                {isPending ? '변경 중...' : '변경하기'}
              </button>
            </div>
          </li>
        </ul>

        <div className="card-actions justify-end">
          <Link className="btn" to="/dreams/me">
            내 꿈 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
