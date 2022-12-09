import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";
import ChefProfileStore from "./chefStores/profile-setup";
import ChefSettingsStore from "./chefStores/settings-store";
import BookingsStore from "./bookings-store";
import CustomerSettingsStore from "./customerStores/settings-store";
import ChefDashboardStore from "./chefStores/dashboard-store";
import ChefApi from "../services/chef/chef-api";

class RootStore {
  chefApi: ChefApi;
  authStore: AuthStore;
  searchStore: SearchStore;
  chefDashboardStore: ChefDashboardStore;
  bookingsStore: BookingsStore;
  chefProfileStore: ChefProfileStore;
  chefSettingsStore: ChefSettingsStore;
  customerSettingsStore: CustomerSettingsStore;

  constructor() {
    this.chefApi = new ChefApi()
    this.chefApi.setup()
    this.authStore = new AuthStore(this)
    this.searchStore = new SearchStore(this)
    this.chefDashboardStore = new ChefDashboardStore(this)
    this.bookingsStore = new BookingsStore(this)
    this.chefProfileStore = new ChefProfileStore(this)
    this.chefSettingsStore = new ChefSettingsStore(this)
    this.customerSettingsStore = new CustomerSettingsStore(this)
  }
}

const rootStore = new RootStore()
export default rootStore
