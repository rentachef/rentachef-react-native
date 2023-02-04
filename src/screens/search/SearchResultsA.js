/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {FlatList, SafeAreaView, StatusBar, StyleSheet} from 'react-native';

// import components
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';

// import colors
import Colors from '../../theme/colors';

let pizzaImage = require('@assets/img/pizza_3.jpg');
let meat_1 = require('@assets/img/meat_1.jpg');
let pizza_1 = require('@assets/img/pizza_1.jpg');
let sandwich_2 = require('@assets/img/sandwich_2.jpg');
let spaghetti_2 = require('@assets/img/spaghetti_2.jpg')
// SearchResultsA Config

// SearchResultsA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  productList: {
    // spacing = padding + ActionProductCardHorizontal margin = 12 + 4 = 16
    padding: 12,
  },
});

// SearchResultsA
export default class SearchResultsA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [
        {
          imageUri: pizzaImage,
          name: 'Pizza Margherita 35cm',
          price: 8.99,
          quantity: 0,
        },
        {
          imageUri: meat_1,
          name: 'Grilled Meat',
          price: 10.99,
          quantity: 0,
        },
        {
          imageUri: pizza_1,
          name: 'Pizza Napolitana',
          price: 8.99,
          quantity: 0,
        },
        {
          imageUri: sandwich_2,
          name: 'Subway sandwich',
          price: 8.49,
          quantity: 0,
          discountPercentage: 10,
        },
        {
          imageUri: spaghetti_2,
          name: 'Spaghetti',
          price: 7.99,
          quantity: 0,
        },
      ],
    };
  }

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
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

  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({item, index}) => (
    <ActionProductCardHorizontal
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      swipeoutDisabled
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      description={item.description}
      rating={item.rating}
      price={item.price}
      quantity={item.quantity}
      discountPercentage={item.discountPercentage}
      label={item.label}
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

        <FlatList
          data={products}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          contentContainerStyle={styles.productList}
        />
      </SafeAreaView>
    );
  }
}
