import React from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity, Platform} from 'react-native'
import CardContainer from "../../../components/cards/CardContainer";
import {
  Text,
  Heading2,
  Heading5,
  LightText,
  Subtitle1,
  BoldHeading,
  SemiBoldHeading, SmallBoldHeading, Subtitle2
} from '../../../components/text/CustomText'
import {BarChart} from 'react-native-chart-kit'
import Avatar from "../../../components/avatar/Avatar";
import Divider from "../../../components/divider/Divider";
import Icon from "../../../components/icon/Icon"
import Colors from '../../../theme/colors';
import {inject, observer} from 'mobx-react'
import ChefEarning from "../../../models/chef/ChefDashboard";
import moment from "moment-timezone";
import {sumBy, isEmpty, some, every} from "lodash";
import { PERMISSIONS, request, requestNotifications } from 'react-native-permissions';
import InfoModal from 'src/components/modals/InfoModal';
import Geolocation from 'react-native-geolocation-service'
import { checkIfIsOperatingInLocation, initGeocoder } from 'src/utils/geocoder';
import Geocoder from 'react-native-geocoding';
import { CustomerLocation } from 'src/models/user/CustomerSettings';

const dashboardStyles = StyleSheet.create({
  dashboardHeaderContainer: {
    paddingTop: Platform.OS === 'ios' ? '10%' : 0,
    marginTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 10,
    flex: .1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: Colors.background
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center'
  },
  cardContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center'
  }
})

const requestPermissions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('asking for location permission', Platform.OS)
      let locationResult = await request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_ALWAYS)
      console.log('location persmission result:', locationResult)
      console.log('asking for notifications permission', Platform.OS)
      let pushNotifsResult
      if(Platform.OS == 'ios')
        pushNotifsResult = { status: 'granted' }
      else
        pushNotifsResult = await requestNotifications(['alert', 'sound'])
      console.log('notifications permission result:', pushNotifsResult)
      let galleryResult = await request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.IOS.PHOTO_LIBRARY)
      console.log('gallery permission result: ', galleryResult)
      resolve({ locationResult, pushNotifsResult, galleryResult })
    } catch(err) {
      reject(err)
    }
  })
}

