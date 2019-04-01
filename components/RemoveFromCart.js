import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {CURRENT_USER_QUERY} from './User';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    margin-right: 20px;
    &:hover {
        color: ${props => props.theme.blue};
        cursor: pointer;
    }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  // This gets called as soon as we get a response back gtom server after a mutation has been performed
  // Cache is the apollo cache, and payload is what you get from the server, in this case 
  update = (cache, payload) => {
    // First read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // Remove that item fro the cart
    // Pyload and data is what we get back from the server by using that mutation
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(c => c.id !== cartItemId);
    // Write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  }
  render () {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{
          id: this.props.id,
        }}
        update={this.update}
        optimisticResponse={{
            __typename: 'Mutation',
            removeFromCart: {
                __typename: 'CartItem',
                id: this.props.id
            }
        }}
      >
        {(removeFromCart, {loading, error}) => (
          <BigButton
            disabled={loading}
            onClick={() => {
              removeFromCart ().catch (err => alert (err.message));
            }}
            title="Delete Item"
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
