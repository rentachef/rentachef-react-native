/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';
// import { SafeAreaView } from "react-navigation";

// import utils
import getImgSource from '../../utils/getImgSource';

// import components
import ActionProductCard from '../../components/cards/ActionProductCard';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import LinkButton from '../../components/buttons/LinkButton';
import {Heading6} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

// HomeA Config
let imgHolder = require('@assets/img/imgholder.png');

// HomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 8,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginLeft: 8,
    width: 104,
    height: 72,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: Color(Colors.overlayColor).alpha(0.2),
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    padding: 12,
    fontWeight: '500',
    fontSize: 16,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  productsList: {
    paddingBottom: 16,
    // spacing = paddingHorizontal + ActionProductCard margin = 12 + 4 = 16
    paddingHorizontal: 12,
  },
  popularProductsList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});

export default class HomeA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        {
          key: 1,
          imageUri: require('@assets/img/pizza_3.jpg'),
          name: 'Pizza',
        },
        {
          key: 2,
          imageUri: require('@assets/img/meat_1.jpg'),
          name: 'Grill',
        },
        {
          key: 3,
          imageUri: require('@assets/img/spaghetti_2.jpg'),
          name: 'Pasta',
        },
        {
          key: 4,
          imageUri: require('@assets/img/soup_1.jpg'),
          name: 'Soups',
        },
        {
          key: 5,
          imageUri: require('@assets/img/salad_1.jpg'),
          name: 'Salads',
        },
      ],
      products: [
        {
          imageUri: require('@assets/img/pizza_4.png'),
          name: 'Pizza Carbonara 35cm',
          price: 10.99,
          label: 'new',
        },
        {
          imageUri: require('@assets/img/sandwich_1.png'),
          name: 'Breakfast toast sandwich',
          price: 4.99,
        },
        {
          imageUri: require('@assets/img/cake_3.png'),
          name: 'Cake Cherries Pie',
          price: 8.49,
          discountPercentage: 10,
        },
        {
          imageUri: require('@assets/img/soup_2.png'),
          name: 'Broccoli Soup',
          price: 6.49,
          discountPercentage: 10,
        },
      ],
      popularProducts: [
        {
          imageUri: require('@assets/img/sandwich_2.jpg'),
          name: 'Subway sandwich',
          price: 8.49,
          quantity: 0,
          discountPercentage: 10,
        },
        {
          imageUri: require('@assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          quantity: 0,
        },
        {
          imageUri: require('@assets/img/cake_1.jpg'),
          name: 'Chocolate cake',
          price: 4.99,
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

    const {popularProducts} = this.state;
    const index = popularProducts.indexOf(item);

    if (quantity < 0) {
      return;
    }
    popularProducts[index].quantity = quantity;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  onPressAdd = item => () => {
    const {quantity} = item;
    const {popularProducts} = this.state;

    const index = popularProducts.indexOf(item);
    popularProducts[index].quantity = quantity + 1;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.navigateTo('Category')}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  renderProductItem = ({item, index}) => (
    <ActionProductCard
      onPress={this.navigateTo('Product')}
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      discountPercentage={item.discountPercentage}
      label={item.label}
    />
  );

  renderPopularProductItem = ({item, index}) => (
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
    const {categories, products, popularProducts} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <Heading6 style={styles.titleText}>Categories</Heading6>
                <LinkButton
                  title="View all"
                  titleStyle={styles.viewAllText}
                  onPress={this.navigateTo('Categories')}
                />
              </View>

              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderCategoryItem}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>Special Offers</Heading6>
            </View>

            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              contentContainerStyle={styles.productsList}
            />

            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>Popular</Heading6>
              <LinkButton
                title="View all"
                titleStyle={styles.viewAllText}
                onPress={this.navigateTo('SearchResults')}
              />
            </View>

            <FlatList
              data={popularProducts}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderPopularProductItem}
              contentContainerStyle={styles.popularProductsList}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
