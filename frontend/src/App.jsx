import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PostAddPage from './pages/PostAddPage'
import PostDetailPage from './pages/PostDetailPage';
import PostEditPage from './pages/PostEditPage';
import FollowersPage from './pages/FollowersPage';
import ProfileEditPage from './pages/ProfileEditPage';

import { Route, Routes } from 'react-router-dom'

import { Header } from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import AuthProvider from './context/AuthContext'
import { FollowProvider } from './context/FollowContext';

function App() {

  return (
    <>
    <AuthProvider> 
    <FollowProvider> 
        <Header/> 
        <Routes>
            <Route exact path="/login/" element={<LoginPage/>}/>
            <Route element={<ProtectedRoutes/>}>
                <Route exact path="/" element={<HomePage/>}/>
        
                <Route exact path="/users/:userId/profile/" element={<ProfilePage/>}/>
                <Route exact path="/users/:userId/profile/edit/"  
                    element={<ProfileEditPage/>}/>
                <Route exact path="/users/:userId/profile/followers/" 
                    element={<FollowersPage/>}/>
                <Route exact path="/addpost/" element={<PostAddPage/>}/>
                <Route exact path="/posts/:postId/" element={<PostDetailPage/>}/>
                <Route exact path="/posts/:postId/edit/" element={<PostEditPage/>}/>
            </Route>
        </Routes>
     </FollowProvider>
     </AuthProvider> 
  </>
  )
}

export default App
