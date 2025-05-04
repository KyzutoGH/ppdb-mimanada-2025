// pages/api/auth/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', serialize('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Immediately expire
  }));
  
  res.status(200).json({ message: 'Logout successful' });
}