import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Router from 'next/router';

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
    title: "Cat",
    description: "Miao Cat",
    image: "miaoaaaa",
    largeImage: "large miao",
    price: 0
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    console.log('Uploading file');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'greatfits');
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/greatfits/image/upload`, {
      method: 'POST',
      body: data
    });
    const file = await res.json();
    console.log(file);
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // Call the mutation
              const res = await createItem();
              // Change item to the single item page
              console.log(res);
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
                Image
                <input
                  onChange={this.uploadFile}
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                />
              </label>

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
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
