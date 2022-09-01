/* @flow */
import * as React from 'react';
import {Text, View} from 'react-native';
import { Slider } from "@miblanchard/react-native-slider";

// styles
import {
  styles,
  trackMarkStyles,
} from './styles';

const DEFAULT_VALUE = 0.2;

const SliderContainer = (props: {
  caption: string;
  children: React.ReactElement;
  sliderValue?: Array<number>;
  trackMarks?: Array<number>;
  vertical?: boolean;
}) => {
  const {caption, sliderValue, trackMarks} = props;
  const [value, setValue] = React.useState(
    sliderValue ? sliderValue : DEFAULT_VALUE,
  );
  let renderTrackMarkComponent: React.ReactNode;

  if (trackMarks?.length && (!Array.isArray(value) || value?.length === 1)) {
    renderTrackMarkComponent = (index: number) => {
      const currentMarkValue = trackMarks[index];
      const currentSliderValue =
        value || (Array.isArray(value) && value[0]) || 0;
      const style =
        currentMarkValue > Math.max(currentSliderValue)
          ? trackMarkStyles.activeMark
          : trackMarkStyles.inactiveMark;
      return <View style={style} />;
    };
  }

  const renderChildren = () => {
    return React.Children.map(
      props.children,
      (child: React.ReactElement) => {
        if (!!child && child.type === Slider) {
          return React.cloneElement(child, {
            onValueChange: setValue,
            renderTrackMarkComponent,
            trackMarks,
            value,
          });
        }

        return child;
      },
    );
  };

  return (
    <View style={styles.sliderContainer}>
      {renderChildren()}
    </View>
  );
};

export default SliderContainer;
