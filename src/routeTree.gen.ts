/* prettier-ignore-start */

/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// This file is auto-generated by TanStack Router
// Import Routes
import { Route as rootRoute } from './routes/__root';
import { Route as AppImport } from './routes/_app';
import { Route as AppProjectsProjectIdImport } from './routes/_app/projects/_$projectId';
import { Route as AppProjectsProjectIdDashboardEditImport } from './routes/_app/projects/_$projectId/dashboard/edit';
import { Route as AppProjectsProjectIdDashboardIndexImport } from './routes/_app/projects/_$projectId/dashboard/index';
import { Route as AppProjectsProjectIdDatastreamsImport } from './routes/_app/projects/_$projectId/datastreams';
import { Route as AppProjectsProjectIdDevicesImport } from './routes/_app/projects/_$projectId/devices';
import { Route as AppProjectsProjectIdIndexImport } from './routes/_app/projects/_$projectId/index';
import { Route as AppProjectsIndexImport } from './routes/_app/projects/index';
import { Route as AuthImport } from './routes/_auth';
import { Route as AuthAuthLoginImport } from './routes/_auth/auth/login';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any);

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const AppProjectsIndexRoute = AppProjectsIndexImport.update({
  path: '/projects/',
  getParentRoute: () => AppRoute,
} as any);

const AuthAuthLoginRoute = AuthAuthLoginImport.update({
  path: '/auth/login',
  getParentRoute: () => AuthRoute,
} as any);

const AppProjectsProjectIdRoute = AppProjectsProjectIdImport.update({
  path: '/projects/$projectId',
  getParentRoute: () => AppRoute,
} as any);

const AppProjectsProjectIdIndexRoute = AppProjectsProjectIdIndexImport.update({
  path: '/',
  getParentRoute: () => AppProjectsProjectIdRoute,
} as any);

const AppProjectsProjectIdDevicesRoute =
  AppProjectsProjectIdDevicesImport.update({
    path: '/devices',
    getParentRoute: () => AppProjectsProjectIdRoute,
  } as any);

const AppProjectsProjectIdDatastreamsRoute =
  AppProjectsProjectIdDatastreamsImport.update({
    path: '/datastreams',
    getParentRoute: () => AppProjectsProjectIdRoute,
  } as any);

const AppProjectsProjectIdDashboardIndexRoute =
  AppProjectsProjectIdDashboardIndexImport.update({
    path: '/dashboard/',
    getParentRoute: () => AppProjectsProjectIdRoute,
  } as any);

const AppProjectsProjectIdDashboardEditRoute =
  AppProjectsProjectIdDashboardEditImport.update({
    path: '/dashboard/edit',
    getParentRoute: () => AppProjectsProjectIdRoute,
  } as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/_app': {
      preLoaderRoute: typeof AppImport;
      parentRoute: typeof rootRoute;
    };
    '/_auth': {
      preLoaderRoute: typeof AuthImport;
      parentRoute: typeof rootRoute;
    };
    '/_app/projects/_$projectId': {
      preLoaderRoute: typeof AppProjectsProjectIdImport;
      parentRoute: typeof AppImport;
    };
    '/_auth/auth/login': {
      preLoaderRoute: typeof AuthAuthLoginImport;
      parentRoute: typeof AuthImport;
    };
    '/_app/projects/': {
      preLoaderRoute: typeof AppProjectsIndexImport;
      parentRoute: typeof AppImport;
    };
    '/_app/projects/_$projectId/datastreams': {
      preLoaderRoute: typeof AppProjectsProjectIdDatastreamsImport;
      parentRoute: typeof AppProjectsProjectIdImport;
    };
    '/_app/projects/_$projectId/devices': {
      preLoaderRoute: typeof AppProjectsProjectIdDevicesImport;
      parentRoute: typeof AppProjectsProjectIdImport;
    };
    '/_app/projects/_$projectId/': {
      preLoaderRoute: typeof AppProjectsProjectIdIndexImport;
      parentRoute: typeof AppProjectsProjectIdImport;
    };
    '/_app/projects/_$projectId/dashboard/edit': {
      preLoaderRoute: typeof AppProjectsProjectIdDashboardEditImport;
      parentRoute: typeof AppProjectsProjectIdImport;
    };
    '/_app/projects/_$projectId/dashboard/': {
      preLoaderRoute: typeof AppProjectsProjectIdDashboardIndexImport;
      parentRoute: typeof AppProjectsProjectIdImport;
    };
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AppRoute.addChildren([
    AppProjectsProjectIdRoute.addChildren([
      AppProjectsProjectIdDatastreamsRoute,
      AppProjectsProjectIdDevicesRoute,
      AppProjectsProjectIdIndexRoute,
      AppProjectsProjectIdDashboardEditRoute,
      AppProjectsProjectIdDashboardIndexRoute,
    ]),
    AppProjectsIndexRoute,
  ]),
  AuthRoute.addChildren([AuthAuthLoginRoute]),
]);

/* prettier-ignore-end */
