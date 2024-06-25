// import config setting
import config from '../config';

// Color Themes
const themes = {
  rentAChef: {
    // primary color
    primaryColor: '#FFC534',
    primaryColorDark: '#FBB12B',
    primaryColorLight: '#FFC534B2',
    onPrimaryColor: '#fff',

    // accent color, triad
    accentColor: '#0069b9',
    onAccentColor: '#fff',

    // secondary color, primary color split
    secondaryColor: '#4A515F',
    onSecondaryColor: '#fff',

    // tertiary color, secondary color intermediately related
    tertiaryColor: '#ffa400',
    onTertiaryColor: '#fff',

    // status bar color
    statusBarColor: '#fff',

    // gradient colors
    primaryGradientColor: '#00b970',
    secondaryGradientColor: '#00b9a7',

    // overlay color
    overlayColor: '#b90039',

    // text color
    primaryText: '#1C2331',
    secondaryText: '#8891A3',
    disabledText: 'rgba(0, 0, 0, 0.38)',
    
    placeholderColor: '#A7AFBF',

    // background, surface
    background: '#fff',
    backgroundDark: '#DDE2ED',
    backgroundMedium: '#EAEDF3',
    backgroundLight: '#F3F6FB',

    onBackground: '#212121',
    surface: '#fff',
    onSurface: '#757575',

    //system
    error: '#F23548',
    warn: '#F9945A',
    success: '#33AC2E',


    onError: '#fff',
    black: '#010203',
    white: '#fff',

    //border color
    borderColor: '#DDE2ED',

    //disabled color
    disabled: '#F3F6FB',

    //switch colors
    thumbColorOn: '#fff',
    thumbColorOff: '#fafafa',

    //picker colors
    pickerBackground: '#F7F7FA'
  },
  rentAChefDark: {
    // primary color
    primaryColor: '#FFC534',
    primaryColorDark: '#FBB12B',
    primaryColorLight: '#FFC534B2',
    onPrimaryColor: '#fafafa',

    // accent color, triad
    accentColor: '#0069b9',
    onAccentColor: '#111',

    // secondary color, primary color split
    secondaryColor: '#BFC2CE',
    onSecondaryColor: '#111',

    // tertiary color, secondary color intermediately related
    tertiaryColor: '#FF8B00',
    onTertiaryColor: '#111',

    // status bar color
    statusBarColor: '#111',

    // gradient colors
    primaryGradientColor: '#00b970',
    secondaryGradientColor: '#00b9a7',

    // overlay color
    overlayColor: '#FFB7CC',

    // text color
    primaryText: 'white',
    secondaryText: '#A0A6B2',
    disabledText: 'rgba(255, 255, 255, 0.38)',
    
    placeholderColor: '#6B727F',

    // background, surface
    background: '#1C2331',
    backgroundDark: '#141A26',
    backgroundMedium: '#10161F',
    backgroundLight: '#3C444F',

    onBackground: '#fff',
    surface: '#1C2331',
    onSurface: '#A0A6B2',

    //system
    error: '#F23548',
    warn: '#F9945A',
    success: '#33AC2E',

    onError: '#fff',
    black: '#010203',
    white: '#1C2331',

    //border color
    borderColor: '#1C2331',

    //disabled color
    disabled: '#0B0E13',

    //switch colors
    thumbColorOn: '#1C2331',
    thumbColorOff: '#3C444F',

    //picker colors
    pickerBackground: '#141A26'
  }
};

const theme = themes[config.theme];

export default theme;
