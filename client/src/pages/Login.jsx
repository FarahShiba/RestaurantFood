//react
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphQL/mutations/mutations";

function Login({ onLogin }) {
  // joi validation for react hooks form
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });

  // React-Hook-Forms
  // control - React Hook Forms Controller this is used to control the input
  // handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  // formState - React Hook Forms formState this is used to access the form state
  // reset - React Hook Forms reset function this is used to reset the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER); // loginUser - The mutation function
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Navigate function to navigate to a different page

  //submit login
  const onSubmit = async (data, event) => {
    const { email, password } = data;
    event.preventDefault(); // Prevents page from refreshing on submit
    try {
      const result = await loginUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      console.log(result.data);
      onLogin(result.data.loginUser); // Call onLogin function from App.jsx to store the user in App.jsx state
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message); // Set error message state
      reset(); // Reset the form
    }
  };

  return (
    <Card
      className="shadow m-3"
      style={{ width: "400px", margin: "auto", marginTop: "100px" }}
    >
      <Card.Body>
        {/* Form Header */}
        <div className="text-center mb-3">
          <h2 className="text-primary">Login</h2>
          <div className="underline"></div>
        </div>

        {/* Form */}
        <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="email" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i> {/* Bootstrap icon */}
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="email"
                    placeholder="Email id"
                    className="form-control"
                  />
                </InputGroup>
                {errors.email && (
                  <Alert variant="danger" className="mt-2">
                    {errors.email.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* Password Input */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="password" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="password"
                    placeholder="Password"
                  />
                </InputGroup>
                {errors.password && (
                  <Alert variant="danger" className="mt-2">
                    {errors.password.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* General Error Messages */}
          {errorMessage && (
            <Alert variant="danger" className="mt-2">
              {errorMessage}
            </Alert>
          )}
          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 mt-3"
          >
            Login
          </Button>
        </Form>

        {/* Forgot password and Sign-up Links */}
        <p className="m-0 mt-2 text-center">
          Lost password? <Link to="/forgot-password">Click here!</Link>
        </p>
        <p className="m-0 mt-2 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link> now!
        </p>
      </Card.Body>
    </Card>
  );
}

export default Login;
