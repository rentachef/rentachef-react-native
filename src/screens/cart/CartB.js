/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, Fragment} from 'react';
import {StatusBar, StyleSheet, View, FlatList} from 'react-native';
import remove from 'lodash/remove';

// import components
import Button from '../../components/buttons/Button';
import Divider from '../../components/divider/Divider';
import {Heading6, Subtitle1} from '../../components/text/CustomText';
import EmptyState from '../../components/emptystate/EmptyState';
import ProductCard from '../../components/cards/ProductCard';
import SafeAreaView from '../../components/SafeAreaView';

// import colors
import Colors from '../../theme/colors';

// CartB Config
const EMPTY_STATE_ICON = 'cart-remove';

// CartB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleText: {
    fontWeight: '700',
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  subTotalText: {
    top: -2,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  subTotalPriceText: {
    fontWeight: '700',
    color: Colors.primaryColor,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    width: '100%',
    padding: 16,
    backgroundColor: '#efefef',
  },
  button: {
    width: '48%',
  },
});

// CartB
export default class CartB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0.0,
      products: [
        {
          id: 'product1',
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'Pizza One',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 7.99,
          quantity: 2,
        },
        {
          id: 'product3',
          imageUri: require('../../assets/img/barbecue_1.jpg'),
          name: 'Beef',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 8.99,
          quantity: 2,
        },
        {
          id: 'product4',
          imageUri: require('../../assets/img/spaghetti_1.jpg'),
          name: 'Fettuccine Pasta',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 11.99,
          quantity: 1,
        },
      ],
    };
  }

  componentDidMount = () => {
    this.updateTotalAmount();
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  swipeoutOnPressRemove = item => () => {
    let {products} = this.state;
    const index = products.indexOf(item);

    products = remove(products, n => products.indexOf(n) !== index);

    this.setState(
      {
        products,
      },
      () => {
        this.updateTotalAmount();
      },
    );
  };

  onPressRemove = item => () => {
    let {quantity} = item;
    quantity -= 1;

    let {products} = this.state;
    const index = products.indexOf(item);

    if (quantity === 0) {
      products = remove(products, n => products.indexOf(n) !== index);
    } else {
      products[index].quantity = quantity;
    }

    this.setState(
      {
        products: [...products],
      },
      () => {
        this.updateTotalAmount();
      },
    );
  };

  onPressAdd = item => () => {
    const {quantity} = item;
    const {products} = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState(
      {
        products: [...products],
      },
      () => {
        this.updateTotalAmount();
      },
    );
  };

  updateTotalAmount = () => {
    const {products} = this.state;
    let total = 0.0;

    products.forEach(product => {
      let {price} = product;
      const {discountPercentage, quantity} = product;

      if (typeof discountPercentage !== 'undefined') {
        price -= price * discountPercentage * 0.01;
      }
      total += price * quantity;
    });

    this.setState({
      total,
    });
  };

  keyExtractor = item => item.id.toString();

  renderProductItem = ({item}) => (
    <ProductCard
      key={item.id}
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      quantity={item.quantity}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
    />
  );

  renderSeparator = () => <Divider />;

  render() {
    const {total, products} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Cart</Heading6>

          {products.length > 0 && (
            <View style={styles.inline}>
              <Subtitle1 style={styles.subTotalText}> Subtotal: </Subtitle1>
              <Heading6 style={styles.subTotalPriceText}>
                {`$ ${parseFloat(Math.round(total * 100) / 100).toFixed(2)}`}
              </Heading6>
            </View>
          )}
        </View>

        {products.length === 0 ? (
          <EmptyState
            showIcon
            iconName={EMPTY_STATE_ICON}
            title="Your Cart is Empty"
            message="Looks like you haven't added anything to your cart yet"
          />
        ) : (
          <Fragment>
            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              ItemSeparatorComponent={this.renderSeparator}
            />

            <View style={styles.bottomButtonsContainer}>
              <Button
                onPress={this.navigateTo('Home')}
                buttonStyle={styles.button}
                color={Colors.tertiaryColor}
                rounded
                title="Add More"
              />
              <Button
                onPress={this.navigateTo('Checkout')}
                buttonStyle={styles.button}
                rounded
                title="Checkout"
              />
            </View>
          </Fragment>
        )}
      </SafeAreaView>
    );
  }
}
