import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  environmentName: 'production',
  skipAuthenticationChecks: true,
  skipAuthorizationChecks: true,
  api: '/api/',
  sentryDetails: {
    url: undefined
  }
};
