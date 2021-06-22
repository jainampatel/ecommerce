import React from "react";
import { Link } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import useStyles from "./newProductStyles";
import { Grid } from "@material-ui/core";
import Input from "../../shared/components/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";
import ImageUpload from "../../shared/components/ImageUpload";

const NewProduct = () => {
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      details: {
        value: "",
        isValid: false,
      },
      quantity: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formState.inputs.name.value);
    formData.append("details", formState.inputs.details.value);
    formData.append("quantity", formState.inputs.quantity.value);
    formData.append("price", formState.inputs.price.value);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest("http://localhost:5000/api/product", "POST", formData);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />
      <div className={classes.toolbar} />
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Add New Product
          </Typography>
          <React.Fragment>
            <Grid container spacing={3}>
              <form className={classes.form} onSubmit={onSubmitHandler}>
                <Grid item xs={12}>
                  <Input
                    name="name"
                    label="Product Name"
                    id="name"
                    variant="outlined"
                    margin="normal"
                    autoComplete="name"
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid name."
                    onInput={inputHandler}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    name="details"
                    label="Description"
                    id="details"
                    variant="outlined"
                    margin="normal"
                    autoComplete="details"
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid details."
                    onInput={inputHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    name="quantity"
                    label="Quantity"
                    id="quantity"
                    margin="normal"
                    variant="outlined"
                    autoComplete="quantity"
                    type="number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid quantity."
                    onInput={inputHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    name="price"
                    label="Unit Price"
                    id="price"
                    margin="normal"
                    variant="outlined"
                    autoComplete="price"
                    type="number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid price."
                    onInput={inputHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUpload id="image" onInput={inputHandler} />
                </Grid>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6} item>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      color="secondary"
                      className={classes.submit}
                      disabled={!formState.isValid}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <Button
                      component={Link}
                      to="/"
                      variant="contained"
                      fullWidth
                      color="primary"
                      className={classes.submit}
                      disabled={!formState.isValid}
                    >
                      Display
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
};

export default NewProduct;
