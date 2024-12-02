// Restaurants.jsx

// It uses Apollo Client's useQuery hook to retrieve restaurant data from the server, with authorization headers.
import { useQuery } from "@apollo/client";
import RestaurantsEntry from "../components/RestaurantsEntry.jsx";
// import RestaurantCard from "../components/RestaurantCard.jsx";
import { useEffect } from "react";
import { GET_RESTAURANTS } from "../graphQL/queries/queries";

// Restaurants component - fetches and displays restaurant data for an authenticated user.
const Restaurants = ({ user }) => {
  // useQuery hook to fetch restaurant data with the authorization header.
  // loading: indicates if the request is in progress.
  // error: holds any error that occurred during the request.
  // data: holds the retrieved restaurant data.
  // refetch: function to manually refetch the data.
  const { loading, error, data, refetch } = useQuery(GET_RESTAURANTS, {
    context: {
      headers: {
        authorization: user.token, // authorization token for user access
      },
    },
  });

  // useEffect to trigger refetch on component mount or if error changes
  useEffect(() => {
    refetch(); // Refreshes restaurant data on component mount
  }, [refetch, error]);

  if (loading) return <p>Loading... 🤔</p>; //If the request is in progress, display a loading message
  if (error) return <p>Error 😭</p>; //If the request fails, display an error message

  return (
    <div>
      {/* Render the RestaurantsEntry component with user data and refetch function */}
      <RestaurantsEntry user={user} refetch={refetch} />

      {/* {data.restaurants.map((data) => (
        <RestaurantCard
          key={data.id}
          data={data}
          user={user}
          refetch={refetch}
        />
      ))} */}
    </div>
  );
};

export default Restaurants;
