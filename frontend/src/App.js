import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Homepage from './component/Homepage/Homepage';
import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';
import OperaRequri from './component/OperaRequri/Opera';
import RegisterOpera from './component/RegisterOpera/Registeropera';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/RegisterChoice" element={<RegisterChoice />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/customer-register" element={<RegisterCustomer/>} />
      

        <Route path="/OperaRequri" element={<OperaRequri/>} />
        <Route path="/RegisterOpera" element={<RegisterOpera/>} />
      </Routes>
    </BrowserRouter>
  );
}





export default App;