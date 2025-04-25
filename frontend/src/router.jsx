import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Portfolio from './pages/Portfolio.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import Subscription from './pages/Subscription.jsx';
export default function Router() {
  return (<BrowserRouter><Routes>
    <Route path='/' element={<Landing/>}/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/portfolio' element={<Portfolio/>}/>
    <Route path='/history' element={<History/>}/>
    <Route path='/settings' element={<Settings/>}/>
    <Route path='/subscription' element={<Subscription/>}/>
  </Routes></BrowserRouter>);
}
