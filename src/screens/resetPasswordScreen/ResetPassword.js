//import liraries
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../components/ButtonComponent";
import ShowPassIcon from '../../assets/svgs/show_pass_icon'
import PasswordIcon from '../../assets/svgs/pass_icon.svg'
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/HeaderComponent";
import fonts from "../../theme/fonts";
import { resetPassword } from "../../redux/authSlices/resetPasswordSlice";
import { resetNavigation } from "../../utilities/resetNavigation";
import CustomSnackbar from "../../components/CustomToast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomLayout from "../../components/CustomLayout";
import useBackHandler from "../../components/useBackHandler";
import useCustomTranslation from "../../utilities/useCustomTranslation";
import LanguageSelector from "../../components/LanguageSelector";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPassword = ({ navigation, route }) => {
  const { t } = useCustomTranslation();
  const { email } = route.params;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [toastType, setToastType] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.resetPassword);

  const handleResetPassword = (email, password, confirmPassword) => {

    if (password !== confirmPassword) {
      renderErrorMessage("Passwords do not match.");
      return
    }

    const payload = {
      email: email,
      password: password
    };

    // console.log('payload', payload)

    dispatch(resetPassword(payload)).then((result) => {
      //console.log(result?.payload)
      if (result?.payload?.success == true) {
        renderSuccessMessage(result?.payload?.message)
      } else {
        renderErrorMessage(result?.payload?.message)
      }
    });;
  };

  const renderSuccessMessage = (message) => {
    setMessage('Success')
    setDescription(message)
    setIsVisible(true);
    setToastType('success')
    setTimeout(() => {
      resetNavigation(navigation, 'SignIn')
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

  const handleBackPress = () => {

    return true;
  };

  useBackHandler(handleBackPress)

  return (
    <CustomLayout>

      <SafeAreaView style={styles.container}>
        <LanguageSelector />
        <View style={{ marginTop: '10%', marginLeft: 20 }}>
          <HeaderComponent
            navigation={navigation}
            navigateTo={'SignIn'}
            headerTitle={t('resetPasswordHeaderTitle')} />
          <Image
            source={require("../../assets/images/reset_password_logo.png")}
            resizeMode="contain"
            style={styles.imageStyle}
          />
        </View>
        {renderToastMessage()}
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (values.password === values.confirmPassword) {
              handleResetPassword(email, values.password, values.confirmPassword);
            } else {
              renderErrorMessage("Passwords do not match.");
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            isSubmitting,
            handleBlur,
          }) => (
            <View>
              {/* <Text style={styles.welcomeTextStyle}>Reset Password</Text> */}
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(125, 125, 125, 1)",
                  marginTop: 30,
                  textAlign: "center",
                  fontFamily: fonts.fontsType.medium
                }}
              >
                {t('resetPasswordText')}
              </Text>
              <View style={[styles.inputTextStyle, { marginTop: 40 }]}>
                <PasswordIcon style={{ marginStart: 10 }} width={24} height={24} />
                <TextInput
                  placeholder={t('passwordPlaceholder')}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
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
                  onPress={() => setShowPassword(!showPassword)}
                /> : <Icon onPress={() => setShowPassword(!showPassword)} name="eye-off-outline" color={'#969696'} size={20} style={{ marginEnd: 10 }} />}
              </View>
              {touched.password && errors.password && (
                <Text style={{ color: "red", marginLeft: 30, marginTop: 5 }}>
                  {errors.password}
                </Text>
              )}

              <View style={[styles.inputTextStyle, { marginTop: 20 }]}>
                <PasswordIcon style={{ marginStart: 10 }} width={24} height={24} />
                <TextInput
                  placeholder={t('confirmPasswordPlaceholder')}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
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
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                /> : <Icon onPress={() => setShowConfirmPassword(!showConfirmPassword)} name="eye-off-outline" color={'#969696'} size={20} style={{ marginEnd: 10 }} />}
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{ color: "red", marginLeft: 30, marginTop: 5 }}>
                  {errors.confirmPassword}
                </Text>
              )}

              <View style={styles.buttonStyle}>
                <ButtonComponent
                  title={t('resetButtonTitle')}
                  loading={status == 'loading' ? true : false}
                  customStyle={{ width: "85%" }}
                  onPress={() => {
                    handleResetPassword(email, values.password, values.confirmPassword)
                  }}
                />
              </View>
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </CustomLayout>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageStyle: {
    width: 220,
    height: 150,
    alignSelf: "center",
    marginTop: 60,
  },
  buttonStyle: {
    marginTop: 30,
    alignItems: "center"
  },

  inputTextStyle: {
    width: '85%',
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
    marginTop: 50,
  },
  welcomeTextStyle: {
    fontSize: 28,
    alignSelf: "center",
    marginTop: 30,
  },
});

//make this component available to the app
export default ResetPassword;
