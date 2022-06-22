import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.

// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.

// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.

// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';


function App() {
  return (
    // with this we can get any data from the graphql server
    <ApolloProvider client={client}> 
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

const httpLink = createHttpLink({
  uri: '/graphql',  // uri stands for Uniform Resource Identifier
});

const client = new ApolloClient({ // create the connection from the client server to the api endpoint or graphql server that will give us the data
  link: httpLink,
  cache: new InMemoryCache(),
});

export default App;
