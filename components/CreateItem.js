import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cat',
    description: 'Miao Cat',
    image: 'miaoaaaa',
    largeImage: 'large miao',
    price: 0,
  };

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat (value) : value;
    this.setState ({[name]: val});
  };

  render () {
    return (
      <Mutation 
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
      >
      {(createItem, {loading, error}) => (

      <Form onSubmit={e => {
          e.preventDefault();
          console.log(this.state);
      }}>
        <fieldset>
          <label htmlFor="title">
            Title
            <input
              value={this.state.title}
              onChange={this.handleChange}
              type="text"
              id="title"
              name="title"
              placeholder="title"
              required
            />
          </label>

          <label htmlFor="price">
            Price
            <input
              value={this.state.price}
              onChange={this.handleChange}
              type="number"
              id="price"
              name="price"
              placeholder="Price"
              required
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea
              value={this.state.description}
              onChange={this.handleChange}
              name="description"
              id="description"
              placeholder="Enter a description"
              required
            />
          </label>

          <button type="submit">Submit</button>
        </fieldset>

      </Form> )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
