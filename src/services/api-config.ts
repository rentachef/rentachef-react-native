/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string;

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
}

const DEFAULT_TIMEOUT = 30000

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: 'http://rentachefdevelop-env.eba-rzrqkwm8.us-east-1.elasticbeanstalk.com/api/v1/', //develop
  //url: 'http://rentachef-production-env.eba-rzrqkwm8.us-east-1.elasticbeanstalk.com/api/v1/', //production
  //url: 'http://localhost:3000/api/v1/', //local
  timeout: DEFAULT_TIMEOUT,
}