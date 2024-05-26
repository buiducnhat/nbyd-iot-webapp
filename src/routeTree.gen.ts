/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppImport } from './routes/_app'
import { Route as IndexImport } from './routes/index'
import { Route as AuthLayoutImport } from './routes/auth/_layout'
import { Route as AppProjectsIndexImport } from './routes/_app/projects/index'
import { Route as AppProfileIndexImport } from './routes/_app/profile/index'
import { Route as AuthLayoutRegisterImport } from './routes/auth/_layout/register'
import { Route as AuthLayoutLoginImport } from './routes/auth/_layout/login'
import { Route as AppProjectsProjectIdLayoutImport } from './routes/_app/projects/$projectId/_layout'
import { Route as AppProjectsProjectIdLayoutIndexImport } from './routes/_app/projects/$projectId/_layout/index'
import { Route as AppProjectsProjectIdLayoutGatewaysImport } from './routes/_app/projects/$projectId/_layout/gateways'
import { Route as AppProjectsProjectIdLayoutDevicesImport } from './routes/_app/projects/$projectId/_layout/devices'
import { Route as AppProjectsProjectIdLayoutDashboardIndexImport } from './routes/_app/projects/$projectId/_layout/dashboard/index'
import { Route as AppProjectsProjectIdLayoutDashboardEditImport } from './routes/_app/projects/$projectId/_layout/dashboard/edit'

// Create Virtual Routes

const AuthImport = createFileRoute('/auth')()
const AppProjectsProjectIdImport = createFileRoute(
  '/_app/projects/$projectId',
)()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthLayoutRoute = AuthLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthRoute,
} as any)

const AppProjectsProjectIdRoute = AppProjectsProjectIdImport.update({
  path: '/projects/$projectId',
  getParentRoute: () => AppRoute,
} as any)

const AppProjectsIndexRoute = AppProjectsIndexImport.update({
  path: '/projects/',
  getParentRoute: () => AppRoute,
} as any)

const AppProfileIndexRoute = AppProfileIndexImport.update({
  path: '/profile/',
  getParentRoute: () => AppRoute,
} as any)

const AuthLayoutRegisterRoute = AuthLayoutRegisterImport.update({
  path: '/register',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutLoginRoute = AuthLayoutLoginImport.update({
  path: '/login',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AppProjectsProjectIdLayoutRoute = AppProjectsProjectIdLayoutImport.update(
  {
    id: '/_layout',
    getParentRoute: () => AppProjectsProjectIdRoute,
  } as any,
)

const AppProjectsProjectIdLayoutIndexRoute =
  AppProjectsProjectIdLayoutIndexImport.update({
    path: '/',
    getParentRoute: () => AppProjectsProjectIdLayoutRoute,
  } as any)

const AppProjectsProjectIdLayoutGatewaysRoute =
  AppProjectsProjectIdLayoutGatewaysImport.update({
    path: '/gateways',
    getParentRoute: () => AppProjectsProjectIdLayoutRoute,
  } as any)

const AppProjectsProjectIdLayoutDevicesRoute =
  AppProjectsProjectIdLayoutDevicesImport.update({
    path: '/devices',
    getParentRoute: () => AppProjectsProjectIdLayoutRoute,
  } as any)

const AppProjectsProjectIdLayoutDashboardIndexRoute =
  AppProjectsProjectIdLayoutDashboardIndexImport.update({
    path: '/dashboard/',
    getParentRoute: () => AppProjectsProjectIdLayoutRoute,
  } as any)

const AppProjectsProjectIdLayoutDashboardEditRoute =
  AppProjectsProjectIdLayoutDashboardEditImport.update({
    path: '/dashboard/edit',
    getParentRoute: () => AppProjectsProjectIdLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/auth/_layout': {
      id: '/auth/_layout'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthLayoutImport
      parentRoute: typeof AuthRoute
    }
    '/auth/_layout/login': {
      id: '/auth/_layout/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLayoutLoginImport
      parentRoute: typeof AuthLayoutImport
    }
    '/auth/_layout/register': {
      id: '/auth/_layout/register'
      path: '/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthLayoutRegisterImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_app/profile/': {
      id: '/_app/profile/'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AppProfileIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/projects/': {
      id: '/_app/projects/'
      path: '/projects'
      fullPath: '/projects'
      preLoaderRoute: typeof AppProjectsIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/projects/$projectId': {
      id: '/_app/projects/$projectId'
      path: '/projects/$projectId'
      fullPath: '/projects/$projectId'
      preLoaderRoute: typeof AppProjectsProjectIdImport
      parentRoute: typeof AppImport
    }
    '/_app/projects/$projectId/_layout': {
      id: '/_app/projects/$projectId/_layout'
      path: '/projects/$projectId'
      fullPath: '/projects/$projectId'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutImport
      parentRoute: typeof AppProjectsProjectIdRoute
    }
    '/_app/projects/$projectId/_layout/devices': {
      id: '/_app/projects/$projectId/_layout/devices'
      path: '/devices'
      fullPath: '/projects/$projectId/devices'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutDevicesImport
      parentRoute: typeof AppProjectsProjectIdLayoutImport
    }
    '/_app/projects/$projectId/_layout/gateways': {
      id: '/_app/projects/$projectId/_layout/gateways'
      path: '/gateways'
      fullPath: '/projects/$projectId/gateways'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutGatewaysImport
      parentRoute: typeof AppProjectsProjectIdLayoutImport
    }
    '/_app/projects/$projectId/_layout/': {
      id: '/_app/projects/$projectId/_layout/'
      path: '/'
      fullPath: '/projects/$projectId/'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutIndexImport
      parentRoute: typeof AppProjectsProjectIdLayoutImport
    }
    '/_app/projects/$projectId/_layout/dashboard/edit': {
      id: '/_app/projects/$projectId/_layout/dashboard/edit'
      path: '/dashboard/edit'
      fullPath: '/projects/$projectId/dashboard/edit'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutDashboardEditImport
      parentRoute: typeof AppProjectsProjectIdLayoutImport
    }
    '/_app/projects/$projectId/_layout/dashboard/': {
      id: '/_app/projects/$projectId/_layout/dashboard/'
      path: '/dashboard'
      fullPath: '/projects/$projectId/dashboard'
      preLoaderRoute: typeof AppProjectsProjectIdLayoutDashboardIndexImport
      parentRoute: typeof AppProjectsProjectIdLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AppRoute: AppRoute.addChildren({
    AppProfileIndexRoute,
    AppProjectsIndexRoute,
    AppProjectsProjectIdRoute: AppProjectsProjectIdRoute.addChildren({
      AppProjectsProjectIdLayoutRoute:
        AppProjectsProjectIdLayoutRoute.addChildren({
          AppProjectsProjectIdLayoutDevicesRoute,
          AppProjectsProjectIdLayoutGatewaysRoute,
          AppProjectsProjectIdLayoutIndexRoute,
          AppProjectsProjectIdLayoutDashboardEditRoute,
          AppProjectsProjectIdLayoutDashboardIndexRoute,
        }),
    }),
  }),
  AuthRoute: AuthRoute.addChildren({
    AuthLayoutRoute: AuthLayoutRoute.addChildren({
      AuthLayoutLoginRoute,
      AuthLayoutRegisterRoute,
    }),
  }),
})

/* prettier-ignore-end */
