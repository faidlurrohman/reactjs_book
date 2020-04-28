import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";
import Borrow from "./components/Borrow";
import Return from "./components/Return";
import BorrowedUser from "./components/BorrowedUser";

const LoginComponent = () => <Login />;
const RegisterComponent = () => <Register />;
const AdminComponent = () => <Admin />;
const BorrowComponent = () => <Borrow />;
const ReturnComponent = () => <Return />;
const DashboardComponent = () => <Dashboard />;
const BorrowedComponent = () => <BorrowedUser />;

const MainRouter = () => (
  <Router>
    <Route path="/" component={LoginComponent} exact={true} />
    <Route path="/dashboard" component={DashboardComponent} />
    <Route path="/register" component={RegisterComponent} />
    <Route path="/admin" component={AdminComponent} />
    <Route path="/borrow" component={BorrowComponent} />
    <Route path="/return" component={ReturnComponent} />
    <Route path="/borrowed" component={BorrowedComponent} />
  </Router>
);

export default MainRouter;
