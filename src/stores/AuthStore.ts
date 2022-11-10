import {action, makeAutoObservable, observable} from 'mobx';
import ChefApi from "../services/chef/chef-api";

export interface AuthProps {
  attributes: {
    email: string;
    phone_number: string;
  };
  userId: string;
  username: string;
  password: string;
  userDataKey: string;
  stripeClientToken: any;
  ephemeralKey: string;
  role: 'Consumer' | 'Cook' | '';
}

interface UserApiData {
  role: '',
  userId: '',
  password: ''
}

class AuthStore {
  rootStore: any;

  constructor(rootStore: any) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  /*
  * {
    "username": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2",
    "pool": {
        "userPoolId": "us-east-1_lIuuH6J2w",
        "clientId": "3j00jcfrjm71vnjhaieuj4r76n",
        "client": {
            "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
            "fetchOptions": {}
        },
        "advancedSecurityDataCollectionFlag": true
    },
    "Session": null,
    "client": {
        "endpoint": "https://cognito-idp.us-east-1.amazonaws.com/",
        "fetchOptions": {}
    },
    "signInUserSession": {
        "idToken": {
            "jwtToken": "eyJraWQiOiJaWk5PQWp2RWZCVjRDTTNIQVl2dkFxRkllaktrYkpacjExWUgxV0ZWUmY0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1YTNkZWQ4Yi1lNDU4LTRjYTgtOTAyMi1lMzgyNmFhYTFjYzIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfbEl1dUg2SjJ3IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6IjVhM2RlZDhiLWU0NTgtNGNhOC05MDIyLWUzODI2YWFhMWNjMiIsIm9yaWdpbl9qdGkiOiI1MzA0YmJlZi0yYzlmLTRkOGYtYmFiMy1jNzA2OGZiNzAyODgiLCJhdWQiOiIzajAwamNmcmptNzF2bmpoYWlldWo0cjc2biIsImV2ZW50X2lkIjoiZWVhNzdkNGMtZjFlZS00MDFiLWE0MGMtYWRkNjAyNGVhMzM2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Mjg5OTk1MzAsInBob25lX251bWJlciI6IisxNDA5NTI3MjUzMiIsImV4cCI6MTYyOTAwMzEzMCwiaWF0IjoxNjI4OTk5NTMwLCJqdGkiOiI3MDVhM2IwMi03MWVhLTRmYTctODVlOS00ZTE3YzdmYjhlYTIiLCJlbWFpbCI6ImZpdmVhcnVuQGdtYWlsLmNvbSJ9.W_hWw32tvdJBKGJIM1zwy9Wrm80NOmJXs3fQXiFVMUVnkElLAlmFCywc0h5ZzvwbDle9SR4dfxUQ6jUN7qAaXnd8MEn8YSeL912n1eBb1uKSkINvyQiWkn3TS4bQ640H0AycsX5SQKsJibcaFMuIPN1CsfKVNCubeYEstKbhI1TqxCqrCInpJOfgLyC4fws1PXQUUhYA6XUKFeAho5UtTKy_XtBUXUu4vqkC3hsfPyDTBVy61O0HcWXPs1JVdtMhaCxpvmNbYbwqM7uAOeCRtHcLbQEKooJwxGd5TMp_4Q_wFR3j8u_rakkhL_Pm0tcBfOb9pO9kQxrddvn8saDlVg",
            "payload": {
                "sub": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2",
                "email_verified": true,
                "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lIuuH6J2w",
                "phone_number_verified": false,
                "cognito:username": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2",
                "origin_jti": "5304bbef-2c9f-4d8f-bab3-c7068fb70288",
                "aud": "3j00jcfrjm71vnjhaieuj4r76n",
                "event_id": "eea77d4c-f1ee-401b-a40c-add6024ea336",
                "token_use": "id",
                "auth_time": 1628999530,
                "phone_number": "+14095272532",
                "exp": 1629003130,
                "iat": 1628999530,
                "jti": "705a3b02-71ea-4fa7-85e9-4e17c7fb8ea2",
                "email": "fivearun@gmail.com"
            }
        },
        "refreshToken": {
            "token": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.decAxMyDdPx4Cibr6GUhk4nyHyqG4pVD8YnFnONMD7yQHFsfMquIR2DVLT7BJMpN22dJq4CFxWt2_QnNUtJb8uLbg-ZGUEluAcZYIdokkj4BJRQ4dRnCaKLWmEtSuEAX2Ye_AIgowC4RZolwPk9nitRp1iGV8o4t9-fN39bW3qISBDKDe4IUrb3pN-cN15YGMQSkk6pOTHZCVECdxM258jMrr-vPk9-l5_7y-IwkH_2B8ggHtw-Dz1rrbL27FsQQGbriQq-NjwPHziz6_q_QVUHTjQFbKkE-WQ7ijTAQWsS1xeliWHH1NVy-rodFWVwcIXRhhqKtZ4DY8dTOsv1qnQ.eLfl_hCSCBUMg3Lg.0QpwsC6NrlTSxI61hIaumG7qvl8MwKojyHogSyP7V6z5p8veV14_aFrCuy0Ywi6fC8ymoGfDcb7AUt6vGFFvjJQyYgUttXVHhoHV60hrI0HoJWtybC6hYw8Fxo0veCYLlCMf8_eGbl82Pz8u9Bc0SP_h1KUk_0nYTsjkWSbDNGM7DxARkVetLm06VtuOzMc-4c41o4yww7QXrNDGcjepbYfMfqCqxSbJQG7xmVslHl3Ff1igYr7i5BD0KQhInrDSruHSxXBCWtHB4DIY55ZrGsL4DFmfgnGBynGtfoIdotQOU_5lk-rP6fb4VtI7GXjsGw3Kynr62VVLy2sKjCXx_aSPy7jzq_YQSqSxcBcBUP0gCM-j_wRR0wKkhXrI1eRgETKkRg4SuFzyxCJWHPXZ7FhlzbEarXd8NOPulDohS3lRyZ4EPCWmleiBRU4w_ScD6989a2IcS3riVfW5go5V366ryWD5qk81MEMR8aHrIfuSMx1eDJp1KYktGoQIYPGvC9V9yZfKmF3RE6gRarRIear3tjZb4vdBnoBoWiZYkJNyHhIlgP24uZCCYK3Ey_EmMBT84-ILEfQMZSBIbAZQx-Qct_LHIebsYk73a98DwnFRuzH5bRrasgNMcvG3C81Kbd0iAL-fAojvFJMH8l0m59Jq_edVOYI-ZluVZFDZyHeAMAPiSnIy6II7gHVI2VoRWwzwEmbtsazU9w8EtlG_7cE2RkuzaHuma3ZDeuggskPR0yKJiLXTxQjDALFYFg-ciUtdTJq3257YrtC3joE_TPS7n8T4YdnWcC6MoZ2rVQVkkbbWtOrH6ecwagjnFbemWVn_xXPiIds2v9sEjznggGhaPnxrNjPjhkFAaX0obJhcD-Vrh_8Ztjo9-Wt0tp-Lgnu0nt-BxMwek1_jskA127nFQAHkSn3u6b5vaVyC-Mw3YA2dks8UMQOvo9zxfm8ISDzpJaG3TFKTiuc3Jqt83lzlUhWoeyPOu6YzxC8JzichVLxrzEHCLY731TgOdExJ7snFGKmPxAxjZj4DFJo886_zMXN1Iwj_M32qProFWZI8JqTVmCo5ezbr57fUYRVed5e4cFZzuKx33iAoLZYmMtRiOs2eAbph5aNV7eYQ5NLV-lw2j2lJxALT0zu95V72VWkF4dmq_Th4eyfHiv9-BWl8XeIX4e1UKFXNyuhMVcGzMdlwGWRi395zl72h6uqL5iygzTtaoPHt7qo1XtnEMyiGyWvMyQQ6vBpZtflre_EwzAdGxi6ruT5pqXTK1HokzZqzj9pvqHS5GTG-LBQYiusRhQVceFQdLINjt73NERscevmM-s9fZbypVg.K5YdBu-tQUc3ERWVD0OXZQ"
        },
        "accessToken": {
            "jwtToken": "eyJraWQiOiI4cDIrREY0dmZ3VkRTa2pDeUpDM0YzdTI1bFBVYklSRE9pR3h3Q1o2THpjPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiNTMwNGJiZWYtMmM5Zi00ZDhmLWJhYjMtYzcwNjhmYjcwMjg4Iiwic3ViIjoiNWEzZGVkOGItZTQ1OC00Y2E4LTkwMjItZTM4MjZhYWExY2MyIiwiZXZlbnRfaWQiOiJlZWE3N2Q0Yy1mMWVlLTQwMWItYTQwYy1hZGQ2MDI0ZWEzMzYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjI4OTk5NTMwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9sSXV1SDZKMnciLCJleHAiOjE2MjkwMDMxMzAsImlhdCI6MTYyODk5OTUzMCwianRpIjoiNjk2YWNhMDItMDAyMC00YTg5LTk4MDAtZjUyZjcwNTBmMTg2IiwiY2xpZW50X2lkIjoiM2owMGpjZnJqbTcxdm5qaGFpZXVqNHI3Nm4iLCJ1c2VybmFtZSI6IjVhM2RlZDhiLWU0NTgtNGNhOC05MDIyLWUzODI2YWFhMWNjMiJ9.bHD6Z7Ci0-JyySYU7xuxhO41bkEsxz6Z44jyMdeJZtk65p6Lg-7cC5nk32g_02Viy5Ios68oR7Cwg-jZZ5rs7y0Rm6pxfYg-huXNFNJLc3GOEYCTRMlvfQDUw0xGSWF6A_2gkTnjoMQ63goiIWg_T49uOhMh7qcN3Dh1u0fV4rG700fwrpKf6jhTO6wZODg9ce1uQ3YqjYOknxBS3IydL4d6kSeMihTcdVQKLHaqoIErPVvtSeu0x-dTD65oKXyv827Yz1bMHveKytTDGdwGg6XePqqmm5EzFOH2M4WokzLGdQhlSAa7wVrZp-VjA6RUh7Ae4AWqwrcjMCQTyxUwpg",
            "payload": {
                "origin_jti": "5304bbef-2c9f-4d8f-bab3-c7068fb70288",
                "sub": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2",
                "event_id": "eea77d4c-f1ee-401b-a40c-add6024ea336",
                "token_use": "access",
                "scope": "aws.cognito.signin.user.admin",
                "auth_time": 1628999530,
                "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lIuuH6J2w",
                "exp": 1629003130,
                "iat": 1628999530,
                "jti": "696aca02-0020-4a89-9800-f52f7050f186",
                "client_id": "3j00jcfrjm71vnjhaieuj4r76n",
                "username": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2"
            }
        },
        "clockDrift": 0
    },
    "authenticationFlowType": "USER_SRP_AUTH",
    "keyPrefix": "CognitoIdentityServiceProvider.3j00jcfrjm71vnjhaieuj4r76n",
    "userDataKey": "CognitoIdentityServiceProvider.3j00jcfrjm71vnjhaieuj4r76n.5a3ded8b-e458-4ca8-9022-e3826aaa1cc2.userData",
    "attributes": {
        "sub": "5a3ded8b-e458-4ca8-9022-e3826aaa1cc2",
        "email_verified": true,
        "phone_number_verified": false,
        "phone_number": "+14095272532",
        "email": "fivearun@gmail.com"
    },
    "preferredMFA": "NOMFA"
}
  * */
  @observable authInfo: AuthProps = {
    attributes: {
      email: '',
      phone_number: ''
    },
    userId: '',
    username: '',
    password: '',
    userDataKey: '',
    stripeClientToken: {},
    ephemeralKey: '',
    role: ''
  };

