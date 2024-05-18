import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import Top from './Top';
import TakePhoto from './TakePhoto';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top" element={<Top />} />
        <Route path="/users" element={<Users />} />
        <Route path="/takephoto" element={<TakePhoto />} />
      </Routes>
    </div>
  );
}

export default App;
