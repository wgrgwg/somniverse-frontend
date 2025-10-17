import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { createDream, updateDream } from '../../features/dreams/api.ts';
import type { DreamPayload } from '../../features/dreams/types.ts';

export default function DreamEditor({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dreamDate, setDreamDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [isPublic, setIsPublic] = useState(false);

  const attemptKeyRef = useRef<string | null>(null);
  const ensureAttemptKey = () => {
    if (!attemptKeyRef.current) {
      attemptKeyRef.current =
        globalThis.crypto?.randomUUID?.() ??
        `idem-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    }
    return attemptKeyRef.current;
  };
  const endAttempt = () => {
    attemptKeyRef.current = null;
  };

  const { data } = useQuery({
    enabled: mode === 'edit' && !!id,
    queryKey: ['dream', id],
    queryFn: async () => {
      const { data } = await api.get(`/dreams/${id}`);
      return data.data;
    },
  });

  useEffect(() => {
    if (data && mode === 'edit') {
      setTitle(data.title);
      setContent(data.content);
      setDreamDate(data.dreamDate?.slice(0, 10));
      setIsPublic(Boolean(data.isPublic ?? data.public));
    }
  }, [data, mode]);

  const mutate = useMutation({
    mutationFn: async (input: DreamPayload) => {
      if (mode === 'create') {
        const key = ensureAttemptKey();
        return createDream(input, key);
      }
      return updateDream(Number(id), input);
    },
    onSuccess: (d) => {
      endAttempt();
      qc.invalidateQueries({ queryKey: ['myDreams'] });
      nav(`/dreams/${d.id}`);
    },
    onError: (e: any) => {
      if (e?.response && e.response.status >= 400 && e.response.status < 500) {
        endAttempt();
      }
    },
    retry: 1,
  });

  const isSubmitting = mutate.isPending;

  const handleSubmit = () => {
    if (isSubmitting) return;
    const payload: DreamPayload = { title, content, dreamDate, isPublic };
    mutate.mutate(payload);
  };

  return (
    <div className="max-w-2xl mx-auto card bg-base-100 shadow">
      <div className="card-body">
        <h1 className="card-title">
          {mode === 'create' ? '새 꿈 작성' : '꿈 수정'}
        </h1>

        <div className="form-control">
          <label className="label">제목</label>
          <input
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">내용</label>
          <textarea
            className="textarea textarea-bordered min-h-[180px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">날짜</label>
            <input
              type="date"
              className="input input-bordered"
              value={dreamDate}
              onChange={(e) => setDreamDate(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                className="toggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>공개</span>
            </label>
          </div>
        </div>

        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'create'
                ? '작성중…'
                : '수정중…'
              : mode === 'create'
                ? '작성'
                : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
