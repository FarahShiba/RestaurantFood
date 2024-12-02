import { useQuery } from "@apollo/client";
import RestaurantCard from "../components/RestaurantCard.jsx";
import { useEffect } from "react";
import { GET_RESTAURANTS } from "../graphQL/queries/queries";

const Restaurants = ({ user }) => {
  const { loading, error, data, refetch } = useQuery(GET_RESTAURANTS, {
    context: {
      headers: {
        authorization: user.token,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <p>Loading... 🤔</p>; //If the request is in progress, display a loading message
  if (error) return <p>Error 😭</p>; //If the request fails, display an error message

  return (
    <div>
      {data.restaurants.map((data) => (
        <RestaurantCard
          key={data.id}
          data={data}
          user={user}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

export default Restaurants;
