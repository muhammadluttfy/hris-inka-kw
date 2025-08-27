import { useCallback, useEffect, useMemo, useState } from 'react'
import { clearToken, getRekapShift, getToken, login } from '../lib/apiClient'


function todayStrLocal() {
const d = new Date()
const pad = (n) => String(n).padStart(2, '0')
const yyyy = d.getFullYear()
const mm = pad(d.getMonth() + 1)
const dd = pad(d.getDate())
return `${yyyy}-${mm}-${dd}`
}


export function useRekapShift(initialStart, initialEnd) {
const [startDate, setStartDate] = useState(initialStart || import.meta.env.VITE_DEFAULT_DATE || todayStrLocal())
const [endDate, setEndDate] = useState(initialEnd || import.meta.env.VITE_DEFAULT_DATE || todayStrLocal())
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')


const hasToken = useMemo(() => Boolean(getToken()), [getToken()])


const doLoginIfNeeded = useCallback(async () => {
if (getToken()) return
const username = import.meta.env.VITE_LOGIN_USERNAME
const password = import.meta.env.VITE_LOGIN_PASSWORD
if (!username || !password) throw new Error('Env username/password belum diset')
await login({ username, password })
}, [])


const fetchRekap = useCallback(async () => {
setLoading(true)
setError('')
try {
await doLoginIfNeeded()
const json = await getRekapShift({ startDate, endDate, statusPegawai: true })
setData(Array.isArray(json?.data) ? json.data : [])
} catch (e) {
setError(e?.message || String(e))
setData([])
} finally {
setLoading(false)
}
}, [startDate, endDate, doLoginIfNeeded])


const relogin = useCallback(async () => {
try {
clearToken()
await doLoginIfNeeded()
await fetchRekap()
} catch (e) {
setError(e?.message || String(e))
}
}, [doLoginIfNeeded, fetchRekap])


useEffect(() => {
fetchRekap()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


return {
startDate,
endDate,
setStartDate,
setEndDate,
data,
loading,
error,
refresh: fetchRekap,
relogin,
hasToken,
}
}