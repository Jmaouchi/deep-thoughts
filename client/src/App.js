import React from 'react';
// get access to server api
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.

// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.

// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.

// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

// use router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// retrieve token from local storage 
import { setContext } from '@apollo/client/link/context';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';


function App() {
  return (
    // the useQuery is hooking to the apollo provider and get the data from it 
    <ApolloProvider client={client}> 
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* these routes are whatever we can use to get page components on the page, and these will be links that we used inside the other components  */}
            <Routes>
               {/* the path is whatever you want to call it  */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route  path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

// set httpLink to get the data 
const httpLink = createHttpLink({
  uri: '/graphql',  // uri stands for Uniform Resource Identifier
});

// set the authLink to get the token from localStorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// instruct the Apollo instance in App.js to retrieve this token every time we make a GraphQL reques,
// this will return the token everytime we make a request to the DB
const client = new ApolloClient({ // create the connection from the client server to the api endpoint or graphql server that will give us the data
  // combine both authLink and httpLink 
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // if he we get the data this will save it for next time 
});

export default App;
