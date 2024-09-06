import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import CustomInput from '../../components/TextInputComponent';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../../components/ButtonComponent';
import CustomSnackbar from '../../components/CustomToast';
import { useDispatch, useSelector } from 'react-redux';
import { postCoacheeProfile } from '../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { postSessionDurations } from '../../redux/coachSlices/postSessionDurationsSlice';
import CustomLayout from '../../components/CustomLayout';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const SessionDuration = ({ navigation }) => {
    const {t} = useCustomTranslation();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.sessionDurations)
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


    const handleSubmitProfile = () => {

        const sessionPayload = [
            { value: '30', amount: inputValues?.thirtyMinutes },
            { value: '60', amount: inputValues?.sixtyMinutes },
            { value: '90', amount: inputValues?.nintyMinutes },]


        const newSessionPayload = {
            durationDetails: sessionPayload
        }
        dispatch(postSessionDurations(newSessionPayload)).then((result) => {
            console.log('final result', JSON.stringify(result?.payload))
            if (result?.payload?.success === true) {
                renderSuccessMessage('Session Added Successfully');
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
        setTimeout(() => {
            resetNavigation(navigation, "CreateStripeAccount")
            //resetNavigation(navigation, "CoachProfileCompletion")
        }, 3000);

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

    // const handleBackPress = () => {
    //     resetNavigation(navigation, 'CoachProfile')
    //     return true;
    //   };

    //   useBackHandler(handleBackPress)

    return (
        <CustomLayout>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container}>

                    <HeaderComponent />

                    <Text style={{
                        fontFamily: fonts.fontsType.bold,
                        fontSize: 22,
                        color: 'rgba(49, 40, 2, 1)',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>{t('setSessionHeading')}</Text>

                    <Text style={{
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 13,
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
                        <TouchableOpacity
                            onPress={() => handleCheckboxChange(1)}
                            style={styles.itemContainer}>
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

                        </TouchableOpacity>
                    </LinearGradient>

                    {isChecked1 && (
                        <CustomInput
                            identifier="thirtyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                            inputType={'number-pad'}
                        />
                    )}

                    {/* second View */}

                    <LinearGradient
                        colors={isChecked2 ? ['rgba(7, 63, 61, 1)', 'rgba(15, 109, 106, 1)', 'rgba(15, 109, 106, 1)'] : ['rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <TouchableOpacity
                            onPress={() => handleCheckboxChange(2)}
                            style={styles.itemContainer}>
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

                        </TouchableOpacity>
                    </LinearGradient>

                    {isChecked2 && (
                        <CustomInput
                            identifier="sixtyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                            inputType={'number-pad'}
                        />
                    )}


                    {/* third View */}

                    <LinearGradient
                        colors={isChecked3 ? ['rgba(7, 63, 61, 1)', 'rgba(15, 109, 106, 1)', 'rgba(15, 109, 106, 1)'] : ['rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)', 'rgba(238, 238, 238, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <TouchableOpacity
                            onPress={() => handleCheckboxChange(3)}
                            style={styles.itemContainer}>
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

                        </TouchableOpacity>
                    </LinearGradient>

                    {isChecked3 && (
                        <CustomInput
                            identifier="nintyMinutes"
                            placeholder={t('sessionInputPlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                            inputType={'number-pad'}
                        />
                    )}


                </View>
                <CustomButton
                    loading={status === 'loading' ? true : false}
                    onPress={() => { handleSubmitProfile() }}
                    title={'Next'}
                    customStyle={{ marginBottom: 40 }} />
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

export default SessionDuration;
