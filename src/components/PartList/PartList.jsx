import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as buildService from '../../services/buildService';
import * as componentService from '../../services/componentService';
import { UserContext } from '../../contexts/UserContext';
import {
  CATEGORIES,
  formatPrice,
  getBuildComponent,
  getSpecs,
} from '../../lib/helpers/build-helpers';

const PartList = () => {
  // with a build id in the URL, this page picks a part for that build
  const { buildId, category } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [components, setComponents] = useState([]);
  const [build, setBuild] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

    useEffect(() => {
    const fetchComponents = async () => {
      try {
        const fetchedComponents = await componentService.index(category || selectedCategory);
        setComponents(fetchedComponents);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchComponents();
  }, [category, selectedCategory]);

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const fetchedBuild = await buildService.show(buildId);

        // only the owner can pick parts for a build
        if (fetchedBuild.user.id !== Number(user.sub)) return navigate(`/builds/${buildId}`);

        setBuild(fetchedBuild);
      } catch (err) {
        setMessage(err.message);
      }
    };

    if (buildId) fetchBuild();
  }, [buildId, user, navigate]);

    const handleAddPart = async (componentId) => {
    try {
      const buildComponent = getBuildComponent(build, category);

      // a filled slot gets its part swapped, an empty slot gets a new one
      if (buildComponent) {
        await buildService.updateBuildComponent(buildComponent.id, { component_id: componentId });
      } else {
        await buildService.createBuildComponent(buildId, { component_id: componentId });
      }

      navigate(`/builds/${buildId}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

    return (
    <main>
      {buildId ? (
        <>
          <h1>Choose a {category}</h1>
          {build && <p className='muted'>for {build.name}</p>}
        </>
      ) : (
        <>
          <h1>Parts</h1>
          <div className='actions filters'>
            <button
              className={selectedCategory === '' ? 'button' : 'button button-outline'}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {CATEGORIES.map((categoryName) => (
              <button
                className={selectedCategory === categoryName ? 'button' : 'button button-outline'}
                key={categoryName}
                onClick={() => setSelectedCategory(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </>
      )}

      {message && <p className='message'>{message}</p>}

            <ul className='rows'>
        {components.map((component) => (
          <li className='row part' key={component.id}>
            <div>
              <h2>{component.brand} {component.name}</h2>
              <p className='muted'>
                {component.category}
                {getSpecs(component) && ` · ${getSpecs(component)}`}
              </p>
            </div>
            <span className='price'>{formatPrice(component.price)}</span>
            {build && (
              <button className='button button-success' onClick={() => handleAddPart(component.id)}>Add</button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default PartList;