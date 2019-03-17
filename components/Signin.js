import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import Link from 'next/link';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from './User';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            name
            email
        }
    }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  };

  saveToState = e => {
    const {name, value, type} = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    this.setState ({[name]: val});
  };

  render () {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(signin, {error, loading}) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault ();
                await signin ();
                this.setState ({email: '', password: ''});
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>

                <h2>Sign Into Your Account</h2>
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
                    required
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
                    required
                  />
                </label>

                <Link href="/request-reset">
                  <a className="forgotPasswordLink">Forgot Password</a>
                </Link>

                <button style={{display: 'block', marginTop: '20px'}} type="submit">Sign In</button>

              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
export {SIGNIN_MUTATION};
