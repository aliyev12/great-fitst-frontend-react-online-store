import Link from 'next/link';
import UpdateItem from '../components/UpdateItem';

const Sell = ({ query }) => (
    <div>
        <p>Sell!</p>
        <UpdateItem id={ query.id } ></UpdateItem>
    </div>
);

export default Sell;