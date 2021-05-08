import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navigation from './components/navigation';
import routes from './routes/routes';

const listOfLink = [
  {
    label: 'Test',
    path: '/',
  },
  {
    label: 'Characters',
    path: '/characters',
  },
  {
    label: 'Planets',
    path: '/planets',
  },
];

const App = () => (
  <BrowserRouter>
    <div>
      <h1>Star Wars Universe!</h1>
      <Navigation listOfLink={listOfLink} />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} exact={route.exact} />
          ))}
        </Switch>
      </React.Suspense>
    </div>
  </BrowserRouter>
);

export default App;
