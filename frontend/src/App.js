import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';

import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';
import ForgotPassword from './component/ForgotPassword/ForgotPassword';
import OperaRequri from './component/OperaRequri/Opera';
import RegisterOpera from './component/RegisterOpera/Registeropera';
import StadiumList from './component/StadiumList/StadiumList';
import Resetpassword from './component/ResetPassword/ResetPassword';
import FavoriteList from './component/Favorites/FavoritesList';
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
        <Route path="/stadium-list" element={<StadiumList />} />
        <Route path='/FavoritesList' element={<FavoriteList />} />
      </Routes>
    </BrowserRouter>
  );
}





export default App;