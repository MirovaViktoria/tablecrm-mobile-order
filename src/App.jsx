import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import OrderForm from './components/OrderForm';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <OrderForm /> : <AuthForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
