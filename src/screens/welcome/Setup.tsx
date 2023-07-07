import React, { useEffect } from 'react'
import {ActivityIndicator, Modal, View} from "react-native";
import {Text, SmallBoldHeading, SmallBoldText} from "../../components/text/CustomText";
import Colors from "../../theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import globalStyles from "../../theme/global-styles";
import Button from "../../components/buttons/Button";

const SetupModal = ({ missing, navigateTo }) => {
    console.log('MISSING', missing)
    return (
        <Modal>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryText }}>
                <View style={{ flex: .5, justifyContent: 'center' }}>
                    <SmallBoldHeading style={{ color: Colors.onPrimaryColor, textAlign: 'center' }}>Please complete your profile and settings first</SmallBoldHeading>
                </View>
                {missing.map((v, i) => (
                    <View key={i} style={{ flex: .30, width: '80%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icon name='account-cog' size={30} color={Colors.primaryColor} />
                            <SmallBoldHeading style={{ color: Colors.onPrimaryColor }}>{v.title}</SmallBoldHeading>
                            <Button
                                buttonStyle={{ width: '15%'}}
                                socialIconName='chevron-right'
                                iconStyle={{ alignSelf: 'center' }}
                                onPress={() => navigateTo(v)}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </Modal>
    )
}

export default SetupModal