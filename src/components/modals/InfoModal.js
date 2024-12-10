/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useEffect, useState } from 'react';
import {Modal, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';

// import components
import Button from '../buttons/Button';
import Icon from '../icon/Icon';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import UnderlineTextInput from '../textinputs/UnderlineTextInput';
import { isEmpty } from 'lodash';
import {inject} from "mobx-react";

// InfoModal Config

// InfoModal Styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: Layout.SCREEN_WIDTH - 3 * Layout.MEDIUM_MARGIN,
    borderRadius: 4,
    backgroundColor: Colors.background,
  },
  title: {
    paddingVertical: 8,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primaryText,
  },
  message: {
    marginBottom: 16,
    padding: 8,
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 12,
    width: '100%',
  },
  btn: {
    marginVertical: 5,
  },
  btnTitle: {
    width: '100%',
  },
  notOperatingContainer: {
    height: '100%',
    width: '100%'
  }
});

// InfoModal Props
type Props = {
  message: string,
  locationData: WaitingList | null,
  onRequestClose: () => void,
  iconName: string,
  iconColor: string,
  statusBarColor: string,
  title: string,
  modalType: string,
  buttonTitle: string,
  onButtonPress: () => void,
  onClose: () => void,
  visible: boolean,
};

// InfoModal
const InfoModal = inject('stores')((props: any) => {
  const {
    message,
    locationData,
    onRequestClose,
    iconName,
    iconColor,
    statusBarColor = 'rgba(0, 0, 0, 0.52)',
    title,
    modalType,
    buttonTitle,
    onButtonPress,
    onClose,
    visible = false,
  } = props;

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    validateEmail(email);
  }, [email]);

  const handleEmailChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(String(email).toLowerCase()) || isEmpty(email);
    setIsEmailValid(isValid);
    return isValid;
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      console.error('Invalid email format');
      return;
    }

    console.log('adding to waiting list', {...props.locationData, email})
    if(props.locationData)
      props.stores.searchStore.addToWaitingList({...props.locationData, email})
        .then(res => {
          console.log('res', res)
          if(res === 'OK')
          props.onRequestClose()
        })
  };

  return (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <StatusBar backgroundColor={statusBarColor} />
    <View style={styles.modalWrapper}>
      <View style={modalType === 'not-operating' ? { ...styles.modalContainer, ...styles.notOperatingContainer } : styles.modalContainer}>
        <Icon name={iconName} size={72} color={iconColor} />
        <Text style={styles.title}>{title}</Text>

        {message !== '' && message !== undefined && (
          <Text style={styles.message}>{message}</Text>
        )}

        {modalType !== 'not-operating' && <View style={styles.buttonContainer}>
          <Button buttonStyle={styles.btn} onPress={onButtonPress} title={buttonTitle} />
          <Button buttonStyle={styles.btn} outlined titleColor='indianred' borderColor='indianred' onPress={onClose} title='Cancel' />
        </View>}
        {modalType === 'not-operating' && 
        <View style={styles.buttonContainer}>
          <UnderlineTextInput
            onChangeText={handleEmailChange}
            onFocus={() => {}}
            inputFocused={false}
            onSubmitEditing={handleEmailSubmit}
            blurOnSubmit={false}
            keyboardType="email-address"
            placeholder="E-mail"
            placeholderTextColor={Colors.placeholderText}
            inputTextColor={Colors.primaryText}
            error={!isEmailValid}
            errorMessage="Invalid email format"
            borderColor={isEmailValid ? Colors.primaryColor : Colors.error}
          />
          <Button 
            buttonStyle={{...styles.btn, marginVertical: 20}} 
            titleStyle={styles.btnTitle} 
            onPress={handleEmailSubmit} 
            title={buttonTitle} 
            disabled={!isEmailValid || isEmpty(email)}
          />
          <Button buttonStyle={{...styles.btn, backgroundColor: 'transparent'}} onPress={onRequestClose} title='Close' />
        </View>}
      </View>
    </View>
  </Modal>
)})

export default InfoModal;
