import {action, makeAutoObservable, observable} from "mobx";
import ChefProfileSetup, {
  AvailabilitySetup,
  WeekDayAndTime,
  DayAndTime,
  WorkZoneSetup, BankAccount, BackgroundCheck, PickupDetails
} from "../../models/chef/ChefProfileSetup";
import {isEmpty} from "lodash";

class ChefProfileStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  getChefProfile = () => {
    // @ts-ignore
    this.rootStore.chefApi.getChefProfile().then((r: any) => {
      console.log("chefProfile from API", r.data)
      if(!!r) {
        this.setChefWorkZone(r.data.workZone || {})
        this.setChefAvailability(r.data.availability || {})
        this.setChefBankAccount(r.data.bankAccount || {})
        this.setChefBackgroundCheck(r.data.backgroundCheck || {})
        this.setChefPickupDetails(r.data.pickupDetails || {})
        this.hourlyRate = r.data.hourlyRate
      }

      return r
    })
  }

  @observable workZone?: WorkZoneSetup

  @observable availability?: AvailabilitySetup

  @observable bankAccount?: BankAccount

  @observable backgroundCheck?: BackgroundCheck

  @observable pickupDetails?: PickupDetails

  @observable hourlyRate?: Number

  @action retrieveChefAvailability = () => {
    if(!isEmpty(this.availability)) {
      this.availability.weeklyHours = this.availability?.weeklyHours?.map((wh: WeekDayAndTime) => {
        return {
          day: wh.day,
          timing: {
            from: new Date(wh.timing.from),
            to: new Date(wh.timing.to)
          }
        }
      }) || undefined;
      this.availability.dateOverrides = this.availability?.dateOverrides?.map((dt: DayAndTime) => {
        return {
          day: new Date(dt.day),
          timing: {
            from: new Date(dt.timing.from),
            to: new Date(dt.timing.to)
          }
        }
      }) || undefined;
      return this.availability;
    } else
      return this.availability;
  }

  @action retrieveChefBackgroundCheck = () => {
    return !isEmpty(this.backgroundCheck) ? {...this.backgroundCheck, socialNumber: this.backgroundCheck?.socialNumber?.toString() }
      : this.backgroundCheck;
  }

  @action retreiveChefBankAccount = () => {
    console.log('BANK ACCOUNT', this.bankAccount)
    return !isEmpty(this.bankAccount) ? {...this.bankAccount, accountNumber: this.bankAccount?.accountNumber?.toString(), routingNumber: this.bankAccount?.routingNumber?.toString() }
      : this.bankAccount;
  }

  @action retrieveChefPickupDetails = () => {
    return !isEmpty(this.pickupDetails) ? { ...this.pickupDetails, timing: { from: new Date(this.pickupDetails.timing?.from), to: new Date(this.pickupDetails.timing?.to )}}
      : this.pickupDetails;
  }

  @action saveChefWorkZone = async (data: WorkZoneSetup) => {
    const response = await this.rootStore.chefApi.setChefWorkZone(data)
    if(response.ok) {
      this.setChefWorkZone(data)
      return 'SUCCESS'
    } else
      return response.error
  }

  @action saveChefAvailability = async (data: AvailabilitySetup) => {
    const response = await this.rootStore.chefApi.setChefAvailability(data)
    if(response.ok)
      this.setChefAvailability(data)
  }

  @action saveChefBankAccount = async (data: BankAccount) => {
    const response = await this.rootStore.chefApi.setChefBankAccount(data)
    if(response.ok) {
      this.setChefBankAccount(data)
      return 'SUCCESS'
    } else
      return response.error
  }

  @action saveChefBackgroundCheck = async (data: BackgroundCheck) => {
    const response = await this.rootStore.chefApi.setChefBackgroundCheck(data)
    if(response.ok) {
      this.setChefBackgroundCheck(data)
      return 'SUCCESS'
    } else
      return response.error
  }

  @action saveChefPickupDetails = async (data: PickupDetails) => {
    const response = await this.rootStore.chefApi.setChefPickupDetails(data)
    if(response.ok) {
      this.setChefPickupDetails(data)
      return 'SUCCESS'
    } else
      return response.error
  }

  @action setChefAvailability = (data: AvailabilitySetup) => {
    this.availability = Object.assign({}, data)
  }

  @action setChefWorkZone = (data: WorkZoneSetup) => {
    this.workZone = Object.assign({}, data)
  }

  @action setChefBankAccount = (data: BankAccount) => {
    this.bankAccount = Object.assign({}, data)
  }

  @action setChefBackgroundCheck = (data: BackgroundCheck) => {
    this.backgroundCheck = Object.assign({}, data)
  }

  @action setChefPickupDetails = (data: PickupDetails) => {
    this.pickupDetails = Object.assign({}, data)
  }
}

export default ChefProfileStore
