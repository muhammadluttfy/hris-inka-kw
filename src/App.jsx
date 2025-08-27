import './index.css'
import { useRekapShift } from './hooks/useRekapShift'

export default function App() {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    data,
    loading,
    error,
    refresh,
    relogin,
    hasToken,
  } = useRekapShift()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Kehadiran • Rekap Shift (Demo)</h1>
          <p className="text-sm text-gray-600">Auto-login → fetch rekap (Bearer token dari /login)</p>
        </header>

        <section className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </div>

            <button
              onClick={refresh}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-gray-50 active:scale-[.99]"
            >
              🔄 Refresh
            </button>
            <button
              onClick={relogin}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-gray-50 active:scale-[.99]"
              title="Clear token & login ulang"
            >
              🔐 Re-login
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Token:{" "}
            <span className={`font-medium ${hasToken ? 'text-emerald-600' : 'text-rose-600'}`}>
              {hasToken ? 'tersedia' : 'tidak ada'}
            </span>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-xl p-3 mb-4">
            <div className="font-semibold">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        <section className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Hasil Rekap</h2>
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Tanggal</th>
                  <th className="py-2 pr-4">Shift</th>
                  <th className="py-2 pr-4">Total Jadwal</th>
                  <th className="py-2 pr-4">Hadir</th>
                  <th className="py-2 pr-4">Tidak Hadir</th>
                  <th className="py-2 pr-4">% Hadir</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">{row.tanggal}</td>
                      <td className="py-2 pr-4">{row.shift_label || row.shift}</td>
                      <td className="py-2 pr-4">{row.total_jadwal}</td>
                      <td className="py-2 pr-4">{row.jumlah_hadir}</td>
                      <td className="py-2 pr-4">{row.jumlah_tidak_hadir}</td>
                      <td className="py-2 pr-4">{Number(row.presentase_hadir ?? 0).toFixed(2)}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      {loading ? 'Memuat data…' : 'Tidak ada data.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-xs text-gray-500 mt-6">
          Catatan: contoh testing flow saja. Jangan pakai kredensial default di produksi.
        </footer>
      </div>
    </div>
  )
}
