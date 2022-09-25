import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import HomePage from "./components/HomePage";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import AdminBoard from "./components/User/AdminBoard";
import Profile from "./components/User/Profile";
import ManageAuctions from "./components/Auction/ManageAuctions";
import AuctionsList from "./components/Auction/AuctionsList";
import AuctionPage from "./components/Auction/AuctionPage";
import AuctionManagePage from "./components/Auction/AuctionManagePage";
import NewAuction from "./components/Auction/NewAuction";
import NavigationBar from "./components/sharedComponents/NavigationBar";
import { Container } from "react-bootstrap";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      showAdminBoard: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN")
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
      showAdminBoard: false
    });
  }

  render() {

    return (
      <div>
        <NavigationBar currentUser={this.state.currentUser} showAdminBoard={this.state.showAdminBoard} />
        <Container>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/auctions" component={AuctionsList} />
            <Route path="/auction" component={AuctionPage} />
            <Route path="/new-auction" component={NewAuction} />
            <Route path="/manage" component={ManageAuctions} />
            <Route path="/auction-manage" component={AuctionManagePage} />
            <Route exact path="/admin" component={AdminBoard} />
          </Switch>
        </Container>

      </div>
    );
  }
}

export default App;
