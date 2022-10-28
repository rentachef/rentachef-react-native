import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";
import ChefReviewsStore from "./chefStores/reviews-store";
import ChefProfileStore from "./chefStores/profile-setup";
import ChefSettingsStore from "./chefStores/settings-store";
import ChefBookingsStore from "./chefStores/bookings-store";
import CustomerSettingsStore from "./customerStores/settings-store";
import ChefApi from "../services/chef/chef-api";

class RootStore {
  chefApi: ChefApi;
  authStore: AuthStore;
  searchStore: SearchStore;
  chefReviewsStore: ChefReviewsStore;
  chefBookingsStore: ChefBookingsStore;
  chefProfileStore: ChefProfileStore;
  chefSettingsStore: ChefSettingsStore;
  customerSettingsStore: CustomerSettingsStore;
  constructor() {
    this.chefApi = new ChefApi()
    this.chefApi.setup()
    this.authStore = new AuthStore(this)
    this.searchStore = new SearchStore(this)
    this.chefReviewsStore = new ChefReviewsStore(this)
    this.chefBookingsStore = new ChefBookingsStore(this)
    this.chefProfileStore = new ChefProfileStore(this, this.authStore)
    this.chefSettingsStore = new ChefSettingsStore(this)
    this.customerSettingsStore = new CustomerSettingsStore(this)
  }
}

const rootStore = new RootStore()
export default rootStore
