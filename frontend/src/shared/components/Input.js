import React, { useEffect, useReducer } from "react";

import { validate } from "../util/validators";
import { TextField } from "@material-ui/core";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = ({
  name,
  label,
  id,
  type,
  variant,
  margin,
  autoComplete,
  initialValue,
  initialValid,
  onInput,
  validators,
  errorText,
  autoFocus,
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || "",
    isTouched: false,
    isValid: initialValid || false,
  });

  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  return (
    <TextField
      name={name}
      label={label}
      fullWidth
      id={id}
      type={type}
      variant={variant}
      margin={margin}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
      error={!inputState.isValid && inputState.isTouched && true}
      helperText={!inputState.isValid && inputState.isTouched && errorText}
      autoComplete={autoComplete}
      autoFocus={autoFocus || false}
    />
  );
};

export default Input;
