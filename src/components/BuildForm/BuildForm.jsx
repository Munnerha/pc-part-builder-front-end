import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import * as buildService from '../../services/buildService';
import { UserContext } from '../../contexts/UserContext';

const BuildForm = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const build = await buildService.show(buildId);

        // only the owner can open the edit form
        if (build.user.id !== Number(user.sub)) return navigate(`/builds/${buildId}`);

        setFormData({ name: build.name, description: build.description || '' });
      } catch (err) {
        setMessage(err.message);
      }
    };

    // with a build id in the URL this is the edit form
    if (buildId) fetchBuild();

    // empties the form when leaving the edit page
    return () => setFormData({ name: '', description: '' });
  }, [buildId, user, navigate]);

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const savedBuild = buildId
        ? await buildService.update(buildId, formData)
        : await buildService.create(formData);
      navigate(`/builds/${savedBuild.id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className='narrow'>
      <h1>{buildId ? 'Edit Build' : 'New Build'}</h1>
      {message && <p className='message'>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          value={formData.name}
          name='name'
          onChange={handleChange}
          required
        />
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          id='description'
          value={formData.description}
          name='description'
          onChange={handleChange}
        />
        <div className='actions'>
          <button className='button'>{buildId ? 'Save' : 'Create Build'}</button>
          <Link className='button button-outline' to={buildId ? `/builds/${buildId}` : '/builds'}>Cancel</Link>
        </div>
      </form>
    </main>
  );
};

export default BuildForm;