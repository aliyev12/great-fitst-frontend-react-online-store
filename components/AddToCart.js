import React from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {CURRENT_USER_QUERY} from './User';

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!) {
        addToCart(id: $id) {
            id
            quantity
        }
    }
`;

class AddToCart extends React.Component {
//   update = (cache, payload) => {
//     // First read the cache
//     const data = cache.readQuery ({query: CURRENT_USER_QUERY});
//     data.me.cart = [
//       ...data.me.cart,
//       {
//         id: payload.data.addToCart.id,
//         quantity: payload.data.addToCart.quantity,
//         // item: {
//         //     id: this.props.id,
//         //     image: this.props.image,
//         //     price: this.props.price,
//         //     title: this.props.title
//         // }
//       },
//     ];
//     // Write it back to the cache
//     cache.writeQuery ({query: CURRENT_USER_QUERY, data});
//   };

  render () {
    const {id, image, title, price} = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{id}}
        // update={this.update}
        // optimisticResponse={{
        //   __typename: 'Mutation',
        //   addToCart: {
        //     __typename: 'CartItem',
        //     id,
        //   },
        // }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(addToCart, {loading}) => (
            <>
          <button disabled={loading} onClick={addToCart}>
            Add{loading && 'ing'} To Cart 🛒
          </button>
          </>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
