/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import remove from 'lodash/remove';

// import components
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import EmptyState from '../../components/emptystate/EmptyState';
import {Heading6, SmallText} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';

// FavoritesA Config
const isRTL = I18nManager.isRTL;
const EMPTY_STATE_ICON = 'star-outline';

let sandwich_2 = require('@assets/img/sandwich_2.jpg')
let pizza_1 = require('@assets/img/pizza_1.jpg')
let cake_1 = require('@assets/img/cake_1.jpg')
// FavoritesA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  productList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    paddingHorizontal: 12,
  },
  bottomTextInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f1f1f1',
  },
});

// FavoritesA
export default class FavoritesA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [
        {
          id: 'product1',
          imageUri: sandwich_2,
          name: 'Subway sandwich',
          price: 8.49,
          quantity: 0,
          discountPercentage: 10,
        },
        {
          id: 'product2',
          imageUri: pizza_1,
          name: 'Pizza Margarita 35cm',
          quantity: 0,
          price: 10.99,
        },
        {
          id: 'product3',
          imageUri: cake_1,
          name: 'Chocolate cake',
          quantity: 0,
          price: 4.99,
        },
      ],
    };
  }

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  swipeoutOnPressRemove = item => () => {
    let {products} = this.state;
    const index = products.indexOf(item);

    products = remove(products, n => products.indexOf(n) !== index);

    this.setState({
      products,
    });
  };

  onPressRemove = item => () => {
    let {quantity} = item;
    quantity -= 1;

    const {products} = this.state;
    const index = products.indexOf(item);

    if (quantity < 0) {
      return;
    }
    products[index].quantity = quantity;

    this.setState({
      products: [...products],
    });
  };

  onPressAdd = item => () => {
    const {quantity} = item;
    const {products} = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = item => item.id.toString();

  renderProductItem = ({item}) => (
    <ActionProductCardHorizontal
      key={item.id}
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      quantity={item.quantity}
      discountPercentage={item.discountPercentage}
      label={item.label}
      swipeoutDisabled={false}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
    />
  );

  render() {
    const {products} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Favorites</Heading6>
        </View>

        {products.length === 0 ? (
          <EmptyState
            showIcon
            iconName={EMPTY_STATE_ICON}
            title="Your Favorites List is Empty"
            message="Save your favorite food so you can always find it here and make order easier"
          />
        ) : (
          <Fragment>
            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              contentContainerStyle={styles.productList}
            />

            <View style={styles.bottomTextInfo}>
              <View style={styles.info}>
                <SmallText>
                  {`Swipe ${isRTL ? 'right' : 'left'} to remove items`}
                </SmallText>
              </View>
            </View>
          </Fragment>
        )}
      </SafeAreaView>
    );
  }
}
