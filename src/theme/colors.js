// import config setting
import config from '../config';

// Color Themes
const themes = {
  jade: {
    // primary color
    primaryColor: '#00b970',
    primaryColorDark: '#00945a',
    primaryColorLight: '#00e78c',
    onPrimaryColor: '#fff',

    // accent color, triad
    accentColor: '#0069b9',
    onAccentColor: '#fff',

    // secondary color, primary color split
    secondaryColor: '#b90039',
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
    primaryText: '#010203',
    secondaryText: '#5d5d5d',
    disabledText: 'rgba(0, 0, 0, 0.38)',

    // background, surface
    background: '#fff',
    onBackground: '#212121',
    surface: '#fff',
    onSurface: '#757575',
    error: '#cd040b',
    onError: '#fff',
    black: '#010203',
    white: '#fff'
  },
  redOrange: {
    // primary color
    primaryColor: '#e8500e',
    primaryColorDark: '#de4701',
    primaryColorLight: '#f35919',
    onPrimaryColor: '#fff',

    // accent color
    accentColor: '#0069b9',
    onAccentColor: '#fff',

    // secondary color
    secondaryColor: '#00b970', // '#239d19'
    onSecondaryColor: '#fff',

    // tertiary color, secondary color intermediately related
    tertiaryColor: '#66033c',
    onTertiaryColor: '#fff',

    // status bar color
    statusBarColor: '#fff',

    // gradient colors
    primaryGradientColor: '#e8500e',
    secondaryGradientColor: '#e25822',

    // overlay color
    overlayColor: '#f35919',

    // text color
    primaryText: '#010203',
    secondaryText: '#5d5d5d',
    disabledText: 'rgba(0, 0, 0, 0.38)',

    // background, surface
    background: '#fff',
    onBackground: '#212121',
    surface: '#fff',
    onSurface: '#757575',
    error: '#cd040b',
    onError: '#fff',
    black: '#010203',
    white: '#fff'
  },
  blueberry: {
    // primary color
    primaryColor: '#4f86f7',
    primaryColorDark: '#115bf4',
    primaryColorLight: '#9dbcfb',
    onPrimaryColor: '#fff',

    // accent color
    accentColor: '#01ad95',
    onAccentColor: '#fff',

    // secondary color, primary color split
    secondaryColor: '#83d076', // '#fac04c'
    onSecondaryColor: '#fff',

    // tertiary color, secondary color intermediately related
    tertiaryColor: '#de5246', // '#e0115f'
    onTertiaryColor: '#fff',

    // status bar color
    statusBarColor: '#eeeeee',

    // gradient colors
    primaryGradientColor: '#4f86f7',
    secondaryGradientColor: '#47b8ff',

    // overlay color
    overlayColor: '#9dbcfb',

    // text color
    primaryText: 'rgba(0, 0, 0, 0.87)',
    secondaryText: 'rgba(0, 0, 0, 0.54)',
    disabledText: 'rgba(0, 0, 0, 0.38)',

    // background, surface
    background: '#fff',
    onBackground: '#212121',
    surface: '#fff',
    onSurface: '#757575',
    error: '#cd040b',
    onError: '#fff',
    black: '#000',
    white: '#fff'
  },
  rentAChef: {
    // primary color
    primaryColor: '#FFC534',
    primaryColorDark: '#FBB12B',
    primaryColorLight: '#00e78c',
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
    disabled: '#C3C3C3'
  }
};

const theme = themes[config.theme];

export default theme;
