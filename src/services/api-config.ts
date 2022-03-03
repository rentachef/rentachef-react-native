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
  url: 'http://rentachefuser-dev-env.us-east-1.elasticbeanstalk.com/',
  timeout: DEFAULT_TIMEOUT,
}

export const CHEF_REVIEWS: ApiConfig = {
  url: '/findCooks?latitude=1&longitude=1&searchradius=5&cuisines=INDO_PAK&cuisines=VIETNAMESE&startIndex=1&endIndex=5',
  timeout: DEFAULT_TIMEOUT
}
