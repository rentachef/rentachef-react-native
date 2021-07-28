import AsyncStorage from '@react-native-async-storage/async-storage'

export default (() => {

  //Async StorageKey, clearing this will clear the app data
  let SELECTED_APP_USER = 'RAC-USER' // OPTIONS RAC-USER | RAC-COOK

  const setUserStoreData = async (data: any) => {
    await AsyncStorage.setItem(SELECTED_APP_USER, JSON.stringify(data))
  }

  //When user switches between Consumer or CHEF, set this the key accordingly
  const setUserOrCookAsyncStorageKey = (user: string) => {
    SELECTED_APP_USER = user
  }

  const getUserAppDataFromStorage = async () => {
    const userData: any = await AsyncStorage.getItem(SELECTED_APP_USER)
    return JSON.parse(userData)
  }

  return {
    setUserStoreData,
    setUserOrCookAsyncStorageKey,
    getUserAppDataFromStorage,
    SELECTED_APP_USER
  }
})()
