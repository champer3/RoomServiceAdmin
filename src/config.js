// API base URL from env (Create React App: only REACT_APP_* are exposed)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const PRINTER_IP = process.env.REACT_APP_PRINTER_IP || '192.168.1.100';

export { API_URL, PRINTER_IP };
