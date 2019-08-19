import React from "react";
import {
  CustomInput,
  Form,
  FormGroup,
  Label,
  //Input,
  FormText,
  Button
} from "reactstrap";
let file;
let reader = new FileReader();
class ImageUpload extends React.Component {
  state = {
    selectedFile: null
  };

  fileSelectedHandler = events => {
    // preview = document.querySelector("#footer");
    let socialPost = {
      imgHash: null
    };
    file = document.querySelector("input[type=file]").files[0];

    reader.onload = async function(e) {
      // preview.src = reader.result;
      let imageHash = JSON.stringify(reader.result);
      // ImageHash = preview.src;

      socialPost.imgHash = imageHash;
      //console.log(socialPost.imgHash);
      //getUTXO(socialPost);

      /*  // Send a message to bob
      let enc = new IES().publicKey(bobPubkey).encrypt(ImageHash);
      // Bob decrypt a message
      let dec = new IES().privateKey(privateKey).decrypt(enc); */
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  fileUploadHandler = events => {};

  render() {
    return (
      <div className="ImageUpload">
        {
          <Form>
            <img id="header" />
            <FormGroup>
              <img id="header" />
              <Label for="exampleFile">File</Label>
              <FormText color="muted">
                This is some placeholder block-level help text for the above
                input. It's a bit lighter and easily wraps to a new line.
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label for="exampleCustomFileBrowser">File Browser</Label>
              <CustomInput
                type="file"
                id="exampleCustomFileBrowser"
                name="customFile"
                onChange={this.fileSelectedHandler}
              />

              <Button onClick={this.fileUploadHandler}>Upload</Button>
            </FormGroup>
          </Form>
        }{" "}
        <img id="footer" />
      </div>
    );
  }
}

export default ImageUpload;
