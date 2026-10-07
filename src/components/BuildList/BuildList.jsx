import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as buildService from '../../services/buildService';
import { UserContext } from '../../contexts/UserContext';
import { formatPrice, getTotal } from '../../lib/helpers/build-helpers';

const BuildList = ({ onlyMine }) => {
  const { user } = useContext(UserContext);
  const [builds, setBuilds] = useState([]);
  const [message, setMessage] = useState('Loading builds...');

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const fetchedBuilds = await buildService.index();
        setBuilds(fetchedBuilds);
        setMessage('');
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchBuilds();
  }, []);

  // on the My Builds page, keep only the signed-in user's builds
  const visibleBuilds = onlyMine
    ? builds.filter((build) => build.user.id === Number(user.sub))
    : builds;

  return (
    <main>
      <h1>{onlyMine ? 'My Builds' : 'All Builds'}</h1>
      {message && <p className='message'>{message}</p>}
      {!message && visibleBuilds.length === 0 && <p className='message'>No builds yet.</p>}
      <ul className='rows'>
        {visibleBuilds.map((build) => (
          <li key={build.id}>
            <Link className='row row-link' to={`/builds/${build.id}`}>
              <div>
                <h2>{build.name}</h2>
                {build.description && <p className='muted'>{build.description}</p>}
                <p className='muted'>
                  by {build.user.username} · {build.build_components.length} parts
                </p>
              </div>
              <span className='price'>{formatPrice(getTotal(build))}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BuildList;