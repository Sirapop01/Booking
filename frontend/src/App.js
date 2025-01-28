import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';

import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';
import ForgotPassword from './component/ForgotPassword/ForgotPassword';
import OperaRequri from './component/OperaRequri/Opera';
import RegisterOpera from './component/RegisterOpera/RegisterOpera';
import RegisterArena from './component/RegisterArena/Registerarena';
import StadiumList from './component/StadiumList/StadiumList';
import Resetpassword from './component/ResetPassword/ResetPassword';
import ManageStadium from './component/ManageStadium/ManageStadium';
import ManageSubStadium from './component/ManageSubStadium/ManageSubStadium';
import ManageSubStadiumDetails from './component/ManageSubStadiumDetails/ManageSubStadiumDetails';


/**/ 

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/RegisterChoice" element={<RegisterChoice />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/customer-register" element={<RegisterCustomer/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<Resetpassword/>} />
        <Route path="/OperaRequri" element={<OperaRequri/>} />
        <Route path="/RegisterOpera" element={<RegisterOpera/>} />
        <Route path="/RegisterArena" element={<RegisterArena/>} />
        <Route path="/stadium-list" element={<StadiumList />} />
        <Route path="/manage-stadium" element={<ManageStadium />} />
        <Route path="/manage-sub-stadium" element={<ManageSubStadium />} />
        <Route path="/manage-substadium-details" element={<ManageSubStadiumDetails />} />
      </Routes>
    </BrowserRouter>
  );
}





export default App;