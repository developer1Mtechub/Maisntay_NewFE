// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Image,
    Text,
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Keyboard
} from 'react-native';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/ButtonComponent';
import EmailIcon from '../../assets/svgs/email_icon.svg';
import PasswordIcon from '../../assets/svgs/pass_icon.svg';
import ShowPassIcon from '../../assets/svgs/show_pass_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import CustomSnackbar from '../../components/CustomToast';
import { BottomSheet } from '@rneui/themed';
import HorizontalDivider from '../../components/DividerLine';
import { registerUser } from '../../redux/authSlices/signUpSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { sendVerificationCode } from '../../redux/authSlices/sendVerificationCodeSlice';
import { BASE_URL } from '../../configs/apiUrl';
import { storeData } from '../../utilities/localStorage';
import { setSignUpToken } from '../../redux/setTokenSlice';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCredentials } from '../../redux/setCredentialsSlice';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import LanguageSelector from '../../components/LanguageSelector';
import { getLocationWithPermission } from '../../utilities/getUserLocation';
import { useAlert } from '../../providers/AlertContext';



const SignUpScreen = ({ navigation, route }) => {
    const { role } = route.params;
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const { status } = useSelector((state) => state.registerUser)
    const codeVerifyStatus = useSelector((state) => state.sendVerificationCode.status);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [userId, setUserId] = useState('')
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);


    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('invalidEmailErrorMessage')).required(t('emailRequiredErrorMessage')),
        password: Yup.string()
            .required(t('passwordRequiredErrorMessage'))
            .test(
                'is-strong-password',
                'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
                value =>
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(value)
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('passwordMatchErrorMessage'))
            .required(t('confirmPasswordRequiredErrorMessage')),
    });


    const checkPasswordStrength = (password) => {
        const strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        setIsPasswordStrong(strongRegex.test(password));
    }


    const renderSuccessMessage = (message, result) => {

        if (role === 'coachee') {
            const params = {
                email: result?.payload?.result?.email,
                code: result?.payload?.result?.code,
                routeData: { role: role }
            }
            resetNavigation(navigation, 'CoacheeVerification', params)

        } else {
            setUserId(result?.payload?.result?.id)
            setIsSheetVisible(true);
        }
    }

    const handleSignup = async (email, password, confirmPassword) => {

        const location = await getLocationWithPermission();
        if (location) {

            if (email === '' || password === '') {
                showAlert("Error", 'error', "Email and password are required!")
                return
            }

            if (password !== confirmPassword) {
                showAlert("Error", 'error', "Passwords do not match.")
                return
            }

            if (!isPasswordStrong) {
                showAlert("Error", 'error', "Please enter strong password.")
                return;
            }

            const userRegister = {
                email: email,
                password: password,
                role: role,
                lat: location?.latitude,
                long: location?.longitude
            };
            const user = {
                email: email,
                password: password,
                lat: location?.latitude,
                long: location?.longitude
            };
            dispatch(setCredentials(user))

            dispatch(registerUser(userRegister)).then((result) => {
                dispatch(setSignUpToken(result?.payload?.result?.accessToken))
                if (result?.payload?.success == true) {
                    renderSuccessMessage(result?.payload?.message, result)
                } else {
                    let message;
                    if (result?.payload?.message === "Email, password, device_id and role are required!") {
                        message = "Email and password are required!";
                    } else {
                        message = result?.payload?.message
                    }
                    showAlert("Error", 'error', message)
                }

            })

        } else {
            showAlert("Error", 'error', 'Enable your location to continue.')
        }



    };

    const verifyCoachEmail = () => {
        resetNavigation(navigation, 'SignIn')
    }


    const renderBottomSheet = (email, code) => {
        return (
            <BottomSheet
                onBackdropPress={() => setIsSheetVisible(false)}
                modalProps={{}}
                isVisible={isSheetVisible}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text style={styles.alertText}>Alert</Text>
                    <HorizontalDivider />
                    <Text style={styles.messageText}>
                        Your sign-up request is being reviewed by the admin
                    </Text>
                    <CustomButton
                        loading={codeVerifyStatus == 'loading' ? true : false}
                        onPress={() => verifyCoachEmail(email, code)}
                        title={'OK'}
                        customStyle={styles.buttonStyleSheet}
                    />
                </View>
            </BottomSheet>
        );
    };

    const handleBackPress = () => {
        resetNavigation(navigation, 'RoleSelector')
        return true;
    };

    useBackHandler(handleBackPress)

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <LanguageSelector />
                <View style={{ marginStart: 20, marginTop: 0 }}>
                    <HeaderComponent
                        navigation={navigation}
                        navigateTo={'RoleSelector'}
                        customTextStyle={{ flex: 0 }}
                    />
                </View>
                {renderBottomSheet()}
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, marginTop: 20 }}>
                    <View>
                        <Formik
                            initialValues={{ email: '', password: '', confirmPassword: '' }}
                            validationSchema={validationSchema}>
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                                errors,
                                touched,
                                isSubmitting,
                                handleBlur,
                            }) => (
                                <View style={styles.loginContainer}>
                                    <Image
                                        style={{ width: 160, height: 90, alignSelf: 'center' }}
                                        source={require('../../assets/images/sign_logo.png')}
                                    />
                                    <Text style={styles.welcomeTextStyle}>
                                        {t('signUpTitle')}
                                    </Text>
                                    <View style={styles.inputTextStyle}>
                                        <EmailIcon style={{ marginStart: 10 }} width={24} height={24} />
                                        <TextInput
                                            placeholder={t('emailPlaceholder')}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
                                            }}
                                        />
                                    </View>

                                    {touched.email && errors.email && (
                                        <Text style={{ color: 'red', marginLeft: 30, marginTop: 10, }}>
                                            {errors.email}
                                        </Text>
                                    )}

                                    {/* Password Input with Eye Icon/Button */}
                                    <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                                        <PasswordIcon
                                            style={{ marginStart: 10 }}
                                            width={24}
                                            height={24}
                                        />
                                        <TextInput
                                            placeholder={t('passwordPlaceholder')}
                                            onChangeText={(text) => {
                                                handleChange('password')(text);
                                                checkPasswordStrength(text); // Call function to check password strength
                                            }}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            secureTextEntry={!showPassword}
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
                                            }}
                                        />

                                        {!showPassword ? <ShowPassIcon
                                            style={{ marginEnd: 10 }}
                                            width={24}
                                            height={24}
                                            onPress={() => { setShowPassword(!showPassword) }}
                                        /> : <Icon onPress={() => { setShowPassword(!showPassword) }}
                                            name="eye-off-outline" color={'#969696'} size={20}
                                            style={{ marginEnd: 10 }} />}
                                    </View>
                                    {touched.password && errors.password && (
                                        <Text style={{ color: 'red', marginLeft: 30, marginTop: 10, width: '85%' }}>
                                            {errors.password}
                                        </Text>
                                    )}
                                    {/* General Error Message */}
                                    {errors.general && (
                                        <Text style={{ color: 'red' }}>{errors.general}</Text>
                                    )}

                                    <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                                        <PasswordIcon
                                            style={{ marginStart: 10 }}
                                            width={24}
                                            height={24}
                                        />
                                        <TextInput
                                            placeholder={t('confirmPasswordPlaceholder')}
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
                                            }}
                                        />

                                        {!showConfirmPassword ? <ShowPassIcon
                                            style={{ marginEnd: 10 }}
                                            width={24}
                                            height={24}
                                            onPress={() => { setShowConfirmPassword(!showConfirmPassword) }}
                                        /> : <Icon onPress={() => { setShowConfirmPassword(!showConfirmPassword) }}
                                            name="eye-off-outline" color={'#969696'} size={20}
                                            style={{ marginEnd: 10 }} />}
                                    </View>
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
                                            {errors.confirmPassword}
                                        </Text>
                                    )}
                                    {/* General Error Message */}
                                    {errors.general && (
                                        <Text style={{ color: 'red' }}>{errors.general}</Text>
                                    )}

                                    <View style={styles.buttonStyle}>
                                        <CustomButton
                                            loading={status == 'loading' ? true : false}
                                            onPress={() => {
                                                Keyboard.dismiss()
                                                handleSignup(values.email, values.password, values.confirmPassword);
                                            }}
                                            title={t('signInButtonText')}
                                            customStyle={{ width: '85%' }}
                                        />
                                    </View>

                                </View>


                            )}
                        </Formik>
                    </View>
                </ScrollView>
                <View style={styles.rowContainer}>
                    <Text style={styles.noAccountText}>
                        {t('noAccountText')}
                    </Text>
                    <Text
                        onPress={() => {
                            Keyboard.dismiss();
                            resetNavigation(navigation, 'SignIn');
                        }}
                        style={styles.signInLinkText}
                    >
                        {t('signInLinkText')}
                    </Text>
                </View>
            </SafeAreaView>

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    imageStyle: {
        width: 215,
        height: 65,
        alignSelf: 'center',
        marginTop: 40,
    },
    loginContainer: {
        backgroundColor: 'white',
        marginTop: 30,
    },
    welcomeTextStyle: {
        fontSize: 28,
        width: widthPercentageToDP('70%'),
        fontFamily: fonts.fontsType.bold,
        marginTop: 30,
        color: 'rgba(31, 29, 43, 1)',
        marginStart: 30,
    },
    buttonStyle: { marginTop: 20, alignItems: 'center' },
    forgetPassTextStyle: {
        fontSize: 15,
        color: 'rgba(15, 109, 106, 1)',
        fontWeight: 'bold',
        marginEnd: 25,
    },
    rememberTextStyle: {
        fontSize: 16,
        flex: 1,
        marginStart: -10,
        color: 'rgba(31, 29, 43, 1)',
    },
    inputTextStyle: {
        width: '85%',
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#F6F6F6',
        alignSelf: 'center',
        marginTop: 30,
        padding: 0,
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    backgroundImage: {
        resizeMode: 'contain',
        width: '100%',
    },
    bottomSheetContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
        padding: 40,
    },
    alertText: {
        fontSize: 24,
        fontWeight: '600',
        color: 'rgba(255, 72, 72, 1)',
        alignSelf: 'center',
        marginBottom: 15,
        marginTop: -15,
    },
    messageText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(49, 40, 2, 1)',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonStyleSheet: {
        width: '100%',
        marginBottom: -10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: Platform.OS === 'ios' ? '8%' : '20%', // Uncomment if needed
        marginBottom: 40,
    },
    noAccountText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: fonts.fontSize.font14,
        color: 'rgba(176, 176, 176, 1)',
    },
    signInLinkText: {
        fontSize: fonts.fontSize.font14,
        fontFamily: fonts.fontsType.bold,
        color: 'rgba(15, 109, 106, 1)',
        marginStart: 5,
    },
});

export default SignUpScreen;
