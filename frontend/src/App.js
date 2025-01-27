import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Homepage from './component/Homepage/Homepage';
import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';
import ForgotPassword from './component/ForgotPassword/ForgotPassword';
import OperaRequri from './component/OperaRequri/Opera';
import RegisterOpera from './component/RegisterOpera/RegisterOpera';
import ChangePassword from './component/ChangePassword/ChangePassword';
import StadiumList from './component/StadiumList/StadiumList';
/**/ 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/RegisterChoice" element={<RegisterChoice />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/customer-register" element={<RegisterCustomer/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="changepassword" element={<ChangePassword/>} />
        <Route path="/OperaRequri" element={<OperaRequri/>} />
        <Route path="/RegisterOpera" element={<RegisterOpera/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;