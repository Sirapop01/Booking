import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import "leaflet/dist/leaflet.css";
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
import AdminChat from './component/AdminChat/AdminChat';
import Mapping from './component/Mapping/Mapping';
import AdminPayment from './component/AdminPayment/AdminPayment';
import AdminOwnersLedger from './component/AdminOwnerLedger/AdminOwnersLedger';
import OwnerLedgerDetails from './component/OwnerLedgerDetails/OwnerLedgerDetails';
import ProfileBusiness from './component/ProfileBusiness/BusinessProfile';
import Promotion from './component/Promotion/Promotion';
import BookingArena from './component/BookingArena/BookingArena';
import SuperAdminLogin from './component/SuperAdmin/SuperAdminLogin';
import SuperAdminDashboard from './component/SuperAdminDashboard/SuperAdminDashboard';
import ProtectedRoute from "./component/ProtectedRoute"; 
import AdminRegister from "./component/AdminRegister/AdminRegister";


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
        <Route path="/reset-password/:token" element={<Resetpassword />} />
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
        <Route path='/AdminChat' element={<AdminChat/>}/>
        <Route path='/map' element={<Mapping/>} />
        <Route path='/AdminPayment' element={<AdminPayment/>}/>
        <Route path='/AdminOwnersLedger' element={<AdminOwnersLedger/>}/>
        <Route path='/OwnerLedgerdetail/:ownerId' element={<OwnerLedgerDetails/>}/>
        <Route path='/OwnerProfile' element={<ProfileBusiness />} />
        <Route path="/BookingArena/:id" element={<BookingArena />} />
        <Route path='/Promotion' element={<Promotion />} />
        <Route path="/BookingArena" element={<BookingArena />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route element={<ProtectedRoute role="superadmin" />}>
          <Route path="/admin/register" element={<AdminRegister />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}





export default App;