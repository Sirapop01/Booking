import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Homepage from './component/Homepage/Homepage';
import Login from './component/Login/Login';
import RegisterChoice from './component/RegisterChoice/RegisterChoice';
import RegisterCustomer from './component/Register/RegisterCustomer';
import ForgotPassword from './component/ForgotPassword/ForgotPassword';
import OperaRequri from './component/OperaRequri/Opera';
import RegisterOpera from './component/RegisterOpera/Registeropera';
import RegisterArena from './component/RegisterArena/Registerarena';
import StadiumList from './component/StadiumList/StadiumList';
import Resetpassword from './component/ResetPassword/ResetPassword';
import FavoriteList from './component/Favorites/FavoritesList';
import UserProfile from './component/ProfileCustomer/UserProfile';
import ManageStadium from './component/ManageStadium/ManageStadium';
import ManageSubStadium from './component/ManageSubStadium/ManageSubStadium';
import ManageSubStadiumDetails from './component/ManageSubStadiumDetails/ManageSubStadiumDetails';
import SuccessRegis from  './component/SuccessRegis/SuccessRegis';
import Discount from './component/Discount/Discount';
import TestHome from './component/Test/TestHome';
import OwnerLedger from './component/OwnerLedger/OwnerLedger';
import Information from './component/Information/Information';
import ManageAccount from './component/ManageAccount/ManageAccount';
import HomepageOper from './component/HomepageOper/Homepageopera';



/**/ 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Homepage/>} />
        <Route path="/RegisterChoice" element={<RegisterChoice />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/customer-register" element={<RegisterCustomer/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<Resetpassword/>} />
        <Route path="/OperaRequri" element={<OperaRequri/>} />
        <Route path="/RegisterOpera" element={<RegisterOpera/>} />
        <Route path="/RegisterArena" element={<RegisterArena/>} />
        <Route path="/stadium-list" element={<StadiumList />} />
        <Route path='/FavoritesList' element={<FavoriteList />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path="/manage-stadium" element={<ManageStadium />} />
        <Route path="/manage-sub-stadium" element={<ManageSubStadium />} />
        <Route path="/manage-substadium-details" element={<ManageSubStadiumDetails />} />
        <Route path='/Discount' element={<Discount />} />
        <Route path='/SuccessRegis' element={<SuccessRegis />} />
        <Route path='/Ownerledger' element={<OwnerLedger />} />
        <Route path='/Information' element={<Information />} />
        <Route path='/ManageAccount' element={<ManageAccount />}/>
        <Route path='/Homepageopera' element={<HomepageOper />}/>

      </Routes>
    </BrowserRouter>
  );
}





export default App;