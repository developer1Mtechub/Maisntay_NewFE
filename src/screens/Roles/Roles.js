import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import HorizontalDivider from '../../components/DividerLine';
import SelectedIcon from '../../assets/svgs/selected_icon.svg'
import UnSelectedIcon from '../../assets/svgs/unselect_icon.svg'
import CustomButton from '../../components/ButtonComponent';
import { resetNavigation } from '../../utilities/resetNavigation';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';


const RoleSelector = ({ navigation }) => {
    const {t} = useCustomTranslation()
    const roles = [
        { name: 'Coach', image: require('../../assets/images/coach_role.png') },
        { name: 'Coachee', image: require('../../assets/images/coachee_role.png') }
    ];
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelection = (role) => {
        console.log(role.name)
        setSelectedRole(role.name);

        // You can perform additional actions based on the selected role if needed
    };

    const handleBackPress = () => {
        resetNavigation(navigation, 'SignIn')
        return true;
    };

    useBackHandler(handleBackPress)

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent navigation={navigation} navigateTo={'SignIn'} />
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.label}>{t('label')}</Text>
                <Text style={styles.subtitle}>{t('subtitle')}</Text>
            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 20 }} />
            <View style={styles.roleContainer}>
                {roles.map((role, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.roleButton,
                            role.name === selectedRole && styles.selectedRoleButton,
                        ]}
                        onPress={() => handleRoleSelection(role)}
                    >
                        <Image
                            style={{ width: 130, height: 110, margin: 8 }}
                            resizeMode='contain'
                            source={role.image} />

                        <HorizontalDivider height={1} customStyle={{ marginTop: 20, width: '70%', alignSelf: 'center' }} />
                        <Text
                            style={[
                                styles.roleButtonText,
                                role.name === selectedRole && styles.selectedRoleButtonText,
                            ]}
                        >
                            {role.name}
                        </Text>
                        {
                            role.name === selectedRole ? <SelectedIcon width={26} height={26}
                                style={{ alignSelf: 'center', marginTop: 10 }} /> :
                                <UnSelectedIcon width={26} height={26} style={{ alignSelf: 'center', marginTop: 10 }} />
                        }
                    </TouchableOpacity>
                ))}
            </View>
            <CustomButton
                onPress={() => {

                    const params = { role: selectedRole == 'Coach' ? 'coach' : 'coachee' }
                    resetNavigation(navigation, "SignUp", params)
                }}
                customStyle={{
                    width: '90%',
                    color: selectedRole != null ? 'black'
                        : 'white',
                    marginTop: '40%',
                    backgroundColor: selectedRole != null ? 'rgba(15, 109, 106, 1)'
                        : 'rgba(209, 209, 209, 1)'
                }} title={t('continueButtonTitle')}
                textCustomStyle={{
                    color: selectedRole != null ? 'white'
                        : 'black'
                }}
                disabled={selectedRole != null ? false : true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        // margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1
    },
    label: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 24,
        marginBottom: 10,
        color: 'black'
    },
    subtitle: {
        fontFamily: fonts.fontsType.light,
        fontSize: 13,
        marginBottom: 10,
        width: widthPercentageToDP('70%'),
        color: 'rgba(125, 125, 125, 1)',
        textAlign: 'center'
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,

    },
    roleButton: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        // width: 173,
        // height: 264,
        width: 160,
        height: 250,
        margin: 8
    },
    selectedRoleButton: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(15, 109, 106, 1)',
        // width: 173,
        // height: 264,
        width: 160,
        height: 250,
        margin: 8
    },
    roleButtonText: {
        fontSize: 19,
        color: 'rgba(33, 33, 33, 0.4)',
        alignSelf: 'center',
        marginTop: 10
    },
    selectedRoleButtonText: {
        fontSize: 19,
        color: 'rgba(15, 109, 106, 1)',
        alignSelf: 'center',
        marginTop: 10
    },
    selectedRoleText: {
        fontSize: 19,
        color: 'rgba(15, 109, 106, 1)',
    },
});

export default RoleSelector;
