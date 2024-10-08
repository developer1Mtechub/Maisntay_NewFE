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
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/ButtonComponent';
import EmailIcon from '../../assets/svgs/email_icon.svg';
import PasswordIcon from '../../assets/svgs/pass_icon.svg';
import ShowPassIcon from '../../assets/svgs/show_pass_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import AndroidCheckBox from '@react-native-community/checkbox';
import { CheckBox } from '@rneui/themed';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import CustomSnackbar from '../../components/CustomToast';
import { resetState, signInUser } from '../../redux/authSlices/userLoginSlice';
import { getData, removeData, storeData } from '../../utilities/localStorage';
import { resetNavigation } from '../../utilities/resetNavigation';
import { setSignUpToken } from '../../redux/setTokenSlice';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCredentials } from '../../redux/setCredentialsSlice';
import { setAnyData } from '../../redux/setAnyTypeDataSlice';
import colors from '../../theme/colors';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import i18n from '../../i18n';
import { getLocationWithPermission } from '../../utilities/getUserLocation';
import LanguageSelector from '../../components/LanguageSelector';
import CountryCodePicker from '../../components/CountryCodePicker';
import { useAlert } from '../../providers/AlertContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SignInScreen = ({ navigation }) => {
  const { showAlert } = useAlert()
  const { t, changeLanguage } = useCustomTranslation();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.userLogin)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');


  useEffect(() => {
    const loadStoredCredentials = async () => {
      const storedCredentials = await getData('remember_me');
      if (storedCredentials && storedCredentials.email && storedCredentials.password) {
        const { email, password } = storedCredentials;
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      }
    };
    loadStoredCredentials();
  }, []);

  useEffect(() => {
    const currentLanguage = i18n.language;
    if (currentLanguage === 'en') {
      setSelectedLanguage("English")
    } else if (currentLanguage === 'de') {
      setSelectedLanguage("German")
    }
  }, [])

  async function delayAndStoreData(result) {
    const { payload } = result;
    const { user } = payload.result;

    if (user.role === 'coach') {
      console.log('condition 1')
      const { is_completed, is_stripe_completed } = user?.coach;
      console.log('hhhh', user?.coach.is_completed)
      if (!user?.coach.is_completed) {
        await removeData("accessToken");
        await storeData("accessToken", payload?.result?.accessToken);
        resetNavigation(navigation, 'CoachProfile');
      }
      if (is_completed && is_stripe_completed) {
        console.log('condition 3')
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await storeData("token", payload?.result?.accessToken);
        await storeData('userData', payload?.result);
      } else if (is_completed && !is_stripe_completed) {
        console.log('condition 4')
        await storeData('userData', payload?.result);
        navigation.navigate('CreateStripeAccount');
      }
    }
    else {
      console.log('condition 2')
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await storeData("token", payload?.result?.accessToken);
      await storeData('userData', payload?.result);
    }

  }

  const renderSuccessMessage = async (message, result) => {
    showAlert("Success", 'success', message)
    delayAndStoreData(result);
  }


  const handleSignInUserCall = async (email, password) => {
    const location = await getLocationWithPermission();
    console.log(location)
    
    if (location) {

      const user = { email: email, password: password, lat: location?.latitude, long: location?.longitude };
      dispatch(setCredentials(user))
      dispatch(setAnyData({}));
      if (rememberMe) {
        await storeData('remember_me', user);
      } else {
        await removeData('remember_me');
      }
      dispatch(signInUser(user)).then((result) => {
        dispatch(setSignUpToken(result?.payload?.result?.accessToken))
        if (result?.payload?.success == true) {
          renderSuccessMessage('User Signed In Successfully', result)
        } else {
          showAlert("Error", 'error', result?.payload?.message || 'Network Error')
        }

      });

    } else {
      showAlert("Error", 'error', "Enable your location to continue.")
    }

  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
            <View style={{ marginStart: 20, marginTop: 20 }}>
              <HeaderComponent
                isBackBtn={false}
              />
            </View>

            <TouchableOpacity // Language button
              style={styles.languageButton}
              onPress={() => setLanguageDropdownVisible(!languageDropdownVisible)}>
              <Text style={styles.languageButtonText}>{selectedLanguage}</Text>
            </TouchableOpacity>
            {languageDropdownVisible && ( // Language dropdown menu
              <View style={styles.languageDropdown}>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => {
                    changeLanguage('en')
                    setSelectedLanguage('English');
                    setLanguageDropdownVisible(false);
                  }}>
                  <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    color: colors.blackTransparent
                  }}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => {
                    changeLanguage('de')
                    setSelectedLanguage('German');
                    setLanguageDropdownVisible(false);
                  }}>
                  <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    color: colors.blackTransparent
                  }}>German</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ marginTop: (languageDropdownVisible) ? 50 : 0 }}>
              <Formik
                enableReinitialize={true}
                initialValues={{ email: email, password: password }}
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
                      {t('signInTitle')}
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
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
                        style={{
                          marginLeft: 20,
                          flex: 1
                        }}
                      />
                    </View>

                    {touched.email && errors.email && (
                      <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
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
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
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
                      <Text style={{ color: 'red', marginLeft: 30, marginTop: 10 }}>
                        {errors.password}
                      </Text>
                    )}
                    {/* General Error Message */}
                    {errors.general && (
                      <Text style={{ color: 'red' }}>{errors.general}</Text>
                    )}

                    <View style={styles.textContainer}>
                      {Platform.OS == 'android' ? (
                        <AndroidCheckBox
                          value={rememberMe}
                          onValueChange={() => { setRememberMe(!rememberMe), Keyboard.dismiss() }}
                          style={{ marginLeft: 20, marginEnd: 10, marginTop: '-1%' }}
                        />
                      ) : (
                        <CheckBox
                          checked={rememberMe}
                          onPress={() => { setRememberMe(!rememberMe), Keyboard.dismiss() }}
                          iconType="material-community"
                          checkedIcon="checkbox-marked"
                          uncheckedIcon="checkbox-blank"
                          checkedColor={'rgba(15, 109, 106, 1)'}
                          uncheckedColor="rgba(235, 235, 235, 1)"
                          containerStyle={{ marginTop: '-3%', marginLeft: 20 }}
                        />
                      )}

                      <Text
                        onPress={() => {
                          Keyboard.dismiss();
                          setRememberMe(!rememberMe)
                        }}
                        style={styles.rememberTextStyle}> {t('rememberMeText')}</Text>
                      <Text
                        style={styles.forgetPassTextStyle}
                        onPress={() => {
                          navigation.navigate('ForgetPassword');
                        }}>
                        {t('forgetPasswordText')}
                      </Text>
                    </View>

                    <View style={styles.buttonStyle}>
                      <CustomButton
                        loading={status === 'loading' ? true : false}
                        onPress={() => {
                          Keyboard.dismiss();
                          handleSignInUserCall(values.email, values.password);
                        }}
                        title={t('signInButton')}
                        customStyle={{ width: '85%' }}
                      />
                    </View>

                  </View>
                )}
              </Formik>
            </View>

          </ScrollView>
          <View
            style={styles.signupContainer}>
            <Text
              style={styles.noAccountStyle}>
              {t('noAccountText')}
            </Text>
            <Text
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('RoleSelector');
              }}
              style={styles.signupLink}>
              {t('signUpLinkText')}
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    width: widthPercentageToDP('60%'),
    fontFamily: fonts.fontsType.bold,
    marginTop: 30,
    color: 'rgba(31, 29, 43, 1)',
    marginStart: 30,

  },
  buttonStyle: { marginTop: 20, alignItems: 'center' },
  forgetPassTextStyle: {
    fontSize: 13,
    color: 'rgba(15, 109, 106, 1)',
    fontFamily: fonts.fontsType.semiBold,
    marginEnd: 25,
  },
  rememberTextStyle: {
    fontSize: 13,
    flex: 1,
    marginStart: -10,
    fontFamily: fonts.fontsType.medium,
    color: 'rgba(49, 40, 2, 1)',
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
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.primaryColor
  },
  languageButtonText: {
    fontSize: 16,
    fontFamily: fonts.fontsType.medium,
    color: colors.primaryColor
  },
  languageDropdown: {
    position: 'absolute',
    top: 40,
    right: 12,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: colors.primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 35,

  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  noAccountStyle: {
    fontSize: fonts.fontSize.font14,
    color: 'rgba(176, 176, 176, 1)',
    fontFamily: fonts.fontsType.regular
  },
  signupLink: {
    fontSize: fonts.fontSize.font14,
    fontFamily: fonts.fontsType.semiBold,
    color: 'rgba(15, 109, 106, 1)',
    marginStart: 5,
  }
});

export default SignInScreen;
