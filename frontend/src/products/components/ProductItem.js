import React, { useContext } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";

import useStyles from "./productItemStyle";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AuthContext from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";

const ProductItem = ({ product }) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const addToCartHandler = async () => {
    try {
      await sendRequest(
        "http://localhost:5000/api/cart",
        "POST",
        JSON.stringify({
          userId: auth.userId,
          productId: product.id,
          qty: 1,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (error) {}
  };

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />
      <Card className={classes.root}>
        <CardMedia
          component="img"
          alt="Product"
          className={classes.media}
          image={`http://localhost:5000/${product.image}`}
          title={product.name}
        />
        <CardContent>
          <div className={classes.cardContent}>
            <Typography variant="h5" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5">{product.price}</Typography>
          </div>
          <Typography
            dangerouslySetInnerHTML={{ __html: product.details }}
            variant="body2"
            color="textSecondary"
          />
        </CardContent>
        {auth.userId && (
          <CardActions disableSpacing className={classes.cardActions}>
            <IconButton aria-label="Add to Cart" onClick={addToCartHandler}>
              <AddShoppingCart />
            </IconButton>
          </CardActions>
        )}
        {!auth.userId && (
          <Button
            component={Link}
            variant="contained"
            to="/login"
            aria-label="Show Cart Items"
            color="secondary"
            style={{ marginLeft: "22%" }}
          >
            Login for add to cart
          </Button>
        )}
      </Card>
    </>
  );
};

export default ProductItem;
