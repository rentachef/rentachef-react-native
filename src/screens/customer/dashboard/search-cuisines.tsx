import React, {useEffect, useRef, useState} from 'react'
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Colors from "../../../theme/colors";
import {SmallBoldHeading, Subtitle1} from "../../../components/text/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import getImgSource from "../../../utils/getImgSource";
import TouchableItem from "../../../components/TouchableItem";
import UnderlineTextInput from "../../../components/textinputs/UnderlineTextInput";
import {Timestamp} from "react-native-reanimated/lib/types/lib/reanimated2";
import moment from "moment";
const imgHolder = require('../../../assets/img/imgholder.png');

const recentSearchesMock = ['BBQ', 'Italian', 'Butter chicken']

interface RecentSearch {
  timestamp: number,
  text: string
}

const categories = [
    {
      key: 1,
      imageUri: require('../../../assets/img/pizza_3.jpg'),
      name: 'Pizza',
    },
    {
      key: 2,
      imageUri: require('../../../assets/img/meat_1.jpg'),
      name: 'Grill',
    },
    {
      key: 3,
      imageUri: require('../../../assets/img/spaghetti_2.jpg'),
      name: 'Pasta',
    },
    {
      key: 4,
      imageUri: require('../../../assets/img/soup_1.jpg'),
      name: 'Soups',
    },
    {
      key: 5,
      imageUri: require('../../../assets/img/salad_1.jpg'),
      name: 'Salads',
    },
    {
      key: 6,
      imageUri: require('../../../assets/img/cake_2.jpg'),
      name: 'Dessert',
    },
  {
    key: 7,
    imageUri: require('../../../assets/img/barbecue_1.jpg'),
    name: 'BBQ',
  },
  {
    key: 8,
    imageUri: require('../../../assets/img/cake_2.jpg'),
    name: 'Dessert',
  },
  {
    key: 9,
    imageUri: require('../../../assets/img/cake_2.jpg'),
    name: 'Dessert',
  },
  {
    key: 10,
    imageUri: require('../../../assets/img/cake_2.jpg'),
    name: 'Dessert',
  }
]

const Item = ({ item, onPress, onDelete }) => (
  <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
    <Text style={styles.title}>{item.text}</Text>{<Icon name='close' onPress={() => onDelete(item)} size={20} />}
  </TouchableOpacity>
);

const SearchCuisines = ({ navigation }) => {
  const [focus, setFocus] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredCategories, setFilteredCategories] = useState(categories || [])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    if(searchText.length > 0)
      filterCategories()
    else
      setFilteredCategories(categories)
  }, [searchText])

  useEffect(() => {
    setRecentSearches([{ text: 'BBQ', timestamp: moment().valueOf()}])
  }, []);

  const renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={() => navigation.navigate('ChefResults', { searchedValue: item.name })}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  const filterCategories = () => setFilteredCategories(categories.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())))

  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <UnderlineTextInput
        placeholder="Search cuisines or dishes"
        returnKeyType="search"
        maxLength={50}
        inputContainerStyle={focus ? { borderWidth: 2, borderColor: Colors.primaryColor } : {}}
        onFocus={() => setFocus(true)}
        value={searchText}
        onSubmitEditing={() => setRecentSearches([...recentSearches, { text: searchText, timestamp: moment().valueOf() }])}
        onChangeText={(text: string) => {
          setSearchText(text)
        }}
      />
      <SafeAreaView style={{ marginVertical: 20 }}>
        {recentSearches.length > 0 &&
          <>
            <SmallBoldHeading>Recent Searches</SmallBoldHeading>
            <SectionList
              sections={[{ data: recentSearches}]}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) =>
                <Item
                  item={item}
                  onPress={(item: RecentSearch) => setSearchText(item.text)}
                  onDelete={(item: RecentSearch) => setRecentSearches([...recentSearches.filter(i => i.timestamp !== item.timestamp)])}
                />}
            />
          </>}
      </SafeAreaView>
      <View>
        <SmallBoldHeading>Cuisines</SmallBoldHeading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {filteredCategories.map((cat, index) => renderCategoryItem({item: cat, index}))}
        </View>
      </View>
    </ScrollView>
  )
}

export default SearchCuisines

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.backgroundDark,
    borderRadius: 8
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 15,
    letterSpacing: .8
  },
  cardImg: {
    borderRadius: 4
  },
  card: {
    flexBasis: '46.8%',
    justifyContent: 'center',
    margin: 5,
    height: 70,
    resizeMode: 'cover'
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    alignSelf: 'center',
    padding: 20,
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: .5,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  }
})
