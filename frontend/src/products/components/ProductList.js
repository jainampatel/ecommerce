import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";
import ProductItem from "./ProductItem";
import useStyles from "./productListStyle";

const ProductList = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProducts, setLoadedProducts] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/product"
        );
        setLoadedProducts(responseData.products);
      } catch (error) {}
    };
    fetchProducts();
  }, [sendRequest]);

  const classes = useStyles();
  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {loadedProducts && (
          <Grid container justify="center" spacing={4}>
            {loadedProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductItem product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </main>
    </>
  );
};

export default ProductList;
