import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView, StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
import {notifySuccess} from "../../components/toast/toast";
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

const specialtiesPhotoUris = [
  { key: 1, url: 'data:image/jpeg;base64,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'},
  { key: 2, url: 'https://static.wikia.nocookie.net/gensin-impact/images/b/bf/Item_Stormcrest_Pie.png/revision/latest?cb=20210428163016'},
  { key: 3, url: 'data:image/jpeg;base64,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wM9FWSC6ZGh16EHUdjwIXgfxVK06DLnRlIJQ/hY6cjw5S+vs9xvbYDDtzCZT6qSp/KV5tD7N8bTBFCqlRT9LHIfxuPxEnH2a7Or4fCdliKZpstRrAlT3TY3BUnS5PxOqrw5pMjXdPCN+m60le1HAixUviZiVlEsRMxCJERCJERCJERCJMETMQi8KmGU6WnC2luZgq989CmT1AsfwkkiEVaY/7JMI1+zarT9CGH/cDOHiPsfqDWliR/FTIPyrfylzzFp7JXslUdU+zPaS+CvTP/MqD81nidxdsDg6n0rf1EvfLMZBPcxXuYqiRuNtk/WP/m/oJ6J9nG1G8VamP+bUP5LLyyCLCMxTMVS9H7Iq7f2uJT2Vm/zETsYH7IMOv9pVqv5DKo/AX/GWjaZnkleSVE9m7g4GjYrQUkc3ux/GSGhg0QWUADoAAPgTbieLxfKoBPqIhEiIhFggQBMxCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCJERCL//2Q=='},
  { key: 4, url: 'data:image/jpeg;base64,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'}
]

const cuisines: Cuisine[] = [
  { key: 'Asian', label: 'Asian' },
  { key: 'BBQ', label: 'BBQ' },
  { key: 'Mexican', label: 'Mexican' },
  { key: 'Italian', label: 'Italian' }
]

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

  useEffect(() => { //add get cuisines from API
    //props.stores.chefSettingsStore.setChefBio({...props.stores.chefSettingsStore.bio, covid: { fullVaccines: false, testDate: undefined }, specialties: []})
    if(!!bio.cuisines)
      setSelectedChips(props.stores.chefSettingsStore.bio?.cuisines?.map((c: Cuisine) => c.key))
    if(!!bio.specialties)
      setSpecialtiesPhotos(bio.specialties.map((url: string, id: number) => {
        return { id, url }
      }))
    if(!bio.covid)
      setBio({...bio, covid: { fullVaccines: false, testDate: undefined } }) //initialize covid
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
    //getting base64 of photos
    let specialties: string[] = [];
    for(var sp of specialtiesPhotos) {
      let base64 = await _getBase64(sp.url)
      specialties.push(base64)
    }

    props.stores.chefSettingsStore.setChefBio({
      ...bio,
      cuisines: cuisines.filter((c: Cuisine) => selectedChips.includes(c.key)),
      specialties
    })
    notifySuccess('Bio data saved!')
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
          <Subtitle1>Specialities</Subtitle1>
          <TextInput
            placeholder='Add your specialties separated by commas.'
            placeholderTextColor={Colors.placeholderTextColor}
            multiline={true}
            numberOfLines={3}
            value={bio.specialities}
            onChangeText={v => setBio({...bio, specialities: v})}
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
                onPress={() => onSelectChip(item.key)}
                type='outline'
                buttonStyle={[{ borderColor: Colors.placeholderColor}, selectedChips.some((it: string) => it === item.key) && { backgroundColor: Colors.primaryColor}]}
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
