import ChefApi from "../../services/chef/chef-api";
import {action, makeAutoObservable, observable} from "mobx";
import {AuthProps} from "../AuthStore";
import ChefProfileSetup, {
  AvailabilitySetup,
  WeekDayAndTime,
  DayAndTime,
  WorkZoneSetup, BankAccount, BackgroundCheck
} from "../../models/chef/ChefProfileSetup";

const chefAPI = new ChefApi()

class ChefProfileStore {
  rootStore: any;
  chefApi: any;

  constructor(/*rootStore: any*/) {
    makeAutoObservable(this)
    this.chefApi = new ChefApi()
    chefAPI.setup()
  }

  getChefProfile = () => {
    // @ts-ignore
    chefAPI.getChefProfile().then((r: ChefProfileSetup) => {
      console.log("r", r)
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
    return !!this.backgroundCheck ? {...this.backgroundCheck, socialNumber: this.backgroundCheck.socialNumber?.toString() }
      : this.backgroundCheck;
  }

  @action retreiveChefBankAccount = () => {
    return !!this.bankAccount ? {...this.bankAccount, accountNumber: this.bankAccount.accountNumber?.toString(), routingNumber: this.bankAccount.routingNumber.toString() }
      : this.bankAccount;
  }

  @action setChefWorkZone = (data: WorkZoneSetup) => {
    this.workZone = Object.assign({}, data)
  }

  @action setChefAvailability = (data: AvailabilitySetup) => {
    this.availability = Object.assign({}, data)
  }

  @action setChefBankAccount = (data: BankAccount) => {
    this.bankAccount = Object.assign({}, data)
  }

  @action setChefBackgroundCheck = (data: BackgroundCheck) => {
    this.backgroundCheck = Object.assign({}, data)
  }
}

export default ChefProfileStore
