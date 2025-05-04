import { useState } from 'react';

export default function Step3Upload({ formData, setLoading, calonSiswaId }) {
  const [file, setFile] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Format file tidak valid. Harus PDF atau DOC/DOCX');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('Ukuran file terlalu besar (maksimal 10MB)');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!calonSiswaId) {
      setErrorDetails({ message: 'Sesi login tidak valid. Silahkan login kembali.' });
      return;
    }

    if (!file) {
      setErrorDetails({ message: 'Harap pilih file dokumen terlebih dahulu' });
      return;
    }

    setLoading(true);
    setErrorDetails(null);
    setSubmitSuccess(false);
    
    try {
      // Process form data
      const processedFormData = {
        ...formData,
        calonSiswaId,
        tanggalLahir: formData.tanggalLahir 
          ? new Date(formData.tanggalLahir).toISOString() 
          : null
      };

      // Create form record
      const formRes = await fetch('/api/form/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedFormData)
      });
      
      const formResData = await formRes.json();
      if (!formResData?.id) {
        throw new Error('ID form tidak diterima dari server');
      }

      // Upload file
      const uploadData = new FormData();
      uploadData.append('formId', formResData.id);
      uploadData.append('dokumenPersyaratan', file);

      const uploadRes = await fetch('/api/form/upload', {
        method: 'POST',
        body: uploadData,
      });

      const uploadResData = await uploadRes.json();
      if (!uploadResData.success) {
        throw new Error(uploadResData.message || 'Upload gagal');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorDetails({
        message: error.message || 'Terjadi kesalahan saat mengirim data'
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center mt-8">
        <div className="text-green-500 text-6xl mb-4 flex justify-center">✓</div>
        <h2 className="text-2xl mb-4">Pendaftaran Berhasil!</h2>
        <p className="mb-8">
          Terima kasih telah mendaftar. Tim kami akan meninjau pendaftaran Anda.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          className="bg-green-500 text-white py-3 px-6 rounded-lg font-bold text-base"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="mt-4 mb-4 text-lg font-bold">Upload Dokumen Persyaratan</h2>

      {errorDetails && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
          <h3 className="text-red-800 mt-0">Terjadi Kesalahan</h3>
          <p><strong>Pesan:</strong> {errorDetails.message}</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
        <h3 className="text-base mb-3">Panduan Upload Dokumen</h3>
        <p>Silakan upload <strong>satu file dokumen</strong> yang berisi semua persyaratan berikut:</p>
        <ul className="pl-6 mt-2">
          <li>Scan Kartu Keluarga (KK)</li>
          <li>Scan Akta Kelahiran</li>
          <li>Scan Ijazah TK</li>
          <li>Scan Kartu PKH (jika ada)</li>
          <li>Bukti Pembayaran</li>
        </ul>
        <p className="mt-3">
          Format file: PDF atau Word (DOC/DOCX), maksimal 10MB
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="dokumenPersyaratan">
          Upload Dokumen <span className="text-red-500">*</span>
        </label>
        <input
          id="dokumenPersyaratan"
          type="file"
          onChange={handleFileChange}
          required
          accept=".doc,.docx,.pdf"
          className="p-3 rounded-lg border border-gray-300 bg-gray-50"
        />
        {file && (
          <p className="text-green-500 text-sm">
            File terpilih: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <button 
        onClick={handleSubmit} 
        className="bg-green-500 text-white p-3 rounded-lg font-bold mt-4 text-base"
        disabled={!file}
      >
        Submit Pendaftaran
      </button>
    </div>
  );
}