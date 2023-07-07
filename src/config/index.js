import {Appearance} from 'react-native';

const colorScheme = Appearance.getColorScheme();

console.log('COLOR SCHEME', colorScheme)

const config = {
  /*
    theme: 'jade' | 'redOrange' | 'blueberry' | 'rentAChef' | 'rentAChefDark'
   */
  theme: colorScheme === 'light' ? 'rentAChef' : 'rentAChefDark'
};

export default config;
