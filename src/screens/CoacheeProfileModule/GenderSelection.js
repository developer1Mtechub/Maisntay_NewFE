import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change this to your preferred icon library
import fonts from '../../theme/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import HorizontalDivider from '../../components/DividerLine';
import CustomButton from '../../components/ButtonComponent';
import { resetNavigation } from '../../utilities/resetNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAnyData } from '../../redux/setAnyTypeDataSlice';
import useBackHandler from '../../components/useBackHandler';
import CustomSnackbar from '../../components/CustomToast';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const GenderSelectionScreen = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { routeData } = route.params;
    const [selectedGender, setSelectedGender] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    };

    const handleNavigation = () => {
        if (selectedGender == null) {
            renderErrorMessage("Please select gender.")
            return
        }
        const newPayload = {
            ...routeData,
            gender: selectedGender
        }
        dispatch(setAnyData(newPayload))
        resetNavigation(navigation, "CoacheeProfile")
    }


    const handleBackPress = () => {
        resetNavigation(navigation, 'CoacheeVerification')
        return true;
    };

    useBackHandler(handleBackPress)


    const renderErrorMessage = (message) => {

        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }


    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <HeaderComponent
                navigateTo={'CoacheeVerification'}
                navigation={navigation}
                customContainerStyle={{ marginStart: 20 }}
            />

            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 22,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}>{t('genderTitle')}</Text>

            <Text style={{
                fontFamily: fonts.fontsType.medium,
                fontSize: 14,
                color: '#7D7D7D',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 10,
                width: '80%'
            }}>{t('genderSubTitle')}</Text>
            {renderToastMessage()}

            <HorizontalDivider height={1} customStyle={{ width: '90%', alignSelf: 'center', marginTop: 50 }} />

            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', marginTop: 50 }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        borderWidth: 1,
                        borderColor: selectedGender === 'male' ? 'rgba(15, 109, 106, 1)' : 'rgba(0, 0, 0, 0.17)',
                        overflow: 'hidden',
                    }}
                    onPress={() => handleGenderSelection('male')}
                >
                    <LinearGradient
                        colors={[selectedGender === 'male' ? '#073F3D' : '#fff', selectedGender === 'male' ? 'rgba(15, 109, 106, 1)' : '#FFF']}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: 60,
                        }}
                    >
                        <Icon name="mars" size={50} color="rgba(121, 121, 121, 1)" />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: selectedGender === 'male' ? '#FFF' : 'rgba(121, 121, 121, 1)',
                            fontSize: 14,
                            marginTop: 10
                        }}>Male</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 75,
                        borderWidth: 1,
                        borderColor: selectedGender === 'female' ? 'rgba(15, 109, 106, 1)' : 'rgba(0, 0, 0, 0.17)',
                        overflow: 'hidden',
                    }}
                    onPress={() => handleGenderSelection('female')}
                >
                    <LinearGradient
                        colors={[selectedGender === 'female' ? '#073F3D' : '#fff', selectedGender === 'female' ? 'rgba(15, 109, 106, 1)' : '#FFF']}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            borderRadius: 75,
                        }}
                    >
                        <Icon name="venus" size={50} color="rgba(121, 121, 121, 1)" />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: selectedGender === 'female' ? '#FFF' : 'rgba(121, 121, 121, 1)',
                            fontSize: 14,
                            marginTop: 10
                        }}>Female</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <CustomButton
                onPress={() => {
                    handleNavigation();

                }}
                title={t('nextButtonTitle')}
                customStyle={{ marginBottom: 40 }} />

        </SafeAreaView>
    );
};

export default GenderSelectionScreen;
