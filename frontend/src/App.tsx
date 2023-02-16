import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import WithAuth from './components/WithAuth'
import CompetenceManager from './pages/CompetenceManager/CompetenceManager'
import Home from './pages/Home/Home'
import MigrateUser from './pages/MigrateUser/MigrateUser'
import Opportunity from './pages/Opportunity/Opportunity'
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signup/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WithAuth Page={Home} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/migrate-user" element={<MigrateUser />} />
          <Route
            path="/competences"
            element={<WithAuth allowedRoles={['applicant']} Page={CompetenceManager} />}
          />
          <Route
            path="/opportunity/:id"
            element={<WithAuth allowedRoles={['applicant']} Page={Opportunity} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
