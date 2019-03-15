import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
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
    formData: {
      title: 'Cat',
      description: 'Miao Cat',
      image: 'miaoaaaa',
      largeImage: 'large miao',
      price: 0,
    },
    imageLoading: false,
  };

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat (value) : value;
    const newFormData = {
        ...this.state.formData,
        [name]: val
    };
    this.setState ({formData: newFormData});
  };

  uploadFile = async e => {
    this.setState ({imageLoading: true});
    const files = e.target.files;
    const data = new FormData ();
    data.append ('file', files[0]);
    data.append ('upload_preset', 'greatfits');

    const res = await fetch (
      `https://api.cloudinary.com/v1_1/greatfits/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );
    const file = await res.json ();
    const newFormData = {
      ...this.state.formData,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    };
    this.setState ({
        formData: newFormData,
        imageLoading: false
    });
  };

  render () {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state.formData}>
        {(createItem, {loading, error}) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              // Before submitting, check if image is done uploading because there could
              //  be a little bit of time when someone uploads a file then immediately
              // hits enter then its going to send the data.
              e.preventDefault ();
              if (!this.state.imageLoading) {
                // Call the mutation
                const res = await createItem ();
                // Change item to the single item page
                Router.push ({
                  pathname: '/item',
                  query: {id: res.data.createItem.id},
                });
              }
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
                {this.state.formData.image && <img src={this.state.formData.image} alt={'Upload preview of ' + this.state.formData.title} width="200" />}
              </label>

              <label htmlFor="title">
                Title
                <input
                  value={this.state.formData.title}
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
                  value={this.state.formData.price}
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
                  value={this.state.formData.description}
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
export {CREATE_ITEM_MUTATION};
