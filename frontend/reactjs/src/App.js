import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationBar from './components/sharedComponents/NavigationBar';
import AuctionsListPage from './components/pages/AuctionsListPage';

function App() {
  return (
    <div>
      <NavigationBar />
      <Router>
        <Routes>

          <Route path="/auctions" element={<AuctionsListPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
