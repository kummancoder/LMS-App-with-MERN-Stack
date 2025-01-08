import React from 'react';
import LoginSignUp from './pages/LoginSignUp'; 
import Navbar from './components/Navbar';
import HeroSection from './pages/student/HeroSection';

const App = () => {
  return (
    <main>
      <Navbar/>
      <HeroSection/>
      <LoginSignUp /> 
    </main>
  );
};

export default App;
