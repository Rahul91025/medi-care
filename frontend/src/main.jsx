import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/react';
import './index.css';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in .env file. " +
    "Auth features will not work. " +
    "Create a .env file with: VITE_CLERK_PUBLISHABLE_KEY=pk_test_..."
  );
}

const AppWrapper = PUBLISHABLE_KEY ? (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
) : (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {AppWrapper}
  </StrictMode>,
);
