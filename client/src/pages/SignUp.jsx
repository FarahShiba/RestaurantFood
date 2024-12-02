// SignUp.jsx
// This component handles the user sign-up process, including validation, form submission, and error handling.
// It uses React Hook Form with Joi validation, Apollo Client for GraphQL mutation, and React Router for navigation.

// Import React and supporting libraries
import { useState } from "react";
import { Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
//react router
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//react hook forms
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
//apollo client
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphQL/mutations/mutations";

// SignUp component - responsible for rendering the user registration form
function SignUp({ onLogin }) {
  // Global variables
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages for display
  const [createUser, { loading, error }] = useMutation(CREATE_USER); // Mutation to create a new user
  const navigate = useNavigate(); // Navigation hook to redirect user after sign-up

  // onSubmit function - handles form submission
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevents default form submission behavior
    const { username, email, firstName, lastName, password } = data; // Destructures data from the form inputs
    try {
      const result = await createUser({
        variables: {
          // Sends form data to the GraphQL API
          input: {
            username,
            email,
            password,
            // firstName,
            // lastName,
          },
        },
      });
      console.log(result.data);
      onLogin(result.data.createUser); // Calls onLogin to store user data and log in
      navigate("/"); // Redirects to the home page after successful registration
    } catch (error) {
      setErrorMessage(error.message); // Sets the error message if the request fails
    }
  };

  // Joi schema for validating form inputs
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  // React Hook Form setup with Joi validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      // firstName: "",
      // lastName: "",
    },
  });

  return (
    <Card
      className="shadow m-3"
      style={{ width: "400px", margin: "auto", marginTop: "100px" }}
    >
      <Card.Body>
        {/* Form Header */}
        <div className="text-center mb-3">
          <h2 className="text-primary">Sign Up</h2>
          <div className="underline"></div>
        </div>
        {/* Form */}
        {/* Form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Input */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="username" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person"></i> {/* Bootstrap icon */}
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Name"
                    className="form-control"
                  />
                </InputGroup>
                {errors.username && (
                  <Alert variant="danger" className="mt-2">
                    {errors.username.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="email" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="email"
                    placeholder="Email id"
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
          {/* First Name Input */}
          {/* <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="firstName" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="First Name"
                  />
                </InputGroup>
              </Form.Group>
            )}
          /> */}

          {/* Last Name Input */}
          {/* <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Form.Group controlId="lastName" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Last Name"
                  />
                </InputGroup>
              </Form.Group>
            )}
          /> */}

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
          {/* Error Messages */}
          {errorMessage && (
            <Alert variant="danger" className="mt-2">
              {errorMessage}
            </Alert>
          )}
          {/* Sign Up Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 mt-3"
          >
            Sign Up
          </Button>
        </Form>
        {/* Text with Link for Login */}
        <p className="m-0 mt-1 text-center">
          Already have an account? <Link to="/login">Login</Link> now!
        </p>
      </Card.Body>
    </Card>
  );
}

export default SignUp;
