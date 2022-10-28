import {action, makeAutoObservable, observable} from "mobx";
import ChefProfileSetup, {
  AvailabilitySetup,
  WeekDayAndTime,
  DayAndTime,
  WorkZoneSetup, BankAccount, BackgroundCheck
} from "../../models/chef/ChefProfileSetup";
import AuthStore from "../AuthStore";
import {isEmpty} from "lodash";

class ChefProfileStore {
  rootStore: any;
  authStore: any;

  constructor(rootStore: any, authStore: AuthStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.authStore = authStore
  }

  getChefProfile = () => {
    // @ts-ignore
    this.rootStore.chefApi.getChefProfile().then((r: any) => {
      console.log("chefProfile from API", r.data)
      if(!!r) {
        this.setChefWorkZone(r.data.workZone)
        this.setChefAvailability(r.data.availability)
        this.setChefBankAccount(r.data.bankAccount)
        this.setChefBackgroundCheck(r.data.backgroundCheck)
      }

      return r
    })
  }

  @observable workZone?: WorkZoneSetup

  @observable availability?: AvailabilitySetup

  @observable bankAccount?: BankAccount

  @observable backgroundCheck?: BackgroundCheck

  @action retrieveChefAvailability = () => {
    if(!!this.availability) {
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

  @action saveChefWorkZone = async (data: WorkZoneSetup) => {
    const response = await this.rootStore.chefApi.setChefWorkZone(data)
    if(response.ok)
      this.workZone = Object.assign({}, data)
  }

  @action saveChefAvailability = async (data: AvailabilitySetup) => {
    const response = await this.rootStore.chefApi.setChefAvailability(data)
    if(response.ok)
      this.availability = Object.assign({}, data)
  }

  @action saveChefBankAccount = async (data: BankAccount) => {
    const response = await this.rootStore.chefApi.setChefBankAccount(data)
    if(response.ok)
      this.bankAccount = Object.assign({}, data)
  }

  @action saveChefBackgroundCheck = async (data: BackgroundCheck) => {
    const response = await this.rootStore.chefApi.setChefBackgroundCheck(data)
    if(response.ok)
      this.backgroundCheck = Object.assign({}, data)
  }

  @action setChefAvailability = async (data: AvailabilitySetup) => {
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
}

export default ChefProfileStore
