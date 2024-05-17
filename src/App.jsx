import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import Top from './Top';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top" element={<Top />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;
