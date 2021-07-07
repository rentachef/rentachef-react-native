import {
  // eslint-disable-next-line react-native/split-platform-components
  ToastAndroid,
  Platform,
  // eslint-disable-next-line react-native/split-platform-components
  Alert,
} from 'react-native';

export default function getImgSource(src) {
  let imgSource;

  if (typeof src === 'string') {
    // network image
    imgSource = { uri: src };
  }
  if (typeof src === 'number') {
    // static image
    imgSource = src;
  }

  return imgSource;
}

export const notifyMessage = (title: string, msg: string) => {
  Alert.alert(title, msg)
}
