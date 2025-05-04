import { useState } from 'react';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Upload from './Step3Upload';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormStepper({ calonSiswaId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    tk: '',
    tanggalLahir: '',
    tempatLahir: '',
    alamat: '',
    agama: '',
    hobi: '',
    namaSekolah: '',
    statusSekolahAsal: '',
    alamatSekolah: '',
    namaWali: '',
    ttlWali: '',
    pekerjaanWali: '',
    pendapatanWali: '',
    noRumah: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer />
      <ProgressBar step={step} />

      {loading && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4CAF50',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          {step === 1 && (
            <Step1Form
              nextStep={nextStep}
              formData={formData}
              setFormData={setFormData}
              calonSiswaId={calonSiswaId}
            />
          )}
          {step === 2 && (
            <Step2Form
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
              calonSiswaId={calonSiswaId}
            />
          )}
          {step === 3 && (
            <Step3Upload 
              formData={formData}
              calonSiswaId={calonSiswaId}
              setLoading={setLoading}
            />
          )}
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ProgressBar({ step }) {
  const steps = ['Data Pribadi', 'Data Sekolah', 'Upload Berkas'];
  const progressWidth = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div style={{ marginBottom: '2rem', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '0',
        right: '0',
        height: '4px',
        backgroundColor: '#ccc',
        zIndex: '1'
      }} />
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '0',
        height: '4px',
        backgroundColor: '#4CAF50',
        width: `${progressWidth}%`,
        transition: 'width 0.5s ease',
        zIndex: '2'
      }} />
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: '3'
      }}>
        {steps.map((label, index) => (
          <li key={index} style={{ flex: 1, textAlign: 'center', color: step === index + 1 ? '#4CAF50' : '#aaa' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: step >= index + 1 ? '#4CAF50' : '#ccc',
              margin: '0 auto',
              lineHeight: '30px',
              color: 'white',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}>
              {index + 1}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
              {label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}