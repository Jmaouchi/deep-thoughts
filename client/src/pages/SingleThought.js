import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import Auth from '../utils/auth';
import Login from './Login';
const SingleThought = props => {
  
  // this useParams is to get the data by id
  const { id: thoughtId } = useParams();

const { loading, data } = useQuery(QUERY_THOUGHT, {
  variables: { id: thoughtId } //we will get the query_thought data but we need to specify the ID because its required, so the id will be the 
  // thoughtId
});

const thought = data?.thought || {};
console.log(thought);

if (loading) {
  return <div>Loading...</div>;
}

const loggedIn = Auth.loggedIn();
return (
  <div>
    {loggedIn && thought? (
    <div className="card mb-3">
      <p className="card-header">
        <span style={{ fontWeight: 700 }} className="text-light">
          {thought.username}
        </span>{' '} {/* this is to leave some space*/}
        thought on {thought.createdAt}
      </p>
      <div className="card-body">
        <p>{thought.thoughtText}</p>
      </div>
    </div>  ) : null}
    {/* if reaction count is > 0 then display the ReactionList component that will send the data as a params */}
    {loggedIn && thought? (
    <div >
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>  ) : <Login ></Login>}
    </div>
);
};

export default SingleThought;
