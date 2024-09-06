import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../../../components/HeaderComponent';
import fonts from '../../../../theme/fonts';
import CustomInput from '../../../../components/TextInputComponent';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../../../../components/ButtonComponent';
import CustomSnackbar from '../../../../components/CustomToast';
import { useDispatch, useSelector } from 'react-redux';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import { fetchSessionDurations } from '../../../../redux/DashboardSlices/getDurationSlice';
import { updateSessionDuration } from '../../../../redux/coachSlices/updateSessionDurationSlice';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomLayout from '../../../../components/CustomLayout';
import useBackHandler from '../../../../components/useBackHandler';
import { t } from 'i18next';

const UpdateSessionDurations = ({ navigation }) => {

    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.updateSessionDurations)
    const { user_id } = useSelector((state) => state.anyData);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [inputValues, setInputValues] = useState({
        thirtyMinutes: "",
        sixtyMinutes: "",
        nintyMinutes: "",
    });

    const handleInputChange = (text, identifier) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [identifier]: text,
        }));
    };

    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);


    const handleCheckboxChange = (viewNumber) => {
        switch (viewNumber) {
            case 1:
                setIsChecked1(!isChecked1);
                break;
            case 2:
                setIsChecked2(!isChecked2);
                break;
            case 3:
                setIsChecked3(!isChecked3);
                break;
            default:
                break;
        }
    };

    const handleSessionData = (details) => {
        if (details) {
            details.forEach((detail, index) => {
                if (detail?.amount) {
                    handleCheckboxChange(index + 1);
                    handleInputChange(detail.amount, index === 0 ? 'thirtyMinutes' : (index === 1 ? 'sixtyMinutes' : 'nintyMinutes'));
                }
            });
        }
    };

    useEffect(() => {
        dispatch(fetchSessionDurations({ coachId: user_id })).then((result) => {
            handleSessionData(result?.payload?.duration?.details);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user_id]);

    const handleSubmitProfile = () => {

        const sessionPayload = [
            { time: '30', amount: inputValues?.thirtyMinutes, status: isChecked1 },
            { time: '60', amount: inputValues?.sixtyMinutes, status: isChecked2 },
            { time: '90', amount: inputValues?.nintyMinutes, status: isChecked3 }]

        //console.log(sessionPayload)

        const newSessionPayload = {
            durationDetails: sessionPayload
        }
        dispatch(updateSessionDuration(newSessionPayload)).then((result) => {
            if (result?.payload?.success === true) {
                renderSuccessMessage('Changes saved successfully')
                setTimeout(() => {
                    resetNavigation(navigation, 'CoachSettingProfile')
                }, 3000);
            } else {
                renderErrorMessage(result?.payload?.message)
            }
        });

        //navigation.navigate('CoachProfileCompletion')
        //dispatch data here to call api...
    }

    const renderSuccessMessage = (message) => {

        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
    }

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

    const handleBackPress = () => {
        resetNavigation(navigation, 'CoachSettingProfile')
        return true;
    };

    useBackHandler(handleBackPress)

    return (
        <CustomLayout>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={styles.container}>
                    <HeaderComponent
                        navigation={navigation}
                        navigateTo={'CoachSettingProfile'}
                    />
                    <Text style={{
                        fontFamily: fonts.fontsType.bold,
                        fontSize: 25,
                        fontWeight: fonts.fontWeight.bold,
                        color: 'rgba(49, 40, 2, 1)',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>{t('setSessionHeading')}</Text>

                    <Text style={{
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 14,
                        color: 'rgba(49, 40, 2, 1)',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginTop: 10,
                        marginBottom: 10
                    }}>{t('setSessionTitle')}</Text>

                    {renderToastMessage()}

                    {/* First View */}
                    <LinearGradient
                        colors={isChecked1 ? ['rgba(7, 63, 61, 1)', 'rgba(15, 109, 106, 1)', 'rgba(15, 109, 106, 1)'] : ['rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <View style={styles.itemContainer}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.fontsType.semiBold,
                                fontSize: 14,
                                color: isChecked1 ? 'white' : 'rgba(118, 118, 118, 1)'
                            }}>{t('30MinutText')}</Text>
                            <TouchableOpacity onPress={() => handleCheckboxChange(1)}>
                                <View style={[styles.checkbox,
                                {
                                    backgroundColor: isChecked1 ? 'white' : 'rgba(238, 238, 238, 1)',
                                    borderColor: isChecked1 ? 'white' : 'rgba(204, 204, 204, 1)',
                                    borderWidth: isChecked1 ? 0 : 1
                                }]} >
                                    {isChecked1 && (
                                        <Icon name="check" size={15} color="rgba(7, 63, 61, 1)" /> // Replace with the appropriate icon component
                                    )}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>

                    {isChecked1 && (
                        <CustomInput
                            value={inputValues.thirtyMinutes}
                            identifier="thirtyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                        />
                    )}

                    {/* second View */}

                    <LinearGradient
                        colors={isChecked2 ? ['rgba(7, 63, 61, 1)', 'rgba(15, 109, 106, 1)', 'rgba(15, 109, 106, 1)'] : ['rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <View style={styles.itemContainer}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.fontsType.semiBold,
                                fontSize: 14,
                                color: isChecked2 ? 'white' : 'rgba(118, 118, 118, 1)'
                            }}>{t('60MinutText')}</Text>
                            <TouchableOpacity onPress={() => handleCheckboxChange(2)}>
                                <View style={[styles.checkbox,
                                {
                                    backgroundColor: isChecked2 ? 'white' : 'rgba(238, 238, 238, 1)',
                                    borderColor: isChecked2 ? 'white' : 'rgba(204, 204, 204, 1)',
                                    borderWidth: isChecked2 ? 0 : 1
                                }]} >
                                    {isChecked2 && (
                                        <Icon name="check" size={15} color="rgba(7, 63, 61, 1)" /> // Replace with the appropriate icon component
                                    )}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>

                    {isChecked2 && (
                        <CustomInput
                            value={inputValues.sixtyMinutes}
                            identifier="sixtyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                        />
                    )}


                    {/* third View */}

                    <LinearGradient
                        colors={isChecked3 ? ['rgba(7, 63, 61, 1)', 'rgba(15, 109, 106, 1)', 'rgba(15, 109, 106, 1)'] : ['rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <View style={styles.itemContainer}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.fontsType.semiBold,
                                fontSize: 14,
                                color: isChecked3 ? 'white' : 'rgba(118, 118, 118, 1)'
                            }}>{t('90MinutText')}</Text>
                            <TouchableOpacity onPress={() => handleCheckboxChange(3)}>
                                <View style={[styles.checkbox,
                                {
                                    backgroundColor: isChecked3 ? 'white' : 'rgba(238, 238, 238, 1)',
                                    borderColor: isChecked3 ? 'white' : 'rgba(204, 204, 204, 1)',
                                    borderWidth: isChecked3 ? 0 : 1
                                }]} >
                                    {isChecked3 && (
                                        <Icon name="check" size={15} color="rgba(7, 63, 61, 1)" /> // Replace with the appropriate icon component
                                    )}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>

                    {isChecked3 && (
                        <CustomInput
                            value={inputValues.nintyMinutes}
                            identifier="nintyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                        />
                    )}


                </View>
                <CustomButton
                    loading={status === 'loading' ? true : false}
                    onPress={() => { handleSubmitProfile() }}
                    title={t('saveChangesBtn')}
                    customStyle={{ marginBottom: 40, width: wp('90%') }} />
            </SafeAreaView>
        </CustomLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    gradient: {
        borderRadius: 12,
        marginTop: 20,
        height: 50
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputText: {
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 8,
        flex: 1,
    },
});

export default UpdateSessionDurations;
