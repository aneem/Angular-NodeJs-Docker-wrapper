export class Environment {
  environmentName: string;
  production: boolean;
  skipAuthenticationChecks: boolean;
  skipAuthorizationChecks: boolean;
  api: string;
  sentryDetails: SentryDetails;
}
class SentryDetails {
  url?: string;
}
