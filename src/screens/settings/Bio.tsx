import React, {useState, useEffect} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView, StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {Heading6, Text} from '../../components/text/CustomText';
import {Subtitle1, Subtitle2} from "../../components/text/CustomText";
import Colors from '../../theme/colors';
import Divider from "../../components/divider/Divider";
import ContainedButton from "../../components/buttons/ContainedButton";
import {launchImageLibrary, CameraOptions, ImagePickerResponse, Asset} from 'react-native-image-picker';
import {Chip} from "react-native-elements";
import SwitchComponent from "../components/switch-component";
import DatePicker from "react-native-date-picker";
import {ImageGallery, ImageObject} from "@georstat/react-native-image-gallery";
import {inject, observer} from "mobx-react";
import Button from "../../components/buttons/Button";
import {Cuisine} from "../../models/chef/ChefSettings";
import {notifyError, notifySuccess, notifyWarn} from "../../components/toast/toast";
import {isEmpty, map} from "lodash";
import _getBase64 from "../../utils/imageConverter";
import {RACBottomSheet} from "../components/bottom-sheet-modal";
import TimeRangePicker from "../../components/pickers/TimeRangePicker";
import TimeZonePicker from "../../components/pickers/TimeZonePicker";
import {Picker} from "@react-native-picker/picker";
import globalStyles from "../../theme/global-styles";
import DishDialog from "./DishDialog";
import UnderlineTextInput from 'src/components/textinputs/UnderlineTextInput';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import ImageView from "react-native-image-viewing";

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.5
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.background
  },
  item: {
    marginVertical: 20,
    flex: 1
  },
  inputGroupItem: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: 'black',
  },
  inputGroupItemFocused: {
    borderColor: Colors.primaryColor,
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  imageGridItem: {
    margin: 5,
    padding: 2,
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 64,
    minWidth: 64,
    borderColor: Colors.placeholderColor
  },
  button: {
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 6,
    alignSelf: 'center',
    width: '60%'
  },
  chipItem: {
    color: Colors.primaryColor
  },
  imageGalleryHeader: {
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: StatusBar.currentHeight
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
})

interface specialtiesPhotoGallery {
  key: number
  url: string
}

const covid = true

const dynamicResizeImage = (imageUri, width, height) => {
  let divisor = 2.5;
  if (width > 4000 || height > 4000) {
    divisor = 4; // Adjust the divisor based on image size
  } else if (width > 2000 || height > 2000) {
    divisor = 3;
  }

  const newWidth = width / divisor;
  const newHeight = height / divisor;

  return ImageResizer.createResizedImage(
    imageUri,
    newWidth,
    newHeight,
    'JPEG',
    40, // Adjust the quality as needed
    0,
    null,
    false,
    {
      mode: 'contain',
      onlyScaleDown: true
    }
  );
};

