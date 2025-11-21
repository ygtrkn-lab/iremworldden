'use client';

import { useState } from 'react';

export default function OpenAISettingsPage() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setStatus({ type: 'saving' });

    try {
      const res = await fetch('/api/settings/openai', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Hata: kayıt yapılamadı.');
      }

      setStatus({ type: 'success', message: json?.message || 'Kayıt başarılı' });
      setKey('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? 'Bilinmeyen hata');
      setStatus({ type: 'error', message });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-semibold mb-2">OpenAI API Anahtarı</h1>
      <p className="text-sm text-gray-600 mb-4">Bu sayfa `.env.local` dosyasına anahtar yazmak için geliştirilmiştir. Üretimde kullanmayın veya uygun güvenlik önlemleri ile koruyun.</p>

      <form onSubmit={onSave} className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">OPENAI API KEY</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            disabled={!key.trim() || status.type === 'saving'}
            className="px-4 py-2 rounded bg-gradient-to-r from-[#f07f38] to-[#ff8c4a] text-white"
          >
            {status.type === 'saving' ? 'Kaydediliyor…' : 'Kaydet (.env.local)'}
          </button>
        </div>

        {status.type === 'error' && (
          <p className="text-sm text-red-500">{status.message}</p>
        )}
        {status.type === 'success' && (
          <p className="text-sm text-green-600">{status.message}</p>
        )}
      </form>
    </div>
  );
}
