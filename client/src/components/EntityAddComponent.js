import React, { Component } from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
import auth from "../api/auth-helper";
import Container from "@material-ui/core/Container";
import SideBar from "./sideBar";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { create } from "../api/api-entities";
import Copyright from "./Copyright";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: lightBlue[500]
    },
    secondary: {
      main: blue[900]
    }
  }
});

const styles = theme => ({
  root: {
    display: "flex"
  },
  title: {
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    fontSize: 16
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 120
  }
});

class AddEntity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      contactNo: "",
      entityType: "customer",
      error: "",
      open: "",
      touched: {
        name: false,
        address: false,
        contactNo: false
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      open: !this.state.open
    });
  }

  onRadioChange = e => {
    this.setState({
      entityType: e.target.value
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const entity = {
      name: this.state.name,
      address: this.state.address,
      contactNo: this.state.contactNo,
      entityType: this.state.entityType
    };

    event.preventDefault();
    const token = localStorage.getItem("jwtToken");
    create(entity, token).then(data => {
      //console.log(data);
      if (data.errors) {
        this.setState({ ...this.state, error: data.errors[0].msg });
      } else {
        this.setState({ ...this.state, error: "", open: true });
      }
    });
  }

  handleBlur = field => evt => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  };

  validate(name, address, contactNo) {
    const errors = {
      name: "",
      address: "",
      contactNo: ""
    };

    if (this.state.touched.name && name.length < 3)
      errors.name = "Name should be greater than 3 characters";
    else if (this.state.touched.name && name.length > 25)
      errors.name = "First name shouldbe less than 25 characters";

    if (this.state.touched.address && address.length < 3)
      errors.address = "Address should be greater than 3 characters";
    else if (this.state.touched.address && address.length > 30)
      errors.lastname = "Last name shouldbe <= 30 characters";

    const reg = /^\d+$/;

    if (this.state.touched.contactNo && !reg.test(contactNo))
      errors.contactNo = "contact number should contain only numbers";

    return errors;
  }

  render() {
    const errors = this.validate(
      this.state.name,
      this.state.address,
      this.state.contactNo
    );
    const { classes } = this.props;
    if (auth.isAuthenticated()) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className={classes.root}>
          <SideBar title="Add Entity" />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <div className="container">
                <div className="row row-content">
                  {this.state.error && (
                    <Alert color="danger">{this.state.error}</Alert>
                  )}
                  <Alert
                    severity="success"
                    isOpen={this.state.open}
                    toggle={this.toggleModal}
                  >
                    Entity added successfully —{" "}
                    <a href="/showentities">
                      <strong>check it out!</strong>
                    </a>
                  </Alert>
                  <div className="col-12 col-md-9">
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup row>
                        <Label htmlFor="name" md={2}>
                          Name
                        </Label>
                        <Col md={10}>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={this.state.name}
                            valid={errors.name === ""}
                            invalid={errors.name !== ""}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur("name")}
                          />
                          <FormFeedback>{errors.name}</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label htmlFor="address" md={2}>
                          Address
                        </Label>
                        <Col md={10}>
                          <Input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Address"
                            value={this.state.address}
                            valid={errors.address === ""}
                            invalid={errors.address !== ""}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur("address")}
                          />
                          <FormFeedback>{errors.address}</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label htmlFor="contactNo" md={2}>
                          Contact No.
                        </Label>
                        <Col md={10}>
                          <Input
                            type="conatctNo"
                            id="contactNo"
                            name="contactNo"
                            placeholder="Contact number"
                            value={this.state.contactNo}
                            valid={errors.contactNo === ""}
                            invalid={errors.contactNo !== ""}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur("contactNo")}
                          />
                          <FormFeedback>{errors.contactNo}</FormFeedback>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md={2}>
                          <p>Entity Type </p>
                        </Col>
                        <Col md={2} className="ml-3 mr-0">
                          <Label>
                            <Input
                              type="radio"
                              value="customer"
                              checked={this.state.entityType === "customer"}
                              onChange={this.onRadioChange}
                            />
                            <span>Customer</span>
                          </Label>
                        </Col>
                        <Col className="ml-3 mr-0">
                          <Label>
                            <Input
                              type="radio"
                              value="vendor"
                              checked={this.state.entityType === "vendor"}
                              onChange={this.onRadioChange}
                            />
                            <span>Vendor</span>
                          </Label>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md={{ size: 10, offset: 2 }}>
                          <Button type="submit" color="primary">
                            ADD
                          </Button>
                        </Col>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </div>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    );
  }
  }
}

export default withStyles(styles)(AddEntity);
