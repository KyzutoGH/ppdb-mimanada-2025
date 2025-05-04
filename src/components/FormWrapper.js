// components/FormWrapper.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function FormWrapper({ children }) {
  const router = useRouter();
  const [calonSiswaId, setCalonSiswaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const id = localStorage.getItem('calonSiswaId');
    
    if (!isLoggedIn || !id) {
      router.push('/login');
    } else {
      setCalonSiswaId(id);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Clone children and pass the calonSiswaId as prop
  return children.map(child => {
    return React.cloneElement(child, { calonSiswaId });
  });
}