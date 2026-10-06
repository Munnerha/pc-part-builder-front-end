import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import * as buildService from '../../services/buildService';
import { UserContext } from '../../contexts/UserContext';
import {
  CATEGORIES,
  formatPrice,
  getBuildComponent,
  getTotal,
} from '../../lib/helpers/build-helpers';

const BuildDetails = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [build, setBuild] = useState(null);
  const [message, setMessage] = useState('Loading build...');

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const fetchedBuild = await buildService.show(buildId);
        setBuild(fetchedBuild);
        setMessage('');
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchBuild();
  }, [buildId]);

  const handleDeleteBuild = async () => {
    try {
      await buildService.deleteBuild(buildId);
      navigate('/builds');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleRemovePart = async (buildComponentId) => {
    try {
      await buildService.deleteBuildComponent(buildComponentId);
      setBuild({
        ...build,
        build_components: build.build_components.filter(
          (buildComponent) => buildComponent.id !== buildComponentId
        ),
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!build) {
    return (
      <main>
        <p className='message'>{message}</p>
      </main>
    );
  }

  const isOwner = user && Number(user.sub) === build.user.id;
  const isAdmin = user && user.role === 'admin';
  const hasCase = getBuildComponent(build, 'Case');

  return (
    <main>
      <header className='page-header'>
        <div>
          <h1>{build.name}</h1>
          <p className='muted'>by {build.user.username}</p>
        </div>
        <div className='actions'>
          {isOwner && (
            <Link className='button button-outline' to={`/builds/${buildId}/edit`}>Edit</Link>
          )}
          {(isOwner || isAdmin) && (
            <button className='button button-danger' onClick={handleDeleteBuild}>Delete</button>
          )}
        </div>
      </header>

      {build.description && <p>{build.description}</p>}
      {message && <p className='message'>{message}</p>}
            <ul className='rows'>
        {CATEGORIES.map((category) => {
          const buildComponent = getBuildComponent(build, category);
          // the GPU has to fit the case, so the case is picked first
          const isLocked = category === 'GPU' && !hasCase;

          return (
            <li className='row slot' key={category}>
              <span className='slot-category'>{category}</span>
              {buildComponent ? (
                <>
                  <span>{buildComponent.component.brand} {buildComponent.component.name}</span>
                  <span className='price'>{formatPrice(buildComponent.component.price)}</span>
                </>
              ) : (
                <span className='muted'>{isLocked ? 'Choose a case first' : 'Empty'}</span>
              )}
              {isOwner && (
                <div className='actions'>
                  {buildComponent && (
                    <>
                      <Link className='button button-outline' to={`/builds/${buildId}/choose/${category}`}>Swap</Link>
                      <button className='button button-danger' onClick={() => handleRemovePart(buildComponent.id)}>Remove</button>
                    </>
                  )}
                  {!buildComponent && !isLocked && (
                    <Link className='button button-success' to={`/builds/${buildId}/choose/${category}`}>Choose</Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className='total'>Total: {formatPrice(getTotal(build))}</p>
    </main>
  );
};

export default BuildDetails;