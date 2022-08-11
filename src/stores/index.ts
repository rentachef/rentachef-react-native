import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";
import ChefReviewsStore from "./chefStores/reviews-store";
import ChefProfileStore from "./chefStores/profile-setup";
import ChefSettingsStore from "./chefStores/settings-store";
import ChefBookingsStore from "./chefStores/bookings-store";

class RootStore {
  authStore: AuthStore;
  searchStore: SearchStore;
  chefReviewsStore: ChefReviewsStore;
  chefBookingsStore: ChefBookingsStore;
  chefProfileStore: ChefProfileStore;
  chefSettingsStore: ChefSettingsStore;
  constructor() {
    this.authStore = new AuthStore()
    this.searchStore = new SearchStore()
    this.chefReviewsStore = new ChefReviewsStore()
    this.chefBookingsStore = new ChefBookingsStore()
    this.chefProfileStore = new ChefProfileStore()
    this.chefSettingsStore = new ChefSettingsStore()
  }
}

const rootStore = new RootStore()
export default rootStore

