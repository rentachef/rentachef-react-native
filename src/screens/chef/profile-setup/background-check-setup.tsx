import React, {useState, useRef, useCallback, useEffect} from 'react'
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import Colors from "../../../theme/colors";
import {Subtitle2} from "../../../components/text/CustomText";
import CameraButton from "../../../components/buttons/CameraButton";
import {launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse} from 'react-native-image-picker';
import {notifyError, notifyWarn} from "../../../components/toast/toast";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../components/buttons/Button";

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  cameraType: 'back',
  quality: 0.5,
  presentationStyle: 'fullScreen',
  saveToPhotos: true
}

interface BackgroundCheckPhotos {
  front: string,
  back: string
}

const ChefBackgroundCheckSetup = () => {
  const [focus, setFocus] = useState(undefined)
  const [showCamera, setShowCamera] = useState(false)
  const [pictures, setPictures] = useState<BackgroundCheckPhotos>({} as BackgroundCheckPhotos)
  const [buttonChoice, setButtonChoice] = useState('')

  useEffect(() => {
    console.log('pictures changed!', pictures)
  }, [pictures]);


  const onButtonPressed = (choice: string) => {
    let func = choice === 'camera' ? launchCamera : launchImageLibrary
    func(cameraOptions)
      .then((data: ImagePickerResponse) => {
        console.log('Photo taken!')
        console.log(data)
        if(!data.didCancel) {
          setShowCamera(false)
          //@ts-ignore
          setPictures({... pictures, [buttonChoice]: data.assets[0].uri})
        }
      })
      .catch(err => alert(err.message))
  }

  const onPhotoDelete = (choice: string) => setPictures({... pictures, [choice]: undefined })

  return (
    <View style={styles.screenContainer}>
      <View style={styles.wrapper}>
        <Subtitle2>To keep our platform safe, you have to pass the mandatory background check.  Please read our Terms of Use and Privacy Notice</Subtitle2>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputGroupItemLabel}>Legal Name</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="enter name matching your photo ID"
          placeholderTextColor={Colors.placeholderColor}
          keyboardType={"default"}
          onFocus={() => setFocus(0) }
          onBlur={() => setFocus(undefined)}
          style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
        />
        <Text style={styles.inputGroupItemLabel}>SSN / SIN</Text>
        <TextInput
          autoCapitalize='none'
          placeholder='XXX-XX-XXXX'
          placeholderTextColor={Colors.placeholderColor}
          keyboardType={"number-pad"}
          onFocus={() => setFocus(1) }
          onBlur={() => setFocus(undefined)}
          style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
        />
        <Text style={styles.inputGroupItemLabel}>Driving License</Text>
        <Subtitle2 style={{ padding: 10 }}>Capture both front and back images of your driving license.  Ensure that the photos are clear.</Subtitle2>
        <View style={styles.buttonsContainer}>
          {pictures && pictures.front ? (
            <View style={{flex: 1}}>
              <Image source={{ uri: pictures.front }} style={{ flex: 1, margin: 5 }}/>
              <Icon name='close-circle' size={40} color='white' style={{ position: 'absolute', right: 5, top: 5 }} onPress={() => onPhotoDelete('front')}/>
            </View>) :
          <CameraButton onPress={() => {
            setShowCamera(true)
            setButtonChoice('front')
          }} text='Front'/>}
          {pictures && pictures.back ? (
              <View style={{flex: 1}}>
                <Image source={{ uri: pictures.back }} style={{ flex: 1, margin: 5 }}/>
                <Icon name='close-circle' size={40} color='white' style={{ position: 'absolute', right: 5, top: 5 }} onPress={() => onPhotoDelete('back')}/>
              </View>) :
            <CameraButton onPress={() => {
          setShowCamera(true)
          setButtonChoice('back')
        }} text='Back' />}
        </View>
        {showCamera && (
          <SafeAreaView style={{flex: 1, position: 'absolute', width: '100%', height: '100%'}}>
            <RACBottomSheet
              onSheetChanges={(index: any) => {
                console.log('value', index)
              }}
              index={showCamera ? 1 : -1}
              onClose={() => setShowCamera(false)}
            >
              <View>
                <TouchableOpacity style={styles.launchItem} onPress={() => onButtonPressed('camera')}>
                  <Text>Open Camera</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.launchItem} onPress={() => onButtonPressed('gallery')}>
                  <Text>Open Gallery</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.launchItem} onPress={() => setShowCamera(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity></View>
            </RACBottomSheet>
          </SafeAreaView>
          )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={!(!!pictures.front && !!pictures.back)}
          onPress={() => console.log('on submit!')}
          title='Submit'
          buttonStyle={!(!!pictures.front && !!pictures.back) && { backgroundColor: Colors.disabled } || {}}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    height: '100%'
  },
  wrapper: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputGroup: {
    flex: 1,
    marginTop: 20
  },
  inputGroupItem: {
    flex: .08,
    paddingHorizontal: 20,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    color: 'black',
  },
  inputGroupItemFocused: {
    borderColor: Colors.primaryColor,
  },
  inputGroupItemLabel: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: .6
  },
  buttonsContainer: {
    margin: 5,
    flex: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  launchItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    width: '100%'
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end'
  }
})

export default ChefBackgroundCheckSetup;
