import React from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";

import useStyles from "./cartItemStyles";

const CartItem = ({
  item,
  onUpdateCartQtyPlus,
  onUpdateCartQtyMinus,
  onRemoveProductCart,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardMedia
        component="img"
        alt="Product"
        image={`http://localhost:5000/${item.image}`}
        title={item.name}
        className={classes.media}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">{item.price}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.buttons}>
          <Button
            type="button"
            size="small"
            onClick={() => {
              onUpdateCartQtyMinus(item.productId);
            }}
          >
            -
          </Button>
          <Typography>{item.qty}</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => {
              onUpdateCartQtyPlus(item.productId);
            }}
          >
            +
          </Button>
        </div>
        <Button
          variant="contained"
          type="button"
          color="secondary"
          onClick={() => {
            onRemoveProductCart(item.productId);
          }}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
