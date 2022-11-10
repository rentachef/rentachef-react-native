import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView, StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {Text} from '../../components/text/CustomText';
import {Subtitle1, Subtitle2} from "../../components/text/CustomText";
import Colors from '../../theme/colors';
import Divider from "../../components/divider/Divider";
import ContainedButton from "../../components/buttons/ContainedButton";
import {launchImageLibrary, CameraOptions, ImagePickerResponse, Asset} from 'react-native-image-picker';
import {Chip} from "react-native-elements";
import SwitchComponent from "../components/switch-component";
import DatePicker from "react-native-date-picker";
import {ImageGallery, ImageObject} from "@georstat/react-native-image-gallery";
import {inject} from "mobx-react";
import Button from "../../components/buttons/Button";
import {Cuisine} from "../../models/chef/ChefSettings";
import {notifyError, notifySuccess} from "../../components/toast/toast";
import {isEmpty} from "lodash";
import _getBase64 from "../../utils/imageConverter";

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
    backgroundColor: Colors.backgroundMedium,
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

const Bio = inject('stores')((props) => {
  const [focus, setFocus] = useState(undefined)
  const [selectedChips, setSelectedChips] = useState([])
  const [specialtiesPhotos, setSpecialtiesPhotos] = useState<specialtiesPhotoGallery[]>([])
  const [openGallery, setOpenGallery] = useState(false)
  const [bio, setBio] = useState({...props.stores.chefSettingsStore.bio} || {
    about: '',
    affiliations: [],
    covid: { fullVaccines: false, testDate: undefined }
  })
  const { cuisines } = props.stores.searchStore

  useEffect(() => { //add get cuisines from API
    if(!!bio.cuisines)
      setSelectedChips(props.stores.chefSettingsStore.bio?.cuisines?.map((c: Cuisine) => c._id))
    if(!!bio.photosUris)
      setSpecialtiesPhotos(bio.photosUris.map((url: string, id: number) => {
        return { id, url }
      }))
    if(!bio.covid)
      setBio({...bio, covid: { fullVaccines: false, testDate: undefined } }) //initialize covid

    console.log(bio)
  }, []);

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
        photos.push({
          id: photos.length + 1,
          url: data.assets[0].uri
        });
        setSpecialtiesPhotos([...photos])
      }
    }
  }

  const headerComponent = (image: ImageObject, currentIndex: number) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imageGalleryHeader}>
          <Text style={{ color: Colors.background }}>Swipe down to close</Text>
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
        photosUris
      }

      await props.stores.chefSettingsStore.saveChefBio(changes)
      //notifySuccess('Bio data saved!')
    } catch(e) {
      console.log('Error', e.message)
      notifyError('Error saving Bio data: ' + e.message)
    }
  }

  const isValid = () => selectedChips.length > 0

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Subtitle2>Let people know more about your culinary expertise.</Subtitle2>
        <View style={styles.item}>
          <Subtitle1>About</Subtitle1>
          <TextInput
            placeholder='Tell us about yourself'
            placeholderTextColor={Colors.placeholderTextColor}
            multiline={true}
            numberOfLines={5}
            value={bio.about}
            onChangeText={v => setBio({...bio, about: v})}
            style={[styles.inputGroupItem, focus === 0 && styles.inputGroupItemFocused]}
            onFocus={() => setFocus(0)}
            onBlur={() => setFocus(undefined)}
            textAlignVertical='top'
          />
        </View>
        <Divider type='full-bleed' />
        <View style={styles.item}>
          <Subtitle1>Restaurant Affiliations</Subtitle1>
          <TextInput
            placeholder='Restaurant Name, City'
            placeholderTextColor={Colors.placeholderTextColor}
            value={bio.affiliations}
            onChangeText={v => setBio({...bio, affiliations: v})}
            style={[styles.inputGroupItem, focus === 1 && styles.inputGroupItemFocused]}
            onFocus={() => setFocus(1)}
            onBlur={() => setFocus(undefined)}
          />
        </View>
        <Divider type='full-bleed' />
        <View style={styles.item}>
          <Subtitle1>Specialties</Subtitle1>
          <TextInput
            placeholder='Add your specialties separated by commas.'
            placeholderTextColor={Colors.placeholderTextColor}
            multiline={true}
            numberOfLines={3}
            value={bio.specialties}
            onChangeText={v => setBio({...bio, specialties: v})}
            style={[styles.inputGroupItem, focus === 2 && styles.inputGroupItemFocused]}
            onFocus={() => setFocus(2)}
            onBlur={() => setFocus(undefined)}
            textAlignVertical='top'
          />
        </View>
        <View style={styles.imageGrid}>
          {specialtiesPhotos?.map(item => (
            <TouchableOpacity onPress={() => setOpenGallery(true)}>
              <Image key={item.key} style={styles.imageGridItem} source={{ uri: item.url }}/>
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
          <ImageGallery
            close={() => setOpenGallery(false)}
            renderHeaderComponent={headerComponent}
            isOpen={openGallery}
            images={specialtiesPhotos}
          />}
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
                buttonStyle={[{ borderColor: Colors.placeholderColor}, selectedChips.some((it: string) => it === item._id) && { backgroundColor: Colors.primaryColor}]}
                containerStyle={{ margin: 2 }}
                titleStyle={{ color: Colors.secondaryColor }}
              />
            ))}
          </View>
        </View>
        {covid &&
          <View style={styles.item}>
            <Subtitle1>COVID-19 Screening</Subtitle1>
            <View style={styles.imageGrid}>
              <Text style={styles.item}>Are you fully vaccinated?</Text>
              <SwitchComponent key={bio.covid?.fullVaccines} style={{ marginTop: 18 }} checked={bio.covid?.fullVaccines} onSwitch={(v: boolean) => handleCovid(v, 'fullVaccines')} />
            </View>
            <Text>Test Date</Text>
            <DatePicker
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
            onPress={() => saveChanges()}
            title='Save'
            disabled={!isValid()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

export default Bio
