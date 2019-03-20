import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(email: $email) {
            message
        }
    }
`;

class RequestReset extends Component {
  state = {
    email: '',
  };

  saveToState = e => {
    const {name, value, type} = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    this.setState ({[name]: val});
  };

  render () {
    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION} 
        variables={this.state}
        >
        {(reset, {error, loading, called}) => {
          return (
            <Form method="post" onSubmit={async e => {
                e.preventDefault();
                await reset();
                this.setState({email: ''});
            }}>
              <fieldset disabled={loading} aria-busy={loading}>

                <h2>Request Password Reset</h2>
                <Error error={error} />
                {!error && !loading && called && <div>
                    <p>Success! A password reset link has been sent to the address you provided.</p>
                    <p>Please check that email account for this message, which should arrive within a few minutes. (If you do not see the message, be sure to check your Spam/Junk folder.)</p>
                </div>}

                {/* Check if the request has been submitted or not. If it has been submitted, then don't display email field */}
                {!called && 
                /* EMAIL */
                <>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.saveToState}
                    required
                  />
                </label>
                <button type="submit">Request Reset</button>
                   </> }
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
export {REQUEST_RESET_MUTATION};
