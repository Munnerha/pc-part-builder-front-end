import { Link } from 'react-router';

const Landing = () => {
  return (
    <main className='landing'>
      <h1>Plan your AMD PC build</h1>
      <p>Pick a part for each slot, see the total price, and get warned when parts don't fit.</p>
      <div className='actions'>
        <Link className='button' to='/sign-up'>Sign Up</Link>
        <Link className='button button-outline' to='/builds'>Browse Builds</Link>
      </div>
    </main>
  );
};

export default Landing;