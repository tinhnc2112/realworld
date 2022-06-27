import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routers';
import DefaultLayout from '~/components/Layout/DefaultLayout';
import RequireAuth from './components/Require/RequireAuth';

function App() {
   return (
      <Router>
         <div className="App">
            <Routes>
               {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  let Layout = DefaultLayout;
                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <Layout>
                              <Page />
                           </Layout>
                        }
                     />
                  );
               })}
               {privateRoutes.map((route, index) => {
                  const Page = route.component;
                  let Layout = DefaultLayout;
                  return (
                     <Route key={index} element={<RequireAuth />}>
                        <Route
                           path={route.path}
                           element={
                              <Layout>
                                 <Page />
                              </Layout>
                           }
                        />
                     </Route>
                  );
               })}
            </Routes>
         </div>
      </Router>
   );
}

export default App;
