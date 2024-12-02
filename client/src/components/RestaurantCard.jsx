import { Card, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { DELETE_RESTAURANT } from "../graphQL/mutations/mutations";
import "../styles/RestaurantCard.css";
// import { FaTrash } from "react-icons/fa";
import { FaTrash, FaEdit } from "react-icons/fa";

// Component to display individual restaurant information
function RestaurantCard({ data, user, refetch }) {
  // Function to convert rating into stars
  const scoreToStars = (rating) => {
    return "⭐".repeat(Math.round(rating));
  };

  // useMutation hook to delete restaurant entries
  const [deleteRestaurant] = useMutation(DELETE_RESTAURANT, {
    context: {
      headers: {
        authorization: `${user.token}`, // Authorization without "Bearer"
      },
    },
  });

  // Function to handle deletion of a restaurant
  const handleDelete = async () => {
    try {
      const result = await deleteRestaurant({
        variables: { id: data.id },
      });
      refetch(); // Refetch to update the restaurant list after deletion
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      alert("An error occurred while trying to delete the restaurant.");
    }
  };

  return (
    <Card className="restaurant-card shadow bg-light text-dark m-3">
      <Card.Body>
        <div className="d-flex">
          <div className="title">
            <Card.Title className="bold">{data.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {scoreToStars(data.rating)} ({data.rating})
            </Card.Subtitle>
          </div>
          <div className="ms-auto">
            <Link
              to={`/restaurant/edit/${data.id}`}
              className="btn btn-dark rounded-circle inner-shadow mx-1"
            >
              <FaEdit className="text-white" />
            </Link>
            <Button
              variant="dark"
              className="icon-button"
              onClick={handleDelete}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        <Card.Text className="mt-2">{data.cuisine}</Card.Text>
        <Card.Text className="text-muted">{data.address}</Card.Text>
        <div className="social-links d-flex mt-2">
          {data.socialMedia.facebook && (
            <a
              href={data.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-facebook"></i>
            </a>
          )}
          {data.socialMedia.twitter && (
            <a
              href={data.socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-twitter"></i>
            </a>
          )}
          {data.socialMedia.instagram && (
            <a
              href={data.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-instagram"></i>
            </a>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default RestaurantCard;
