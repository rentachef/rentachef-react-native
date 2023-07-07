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
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';
import getImgSource from '../../utils/getImgSource';

// import components
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

let pizza_3 = require('@assets/img/pizza_3.jpg');
let meat_1 = require('@assets/img/meat_1.jpg');
let spaghetti_2 = require('@assets/img/spaghetti_2.jpg');
let soup_1 = require('@assets/img/soup_1.jpg');
let salad_1 = require('@assets/img/salad_1.jpg');
let cake_2 = require('@assets/img/cake_2.jpg');

// CategoriesA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginVertical: 6,
    height: 100,
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
    borderRadius: 4,
  },
  cardTitle: {
    padding: 16,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

// CategoriesA
export default class CategoriesA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        {
          key: 1,
          imageUri: pizza_3,
          name: 'Pizza',
        },
        {
          key: 2,
          imageUri: meat_1,
          name: 'Grill',
        },
        {
          key: 3,
          imageUri: spaghetti_2,
          name: 'Pasta',
        },
        {
          key: 4,
          imageUri: soup_1,
          name: 'Soups',
        },
        {
          key: 5,
          imageUri: salad_1,
          name: 'Salads',
        },
        {
          key: 6,
          imageUri: cake_2,
          name: 'Dessert',
        },
      ],
    };
  }

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.navigateTo('Category')}
          style={styles.cardContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  render() {
    const {categories} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <FlatList
            data={categories}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCategoryItem}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </View>
      </SafeAreaView>
    );
  }
}
