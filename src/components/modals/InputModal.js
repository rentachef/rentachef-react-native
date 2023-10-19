/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// import components
import Button from '../buttons/Button';
import LinkButton from '../buttons/LinkButton';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import { isEmpty } from 'lodash';
import { Subtitle2 } from '../text/CustomText';

// InputModal Config
const IOS = Platform.OS === 'ios';

// InputModal Styles
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: Layout.SCREEN_WIDTH - 3 * Layout.MEDIUM_MARGIN,
    borderRadius: 4,
    backgroundColor: Colors.background,
  },
  title: {
    marginBottom: 4,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primaryText,
  },
  message: {
    marginBottom: 16,
    padding: 8,
    fontWeight: '400',
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
  textInput: {
    height: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
    width: '100%',
  },
  button: {
    borderRadius: 4,
  },
});

// InputModal Props
type Props = {
  message: string,
  onRequestClose: () => {},
  title: string,
  inputDefaultValue: string,
  inputPlaceholder: string,
  inputKeyboardType:
    | 'default'
    | 'number-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad',
  buttonTitle: string,
  onButtonPress: () => {},
  onClosePress: () => {},
  statusBarColor: string,
  visible: boolean,
};

// InputModal
const InputModal = ({
  message,
  onRequestClose,
  step,
  title,
  inputDefaultValue,
  inputPlaceholder,
  inputKeyboardType,
  error,
  buttonTitle,
  onButtonPress,
  onClosePress,
  statusBarColor = 'rgba(0, 0, 0, 0.52)',
  visible = false,
}: Props) => {
  const [otp, setOtp] = useState('')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    setOtp(''),
    setNewPass('')
  }, [step])

  return (
  <Modal
    animationType="none"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}>
    <StatusBar backgroundColor={statusBarColor} />
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <View style={styles.modalWrapper}>
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView behavior="position" enabled={IOS}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{title}</Text>

              {message !== '' && message !== undefined && (
                <Text style={styles.message}>{message}</Text>
              )}

              {step === 1 && (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      autoCapitalize="none"
                      defaultValue={inputDefaultValue}
                      placeholder={inputPlaceholder}
                      keyboardType={inputKeyboardType}
                      style={styles.textInput}
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={onButtonPress}
                      disabled={isEmpty(inputDefaultValue)}
                      title={buttonTitle}
                      buttonStyle={styles.button}
                    />
                  </View>
                </>)}

              {step === 2 && (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      autoCapitalize="none"
                      defaultValue={otp}
                      placeholder={'Code'}
                      onChangeText={setOtp}
                      keyboardType={inputKeyboardType}
                      style={styles.textInput}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      autoCapitalize="none"
                      defaultValue={newPass}
                      placeholder={'New Password'}
                      onChangeText={setNewPass}
                      keyboardType={inputKeyboardType}
                      style={styles.textInput}
                    />
                    {!isEmpty(error) && <Subtitle2 style={{ color: Colors.error }}>{error}</Subtitle2>}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={() => onButtonPress(otp, newPass)}
                      disabled={isEmpty(otp) || isEmpty(newPass)}
                      title={buttonTitle}
                      buttonStyle={styles.button}
                    />
                  </View>
                </>
              )}

              <LinkButton
                onPress={onClosePress}
                title={'Close'.toUpperCase()}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
)};

export default InputModal;
