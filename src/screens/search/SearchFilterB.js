/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  I18nManager,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// import components
import Button from '../../components/buttons/Button';
import FilterPicker from '../../components/pickers/FilterPicker';
import {Subtitle1} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';

// SearchFilterB Config
const isRTL = I18nManager.isRTL;

// SearchFilterB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mt8: {
    marginTop: 8,
  },
  subtitle: {
    padding: 16,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
  },
  inputContainer: {
    marginHorizontal: 8,
  },
  small: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingHorizontal: 8,
    height: 46,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  textInputFocused: {
    borderColor: Colors.primaryColor,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
});

// SearchFilterB
export default class SearchFilterB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromPrice: '',
      toPrice: '',
      fromPriceFocused: false,
      toPriceFocused: false,
      menu: [
        {title: 'Breakfast', picked: false},
        {title: 'Lunch', picked: false},
        {title: 'Dinner', picked: true},
        {title: 'Snack', picked: false},
        {title: 'Dessert', picked: false},
        {title: 'Teatime', picked: false},
      ],
      cuisine: [
        {title: 'Italian', picked: true},
        {title: 'French', picked: false},
        {title: 'Chinese', picked: false},
        {title: 'Japanese', picked: false},
        {title: 'Indian', picked: false},
        {title: 'Austrian', picked: false},
        {title: 'Armenian', picked: false},
        {title: 'Belgian', picked: false},
      ],
    };
  }

  componentDidMount = () => {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidHideListener.remove();
  };

  keyboardDidHide = () => {
    this.setState({
      fromPriceFocused: false,
      toPriceFocused: false,
    });
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onChangeText = key => text => {
    this.setState({
      [key]: text,
    });
  };

  onFocus = key => () => {
    let focusedInputs = {
      fromPriceFocused: false,
      toPriceFocused: false,
    };
    focusedInputs[key] = true;

    this.setState({
      ...focusedInputs,
    });
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  handleFilterPress = (filters, item) => () => {
    const index = filters.indexOf(item);

    filters[index].picked = !filters[index].picked;

    this.setState({
      filters: [...filters],
    });
  };

  renderFilterItem = ({item, index}, filterArr) => (
    <FilterPicker
      key={index}
      onPress={this.handleFilterPress(filterArr, item)}
      picked={item.picked}
      title={item.title}
    />
  );

  render() {
    const {
      fromPrice,
      fromPriceFocused,
      toPrice,
      toPriceFocused,
      menu,
      cuisine,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />

        <ScrollView>
          <Subtitle1 style={styles.subtitle}>Price range</Subtitle1>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.small]}>
              <TextInput
                onChangeText={this.onChangeText('fromPrice')}
                onFocus={this.onFocus('fromPriceFocused')}
                onSubmitEditing={this.focusOn(this.toPrice)}
                keyboardType="numeric"
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="From 1$"
                value={fromPrice}
                style={[
                  styles.textInput,
                  fromPriceFocused && styles.textInputFocused,
                ]}
              />
            </View>

            <View style={[styles.inputContainer, styles.small]}>
              <TextInput
                ref={r => {
                  this.toPrice = r;
                }}
                onChangeText={this.onChangeText('toPrice')}
                onFocus={this.onFocus('toPriceFocused')}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit
                placeholder="To 200$"
                value={toPrice}
                style={[
                  styles.textInput,
                  toPriceFocused && styles.textInputFocused,
                ]}
              />
            </View>
          </View>

          <Subtitle1 style={[styles.subtitle, styles.mt8]}>Menu</Subtitle1>
          <View style={styles.rowWrap}>
            {menu.map((item, index) =>
              this.renderFilterItem({item, index}, menu),
            )}
          </View>

          <Subtitle1 style={[styles.subtitle, styles.mt8]}>Cuisine</Subtitle1>
          <View style={styles.rowWrap}>
            {cuisine.map((item, index) => (
              <FilterPicker
                key={index}
                onPress={this.handleFilterPress(cuisine, item)}
                picked={item.picked}
                title={item.title}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button onPress={this.goBack} title="Apply Filters" rounded />
        </View>
      </SafeAreaView>
    );
  }
}
