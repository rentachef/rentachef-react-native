/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import type {ReactElement} from 'react';
import {Platform, StyleSheet, Text as RNText} from 'react-native';

// import colors
import Colors from '../../theme/colors';

// CustomText Config
const platform = Platform.OS;
const fontConfig = {
  ios: {
    thin: {
      fontFamily: 'Karla-ExtraLight',
      fontWeight: '100',
    },
    light: {
      fontFamily: 'Karla-Light',
      fontWeight: '300',
    },
    regular: {
      fontFamily: 'Karla-Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Karla-Medium',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'Karla-Bold',
      fontWeight: '700',
    },
    semiBold: {
      fontFamily: 'Karla-Bold',
      fontWeight: '300',
    },
  },
  android: {
    thin: {
      fontFamily: 'Karla-ExtraLight',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Karla-Light',
      fontWeight: 'normal',
    },
    regular: {
      fontFamily: 'Karla-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Karla-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Karla-Bold',
      fontWeight: 'bold',
    },
    semiBold: {
      fontFamily: 'Karla-Bold',
      fontWeight: '300',
    },
  },
};
const fonts = fontConfig[platform];

// CustomText Styles
const styles = StyleSheet.create({
  hSemiBoldBig: {
    ...fonts.semiBold,
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: .8,
    color: Colors.primaryText,
  },
  hhBoldSmall: {
    ...fonts.bold,
    fontSize: 24,
    letterSpacing: .2,
    color: Colors.primaryText,
  },

  hBold: {
    ...fonts.bold,
    fontSize: 36,
    letterSpacing: -1.5,
    color: Colors.primaryText,
  },
  hBoldBig: {
    ...fonts.bold,
    fontSize: 60,
    letterSpacing: -1.5,
    color: Colors.primaryText,
  },
  h1: {
    // fontWeight: '300',
    ...fonts.light,
    fontSize: 96,
    letterSpacing: -1.5,
    color: Colors.primaryText,
  },
  h2: {
    // fontWeight: '300',
    ...fonts.light,
    fontSize: 60,
    letterSpacing: -0.5,
    color: Colors.primaryText,
  },
  h3: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 48,
    color: Colors.primaryText,
  },
  h4: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 34,
    letterSpacing: 0.25,
    color: Colors.primaryText,
  },
  h5: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 24,
    color: Colors.primaryText,
  },
  h6: {
    // fontWeight: '500',
    ...fonts.medium,
    fontSize: 20,
    letterSpacing: 0.15,
    color: Colors.primaryText,
  },
  title: {
    // fontWeight: '500',
    ...fonts.medium,
    fontSize: 25,
    lineHeight: 30,
    color: Colors.primaryText,
  },
  subtitle1: {
    // fontWeight: '400',
    ...fonts.light,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.15,
    color: Colors.primaryText,
  },
  subtitle2: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    color: Colors.secondaryText,
  },
  text: {
    fontWeight: '400',
    ...fonts.regular,
    color: Colors.primaryText
  },
  lightText: {
    // fontWeight: '400'
    ...fonts.light,
    color: Colors.secondaryText
  },
  // body1
  paragraph: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: Colors.secondaryText,
  },
  // body 2
  smallText: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.25,
    color: Colors.secondaryText,
  },
  smallBoldText: {
    // fontWeight: '400',
    ...fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.25,
    color: Colors.secondaryText,
  },
  headingBold: {
    ...fonts.bold,
    fontSize: 18,
    color: Colors.primaryText,
    letterSpacing: 0.25
  },
  buttonText: {
    // fontWeight: '500',
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.75,
  },
  caption: {
    // fontWeight: '400',
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: Colors.secondaryText,
  },
});

export const HeadlineBold = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.headingBold, style]} {...props} />
)

export const SemiBoldHeading = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.hSemiBoldBig, style]} {...props} />
);

export const SmallBoldHeading = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.hhBoldSmall, style]} {...props} />
);

export const BoldHeading = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.hBold, style]} {...props} />
);

export const BigBoldHeading = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.hBoldBig, style]} {...props} />
);

export const Heading1 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h1, style]} {...props} />
);

export const Heading2 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h2, style]} {...props} />
);

export const Heading3 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h3, style]} {...props} />
);

export const Heading4 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h4, style]} {...props} />
);

export const Heading5 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h5, style]} {...props} />
);

export const Heading6 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.h6, style]} {...props} />
);

export const Title = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.title, style]} {...props} />
);

export const Subtitle1 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.subtitle1, style]} {...props} />
);

export const Subtitle2 = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.subtitle2, style]} {...props} />
);

export const  Text = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.text, style]} {...props} />
);

export const LightText = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.lightText, style]} {...props} />
);

export const Paragraph = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.paragraph, style]} {...props} />
);

export const SmallText = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.smallText, style]} {...props} />
);

export const SmallBoldText = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.smallBoldText, style]} {...props} />
);

export const ButtonText = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.buttonText, style]} {...props} />
);

export const Caption = ({style, ...props}: any): ReactElement<RNText> => (
  <RNText style={[styles.caption, style]} {...props} />
);
