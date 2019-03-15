import React, {Component} from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import Router from 'next/router';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID! 
    $title: String
    $description: String
    $price: Int
    # $image: String
    # $largeImage: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    #   image: $image
    #   largeImage: $largeImage
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {
    formData: {},
    imageLoading: false,
  };

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat (value) : value;
    const newFormData = {
      ...this.state.formData,
      [name]: val,
    };
    this.setState ({formData: newFormData});
  };

  updateItem = async (e, updateItemMutation) => {
    // Stop the form from submitting
    // Before submitting, check if image is done uploading because there could
    //  be a little bit of time when someone uploads a file then immediately
    // hits enter then its going to send the data.
    e.preventDefault ();
    if (!this.state.imageLoading) {
      // Call the mutation
      const res = await updateItemMutation ({
        variables: {
          id: this.props.id,
          ...this.state.formData,
        },
      });
      console.log ('updated');
      // Change item to the single item page
      //   Router.push ({
      //     pathname: '/item',
      //     query: {id: res.data.updateItem.id},
      //   });
    }
  };

  //   uploadFile = async e => {
  //     this.setState ({imageLoading: true});
  //     const files = e.target.files;
  //     const data = new FormData ();
  //     data.append ('file', files[0]);
  //     data.append ('upload_preset', 'greatfits');

  //     const res = await fetch (
  //       `https://api.cloudinary.com/v1_1/greatfits/image/upload`,
  //       {
  //         method: 'POST',
  //         body: data,
  //       }
  //     );
  //     const file = await res.json ();
  //     const newFormData = {
  //       ...this.state.formData,
  //       image: file.secure_url,
  //       largeImage: file.eager[0].secure_url,
  //     };
  //     this.setState ({
  //         formData: newFormData,
  //         imageLoading: false
  //     });
  //   };

  render () {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id,
        }}
      >
        {({data, loading}) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No Item Found for ID {this.props.id}</p>;
          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={this.state.formData}
            >
              {(updateItem, {loading, error}) => (
                <Form onSubmit={e => this.updateItem (e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    {/* <label htmlFor="file">
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
              </label> */}

                    <label htmlFor="title">
                      Title
                      <input
                        defaultValue={data.item.title}
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
                        defaultValue={data.item.price}
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
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        name="description"
                        id="description"
                        placeholder="Enter a description"
                        required
                      />
                    </label>

                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION};
