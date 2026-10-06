import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className='narrow'>
      <h1>Sign In</h1>
      {message && <p className='message'>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          value={formData.username}
          name='username'
          onChange={handleChange}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={formData.password}
          name='password'
          onChange={handleChange}
          required
        />
        <button className='button'>Sign In</button>
      </form>
      <p>No account? <Link to='/sign-up'>Sign Up</Link></p>
    </main>
  );
};

export default SignInForm;
