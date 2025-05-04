import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [nisn, setNisn] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

// In the handleLogin function:
const handleLogin = async () => {
  if (!password) {
    setError('Password wajib diisi');
    return;
  }
  try {
    const response = await axios.post('/api/auth/login', { nisn, password });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('calonSiswaId', response.data.calonSiswa.id); // Store the ID
    localStorage.setItem('nisn', response.data.calonSiswa.nisn); // Store NISN for reference
    router.push('/pendaftaran');
  } catch (error) {
    setError('NISN atau Password salah!');
  }
}

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-16 h-16" />
          <h2 className="text-2xl font-semibold text-gray-800">Silahkan Masuk</h2>
          <p className="text-sm text-gray-600">Masukkan NISN dan Password untuk melanjutkan</p>
        </div>

        <input
          type="text"
          placeholder="Masukkan NISN"
          value={nisn}
          onChange={(e) => setNisn(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Tampilkan Password
          </label>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Masuk
        </button>

        <button
          onClick={() => router.push('/auth/register')}
          className="w-full py-3 mt-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Daftar
        </button>
      </div>
    </div>
  )
}
