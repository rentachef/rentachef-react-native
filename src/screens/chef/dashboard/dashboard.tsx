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
import moment from "moment";
import {sumBy} from "lodash";

const dashboardStyles = StyleSheet.create({
  dashboardHeaderContainer: {
    paddingTop: Platform.OS === 'ios' ? '10%' : 0,
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
    justifyContent: 'center'
  }
})

@inject('stores')
@observer
export default class ChefDashboard extends React.Component<any, any> {
  constructor(props: any) {
     super(props)

    this.state = {
      reviews: [],
      earnings: []
    }

    console.log(props.stores?.chefSettingsStore.profile)
  }

  componentDidMount() {
    this.props.stores.chefDashboardStore.getChefReviews()
      .then(reviews => {
        this.setState({ reviews })
      })
    this.props.stores.chefDashboardStore.getChefEarnings()
      .then(earnings => {
        this.setState({ earnings })
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
    const { earnings, reviews } = this.state

    const data = {
      labels: earnings.map(e => `${e._id.month}/${e._id.year}`),
      datasets: [
        {
          data: earnings.map(e => e.total_earnings_month)
        }
      ]
    };

    console.log('DATA:', JSON.stringify(data))

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
                      imageUri={require('@assets/img/profile_1.jpeg')}
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
              style={{marginVertical: 5, marginTop: 10, flex: .25 }}
              onPress={() => this.navigateTo('ChefReviews')}
            >
              <CardContainer
                title={'Ratings and Reviews'}
                style={dashboardStyles.cardContainer}
              >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background}}>
                  <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.background}}>
                    <Icon color={'#FBB12B'} name={'star'} size={25}/>
                    <SmallBoldHeading>{this.calculateAverageStars()}</SmallBoldHeading>
                  </View>
                  <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background}}>
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
