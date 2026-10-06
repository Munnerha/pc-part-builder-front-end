import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as buildService from '../../services/buildService';
import { formatPrice, getTotal } from '../../lib/helpers/build-helpers';

const BuildList = () => {
  const [builds, setBuilds] = useState([]);
  const [message, setMessage] = useState('Loading builds...');

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const fetchedBuilds = await buildService.index();
        setBuilds(fetchedBuilds);
        setMessage(fetchedBuilds.length ? '' : 'No builds yet.');
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchBuilds();
  }, []);
  
return (
    <main>
      <h1>All Builds</h1>
      {message && <p className='message'>{message}</p>}
      <ul className='rows'>
        {builds.map((build) => (
          <li key={build.id}>
            <Link className='row row-link' to={`/builds/${build.id}`}>
              <div>
                <h2>{build.name}</h2>
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