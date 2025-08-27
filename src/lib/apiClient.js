const DEV = import.meta.env.DEV
const RAW_BASE =
  import.meta.env.VITE_API_BASE ?? (DEV ? '/api' : 'https://inkadev-api.koffiesoft.com')
const API_BASE = RAW_BASE.replace(/\/+$/, '')

const STORAGE_KEY = 'inka_access_token'

function buildUrl(path, params) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  if (API_BASE.startsWith('http')) {
    const u = new URL(`${API_BASE}${cleanPath}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)))
    }
    return u.toString()
  }

  let url = `${API_BASE}${cleanPath}`
  if (params) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => qs.set(k, String(v)))
    url += `?${qs.toString()}`
  }
  return url
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(STORAGE_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function login({ username, password }) {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)

  const res = await fetch(buildUrl('/login'), {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Login gagal: ${res.status} ${text}`)
  }

  const json = await res.json()
  const token = json?.access_token
  if (!token) throw new Error('Token tidak ditemukan pada response login')

  setToken(token)
  return token
}

export async function getRekapShift({ startDate, endDate, statusPegawai = true, extra = {} }) {
  const token = getToken()
  if (!token) throw new Error('Token belum tersedia. Jalankan login dulu.')

  const url = buildUrl('/dashboard/kehadiran/rekap_shift', {
    start_date: startDate,
    end_date: endDate,
    status_pegawai: String(statusPegawai),
    ...extra,
  })

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401) {
    throw new Error('Unauthorized (401). Coba login ulang.')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gagal fetch rekap: ${res.status} ${text}`)
  }

  return res.json()
}
