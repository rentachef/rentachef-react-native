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
  url: 'http://rentachefdevelop-env.eba-rzrqkwm8.us-east-1.elasticbeanstalk.com/api/v1/',
  //url: 'http://192.168.0.200:3000/api/v1/',
  timeout: DEFAULT_TIMEOUT,
}

export const CHEF_REVIEWS: ApiConfig = {
  url: '/findCooks?latitude=1&longitude=1&searchradius=5&cuisines=INDO_PAK&cuisines=VIETNAMESE&startIndex=1&endIndex=5',
  timeout: DEFAULT_TIMEOUT
}
