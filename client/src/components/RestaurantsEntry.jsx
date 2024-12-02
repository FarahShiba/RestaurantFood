// Import React Hook Form, Joi, and Apollo Client
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useMutation } from "@apollo/client";
import { CREATE_RESTAURANT } from "../graphQL/mutations/mutations";
import { Card, Form, Button, Alert } from "react-bootstrap";
import "../styles/RestaurantEntry.css";
import { useNavigate } from "react-router-dom";

function RestaurantsEntry(props) {
  const userData = props.user;
  const navigate = useNavigate();

  // Validation schema for the form fields
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    cuisine: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    reviews: Joi.string().min(3).max(255).required(),
    currentLocation: Joi.object({
      currentLocation: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    socialMedia: Joi.object({
      facebook: Joi.string().allow(""),
      twitter: Joi.string().allow(""),
      instagram: Joi.string().allow(""),
    }).required(),
    phoneNumber: Joi.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      name: "Korean BBQ Food",
      address: "flinder street 1",
      cuisine: "Korean",
      rating: 4.5,
      reviews: "Great Food,Loved the ambiance",
      currentLocation: {
        currentLocation: "Melbourne",
        coordinates: [144.9631, -37.8136],
      },
      socialMedia: { facebook: "", twitter: "", instagram: "" },
      phoneNumber: "123-456-7890",
    },
  });

  const onSubmit = async (data) => {
    data.user = userData.id;
    const {
      name,
      address,
      cuisine,
      rating,
      reviews,
      currentLocation,
      socialMedia,
      phoneNumber,
    } = data;
    const token = userData.token;
    console.log(data);
    console.log(token);
    await createRestaurants(
      {
        name,
        address,
        cuisine,
        rating,
        reviews,
        currentLocation,
        coordinates: currentLocation.coordinates,
        socialMedia,
        phoneNumber,
        userId: userData.id,
      },
      token
    );
  };

  // Set up the GraphQL mutation
  const [createRestaurant] = useMutation(CREATE_RESTAURANT);

  const createRestaurants = async (data, token) => {
    // Attempt to create a new restaurant
    const {
      name,
      address,
      cuisine,
      rating,
      reviews,
      currentLocation,
      coordinates,
      socialMedia,
      phoneNumber,
      userId,
    } = data;
    try {
      const result = await createRestaurant({
        variables: {
          input: {
            name,
            address,
            cuisine,
            rating,
            reviews,
            currentLocation,
            coordinates,
            socialMedia,
            phoneNumber,
            userId,
          },
          // userId: data.userId,
        },
        context: {
          headers: {
            authorization: `${token}`,
          },
        },
      });
      props.refetch(); //Refetch the query
      navigate("/restaurant/list");
      console.log(result.data.createRestaurant);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card-container">
      <Card className="shadow m-3" style={{ width: "500px" }}>
        <Card.Body>
          <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-3">
              <h2 className="card-title">Add Restaurant</h2>
              <div className="underline"></div>
            </div>

            {/* Name Input */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="name" className="mb-3">
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Restaurant Name"
                    className="form-control"
                  />
                  {errors.name && (
                    <Alert variant="danger" className="mt-2">
                      {errors.name.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Cuisine Input */}
            <Controller
              name="cuisine"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="cuisine" className="mb-3">
                  <Form.Control {...field} type="text" placeholder="Cuisine" />
                  {errors.cuisine && (
                    <Alert variant="danger" className="mt-2">
                      {errors.cuisine.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Rating Input */}
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="rating" className="mb-3">
                  <Form.Control {...field} type="number" placeholder="Rating" />
                  {errors.rating && (
                    <Alert variant="danger" className="mt-2">
                      {errors.rating.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Reviews Input */}
            <Controller
              name="reviews"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="reviews" className="mb-3">
                  <Form.Control {...field} type="text" placeholder="Reviews" />
                  {errors.reviews && (
                    <Alert variant="danger" className="mt-2">
                      {errors.reviews.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Phone Number Input */}
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="phoneNumber" className="mb-3">
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Phone Number"
                  />
                  {errors.phoneNumber && (
                    <Alert variant="danger" className="mt-2">
                      {errors.phoneNumber.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 mt-3"
            >
              Add Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RestaurantsEntry;
