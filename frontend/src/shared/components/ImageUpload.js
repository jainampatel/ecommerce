import React, { useEffect, useRef, useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  image_upload_center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  image_upload__preview: {
    width: "13rem",
    height: "13rem",
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "1rem",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const classes = useStyles();
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={filePickerRef}
        type="file"
        accept="image/*"
        onChange={pickedHandler}
      />
      <div className={classes.image_upload_center}>
        <div className={classes.image_upload__preview}>
          {previewUrl && (
            <img src={previewUrl} className={classes.img} alt="Preview" />
          )}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={pickImageHandler}
        >
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.helperText}</p>}
    </div>
  );
};

export default ImageUpload;
