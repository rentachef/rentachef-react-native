import {ApiConfig, DEFAULT_API_CONFIG} from "../api-config";
import {ApisauceInstance, create} from "apisauce";
import Toast from '../../components/toast/toast'
import {getGeneralApiProblem} from "../api.problem";
import {
  AvailabilitySetup,
  BackgroundCheck,
  BankAccount,
  PickupDetails,
  WorkZoneSetup
} from "../../models/chef/ChefProfileSetup";
import {Bio, Profile} from "../../models/chef/ChefSettings";
import {CustomerLocation, PaymentMethod, Preferences} from "../../models/user/CustomerSettings";
import BookingRequest from "../../models/BookingRequest";
import { PERMISSIONS, check } from "react-native-permissions";
import { Platform } from "react-native";

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
    this.setup()
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
    let config = {
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
        appCode: 'RAC'
      },
    }

    this.apisauce = create(config)
    this.apisauce.addMonitor(this.badResponseHandler)
    delete this.apisauce.headers['Authorization'] //for development proposes only
  }

  static createDataResponse (data: any, header: string = ''): any {
    return {
      kind: 'ok',
      data: data,
      header: header,
    }
  }

  setToken(token: string) {
    delete this.apisauce.headers['Authorization']
    this.apisauce.setHeader('Authorization', `Bearer ${token}`)
  }

  async saveDeviceToken(token: string) {
    const url = '/users/deviceToken'
    await this._post(url, { token, os: Platform.OS })
  }

  setBasic(token: string) {
    delete this.apisauce.headers['Authorization']
    this.apisauce.setHeader('Authorization', `Basic ${token}`)
  }

  logout() {
    console.log('logout, deleting authorization header...')
    delete this.apisauce.headers['Authorization']
  }

  async getChefReviews(chefId: string) {
    const url = `/bookings/reviews/${chefId}` //TODO url to const
    return await this._get(url)
  }

  async getChefEarnings() {
    const url = 'bookings/earnings'
    return await this._get(url)
  }

  async getChefBookings() {
    const url = '/bookings/chef/'
    return await this._get(url)
  }

  async getConsumerBookings() {
    const url = '/bookings/consumer/'
    return await this._get(url)
  }

  async getChefsByCuisine(cuisineId: string) {
    const url = `/cook/cuisine/${cuisineId}`
    return await this._get(url)
  }

  async updateBooking(id: string, update: any) {
    const url = `/bookings/${id}`
    return await this._put(url, update)
  }

  async book(booking: BookingRequest) {
    const url = '/bookings/book'
    return await this._post(url, booking)
  }

  async loginToApi(email: string, password: string) {
    const url = 'auth/login'
    const response = await this.apisauce.post(url, { email, password })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        this.logout()
        return problem
      }
    }
    if(response.status === 204) {
      return
    }

    return response.data
  }

  async registerUser(email: string, password: string, role: string, cognitoClientId: string) {
    const url = `auth/register/${role}`
    return await this._post(url, { email, password, cognitoClientId })
  }

  async getChefProfile() {
    const url = 'cook'
    return await this._get(url)
  }

  async getUserSettings() {
    const url = 'users/settings'
    return await this._get(url)
  }

  async getUserPaymentMethods() {
    const url = 'users/paymentMethods'
    return await this._get(url)
  }

  async addConsumerPaymentMethod(card: any) {
    const url = 'stripe/addCard'
    return await this._post(url, card)
  }

  async setDefaultPaymentMethod(cardId: string) {
    const url = `users/paymentMethods/default/${cardId}`
    return await this._put(url)
  }

  async chargeClient(chargeObject: any) {
    const url = 'stripe/charge'
    return await this._post(url, chargeObject)
  }

  async getCuisines() {
    const url = `cuisines/`
    return await this._get(url)
  }

  async getChefs() {
    const url = `cook/top/`
    return await this._get(url)
  }

  async getChefHourlyRate(id: string) {
    const url = `cook/hourlyRate/${id}`
    return await this._get(url)
  }

  //CHEF PROFILE SETUP
  async setChefWorkZone(data: WorkZoneSetup) {
    const url = `cook/workZone`
    return await this._post(url, data)
  }

  async setChefAvailability(data: AvailabilitySetup) {
    const url = `cook/availability`
    return await this._post(url, data)
  }

  async setChefBankAccount(data: BankAccount) {
    const url = `cook/bankAccount`
    return await this._post(url, data)
  }

  async setChefBackgroundCheck(data: BackgroundCheck) {
    const url = `cook/backgroundCheck`
    return await this._post(url, data)
  }

  async setChefPickupDetails(data: PickupDetails) {
    const url = `cook/pickupDetails`
    return await this._post(url, data)
  }

  //USER SETTINGS
  async setUserBio(data: Bio) {
    const url = `users/settings/bio`
    return await this._post(url, data)
  }

  async setUserProfile(data: Profile) {
    const url = `users/settings/profile`
    return await this._post(url, data)
  }

  async setUserPreferences(data: Preferences) {
    const url = `users/settings/preferences`
    return await this._post(url, data)
  }

  async setUserWallet(data: any) {
    const url = 'users/settings/preferences'
    return await this._post(url, data)
  }

  async setUserLocation(data: CustomerLocation) {
    const url = `users/settings/location`
    return await this._post(url, data)
  }

  async setBookingReview(data: any) {
    const url = `bookings/review`
    return await this._post(url, data)
  }

  async saveChatIfNotExists(chat: any) {
    const url = `chats/`
    return await this._post(url, chat)
  }

  async deleteAccount() {
    const url = `auth/deleteAccount`
    return await this._delete(url)
  }

  async getUserChats() {
    const url = `chats`
    return await this._get(url)
  }

  async refreshPassword(email: string, newPass: string) {
    const url = `auth/refreshPassword`
    return await this._put(url, { account: email, newPassword: newPass })
  }

  async sendPushNotification(pn: any) {
    const url = `chats/pn`
    return await this._post(url, pn)
  }

  async _get(url: string)  {
    const response = await this.apisauce.get(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        console.log(problem)
        return problem
      }
    }
    if(response.status === 204) {
      return
    }

    return response
  }

  async _post(url: string, data: any)  {
    const response = await this.apisauce.post(url, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        console.log(problem)
        return problem
      }
    }
    if(response.status === 204) {
      return
    }

    return response
  }

  async _delete(url: string)  {
    const response = await this.apisauce.delete(url)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        console.log(problem)
        return problem
      }
    }
    if(response.status === 204) {
      return
    }

    return response
  }

  async _put(url: string, data = null)  {
    const response = await this.apisauce.put(url, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        console.log(problem)
        return problem
      }
    }
    if(response.status === 204) {
      return
    }

    return response
  }
}
