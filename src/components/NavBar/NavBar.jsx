import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    setUser(null);
  };

  return (
    <nav>
      <Link className='brand' to='/'>PCPartBuilder</Link>
      <ul>
        <li><Link to='/builds'>Builds</Link></li>
        <li><Link to='/components'>Parts</Link></li>
        {user ? (
          <>
            <li><Link to='/builds/new'>+ New Build</Link></li>
            {user.role === 'admin' && <li><Link to='/users'>Users</Link></li>}
            <li><Link to='/' onClick={handleSignOut}>Sign Out ({user.username})</Link></li>
          </>
        ) : (
          <>
            <li><Link to='/sign-up'>Sign Up</Link></li>
            <li><Link to='/sign-in'>Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;