  @action setUserAuthInfo = (data: AuthProps, authObj: any) => {
    this.authInfo = Object.assign({}, data, authObj)
  }

  @action setApiData = (data: UserApiData) => {
    this.setUserAuthInfo(this.authInfo, data)
  }

  @action login = async (email: string, password: string) => {
    console.log('loggin in')
    const apiUser = await this.rootStore.chefApi.loginToApi(email, password)
    if(!!apiUser) {
      this.rootStore.chefApi.setToken(apiUser.tokenSession)
      this.setApiData({
        role: apiUser.data.userType,
        userId: apiUser.data._id,
        password: ''
      })
      console.log('authInfo after change', this.authInfo)
      return 'SUCCESS'
    } else
      return 'FAILED'
  }

  @action register = async () => {
    console.log('registering user', this.authInfo)
    const registeredUser = await this.rootStore.chefApi.registerUser(this.authInfo.username, this.authInfo.password, this.authInfo.role, this.authInfo.userDataKey)
    if(registeredUser.ok) {
      try {
        this.rootStore.chefApi.setBasic(this.authInfo.userDataKey)
        await this.login(this.authInfo.username, this.authInfo.password)
        return 'SUCCESS'
      } catch(e) {
        console.log('ERROR ON LOGIN', e)
        return 'LOGIN_FAILED'
      }
    } else
      return 'REGISTRATION_FAILED'
  }

  @action logout = () => {
    this.rootStore.chefApi.logout()
  }
}

export default AuthStore
