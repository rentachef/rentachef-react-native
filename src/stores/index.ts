import AuthStore from "./AuthStore";
import SearchStore from "./SearchStore";

class RootStore {
  private authStore: AuthStore;
  private searchStore: SearchStore;
  constructor() {
    this.authStore = new AuthStore()
    this.searchStore = new SearchStore()
  }
}

const rootStore = new RootStore()
export default rootStore

