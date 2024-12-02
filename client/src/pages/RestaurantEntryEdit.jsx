import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RESTAURANT } from "../graphQL/queries/queries";
import { UPDATE_RESTAURANT } from "../graphQL/mutations/mutations";
import { Card, Form, Button, Alert } from "react-bootstrap";
import "../styles/RestaurantEntryEdit.css";
import { FaEdit } from "react-icons/fa";

function RestaurantEntryEdit(props) {
  const userData = props.user;
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  // Fetch restaurant data
  const { loading, error, data } = useQuery(GET_RESTAURANT, {
    variables: { restaurantId },
    context: {
      headers: {
        authorization: `${userData.token}`, // Directly using userData.token
      },
    },
  });

  // Mutation for updating restaurant
  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT);

  // onSubmit function for form submission
  const onSubmit = async (formData) => {
    const { name, address, cuisine, rating, reviews, phoneNumber } = formData;
    try {
      const result = await updateRestaurant({
        variables: {
          updateRestaurantId: restaurantId,
          input: {
            name,
            address,
            cuisine,
            rating,
            reviews, // Directly use the string for reviews
            phoneNumber,
            userId: userData.id,
          },
        },
        context: {
          headers: {
            authorization: `${userData.token}`,
          },
        },
      });
      console.log("Mutation Result:", result);
      navigate("/restaurant/list");
    } catch (error) {
      console.error(`Failed to update journal entry: ${error.message}`);
    }
  };

  // Validation schema
  const schema = Joi.object({
    name: Joi.string().min(3).max(256).required(),
    address: Joi.string().min(3).max(512).required(),
    cuisine: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    reviews: Joi.string().min(3).max(255).required(),
    phoneNumber: Joi.string().required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  // Prefill the form with restaurant data if available
  useEffect(() => {
    if (data) {
      setValue("name", data.restaurant.name);
      setValue("address", data.restaurant.address);
      setValue("cuisine", data.restaurant.cuisine);
      setValue("rating", data.restaurant.rating);
      setValue("reviews", data.restaurant.reviews);
      setValue("phoneNumber", data.restaurant.phoneNumber);
    }
  }, [data, setValue]);

  if (loading) return <p>Loading... 🤔</p>;
  if (error) return <p>Error 😭</p>;

  return (
    <Card className="restaurant-card shadow text-white m-3">
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              name="name"
              control={control}
              defaultValue={data.restaurant.name}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Restaurant Name"
                  className="form-control form-control-lg mb-2"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <Alert variant="danger" className="mt-2">
                {errors.name.message}
              </Alert>
            )}
          </div>
          <div className="mb-3">
            <Controller
              name="address"
              control={control}
              defaultValue={data.restaurant.address}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Address"
                  className="form-control mb-3"
                  {...field}
                />
              )}
            />
            {errors.address && (
              <Alert variant="danger" className="mt-2">
                {errors.address.message}
              </Alert>
            )}
          </div>
          <div className="mb-3">
            <Controller
              name="cuisine"
              control={control}
              defaultValue={data.restaurant.cuisine}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Cuisine"
                  className="form-control mb-3"
                  {...field}
                />
              )}
            />
            {errors.cuisine && (
              <Alert variant="danger" className="mt-2">
                {errors.cuisine.message}
              </Alert>
            )}
          </div>
          <div className="mb-3">
            <Controller
              name="rating"
              control={control}
              defaultValue={data.restaurant.rating}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  placeholder="Rating"
                  className="form-control mb-3"
                  {...field}
                />
              )}
            />
            {errors.rating && (
              <Alert variant="danger" className="mt-2">
                {errors.rating.message}
              </Alert>
            )}
          </div>
          <div className="mb-3">
            <Controller
              name="reviews"
              control={control}
              defaultValue={data.restaurant.reviews}
              render={({ field }) => (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter reviews separated by commas or new lines."
                  className="form-control mb-3"
                  {...field}
                />
              )}
            />
            {errors.reviews && (
              <Alert variant="danger" className="mt-2">
                {errors.reviews.message}
              </Alert>
            )}
          </div>
          <div className="mb-3">
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue={data.restaurant.phoneNumber}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  className="form-control mb-3"
                  {...field}
                />
              )}
            />
            {errors.phoneNumber && (
              <Alert variant="danger" className="mt-2">
                {errors.phoneNumber.message}
              </Alert>
            )}
          </div>
          <Button variant="dark" size="lg" className="w-100 mt-3" type="submit">
            <FaEdit />
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RestaurantEntryEdit;
