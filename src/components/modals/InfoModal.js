/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {Modal, StatusBar, StyleSheet, Text, View} from 'react-native';

// import components
import Button from '../buttons/Button';
import Icon from '../icon/Icon';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

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
  }
});

// InfoModal Props
type Props = {
  message: string,
  onRequestClose: () => {},
  iconName: string,
  iconColor: string,
  statusBarColor: string,
  title: string,
  buttonTitle: string,
  onButtonPress: () => {},
  onClose: () => void,
  visible: boolean,
};

// InfoModal
const InfoModal = ({
  message,
  onRequestClose = () => {},
  iconName,
  iconColor,
  statusBarColor = 'rgba(0, 0, 0, 0.52)',
  title,
  buttonTitle,
  onButtonPress,
  onClose,
  visible = false,
}: Props) => {
  console.log(onClose)
  return (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
  >
    <StatusBar backgroundColor={statusBarColor} />
    <View style={styles.modalWrapper}>
      <View style={styles.modalContainer}>
        <Icon name={iconName} size={72} color={iconColor} />
        <Text style={styles.title}>{title}</Text>

        {message !== '' && message !== undefined && (
          <Text style={styles.message}>{message}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button buttonStyle={styles.btn} onPress={onButtonPress} title={buttonTitle} />
          <Button buttonStyle={styles.btn} outlined titleColor='indianred' borderColor='indianred' onPress={onClose} title='Cancel' />
        </View>
      </View>
    </View>
  </Modal>
)}

export default InfoModal;
