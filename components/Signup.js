import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            id
            name
            email
        }
    }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };

  saveToState = e => {
    const {name, value, type} = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    this.setState ({[name]: val});
  };

  render () {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, {error, loading}) => {
          return (
            <Form method="post" onSubmit={async e => {
                e.preventDefault();
                await signup();
                this.setState({email: '', name: '', password: ''});
            }}>
              <fieldset disabled={loading} aria-busy={loading}>

                <h2>Sign Up for an Account</h2>
                <Error error={error} />
                {/* EMAIL */}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                {/* NAME */}
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.saveToState}
                  />
                </label>
                {/* PASSWORD */}
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Sign Up</button>

              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Signup;
export {SIGNUP_MUTATION};
