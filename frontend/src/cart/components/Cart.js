import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Container, Typography, Button, Grid } from "@material-ui/core";
import CartItem from "./CartItem";
import useStyles from "./cartStyles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AuthContext from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";

const Cart = () => {
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCart, setLoadedCart] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/cart/${auth.userId}`
        );
        setLoadedCart(responseData.cart);
      } catch (err) {}
    };
    fetchCart();
  }, [sendRequest, auth.userId]);

  const handleUpdateCartQtyPlus = async (productId) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/cart/updateQtyPlus/${productId}`,
        "PATCH",
        JSON.stringify({
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setLoadedCart(responseData.cart);
    } catch (error) {}
  };

  const handleUpdateCartQtyMinus = async (productId) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/cart/updateQtyMinus/${productId}`,
        "PATCH",
        JSON.stringify({
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setLoadedCart(responseData.cart);
    } catch (error) {}
  };

  const handleRemoveProductCart = async (productId) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/cart/${productId}`,
        "PATCH",
        JSON.stringify({
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setLoadedCart(responseData.cart);
    } catch (error) {}
  };

  const handleEmptyCart = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/cart/${auth.userId}`,
        "DELETE"
      );

      setLoadedCart(null);
    } catch (error) {}
  };

  const handleCheckout = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/cart/${auth.userId}`,
        "DELETE"
      );
      setLoadedCart(null);
      alert("Your order is placed.");
    } catch (error) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {loadedCart && (
        <Container>
          <div className={classes.toolbar} />
          <Typography className={classes.title} variant="h3" gutterBottom>
            Your Shopping Cart
          </Typography>
          <Grid container spacing={3}>
            {loadedCart.products.map((item) => (
              <Grid item xs={12} sm={4} key={item.id}>
                <CartItem
                  item={item}
                  onUpdateCartQtyPlus={handleUpdateCartQtyPlus}
                  onUpdateCartQtyMinus={handleUpdateCartQtyMinus}
                  onRemoveProductCart={handleRemoveProductCart}
                />
              </Grid>
            ))}
          </Grid>
          <div className={classes.cardDetails}>
            <Typography variant="h4">Subtotal:{loadedCart.subtotal}</Typography>
            <div>
              <Button
                className={classes.emptyButton}
                size="large"
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleEmptyCart}
              >
                Empty Cart
              </Button>
              <Button
                className={classes.checkoutButton}
                size="large"
                type="button"
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </Container>
      )}
      {!isLoading && !loadedCart && (
        <>
          <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>
              Your Shopping Cart
            </Typography>

            <Typography variant="h6">
              Your cart is empty!
              <Button
                component={Link}
                to="/"
                variant="outlined"
                color="primary"
                className={classes.link}
                style={{ marginLeft: "10px" }}
              >
                Start adding items
              </Button>
            </Typography>
          </Container>
        </>
      )}
    </>
  );
};

export default Cart;
