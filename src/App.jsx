import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './authen/authen';
import LoginComp from './component/LoginComp';
import ProfileComp from './component/ProfileComp';
import MyProfileComp from './component/MyProfileComp';
import './App.css';

// Private Route Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Profile cho Guest (không cần đăng nhập) */}
        <Route path="/" element={<ProfileComp />} />
        <Route path="/profile" element={<ProfileComp />} />
        
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginComp />} />
        
        {/* Trang My Profile (cần đăng nhập) */}
        <Route 
          path="/my-profile" 
          element={
            <PrivateRoute>
              <MyProfileComp />
            </PrivateRoute>
          } 
        />
        
        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