@inject('stores')
@observer
export default class ChefDashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      reviews: [],
      earnings: [],
      modalVisible: false,
      modalMessage: '',
      modalType: '',
      locationData: null,
      beginnerSetup: {
        profile: {
          availability: false,
          backgroundCheck: false,
          bankAccount: false,
          workZone: false
        },
        settings: {
          bio: false,
          profile: false
        }
      }
    }

    console.log('Chef profile', props.stores?.chefSettingsStore.profile)
    console.log('Chef profile setup', props.stores?.chefProfileStore)
    console.log('App settings', props.stores?.searchStore.appsettings)
  }

  componentDidMount() {
    console.log('asking for permissions')
    requestPermissions()
      .then(result => {
        console.log('permissions result', result)
        if(result?.pushNotifsResult?.status === 'granted')
          this.props.stores.authStore.saveDeviceToken()
        if(result?.locationResult === 'granted')
          initGeocoder()
      })

    setTimeout(() => {
      this.setState({ beginnerSetup: {
        profile: {
          availability: !isEmpty(this.props.stores.chefProfileStore.availability),
          backgroundCheck: !isEmpty(this.props.stores.chefProfileStore.backgroundCheck),
          bankAccount: !isEmpty(this.props.stores.chefProfileStore.bankAccount),
          workZone: !isEmpty(this.props.stores.chefProfileStore.workZone)
        },
        settings: {
          bio: !isEmpty(this.props.stores.chefSettingsStore.bio),
          profile: !isEmpty(this.props.stores.chefSettingsStore.profile)
        }
      } }, () => { 
        console.log('Checking cook profile...')
        console.log('beginnerSetup.profile', this.state.beginnerSetup.profile)
        console.log('beginnerSetup.settings', this.state.beginnerSetup.settings)
        Geolocation.getCurrentPosition(position => {
          console.log('Chef Dashboard: position', position)
          let coords = !!this.props.stores.chefProfileStore.workZone ? 
            { latitude: this.props.stores.chefProfileStore.workZone.latitude, longitude: this.props.stores.chefProfileStore.workZone.longitude } 
            : position.coords
          checkIfIsOperatingInLocation({ latitude: coords.latitude, longitude: coords.longitude, address: '', city: '', postalCode: '' })
            .then(({ isOperating, locationData }) => {
              if(!isOperating)
                this.setState({ 
                  modalVisible: true,
                  modalMessage: `We are not operating in ${locationData.city}, ${locationData.state}, sign up to be the first one to know when we do!`,
                  modalType: 'not-operating',
                  locationData
                })
            })
        })
        if(some(this.state.beginnerSetup.profile, p => !p) || some(this.state.beginnerSetup.settings, s => !s))
          this.setState({ modalVisible: true, modalMessage: 'Please complete your profile and settings in order to be visible to the consumers', modalType: 'missing-info' })
      })
    }, 5000)

    this.props.stores.chefDashboardStore.getChefReviews()
      .then(reviews => {
        this.setState({ reviews: reviews || [] })
      })
    this.props.stores.chefDashboardStore.getChefEarnings()
      .then(earnings => {
        this.setState({ earnings: earnings || [] })
      })
  }

  calculateAverageStars = () => this.state.reviews.length > 0 ?
    (this.state.reviews.map(r => r.stars).reduce((a, b) => a + b, 0) / this.state.reviews.length).toFixed(1)
    : 0

  navigateTo = (screen: string) => {
    const {navigation} = this.props;
    navigation.navigate(screen, { reviews: this.state.reviews });
  };

  render() {
    const { earnings, reviews, modalVisible, modalType, modalMessage, beginnerSetup, locationData } = this.state

    const data = {
      labels: earnings.map(e => `${e._id.month}/${e._id.year}`),
      datasets: [
        {
          data: earnings.map(e => e.total_earnings_month)
        }
      ]
    };

    const chartConfig = {
        backgroundColor: Colors.backgroundLight,
        backgroundGradientFrom: Colors.backgroundLight,
        backgroundGradientTo: Colors.backgroundLight,
        color: (opacity = 1) => Colors.secondaryText,
        labelColor: (opacity = 1) => Colors.secondaryText,
        style: {
          borderRadius: 100
        },
        strokeWidth: 1, // optional, default 3
        barPercentage: .75,
        useShadowColorFromDataset: false, // optional
        fillShadowGradient: Colors.secondaryText,
        fillShadowGradientOpacity: 1,
        propsForBackgroundLines: {
          stroke: Colors.secondaryText,
          strokeDasharray: '',
          strokeWidth: '.20'
        }
      }
      return (
        <View style={{flex: 1, backgroundColor: Colors.background}}>
          <InfoModal
            visible={modalVisible}
            message={modalMessage}
            locationData={locationData}
            iconName={modalType === 'not-operating' ? 'map-outline' : 'information-circle-sharp'}
            iconColor='indianred'
            buttonTitle={modalType === 'not-operating' ? 'Be the first to know!' : 'Finish profile setup'}
            modalType={modalType}
            onButtonPress={() => {
              if (modalType !== 'not-operating') {
                this.setState({ modalVisible: false })
                if(every(Object.values(beginnerSetup.profile), p => p))
                  this.props.navigation.navigate('Settings')
                else
                  this.props.navigation.navigate('ChefProfileSetupStack')
              }
              return {}
            }}
            onRequestClose={() => {
              console.log('closing...')
              this.setState({ modalVisible: false })
            }}
          />
          <View style={dashboardStyles.dashboardHeaderContainer}>
            <SemiBoldHeading>{`Hi ${this.props.stores?.chefSettingsStore.profile?.fullName?.split(' ')[0] || ''}!`}</SemiBoldHeading>
            {/*<Text>Here is what's going on today</Text>*/}
          </View>
          <View style={dashboardStyles.dashboardContainer}>
            {/*<View style={{marginVertical: 10, marginBottom: 10, flex: .3 }}>
              <CardContainer
                title={'Today\'s Schedule'}
                style={[dashboardStyles.cardContainer, {flex: 1}]}
              >
                <View style={{padding: 5, flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: .85 }}>
                    <Heading5 style={{marginBottom: 3}}>Cook Italian Food</Heading5>
                    <LightText style={{marginBottom: 3}}>3:00 PM at 2972 Westheimer Rd</LightText>
                    <LightText>4 Guests</LightText>
                  </View>
                  <View style={{flex: .15, justifyContent: 'center'}}>
                    <Avatar
                      imageUri={require('@assets/img/profile_1.jpg')}
                      rounded
                      size={50}
                    />
                  </View>
                </View>
              </CardContainer>
              <Divider type='middle' dividerStyle={{ marginVertical: 10 }} />
            </View>*/}

            <View style={{marginVertical: 25, marginTop: 10, flex: .5 }}>
              <View style={{flex: 1, minHeight: 320 }}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <View style={{alignItems: 'flex-start', flex: 1}}><Text style={{justifyContent:'flex-start', alignSelf: 'flex-start'}}>Your Earnings</Text></View>
                  <TouchableOpacity
                    onPress={() => this.navigateTo("ChefEarnings")}
                    style={{alignSelf: 'flex-end' , flex: 1}}
                  >
                    {/*<Text style={{justifyContent:'flex-end', alignSelf: 'flex-end', color: Colors.primaryColor}}>View All</Text>*/}
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <SmallBoldHeading style={{justifyContent:'center', alignSelf: 'center'}}>
                    $ {sumBy(earnings, 'total_earnings_month').toFixed(2) || 0}
                  </SmallBoldHeading>
                  <Subtitle2>Total Earned</Subtitle2>
                </View>
                <BarChart
                  style={{borderRadius: 16}}
                  data={data}
                  showValuesOnTopOfBars={false}
                  showBarTops={false}
                  fromZero={true}
                  width={Dimensions.get("window").width - 50}
                  height={250}
                  //yAxisLabel="$"
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  flatColor={true}
                  withCustomBarColorFromData={false}
                  withInnerLines={true}
                />
                {/*<BarChart
                  style={{borderRadius: 16}}
                  data={data}
                  showValuesOnTopOfBars={false}
                  showBarTops={false}
                  fromZero={true}
                  width={Dimensions.get("window").width - 50}
                  height={250}
                  //yAxisLabel="$"
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  flatColor={true}
                  withCustomBarColorFromData={false}
                  withInnerLines={true}
                />*/}
              </View>
            </View>

            <Divider type={'full-bleed'}/>

            <TouchableOpacity
              style={{marginVertical: 5, marginTop: 10, flex: .3 }}
              onPress={() => this.navigateTo('ChefReviews')}
            >
              <CardContainer
                title={'Ratings and Reviews'}
                style={dashboardStyles.cardContainer}
              >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon color={Colors.primaryColor} name={'star'} size={25} style={{ marginRight: 4 }}/>
                    <SmallBoldHeading>{this.calculateAverageStars()}</SmallBoldHeading>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LightText>{reviews.length || 0} Reviews</LightText>
                  </View>
                </View>
              </CardContainer>
            </TouchableOpacity>
          </View>
        </View>
      )
  }
}
