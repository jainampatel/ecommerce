import { useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Cart from "./cart/components/Cart";
import ProductList from "./products/components/ProductList";
import NewProduct from "./products/pages/NewProduct";
import Navbar from "./shared/components/Navbar";
import AuthContext from "./shared/context/auth-context";
import Login from "./user/Login";
import Signup from "./user/Signup";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  const login = useCallback((userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <ProductList />
        </Route>
        <Route path="/cart" exact>
          <Cart />
        </Route>
        <Route path="/new" exact>
          <NewProduct />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <ProductList />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <div>
          <Navbar />
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
