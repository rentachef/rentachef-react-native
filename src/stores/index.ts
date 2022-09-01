import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";
import ChefReviewsStore from "./chefStores/reviews-store";
import ChefProfileStore from "./chefStores/profile-setup";
import ChefSettingsStore from "./chefStores/settings-store";
import ChefBookingsStore from "./chefStores/bookings-store";
import CustomerSettingsStore from "./customerStores/settings-store";

class RootStore {
  authStore: AuthStore;
  searchStore: SearchStore;
  chefReviewsStore: ChefReviewsStore;
  chefBookingsStore: ChefBookingsStore;
  chefProfileStore: ChefProfileStore;
  chefSettingsStore: ChefSettingsStore;
  customerSettingsStore: CustomerSettingsStore;
  constructor() {
    this.authStore = new AuthStore()
    this.searchStore = new SearchStore()
    this.chefReviewsStore = new ChefReviewsStore()
    this.chefBookingsStore = new ChefBookingsStore()
    this.chefProfileStore = new ChefProfileStore()
    this.chefSettingsStore = new ChefSettingsStore()
    this.customerSettingsStore = new CustomerSettingsStore()
  }
}

const rootStore = new RootStore()
export default rootStore

