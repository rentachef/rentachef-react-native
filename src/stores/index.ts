import authStore from './AuthStore'

import { observable } from 'mobx'

class RootStore {
  @observable authStore = authStore
}

const rootStore = new RootStore
export default rootStore

