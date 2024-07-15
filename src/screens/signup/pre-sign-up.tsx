import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView} from "react-native";
import {inject, observer} from "mobx-react";
import Carousel, {Pagination} from "react-native-snap-carousel";

import Colors from "../../theme/colors"
import {BigBoldHeading, SemiBoldHeading, SmallBoldHeading, SmallText} from "../../components/text/CustomText";
import Button from "../../components/buttons/Button";

let PreSignUpImage1 = require("@assets/pre-sign-up/pre-sign-up-image-1.jpeg");
let PreSignUpImage2 = require("@assets/pre-sign-up/pre-sign-up-image-2.jpeg");
let PreSignUpImage3 = require("@assets/pre-sign-up/pre-sign-up-image-3.jpeg");

@inject('stores')
@observer
export default class PreSignUp extends Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.returnContentForSlide = this.returnContentForSlide.bind(this)
    this.navigateTo = this.navigateTo.bind(this)

    this.state = {
      activeSlide: 0,
      carouselItems: [
        {
          title:"Item 1",
          text: "Text 1",
          image: PreSignUpImage1
        },
        {
          title:"Item 2",
          text: "Text 2",
          image: PreSignUpImage2
        },
        {
          title:"Item 3",
          text: "Text 3",
          image: PreSignUpImage3
        }
      ]
    }
  }

  navigateTo = (screen: any, role: string) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen, { role });
  };

  _renderItem({item,index}){
    return (
      <View style={{
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        flex: 1,
          /*borderRadius: 5,
          height: 250,

          marginLeft: 25,
          marginRight: 25,
          width: 200*/
      }}>
        <Image source={item.image} style={{ width: '100%', height: '100%' }}/>
      </View>
    )
  }

  returnContentForSlide() {
    switch (this.state.activeSlide) {
      case (0):
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <SmallBoldHeading>Fine Dining at Home</SmallBoldHeading>
          <SmallText>Hire a chef for your next gathering and experience premium cooking at home.</SmallText>
          </View>
        )
      case (1):
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <SmallBoldHeading>Expand your palate</SmallBoldHeading>
            <SmallText>Try cuisines around the world cooked healthily matching your preferences.</SmallText>
          </View>
        )
      case (2):
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <SmallBoldHeading>It's all about you</SmallBoldHeading>
            <SmallText>Take time to do things that you love without worrying about cooking.</SmallText>
          </View>
        )
    }
  }

  render () {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
        <View style={{ flex: .7, flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Carousel
              loop={true}
              layout={"default"}
              ref={ref => this.carousel = ref}
              data={this.state.carouselItems}
              sliderWidth={500}
              itemWidth={500}
              renderItem={this._renderItem}
              onSnapToItem = { index => this.setState({activeSlide:index}) }
            />
            <Pagination
              dotsLength={this.state.carouselItems.length}
              activeDotIndex={this.state.activeSlide}
              containerStyle={{ backgroundColor: Colors.background, padding: 0, marginTop: -40 }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: Colors.primaryColor
              }}
              inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: Colors.secondaryColor
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
      </View>
        <View style={{flex: .3, flexDirection: 'column', padding: 5, backgroundColor: Colors.background}}>
          <View style={{flex: .33}}>{this.returnContentForSlide()}</View>
          <View style={{flex: .33, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Button onPress={this.navigateTo('SignUp', 'Cook')} buttonStyle={{flex: .4, backgroundColor: Colors.secondaryColor, marginRight: 20}} title={'Join as a chef'} titleColor={'white'}/>
            <Button onPress={this.navigateTo('SignUp', 'Consumer')} buttonStyle={{flex: .4}}  title={'Plan a meal'}/>
          </View>
          <View style={{flex: .34, justifyContent: 'center', alignItems: 'center'}}>
            <SmallText>Already have an account?</SmallText>
            <TouchableOpacity onPress={this.navigateTo("SignIn")}>
              <SmallText style={{color: Colors.primaryColor}}>Log In</SmallText>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    );
  }
}
