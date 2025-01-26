import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterChoice />} />
        <Route path="/customer-login" element={<Login />} /> 
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;