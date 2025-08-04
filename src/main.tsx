import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// biome-ignore lint/style/noNonNullAssertion: Ignoring because 'root' element is always present in the DOM.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
