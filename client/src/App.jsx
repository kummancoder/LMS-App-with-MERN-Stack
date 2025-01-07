import React from 'react';
import LoginSignUp from './pages/LoginSignUp'; 
import Navbar from './components/Navbar';

const App = () => {
  return (
    <main>
      <Navbar/>
      <LoginSignUp /> 
    </main>
  );
};

export default App;
