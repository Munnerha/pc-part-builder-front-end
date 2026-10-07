import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { BsCpu, BsDeviceSsd, BsFan, BsGpuCard, BsMemory, BsMotherboard, BsPc, BsPlug } from 'react-icons/bs';

import * as buildService from '../../services/buildService';
import { UserContext } from '../../contexts/UserContext';
import {
  CATEGORIES,
  formatPrice,
  getBuildComponent,
  getTotal,
  getWarnings,
} from '../../lib/helpers/build-helpers';

const ICONS = {
  CPU: { icon: BsCpu, color: '#2563eb' },
  Motherboard: { icon: BsMotherboard, color: '#16a34a' },
  RAM: { icon: BsMemory, color: '#9333ea' },
  GPU: { icon: BsGpuCard, color: '#ea580c' },
  Storage: { icon: BsDeviceSsd, color: '#d97706' },
  Cooler: { icon: BsFan, color: '#0891b2' },
  PSU: { icon: BsPlug, color: '#db2777' },
  Case: { icon: BsPc, color: '#475569' },
};

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
  const warnings = getWarnings(build);

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
          const { icon: Icon, color } = ICONS[category];

          return (
            <li className='row slot' key={category}>
              <span className='slot-category'><Icon aria-hidden='true' color={color} size={20} /> {category}</span>
              {buildComponent ? (
                <>
                  <span>{buildComponent.component.brand} {buildComponent.component.name}</span>
                  <span className='price'>{formatPrice(buildComponent.component.price)}</span>
                </>
              ) : (
                <span className='muted'>Empty</span>
              )}
              {isOwner && (
                <div className='actions'>
                  {buildComponent && (
                    <>
                      <Link className='button button-outline' to={`/builds/${buildId}/choose/${category}`}>Swap</Link>
                      <button className='button button-danger' onClick={() => handleRemovePart(buildComponent.id)}>Remove</button>
                    </>
                  )}
                  {!buildComponent && (
                    <Link className='button button-success' to={`/builds/${buildId}/choose/${category}`}>Choose</Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className='total'>Total: {formatPrice(getTotal(build))}</p>

      {warnings.length > 0 && (
        <ul className='warnings'>
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default BuildDetails;