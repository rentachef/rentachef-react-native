import Toast from 'react-native-root-toast'
import Colors from '../../theme/colors'

const containerStyle = {
  width: '85%',
  borderRadius: 0
}

const notify = (message: string, toastColor: string, duration: number = 2000, isAnimated: boolean = true) => {
  Toast.show(message, {
    animation: isAnimated,
    backgroundColor: toastColor,
    duration: duration,
    containerStyle: containerStyle,
    shadow: false,
    opacity: 1.0,
  })
}

export const notifySuccess = (message: string, duration: number = 2000, animated: boolean = true) => {
  notify(message, Colors.success, duration, animated)
}

export const notifyError = (message: string, duration: number = 2000, animated: boolean = true) => {
  notify(message, Colors.error, duration, animated)
}

export const notifyWarn = (message: string, duration: number = 2000, animated: boolean = true) => {
  notify(message, Colors.warn, duration, animated)
}


export default {
  notifyError,
  notifySuccess,
  notifyWarn,
}
