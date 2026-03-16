import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsRoot } from '@netflix-internal/xd-settings';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DataWrapper } from '@/contexts/data';
import { UIWrapper } from '@/contexts/ui';
import PageGrid from '@/tv/pages/page-grid';
import TvIndex from '@/tv/tv-index';
import Loader from '@/tv/common/loader';
import { settingStores } from '@/tv/settings/settings';
import ControllerIndex from '@/controller/controller-index';

import './index.css';

const LazyPage = lazy(() => import('./tv/pages/pages'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SettingsRoot settingsStore={settingStores}>
        <DataWrapper>
          <UIWrapper>
            <TvIndex />
          </UIWrapper>
        </DataWrapper>
      </SettingsRoot>
    ),
    children: [
      {
        path: '/',
        element: <LazyPage pageId="social-on-controller" focus="mobile" />,
      },
      {
        path: 'menu',
        element: <PageGrid />,
      },
      {
        path: 'f1',
        element: <LazyPage pageId="create-handle" focus="mobile" />,
      },
      {
        path: 'f2',
        element: <LazyPage pageId="finding-achievement" focus="mobile" />,
      },
      {
        path: 'f3',
        element: <LazyPage pageId="friend-invitation" focus="mobile" />,
      },
      {
        path: 'f4',
        element: <LazyPage pageId="unlocking-achievement" focus="mobile" />,
      },
      {
        path: 'f5',
        element: <LazyPage pageId="create-handle" focus="tv" />,
      },
      {
        path: 'f6',
        element: <LazyPage pageId="finding-achievement" focus="tv" />,
      },
      {
        path: 'f7',
        element: <LazyPage pageId="friend-invitation" focus="tv" />,
      },
      {
        path: 'f8',
        element: <LazyPage pageId="unlocking-achievement" focus="tv" />,
      },
      {
        path: 'f9',
        element: <LazyPage pageId="social-on-controller" focus="mobile" />,
      },
      {
        path: 'f10',
        element: <LazyPage pageId="social-on-controller" focus="tv" />,
      },
      {
        path: 'fifa-menu',
        element: <LazyPage pageId="fifa-main-menu" focus="tv" />,
      },
    ],
  },
  {
    path: 'controller',
    element: (
      <SettingsRoot settingsStore={settingStores}>
        <DataWrapper>
          <UIWrapper>
            <ControllerIndex />
          </UIWrapper>
        </DataWrapper>
      </SettingsRoot>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);
