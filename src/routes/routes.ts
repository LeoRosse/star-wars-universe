import React from 'react';
const Test = React.lazy(() => import('../components/test'));
const Characters = React.lazy(() => import('characters/Characters'));
const Planets = React.lazy(() => import('planets/Planets'));

const routes = [
  {
    path: '/',
    component: Test,
    exact: true,
  },
  {
    path: '/characters',
    component: Characters,
    exact: true,
  },
  {
    path: '/planets',
    component: Planets,
    exact: true,
  },
];

export default routes;
