import AuthStore from "./AuthStore";

class RootStore {
  private authStore: AuthStore;
  constructor() {
    this.authStore = new AuthStore(this)
  }
}

const rootStore = new RootStore()
export default rootStore

