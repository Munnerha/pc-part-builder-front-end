import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import BuildList from './components/BuildList/BuildList';
import BuildForm from './components/BuildForm/BuildForm';
import BuildDetails from './components/BuildDetails/BuildDetails';
import PartList from './components/PartList/PartList';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <BuildList /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/builds' element={<BuildList />} />
        <Route path='/builds/new' element={user ? <BuildForm /> : <Navigate to='/sign-in' />} />
        <Route path='/builds/:buildId/edit' element={user ? <BuildForm /> : <Navigate to='/sign-in' />} />
        <Route path='/builds/:buildId' element={<BuildDetails />} />
        <Route path='/builds/:buildId/choose/:category' element={user ? <PartList /> : <Navigate to='/sign-in' />} />
        <Route path='/components' element={<PartList />} />
      </Routes>
    </>
  );
};

export default App;