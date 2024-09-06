import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import colors from '../../../theme/colors';
import NotificationComponent from '../Components/NotificationComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import CustomButton from '../../../components/ButtonComponent';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const NotificationSettings = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const [switchValue1, setSwitchValue1] = useState(false);
    const [switchValue2, setSwitchValue2] = useState(false);

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };

    useBackHandler(handleBackPress)


    const handleSwitchChange = (switchNumber, newValue) => {
        if (switchNumber === 1) {
            setSwitchValue1(newValue);
        } else if (switchNumber === 2) {
            setSwitchValue2(newValue);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ margin: 30, flex: 1 }}>
                <HeaderComponent
                    navigation={navigation}
                    navigateTo={'Dashboard'}
                    headerTitle={'Notification Settings'}
                    params={{ screen: 'Setting' }}
                    customTextStyle={{ marginStart: 25 }}
                />


                <View style={{ marginTop: 30 }}>
                    <NotificationComponent
                        text="Confirmation Messages"
                        switchValue={switchValue1}
                        onSwitchChange={(newValue) => handleSwitchChange(1, newValue)}
                    />

                    <NotificationComponent
                        text="Upcoming Session Reminders"
                        switchValue={switchValue2}
                        onSwitchChange={(newValue) => handleSwitchChange(2, newValue)}
                    />
                </View>

            </View>

            <CustomButton title={'Save Changes'} customStyle={{ width: widthPercentageToDP('80%') }} />



        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});


export default NotificationSettings;
