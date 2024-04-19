import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './home/Home';
import Navbar  from './component/navBar/NavBar';
import Record from './record/Record';
function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record" element={<Record />} />
        </Routes>
    </Router>
  );
}

export default App;
