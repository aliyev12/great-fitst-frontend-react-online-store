import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import {TOGGLE_CART_MUTATION} from './Cart';
import {Mutation} from 'react-apollo';
import CartCount from './CartCount';

const Nav = () => (
    <User>
        {({data: {me}}) => (
            <NavStyles>
                <Link href="/items">
                    <a>Shop</a>
                </Link>
                {me && (
                    <>
                        <Link href="/sell">
                            <a>Sell</a>
                        </Link>
                        <Link href="/orders">
                            <a>Orders</a>
                        </Link>
                        <Link href="/me">
                            <a>Account</a>
                        </Link>
                        <Signout />
                        {/* <Link href="/user">
                            <a>Hey {me.name}!</a>
                        </Link> */}
                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {toggleCart => (
                                <button onClick={toggleCart}>
                                    My Cart
                                    <CartCount 
                                    count={me.cart.reduce((acc, next) => {
                                        return acc + next.quantity
                                    }, 0)} 
                                    ></CartCount>
                                </button>
                            )}
                        </Mutation>
                    </>
                )}
                {!me && (
                    <>
                        <Link href="/signin">
                            <a>Sign In</a>
                        </Link>
                        <Link href="/signup">
                            <a>Sign Up</a>
                        </Link>
                    </>
                )}
            </NavStyles>
        )}
    </User>
);

export default Nav;
