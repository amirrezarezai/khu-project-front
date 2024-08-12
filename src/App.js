import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';


function App() {
  // const [token,SetToken] = useState(localStorage.getItem('token'))
  // useEffect(()=>{
  //   SetToken(localStorage.getItem('token'))
  // },[token])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
