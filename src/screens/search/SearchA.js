/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Button,
  FlatList,
  I18nManager, Image,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
} from 'react-native';
import Color from 'color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import utils
import getImgSource from '../../utils/getImgSource';

// import components
import TouchableItem from '../../components/TouchableItem';
import {BoldHeading, Heading5, Heading6, LightText, SmallText} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';
import {inject, observer} from "mobx-react"
import CardContainer from "../../components/cards/CardContainer"
import Avatar from "../../components/avatar/Avatar"
import {Card} from "react-native-elements"
import _ from "lodash"
import Divider from "../../components/divider/Divider";
import {Filters} from "../../models/user/filters";

// SearchA Config
const isRTL = I18nManager.isRTL;
const SEARCH_ICON = 'magnify';
let imgHolder = require('@assets/img/imgholder.png');

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '700',
    textAlign: 'left',
  },
  inputContainer: {
    marginHorizontal: 16,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchButtonContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.backgroundDark,
    borderRadius: 8
  },
  searchFilter: {
    padding: 10,
    paddingTop: 15,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.backgroundDark,
    borderRadius: 8
  },
  categoriesList: {
    paddingBottom: 10,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginVertical: 2,
    marginHorizontal: 16,
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

// SearchA
@inject('searchStore')
@observer
export default class SearchA extends Component {
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
        {
          key: 6,
          imageUri: require('@assets/img/cake_2.jpg'),
          name: 'Dessert',
        },
      ],
      cooks: [],
      searchText: props.searchText || ''
    };

    this.getCuisinesList = this.getCuisinesList.bind(this)
    this.getCooksList = this.getCooksList.bind(this)
  }

  async componentDidMount() {
    await this.getCooksList()
  }

  async getCooksList() {
    console.log('get cooks list')
    //http://rentachefuser-dev-env.us-east-1.elasticbeanstalk.com/findCooks?latitude=1&longitude=1&searchradius=5&cuisines=INDO_PAK&cuisines=VIETNAMESE&startIndex=1&endIndex=5
    let url = this.state.searchText ? `http://rentachefuser-dev-env.us-east-1.elasticbeanstalk.com/findCooks?latitude=1&longitude=1&searchradius=5&startIndex=1&endIndex=5&search=${this.state.searchText}` : 'http://rentachefuser-dev-env.us-east-1.elasticbeanstalk.com/findCooks?latitude=1&longitude=1&searchradius=5&cuisines=INDO_PAK&cuisines=VIETNAMESE&startIndex=1&endIndex=5'
    let data = await fetch(url).then((res) => {
      console.log("res", res)
      return res.json()
    }).catch((err) => {
      console.log("err", err)
    })
    console.log("data", data)
    this.setState({
      cooks: data
    })
  }

  componentWillUnmount() {
    this.setState({
      cooks: []
    })
  }

  navigateTo = screen => () => {
    console.log('navigating to', screen)
    const {navigation} = this.props;
    console.log(navigation)
    Keyboard.dismiss();

    navigation.navigate(screen);
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
          onPress={() => this.navigateTo('Category')}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  getCuisinesList(item) {
    if(item && item.cuisineList.length) {
      console.log("item.cuisineList", item.cuisineList)
      return (
        <View>
          {_.map(item.cuisineList, (value) => {
            return (<SmallText>{value.type} </SmallText>)
          })}
        </View>
      )
    }
  }

  renderCooks = ({item, index}) => (
    <View style={{marginVertical: 1, marginBottom: 0, flex: .3 }}>
      <Card style={styles.card}>
        <View style={{padding: 5, flex: 1, flexDirection: 'row'}}>
          <View style={{flex: .15, justifyContent: 'center'}}>
            <Avatar
              imageUri={require('@assets/img/profile_1.jpeg')}
              rounded
              size={50}
            />
          </View>
          <View style={{flex: .85 }}>
            <Heading5 style={{marginBottom: 3}}>{item.firstName} {item.lastName}</Heading5>
            <View style={{flexDirection: 'row'}}>
              <Icon color={'#FBB12B'} name={'star'} size={20}/>
              <LightText style={{alignItems: 'baseline'}}>{item.totalrating}</LightText>
            </View>
            {this.getCuisinesList(item)}
          </View>
        </View>
      </Card>
    </View>
  )

  applyFilters = filters => {
    console.log('filters to apply', filters)
  }

  render() {
    const {categories} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <View style={{ paddingVertical: 20 }}>
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={() => console.log('SearchCuisines')}>
              <Icon
                name='magnify'
                style={{ padding: 10 }}
                size={23}
                color={Colors.secondaryColor}
              />
              <TextInput
                placeholder="Search cuisines or dishes"
                returnKeyType="search"
                maxLength={50}
                onTouchStart={() => this.props.navigation.navigate('SearchCuisines')}
                pointerEvents='none'
                onChangeText={(value) => {
                  console.log("value", value)
                  this.setState({searchText: value})
                }}
                value={this.state.searchText}
                onKeyPress={this.getCooksList}
              />
            </TouchableOpacity>
            <Icon name='filter-outline' size={23} style={styles.searchFilter} onPress={() => this.props.navigation.navigate('ChefFilters', { onSelect: this.applyFilters })} />
          </View>
        </View>
        <Divider type='full-bleed' style={{ paddingVertical: 20 }} />
        {/*<View style={styles.container}>
          <FlatList
            data={this.state.cooks}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCooks}
            contentContainerStyle={styles.categoriesList}
          />
        </View>*/}

      </SafeAreaView>
    );
  }
}
