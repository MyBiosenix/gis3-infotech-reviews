'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Edit3, Loader2, RefreshCw, Save, Trash2, X } from 'lucide-react';
import {
  deleteAdminReview,
  getAdminReviews,
  updateAdminReview,
  updateAdminReviewStatus,
  type EmploymentDuration,
  type EmploymentStatus,
  type Review,
  type ReviewSource,
  type ReviewStatus,
} from '@/lib/api';

const sources: ReviewSource[] = ['GIS3 Infotech', 'Google', 'Trustpilot', 'Glassdoor'];
const statuses: ReviewStatus[] = ['pending', 'approved', 'rejected'];
const employmentStatuses: EmploymentStatus[] = ['', 'Current Employee', 'Former Employee', 'Intern', 'Freelancer', 'Contract Employee'];
const durations: EmploymentDuration[] = ['', 'Less than 6 months', '6 months - 1 year', '1 - 2 years', '2 - 5 years', 'More than 5 years'];

export default function AdminReviewsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [draftKey, setDraftKey] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('pending');
  const [sourceFilter, setSourceFilter] = useState<ReviewSource | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem('gis3-review-admin-key') || '';
    setAdminKey(saved);
    setDraftKey(saved);
  }, []);

  const loadReviews = useCallback(async () => {
    if (!adminKey) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminReviews(adminKey, { status: statusFilter, source: sourceFilter, limit: 100 });
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [adminKey, sourceFilter, statusFilter]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const counts = useMemo(() => ({
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  }), [reviews]);

  function unlock() {
    const value = draftKey.trim();
    if (!value) return;
    window.sessionStorage.setItem('gis3-review-admin-key', value);
    setAdminKey(value);
  }

  function lock() {
    window.sessionStorage.removeItem('gis3-review-admin-key');
    setAdminKey('');
    setDraftKey('');
    setReviews([]);
    setEditing(null);
  }

  async function changeStatus(review: Review, status: ReviewStatus) {
    let reason = '';
    if (status === 'rejected') {
      reason = window.prompt('Reason for rejection:', review.rejectionReason || '')?.trim() || '';
      if (!reason) return;
    }
    try {
      setBusyId(review._id);
      setError(null);
      await updateAdminReviewStatus(adminKey, review._id, status, reason);
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(review: Review) {
    if (!window.confirm(`Delete review by ${review.author || 'Anonymous'} permanently?`)) return;
    try {
      setBusyId(review._id);
      setError(null);
      await deleteAdminReview(adminKey, review._id);
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete review.');
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      setBusyId(editing._id);
      setError(null);
      await updateAdminReview(adminKey, editing._id, {
        companyName: editing.companyName,
        ratings: editing.ratings,
        employmentDetails: editing.employmentDetails,
        experience: editing.experience,
        author: editing.isAnonymous ? '' : editing.author,
        isAnonymous: editing.isAnonymous,
        source: editing.source,
      });
      setEditing(null);
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save review.');
    } finally {
      setBusyId(null);
    }
  }

  if (!adminKey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">GIS3 Review Admin</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Admin access</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Enter the same <code>ADMIN_API_KEY</code> configured in your backend environment.</p>
          <input
            type="password"
            value={draftKey}
            onChange={(e) => setDraftKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder="Admin API key"
            className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
          />
          <button onClick={unlock} className="mt-4 w-full rounded-xl bg-purple-800 px-4 py-3 font-semibold text-white hover:bg-purple-900">Open dashboard</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">GIS3 Review Admin</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Review moderation</h1>
            <p className="mt-2 text-sm text-slate-500">Edit reviews, choose their dashboard, then approve or reject them.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadReviews()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><RefreshCw className="h-4 w-4" /> Refresh</button>
            <button onClick={lock} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Lock</button>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {(['pending', 'approved', 'rejected'] as ReviewStatus[]).map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`rounded-2xl border p-4 text-left ${statusFilter === status ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-sm capitalize text-slate-500">{status}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{counts[status]}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | 'all')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as ReviewSource | 'all')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="all">All dashboards</option>
            {sources.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="mt-6 flex min-h-52 items-center justify-center rounded-2xl bg-white"><Loader2 className="h-7 w-7 animate-spin text-purple-700" /></div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800">{review.source}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${review.status === 'approved' ? 'bg-green-100 text-green-700' : review.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{review.status}</span>
                      <span className="text-sm font-semibold text-slate-900">{review.author || 'Anonymous'}</span>
                      <span className="text-sm text-amber-600">★ {review.overallRating?.toFixed?.(1) || review.overallRating}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.experience}</p>
                    <p className="mt-3 text-xs text-slate-400">{review.companyName} · {review.employmentDetails?.jobTitle || 'No job title'} · {new Date(review.createdAt).toLocaleString()}</p>
                    {review.rejectionReason && <p className="mt-2 text-xs text-red-600">Rejected: {review.rejectionReason}</p>}
                  </div>
                  <div className="flex flex-wrap items-start gap-2 lg:max-w-xs lg:justify-end">
                    <button disabled={busyId === review._id} onClick={() => setEditing(structuredClone(review))} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"><Edit3 className="h-4 w-4" /> Edit</button>
                    <button disabled={busyId === review._id} onClick={() => void changeStatus(review, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"><Check className="h-4 w-4" /> Approve</button>
                    <button disabled={busyId === review._id} onClick={() => void changeStatus(review, 'rejected')} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"><X className="h-4 w-4" /> Reject</button>
                    <button disabled={busyId === review._id} onClick={() => void remove(review)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"><Trash2 className="h-4 w-4" /> Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {!reviews.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">No reviews match these filters.</div>}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4">
          <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold text-slate-900">Edit review</h2><p className="text-sm text-slate-500">Changes are saved before moderation.</p></div>
              <button onClick={() => setEditing(null)} className="rounded-full bg-slate-100 p-2"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Company"><input className="input" value={editing.companyName} onChange={(e) => setEditing({ ...editing, companyName: e.target.value })} /></Field>
              <Field label="Dashboard"><select className="input" value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value as ReviewSource })}>{sources.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Author"><input className="input" disabled={editing.isAnonymous} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
              <Field label="Job title"><input className="input" value={editing.employmentDetails?.jobTitle || ''} onChange={(e) => setEditing({ ...editing, employmentDetails: { ...editing.employmentDetails, jobTitle: e.target.value } })} /></Field>
              <Field label="Employment status"><select className="input" value={editing.employmentDetails?.employmentStatus || ''} onChange={(e) => setEditing({ ...editing, employmentDetails: { ...editing.employmentDetails, employmentStatus: e.target.value as EmploymentStatus } })}>{employmentStatuses.map((s) => <option key={s || 'none'} value={s}>{s || 'Not specified'}</option>)}</select></Field>
              <Field label="Duration"><select className="input" value={editing.employmentDetails?.duration || ''} onChange={(e) => setEditing({ ...editing, employmentDetails: { ...editing.employmentDetails, duration: e.target.value as EmploymentDuration } })}>{durations.map((s) => <option key={s || 'none'} value={s}>{s || 'Not specified'}</option>)}</select></Field>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={editing.isAnonymous} onChange={(e) => setEditing({ ...editing, isAnonymous: e.target.checked, author: e.target.checked ? '' : editing.author })} /> Anonymous review</label>

            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              {(Object.keys(editing.ratings) as Array<keyof Review['ratings']>).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1')}>
                  <input type="number" min={1} max={5} className="input" value={editing.ratings[key]} onChange={(e) => setEditing({ ...editing, ratings: { ...editing.ratings, [key]: Math.max(1, Math.min(5, Number(e.target.value))) } })} />
                </Field>
              ))}
            </div>

            <Field label="Review"><textarea className="input mt-4 min-h-40" value={editing.experience} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} /></Field>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button onClick={() => void saveEdit()} disabled={busyId === editing._id} className="inline-flex items-center gap-2 rounded-xl bg-purple-800 px-4 py-2.5 text-sm font-semibold text-white">{busyId === editing._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input { width: 100%; border: 1px solid rgb(203 213 225); border-radius: .75rem; padding: .7rem .85rem; font-size: .875rem; outline: none; background: white; }
        .input:focus { border-color: rgb(126 34 206); box-shadow: 0 0 0 3px rgb(243 232 255); }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>{children}</label>;
}
