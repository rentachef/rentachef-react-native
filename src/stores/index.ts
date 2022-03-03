import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";
import ChefReviewsStore from "./chefStores/reviews-store";

class RootStore {
  private authStore: AuthStore;
  private searchStore: SearchStore;
  private chefReviewsStore: ChefReviewsStore;
  constructor() {
    this.authStore = new AuthStore()
    this.searchStore = new SearchStore()
    this.chefReviewsStore = new ChefReviewsStore()
  }
}

const rootStore = new RootStore()
export default rootStore

