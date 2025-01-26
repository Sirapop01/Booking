import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<RegisterChoice />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/customer-register" element={<RegisterCustomer/>} />
        //fdfdffdf
      </Routes>
    </BrowserRouter>
  );
}

export default App;