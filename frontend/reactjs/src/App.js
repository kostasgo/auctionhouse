import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Profile from "./components/User/Profile";
import AuctionsList from "./components/Auction/AuctionsList";
import AuctionPage from "./components/Auction/AuctionPage";
import NewAuction from "./components/Auction/NewAuction";
import NavigationBar from "./components/sharedComponents/NavigationBar";
import { Container } from "react-bootstrap";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
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
      currentUser: undefined
    });
  }

  render() {

    return (
      <div>
        <NavigationBar currentUser={this.state.currentUser} />
        <Container>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/auctions" component={AuctionsList} />
            <Route path="/auctionpage" component={AuctionPage} />
            <Route path="/newauction" component={NewAuction} />

          </Switch>
        </Container>

      </div>
    );
  }
}

export default App;

