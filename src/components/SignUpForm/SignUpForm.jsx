import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
  });

  const { username, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp({ username, email, password });
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf);
  };

    return (
    <main className='narrow'>
      <h1>Sign Up</h1>
      {message && <p className='message'>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          value={username}
          name='username'
          onChange={handleChange}
          required
        />
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          value={email}
          name='email'
          onChange={handleChange}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          name='password'
          onChange={handleChange}
          required
        />
        <label htmlFor='confirm'>Confirm Password</label>
        <input
          type='password'
          id='confirm'
          value={passwordConf}
          name='passwordConf'
          onChange={handleChange}
          required
        />
        <button className='button' disabled={isFormInvalid()}>Sign Up</button>
      </form>
      <p>Have an account? <Link to='/sign-in'>Sign In</Link></p>
    </main>
  );
};

export default SignUpForm;