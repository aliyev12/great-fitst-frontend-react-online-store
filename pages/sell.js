import Link from 'next/link';
import CreateItem from '../components/CreateItem';
import PleaseSignin from '../components/PleaseSignIn';

const Sell = props => (
  <div>
    <PleaseSignin>
      <CreateItem />
    </PleaseSignin>
  </div>
);

export default Sell;
