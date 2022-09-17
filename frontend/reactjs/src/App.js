import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationBar from './components/sharedComponents/NavigationBar';
import AuctionsListPage from './components/pages/AuctionsListPage/AuctionsListPage';

function App() {
  return (
    <div className="App">
      <NavigationBar/>
      <Router>
        <Routes>
         
          <Route path="/explore" element={<AuctionsListPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
