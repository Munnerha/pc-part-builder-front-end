import { useContext, useEffect, useState } from 'react';

import * as userService from '../../services/userService';
import { UserContext } from '../../contexts/UserContext';

const UserList = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(fetchedUsers);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchUsers();
  }, []);

    const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((listedUser) => listedUser.id !== userId));
    } catch (err) {
      setMessage(err.message);
    }
  };

    return (
    <main>
      <h1>Users</h1>
      {message && <p className='message'>{message}</p>}
      <ul className='rows'>
        {users.map((listedUser) => (
          <li className='row user' key={listedUser.id}>
            <span>{listedUser.username}</span>
            <span className='muted'>{listedUser.email}</span>
            <span className='muted'>{listedUser.role}</span>
            {/* an admin can't delete their own account */}
            {listedUser.id !== Number(user.sub) && (
              <button className='button button-danger' onClick={() => handleDeleteUser(listedUser.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default UserList;