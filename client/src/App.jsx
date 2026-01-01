import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Today from './pages/Today';
import Timetable from './pages/Timetable';
import Analytics from './pages/Analytics';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/today" element={<Today />} />
      <Route path="/timetable" element={<Timetable />} />
      <Route path="/stats" element={<Analytics />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;