const Bio = inject('stores')(observer((props) => {
  console.log('bio mounted', props.stores.chefSettingsStore.bio?.cuisines)
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(undefined)
  const [selectedChips, setSelectedChips] = useState(props.stores.chefSettingsStore.bio?.cuisines?.map(c => c._id) || [])
  const [specialtiesPhotos, setSpecialtiesPhotos] = useState<specialtiesPhotoGallery[]>([])
  const [specialties, setSpecialties] = useState(!isEmpty(props.stores.chefSettingsStore.bio?.specialties) ? [...props.stores.chefSettingsStore.bio?.specialties] : [])
  const [openGallery, setOpenGallery] = useState({ show: false, idx: 0 })
  const [modalIndex, setModalIndex] = useState(-1)
  const [bio, setBio] = useState(!isEmpty(props.stores.chefSettingsStore.bio) ? {...props.stores.chefSettingsStore.bio} : {
    about: '',
    affiliations: '',
    covid: { fullVaccines: false, testDate: undefined }
  })
  const [imgError, setImgError] = useState([])
  const { cuisines } = props.stores.searchStore

  useEffect(() => { //add get cuisines from API
    if(!!bio.photosUris)
      setSpecialtiesPhotos(bio.photosUris.map((url: string, id: number) => {
        return { id, url }
      }))
    if(!bio.covid)
      setBio({...bio, covid: { fullVaccines: false, testDate: undefined } }) //initialize covid
  }, []);

  useEffect(() => {
    console.log('BIO:', bio)
  }, [bio])

  const onSelectChip = (item: string) => {
    let chips = [...selectedChips]
    //adds if not exists or deletes if exists
    if (chips.indexOf(item) !== -1) {
      chips.splice(chips.indexOf(item), 1)
    } else {
      chips.push(item)
    }
    setSelectedChips([...chips])
  }

  const onPhotoSelect = (data: ImagePickerResponse) => {
    let photos = [...specialtiesPhotos]
    if(!data.didCancel) {
      if(data?.assets) {
        dynamicResizeImage(
          data.assets[0].uri,
          data.assets[0].width,
          data.assets[0].height)
            .then((response) => {
              console.log('resize done', response)
              // response.uri is the URI of the new image that can now be displayed, uploaded...
              // response.path is the path of the new image
              // response.name is the name of the new image with the extension
              // response.size is the size of the new image
              photos.push({
                id: photos.length + 1,
                url: response.uri
              });
              setSpecialtiesPhotos([...photos])
            })
            .catch((err) => {
              // Oops, something went wrong. Check that the filename is correct and
              // inspect err to get more details.
              console.log('ERROR!', err)
              //setShowCamera(false)
              //throw err
            });
      }
    }
  }

  const headerComponent = (image: ImageObject, currentIndex: number) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imageGalleryHeader}>
          <Text style={{ color: Colors.background }}>Swipe down on the  image to close</Text>
        </View>
      </SafeAreaView>
    );
  };

  const handleCovid = (v: any, key: string) => {
    let { covid } = bio
    !!covid ? covid[key] = v : covid = { [key]: v }
    setBio({...bio, covid})
  }

  const saveChanges = async () => {
    console.log('saving...')
    setLoading(true)

    try {
      //getting base64 of photos
      let photosUris: string[] = [];
      for(var sp of specialtiesPhotos) {
        let base64 = await _getBase64(sp.url)
        photosUris.push(base64)
      }

      let changes = {
        ...bio,
        cuisines: cuisines.filter((c: Cuisine) => selectedChips.includes(c._id)).map(c => c._id),
        photosUris,
        specialties
      }

      console.log('saving changes', changes)

      await props.stores.chefSettingsStore.saveChefBio(changes)
      setLoading(false)
      notifySuccess('Bio data saved!')
    } catch(e) {
      console.log('Error', e.message)
      setLoading(false)
      notifyError('Error saving Bio data: ' + e.message)
    }
  }

  const onImageError = (index: number) => setImgError([ ...imgError, {
    defaultUri: 'https://static.thenounproject.com/png/3674270-200.png',
    index
  }])

  const isValid = () => selectedChips.length > 0

  const validateSpecialties = () => {
    // Create a map of cuisineId -> number of specialties
    const specialtiesByCuisine = specialties.reduce((acc, specialty) => {
      acc[specialty.cuisineId] = (acc[specialty.cuisineId] || 0) + 1;
      return acc;
    }, {});

    // Check if each selected cuisine has at least one specialty
    const missingSpecialties = selectedChips.some(cuisineId => !specialtiesByCuisine[cuisineId]);
    return !missingSpecialties;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ opacity: modalIndex !== -1 ? 0.5: 1}}>
          <Subtitle2>Let people know more about your culinary expertise.</Subtitle2>
          <View style={styles.item}>
            <Subtitle1>About</Subtitle1>
            <UnderlineTextInput
              placeholder='Tell us about yourself'
              placeholderTextColor={Colors.placeholderTextColor}
              multiline={true}
              numberOfLines={3}
              textAlignVertical='top'
              borderColor={Colors.backgroundLight}
              value={bio.about}
              onChangeText={v => setBio({...bio, about: v})}
              style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
              onFocus={() => setFocus(0)}
              onBlur={() => setFocus(undefined)}
            />
          </View>
          <Divider type='full-bleed' />
          <View style={styles.item}>
            <Subtitle1>Restaurant Affiliations</Subtitle1>
            <UnderlineTextInput
              placeholder='Restaurant Name, City'
              placeholderTextColor={Colors.placeholderTextColor}
              value={bio.affiliations}
              multiline={true}
              numberOfLines={2}
              textAlignVertical='top'
              borderColor={Colors.backgroundLight}
              onChangeText={v => setBio({...bio, affiliations: v})}
              style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
              onFocus={() => setFocus(1)}
              onBlur={() => setFocus(undefined)}
            />
          </View>
          <Divider type='full-bleed' />
          <View style={styles.item}>
            <Subtitle1>Cuisines</Subtitle1>
            <View style={{...styles.imageGrid, marginVertical: 20}}>
              {cuisines.map((item, i: number) => (
                <Chip
                  key={i}
                  title={item.label}
                  onPress={() => onSelectChip(item._id)}
                  type='outline'
                  buttonStyle={[{ borderColor: Colors.placeholderColor}, selectedChips.some((it: string) => it === item._id) && { backgroundColor: Colors.primaryColor }]}
                  containerStyle={{ margin: 2 }}
                  titleStyle={{ color: selectedChips.some((it: string) => it === item._id) ? Colors.background : Colors.secondaryColor }}
                />
              ))}
            </View>
          </View>
          <Divider type='full-bleed' />
          <View style={styles.item}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Subtitle1>Specialties</Subtitle1>
              <Chip
                key='-1'
                title=''
                onPress={() => setModalIndex(0)}
                type='solid'
                icon={{
                  name: "plus",
                  type: "font-awesome",
                  size: 20,
                  color: Colors.primaryText,
                }}
                iconRight
                buttonStyle={{ borderColor: Colors.placeholderColor, backgroundColor: Colors.primaryColor}}
                containerStyle={{ margin: 2 }}
                titleStyle={{ color: Colors.secondaryColor }}
              />
            </View>
            <View style={{...styles.imageGrid, marginTop: 10}}>
              {specialties.map((item, i: number) => (
                <Chip
                  key={i}
                  title={item.label}
                  onPress={() => setSpecialties(specialties.filter(it => it.label !== item.label))}
                  type='outline'
                  icon={{
                    name: "close",
                    type: "font-awesome",
                    size: 20,
                    color: Colors.secondaryColor,
                  }}
                  iconRight
                  buttonStyle={{ borderColor: Colors.placeholderColor}}
                  containerStyle={{ margin: 2 }}
                  titleStyle={{ color: Colors.secondaryColor }}
                />
              ))}
            </View>
          </View>
          <View style={styles.imageGrid}>
            {specialtiesPhotos?.map((item, i: number) => (
              <TouchableOpacity key={i} onPress={() => setOpenGallery({ show: true, idx: i })}>
                <Image
                  key={item.key}
                  style={styles.imageGridItem}
                  source={{ uri: imgError.some(ie => ie.index === i) ? imgError[0].defaultUri : item.url }}
                  onError={() => onImageError(i)}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Button
            onPress={() => launchImageLibrary(cameraOptions, onPhotoSelect)}
            title='Attach Photos'
            titleColor={Colors.black}
            titleStyle={{
              letterSpacing: 1,
              fontWeight: 'bold'
            }}
            buttonStyle={styles.button}
            socialIconName='image'
            color={Colors.white}
            rounded
          />
          {openGallery &&
            <ImageView
              images={specialtiesPhotos.map(img => { return { uri: img.url }})}
              imageIndex={openGallery.idx}
              visible={openGallery.show}
              onRequestClose={() => setOpenGallery({ show: false, idx: 0})}
            />}
          <Divider type='full-bleed' />
          {covid &&
            <View style={styles.item}>
              <Subtitle1>COVID-19 Screening</Subtitle1>
              <View style={styles.imageGrid}>
                <Text style={styles.item}>Are you fully vaccinated?</Text>
                <SwitchComponent key={bio.covid?.fullVaccines} style={{ marginTop: 18 }} checked={bio.covid?.fullVaccines} onSwitch={(v: boolean) => handleCovid(v, 'fullVaccines')} />
              </View>
              <Text>Test Date</Text>
              <DatePicker
                fadeToColor={Colors.backgroundLight}
                maximumDate={new Date()}
                minimumDate={new Date(2020, 1, 1)}
                style={{ alignSelf: 'center'}}
                mode='date'
                date={new Date(bio.covid?.testDate || null) || new Date()}
                onDateChange={(d: Date) => handleCovid(d, 'testDate')}
              />
            </View>}
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                if (!validateSpecialties()) {
                  notifyWarn('Please add at least one specialty for each selected cuisine');
                  return;
                }
                saveChanges();
              }}
              title='Save'
              disabled={!isValid() || loading}
              loading={loading}
              loadingColor={Colors.background}
            />
          </View>
        </ScrollView>
      {modalIndex !== -1 &&
      <SafeAreaView style={{ flex: 1, position: 'absolute', width: Platform.OS === 'android' ? '110%': '100%', height: Platform.OS === 'android' ? '110%' : '100%' }}>
        {
          <RACBottomSheet
            onSheetChanges={(index: any) => {
              console.log('value', index)
            }}
            index={modalIndex}
            enableSwipeClose={true}
            onClose={() => setModalIndex(-1)}
            size={'100%'}
          >
            <DishDialog
              cuisines={cuisines.filter((c: Cuisine) => selectedChips.includes(c._id))}
              onSubmit={({cuisine, dish}) => {
                setSpecialties([...specialties, { ...dish, cuisineId: cuisines.find((c: Cuisine) => c.label === cuisine)._id }])
                setModalIndex(-1)
              }}
            />
          </RACBottomSheet>}
      </SafeAreaView>}
      </SafeAreaView>
    </View>
  )
}))

export default Bio
