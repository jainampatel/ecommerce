import React, { useContext } from "react";

import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

import useStyles from "./navbarStyles";
import logo from "../../assets/store.png";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/auth-context";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar position="fixed" className={classes.appBar} color="inherit">
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          className={classes.title}
          color="inherit"
        >
          <img
            src={logo}
            alt="Ecommerce"
            height="25px"
            className={classes.image}
          />
          E-Commerce
        </Typography>
        <div className={classes.grow} />
        {location.pathname === "/" && auth.isLoggedIn && (
          <div className={classes.button}>
            <Button
              component={Link}
              variant="contained"
              to="/cart"
              aria-label="Show Cart Items"
              color="primary"
            >
              Cart
            </Button>
          </div>
        )}
        {location.pathname === "/cart" && auth.isLoggedIn && (
          <div className={classes.button}>
            <Button
              component={Link}
              variant="contained"
              to="/"
              aria-label="Show Cart Items"
              color="primary"
            >
              Continue Shopping
            </Button>
          </div>
        )}
        {location.pathname === "/new" && auth.isLoggedIn && (
          <div className={classes.button}>
            <Button
              component={Link}
              variant="contained"
              to="/"
              aria-label="Show Cart Items"
              color="primary"
            >
              Home
            </Button>
          </div>
        )}
        {auth.isLoggedIn && (
          <>
            <div className={classes.button}>
              <Button
                component={Link}
                variant="outlined"
                to="/new"
                aria-label="Add"
                color="secondary"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              >
                Add Product
              </Button>
            </div>

            <div className={classes.button}>
              <Button
                variant="outlined"
                onClick={() => {
                  auth.logout();
                }}
                aria-label="logout"
                color="primary"
              >
                Logout
              </Button>
            </div>
          </>
        )}
        {!auth.isLoggedIn && (
          <div className={classes.button}>
            <Button
              component={Link}
              variant="contained"
              to="/login"
              aria-label="logout"
              color="primary"
            >
              Login
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
