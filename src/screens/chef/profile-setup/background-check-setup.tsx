import React, {useState, useRef, useCallback, useEffect} from 'react'
import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Image, TouchableWithoutFeedback, Keyboard, Platform} from "react-native";
import Colors from "../../../theme/colors";
import {Subtitle2} from "../../../components/text/CustomText";
import CameraButton from "../../../components/buttons/CameraButton";
import {launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse} from 'react-native-image-picker';
import {notifyError, notifySuccess, notifyWarn} from "../../../components/toast/toast";
import {RACBottomSheet} from "../../components/bottom-sheet-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../components/buttons/Button";
import {inject, observer} from "mobx-react";
import {isEmpty} from "lodash";
import _getBase64 from "../../../utils/imageConverter";
import {Text} from '../../../components/text/CustomText';
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  cameraType: 'back',
  quality: 0.5,
  presentationStyle: 'fullScreen',
  saveToPhotos: true,
  maxHeight: 600,
  maxWidth: 800
}

const _formatSSN = (value: string) => 
  (value.length === 11 && value.includes('-')) ?
    value
    : value.replace(/^(\d{3})(\d{2})(\d{4})$/, '$1-$2-$3')

const ChefBackgroundCheckSetup = inject('stores')(observer((props: any) => {
  const [focus, setFocus] = useState(undefined)
  const [showCamera, setShowCamera] = useState(false)
  const [buttonChoice, setButtonChoice] = useState('')
  const [loading, setLoading] = useState(false)
  const [backgroundCheck, setBackgroundCheck] = useState({
    legalName: '',
    socialNumber: '',
    idFrontUri: '',
    idBackUri: ''
  })

  useEffect(() => {
    let bgCheck = props.stores.chefProfileStore.retrieveChefBackgroundCheck();
    console.log('bgCheck SSN', bgCheck)
    if(!isEmpty(bgCheck)) {
      setBackgroundCheck({...bgCheck, socialNumber: _formatSSN(bgCheck.socialNumber || '') })
      if(!bgCheck.approved)
        props.navigation.navigate('ChefBackgroundPendingApproval')
    }
    request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
      .then(res => console.log('CAMERA PERMISSION RESULT', res))
  }, []);

  useEffect(() => {
    //console.log(backgroundCheck)
  }, [backgroundCheck])


  const onButtonPressed = (choice: string) => {
    check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
      .then(perm => {
        if(perm === RESULTS.GRANTED) {
          let func = choice === 'camera' ? launchCamera : launchImageLibrary
          func(choice === 'camera' ? cameraOptions : { selectionLimit: 0 })
            .then((data: ImagePickerResponse) => {
              console.log(data)
              if(!data.didCancel) {
                ImageResizer.createResizedImage(
                  data.assets[0].uri,
                  data.assets[0].width / 2,
                  data.assets[0].height / 2,
                  'JPEG',
                  40,
                  0,
                  null,
                  false,
                  {
                    mode: 'contain',
                    onlyScaleDown: true
                  }
                )
                  .then((response) => {
                    console.log('resize done', response)
                    // response.uri is the URI of the new image that can now be displayed, uploaded...
                    // response.path is the path of the new image
                    // response.name is the name of the new image with the extension
                    // response.size is the size of the new image
                    setShowCamera(false)
                    //@ts-ignorer
                    setBackgroundCheck({...backgroundCheck, [buttonChoice]: response.uri})
                  })
                  .catch((err) => {
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                    console.log('ERROR!', err)
                    //setShowCamera(false)
                    //throw err
                  });
              }
            })
            .catch(err => {
              console.log('error', err)
              notifyError(err.message)
            })
        } else {
          notifyError('CAMERA permission was denied')
        }
      })
  }

  const onPhotoDelete = (choice: string) => setBackgroundCheck({...backgroundCheck, [choice]: '' })

  const saveChanges = async () => {
    const { legalName, socialNumber, idFrontUri, idBackUri } = backgroundCheck

    if(isValid()) {
      setLoading(true)
      try {
        await props.stores.chefProfileStore.saveChefBackgroundCheck({
          legalName,
          socialNumber: socialNumber,
          idFrontUri: await _getBase64(idFrontUri),
          idBackUri: await _getBase64(idBackUri),
          approved: false
        }).then(res => {
          if(res === 'SUCCESS') {
            notifySuccess('Background Check saved!')
            const { currentStep, goNextStep } = props.route.params
            goNextStep(currentStep)
          }
          else
            notifyError(`Error: ${res}`)
  
          setLoading(false)
        })
      } catch(e) {
        console.log('Error saving background check', e)
        notifyError(`Error please contact support: ${e.message}`)
      }
    } else {
      notifyError('Please complete all fields')
    }

  }

  const isValid = () => {
    let valid = Object.values(backgroundCheck).filter(v => typeof(v) !== 'boolean').every((v: any) => !isEmpty(v)) && !isEmpty(backgroundCheck) && backgroundCheck.socialNumber.length === 11
    console.log('isValid', valid, backgroundCheck)
    return valid
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screenContainer}>

        <View style={styles.wrapper}>
          <Subtitle2>To keep our platform safe, you have to pass the mandatory background check.  Please read our Terms of Use and Privacy Notice</Subtitle2>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputGroupItemLabel}>Legal Name</Text>
          <UnderlineTextInput
            autoCapitalize="words"
            placeholder="enter name matching your photo ID"
            placeholderTextColor={Colors.placeholderColor}
            keyboardType={"default"}
            value={backgroundCheck.legalName}
            borderColor={Colors.backgroundLight}
            onChangeText={(value: string) => setBackgroundCheck({...backgroundCheck, legalName: value})}
            onFocus={() => setFocus(0) }
            onBlur={() => setFocus(undefined)}
            style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
          />
          <Text style={styles.inputGroupItemLabel}>SSN / SIN</Text>
          <UnderlineTextInput
            autoCapitalize='words'
            placeholder='XXX-XX-XXXX'
            placeholderTextColor={Colors.placeholderColor}
            keyboardType={"number-pad"}
            value={backgroundCheck.socialNumber}
            borderColor={Colors.backgroundLight}
            onChangeText={(value: string) => {
              const formattedSsn = _formatSSN(value);
              setBackgroundCheck({...backgroundCheck, socialNumber: formattedSsn})
            }}
            maxLength={11}
            onFocus={() => setFocus(1) }
            onBlur={() => setFocus(undefined)}
            style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
          />
          <Text style={styles.inputGroupItemLabel}>Driving License</Text>
          <Subtitle2 style={{ padding: 10 }}>Capture both front and back images of your driving license.  Ensure that the photos are clear.</Subtitle2>
          <View style={styles.buttonsContainer}>
            {!!backgroundCheck.idFrontUri ? (
              <View style={styles.pictureView}>
                <Image source={{ uri: backgroundCheck.idFrontUri }} style={styles.picture}/>
                <Icon name='close-circle' size={30} color={Colors.backgroundLight} style={styles.pictureIcon} onPress={() => onPhotoDelete('idFrontUri')}/>
              </View>) :
            <CameraButton onPress={() => {
              setShowCamera(true)
              setButtonChoice('idFrontUri')
            }} text='Front'/>}
            {!!backgroundCheck.idBackUri ? (
                <View style={styles.pictureView}>
                  <Image source={{ uri: backgroundCheck.idBackUri }} style={styles.picture}/>
                  <Icon name='close-circle' size={30} color={Colors.backgroundLight} style={styles.pictureIcon} onPress={() => onPhotoDelete('idBackUri')}/>
                </View>) :
              <CameraButton onPress={() => {
            setShowCamera(true)
            setButtonChoice('idBackUri')
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
            disabled={!isValid || loading}
            onPress={() => saveChanges()}
            title='Submit'
            loading={loading}
            loadingColor={Colors.background}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}))

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
  pictureView: {
    flex: 1,
    margin: 5,
    alignContent: 'center'
  },
  picture: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    alignSelf: 'center',
    transform: [{ rotate: '90deg' }]
  },
  pictureIcon: {
    position: 'absolute',
    right: 10,
    top: 5
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
    margin: 15,
    flex: 1,
    width: '90%',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around'
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
