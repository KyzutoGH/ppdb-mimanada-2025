import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { calonSiswaId, ...formData } = req.body;

    if (!calonSiswaId) {
      return res.status(400).json({ message: 'calonSiswaId diperlukan' });
    }

    await prisma.$connect();

    // Create new form
    const newForm = await prisma.form.create({
      data: {
        calonSiswa: { connect: { id: calonSiswaId } },
        ...formData,
        status: 'pending' // Default status
      }
    });

    return res.status(201).json({
      id: newForm.id,
      message: 'Form berhasil dibuat'
    });

  } catch (error) {
    console.error('Create form error:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan saat membuat form',
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}