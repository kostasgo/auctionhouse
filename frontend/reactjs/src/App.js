import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap'

import NavigationBar from './components/sharedComponents/NavigationBar';
import AuctionsList from './components/Auction/AuctionsList';
import Login from './components/User/Login';
import Register from './components/User/Register';

function App() {
  return (
    <div>

      <Router>
        <NavigationBar />
        <Container>

          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/auctions" element={<AuctionsList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

          </Routes>
        </Container>

      </Router>
    </div>
  );
}

export default App;
