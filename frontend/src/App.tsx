import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import WithAuth from './components/WithAuth'
import Home from './pages/Home/Home'

import Signin from './pages/Signin/Signin'
import Signup from './pages/Signup/Signup'
import MigrateUser from './pages/MigrateUser/MigrateUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WithAuth Page={Home} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/migrate-user" element={<MigrateUser />} />
          {/* <Route path="/account" element={<WithAuth Page={Account} />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
