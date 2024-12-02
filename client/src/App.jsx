//import react hooks and components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"; //import first Apollo Client

//import custom components
import Header from "./components/Header.jsx";
import NotFound from "./pages/NotFound.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import RestaurantsList from "./pages/RestaurantList.jsx";
import RestaurantEntryEdit from "./pages/RestaurantEntryEdit.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import { create } from "lodash";

//after that create an instance of Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4005/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  // create state to store the user (1)
  const [user, setUser] = useState(null);

  //Create a function to handle login (2)
  const handleLogin = (user) => {
    setUser(user);
    saveTokenToSessionStorage(user);
  };

  // Create a function to save the token to session storage (3)
  function saveTokenToSessionStorage(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  // Create a function to handle logout (4)
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    client.clearStore();
  };

  // Create a function to get the user from session storage (5)
  const getUserFromSessionStorage = () => {
    try {
      const userString = sessionStorage.getItem("user");
      const user = JSON.parse(userString);
      return user;
    } catch (error) {
      sessionStorage.setItem("user", "");
      return null;
    }
  };

  // Use the useEffect hook to get the user from session storage (6)
  useEffect(() => {
    const user = getUserFromSessionStorage();
    if (user) {
      setUser(user);
    }
  }, []);

  function ProtectedRoute({ component: Component, ...rest }) {
    const user = getUserFromSessionStorage();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <Component {...rest} user={user} />;
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Header onLogout={handleLogout} />
        <div className="container-centered">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
            <Route
              path="/"
              element={<ProtectedRoute component={Restaurants} user={user} />}
            />
            <Route
              path="/restaurant/list"
              element={
                <ProtectedRoute component={RestaurantsList} user={user} />
              }
            />
            <Route
              path="/restaurant/edit/:restaurantId"
              element={
                <ProtectedRoute component={RestaurantEntryEdit} user={user} />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
