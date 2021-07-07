import {action, observable} from 'mobx';

export interface AuthProps {
  username: string;
  password: string;
}
class AuthStore {
  @observable authInfo: AuthProps = {
    username: '',
    password: ''
  };

  @action setUserAuthInfo = (data: AuthProps, authObj: AuthProps) => {
    this.authInfo = Object.assign({}, data, authObj)
  }
}

const authStore = new AuthStore
export default authStore
