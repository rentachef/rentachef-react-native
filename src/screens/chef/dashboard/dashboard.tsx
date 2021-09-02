import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import CardContainer from "../../../components/cards/CardContainer";
import {
  Text,
  Heading2,
  Heading5,
  LightText,
  Subtitle1,
  BoldHeading,
  SemiBoldHeading
} from '../../../components/text/CustomText'
import {BarChart} from 'react-native-chart-kit'
import Avatar from "../../../components/avatar/Avatar";
import Divider from "../../../components/divider/Divider";
import Icon from "../../../components/icon/Icon";

const dashboardStyles = StyleSheet.create({
  dashboardHeaderContainer: {
    marginTop: 50,
    marginBottom: 10,
    flex: .1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  dashboardContainer: {
    flex: .8,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
})

export default class ChefDashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
      const data = {
        labels: ["Jan", "Feb", "March", "April", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43]
          }
        ]
      };
      const chartConfig = {
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgb(251, 177, 43, ${opacity})`,
          labelColor: (opacity = 1) => `rgb(74, 81, 95, ${opacity})`,
          style: {
            borderRadius: 100,

          },
          strokeWidth: 1, // optional, default 3
          barPercentage: .75,
          useShadowColorFromDataset: false, // optional
          fillShadowGradient: "#FBB12B",
          fillShadowGradientOpacity: 1,
          propsForBackgroundLines: {
            stroke: '#4a515f',
            strokeDasharray: '',
            strokeWidth: '.20'
          }
        }
        return (
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <View style={dashboardStyles.dashboardHeaderContainer}>
              <SemiBoldHeading>Hi Jenny!</SemiBoldHeading>
              <Text>Here is what's going on today</Text>
            </View>
            <View style={dashboardStyles.dashboardContainer}>
              <View style={{marginVertical: 15, marginBottom: 10, flex: .3 }}>
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
                        imageUri={require('../../../assets/img/profile_1.jpeg')}
                        rounded
                        size={50}
                      />
                    </View>
                  </View>
                </CardContainer>
              </View>

              <Divider type={'middle'}/>

              <View style={{marginVertical: 15, marginTop: 10, flex: .5 }}>
                {/*<CardContainer
                  title={'Your Earnings'}
                  style={[dashboardStyles.cardContainer, {flex: 1}]}
                >
                  <View style={{flex: 1}}>
                    <View style={{alignItems: 'center'}}><Text>Total Earned</Text></View>
                    <BarChart
                      style={{borderRadius: 16}}
                      data={data}
                      showValuesOnTopOfBars={false}
                      showBarTops={false}
                      fromZero={true}
                      width={Dimensions.get("window").width - 60}
                      height={180}
                      //yAxisLabel="$"
                      chartConfig={chartConfig}
                      verticalLabelRotation={0}
                      flatColor={true}
                      withCustomBarColorFromData={false}
                      withInnerLines={true}
                    />
                  </View>
                </CardContainer>*/}
                <View style={{flex: 1.5}}>
                  <View style={{alignItems: 'center'}}><Text>Total Earned</Text></View>
                  <BarChart
                    style={{borderRadius: 16}}
                    data={data}
                    showValuesOnTopOfBars={false}
                    showBarTops={false}
                    fromZero={true}
                    width={Dimensions.get("window").width - 60}
                    height={250}
                    //yAxisLabel="$"
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    flatColor={true}
                    withCustomBarColorFromData={false}
                    withInnerLines={true}
                  />
                </View>
              </View>

              <Divider type={'middle'}/>

              <View style={{marginVertical: 5, marginTop: 10, flex: .25 }}>
                <CardContainer
                  title={'Ratings and Reviews'}
                  style={[dashboardStyles.cardContainer, {flex: 1}]}
                >
                  <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>

                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                      <Icon color={'#FBB12B'} name={'star'} size={30}/>
                      <BoldHeading>4.8</BoldHeading>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <LightText>14 Reviews</LightText>
                    </View>
                  </View>
                </CardContainer>
              </View>
            </View>
          </View>

        )
    }
}
