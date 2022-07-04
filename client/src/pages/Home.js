import React from 'react';
//With these statements, we're importing the useQuery Hook from Apollo Client. This will allow us to make requests to the GraphQL server we 
// connected to and made available to the application using the <ApolloProvider> component in App.js 
import { useQuery } from '@apollo/client';
import ThoughtList from '../components/ThoughtList';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';


const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS); // loading is same as async fetch request, loading property to indicate that the request isn't done just yet
  //  when its done getting the data from the server, then the information are stored in the data proprety 
  const thoughts = data?.thoughts || [] //What we're saying is, if data exists, store it in the thoughts constant we just created amd
  // If data is undefined, then save an empty array to the thoughts component.

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC); // this will get the user data but only whatever we need, not the whole data, then we will check if the user is loggenIN,
  // if yes then use that data to change the DOM


  // check if logged in or not
  const loggedIn = Auth.loggedIn();
  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-7'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." /> // we added the thought data to be displayed on the ThoughtList 
            //component
          )}
        </div>

      {loggedIn && userData ? (
      <div className="col-12 col-lg-3 mb-3">
        <FriendList
          username={userData.me.username}
          friendCount={userData.me.friendCount}
          friends={userData.me.friends}
        />
      </div>
      ) : null}
      </div>
    </main>
  );
};

export default Home;
