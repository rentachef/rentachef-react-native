import {ApiConfig, CHEF_REVIEWS, DEFAULT_API_CONFIG} from "../api-config";
import {ApisauceInstance, create} from "apisauce";
import Toast from '../../components/toast/toast'
import {getGeneralApiProblem} from "../api.problem";

export default class ChefApi {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor (config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.config.url = this.config.url ? this.config.url : DEFAULT_API_CONFIG.url
  }

  // eslint-disable-next-line @typescript-eslint/member-naming
  private badResponseHandler(response: any) {
    if (response.status != 200 && response.status != 401) {
      if  (response && response.data && response.data.sprocErrorCode) {
        const translatedMsg = ''
        if (translatedMsg == response.data.sprocErrorCode )
          Toast.notifyError(response.data.message || response.data.error)
        else
          Toast.notifyError(translatedMsg || 'An error occurred, please try again')
      }
      else if  (response && response.data && response.data.code) {
        const translatedMsg = ''
        if (translatedMsg == response.data.code )
          Toast.notifyError(response.data.message || response.data.error)
        else
          Toast.notifyError(translatedMsg || 'An error occurred, please try again')
      }
      else if  (response && response.data && response.data.message) {
        Toast.notifyError(response.data.translate_key && response.data.message)
      }
      else if  (response && response.data && response.data.error) {
        if( typeof response.data.error === 'object' && response.data.error.message) {
          Toast.notifyError(response.data.error.message)
        } else {
          Toast.notifyError(response.data.error)
        }
      }
      else if (typeof response.message === 'string')
        Toast.notifyError(response.message)
      else if (response.originalError && response.originalError.message && typeof response.originalError.message === 'string')
        Toast.notifyError(response.originalError.message)
    }
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup () {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
        appCode: 'RAC'
      },
    })
    this.apisauce.addMonitor(this.badResponseHandler)
  }

  static createDataResponse (data: any, header: string = ''): any {
    return {
      kind: 'ok',
      data: data,
      header: header,
    }
  }

  async getChefReviews() {
    //const url = CHEF_REVIEWS.url
    const url = 'http://renta-loadb-1nm9ghuov34vb-81868913c5443b9a.elb.us-east-1.amazonaws.com:8080/retrieveBookings?userId=1'
    const response = await this.apisauce.get(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }
    if(response.status === 204){
      return
    }

    return response
  }

  async getChefBookings() {
    //const url = CHEF_REVIEWS.url
    const url = 'http://renta-loadb-1nm9ghuov34vb-81868913c5443b9a.elb.us-east-1.amazonaws.com:8080/retrieveBookings?userId=1'
    const response = await this.apisauce.get(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }
    if(response.status === 204){
      return
    }

    return response
  }

  async getChefProfile() { //TODO
    /*const url = 'asd'
    const response = await this.apisauce.get(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }
    if(response.status === 204){
      return
    }

    return response*/
    return
  }

  async getChefSettings() { //TODO
    return
  }

}
