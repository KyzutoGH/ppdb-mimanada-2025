import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie'; // untuk set cookie login (opsional)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { nisn, password } = req.body;

  if (!nisn || !password) {
    return res.status(400).json({ message: 'NISN dan Password wajib diisi.' });
  }

  try {
    const calon = await prisma.calonSiswa.findUnique({
      where: { nisn },
    });

    if (!calon) {
      return res.status(400).json({ message: 'NISN tidak ditemukan.' });
    }

    const isPasswordValid = await bcrypt.compare(password, calon.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password salah.' });
    }

    // OPTIONAL: Set cookie session login
    res.setHeader('Set-Cookie', serialize('token', calon.id, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    }));
    res.status(200).json({ 
      message: 'Login sukses', 
      calonSiswa: {
        id: calon.id, // Make sure this is included
        nisn: calon.nisn,
        // other fields you might need
      } 
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal login', error: error.message });
  }
}
