//import liraries
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import EmailIcon from '../../assets/svgs/email_icon.svg'
import ButtonComponent from '../../components/ButtonComponent'
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/HeaderComponent";
import CustomSnackbar from "../../components/CustomToast";
import fonts from "../../theme/fonts";
import { sendEmailVerification } from "../../redux/authSlices/emailVerificationSlice";
import { resetNavigation } from "../../utilities/resetNavigation";
import { ScrollView } from "react-native";
import CustomLayout from "../../components/CustomLayout";
import useBackHandler from "../../components/useBackHandler";
import useCustomTranslation from "../../utilities/useCustomTranslation";
import LanguageSelector from "../../components/LanguageSelector";
import { useAlert } from "../../providers/AlertContext";


const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required")
});

const ForgetPassword = ({ navigation }) => {
  const { t } = useCustomTranslation();
  const dispatch = useDispatch();
  const { showAlert } = useAlert()
  const { status, error } = useSelector((state) => state.emailVerification);

  const handleSendVerificationEmail = (email) => {
    const sendEmail = {
      email: email
    }
    dispatch(sendEmailVerification(sendEmail)).then((result) => {

      if (result?.payload?.success === true) {
        showAlert("Success", "success", result?.payload?.message)
        const params = {
          email: email,
          code: result?.payload?.code
        }
        setTimeout(() => {
          resetNavigation(navigation, 'VerificationCode', params)
        }, 3000);


      } else {
        showAlert("Error", "error", result?.payload?.message)
      }
    });
  };



  const handleBackPress = () => {
    resetNavigation(navigation, 'SignIn')
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
            headerTitle={t('forgetHeaderTitle')}
            customTextStyle={{flex:0,marginStart:10}}
             />
          <Image
            source={require("../../assets/images/forgetPassLogo.png")}
            resizeMode="contain"
            style={styles.imageStyle}
          />
        </View>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
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
              <Text
                style={{
                  fontSize: 13,
                  alignSelf: "center",
                  color: "rgba(125, 125, 125, 1)",
                  marginTop: 10,
                  textAlign: "center",
                  fontFamily: fonts.fontsType.medium,

                }}
              >
                {t('emailInputLabel')}
              </Text>
              <View style={styles.inputTextStyle}>
                <EmailIcon style={{ marginStart: 10 }} width={24} height={24} />
                <TextInput
                  placeholder={t('emailPlaceholder')}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    marginLeft: 20,
                    flex: 1
                  }}
                />
              </View>

              {touched.email && errors.email && (
                <Text style={{ color: "red", marginLeft: 35 }}>
                  {errors.email}
                </Text>
              )}

              <View style={styles.buttonStyle}>
                <ButtonComponent
                  title={t('sendCodeButtonTitle')}
                  loading={status === 'loading' ? true : false}
                  customStyle={{ width: "85%" }}
                  onPress={() => {
                    handleSendVerificationEmail(values.email);
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
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: 60,
  },
  buttonStyle: { marginTop: 80, alignItems: "center" },
  inputTextStyle: {
    width: "85%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,

    backgroundColor: "#F6F6F6",
    alignSelf: "center",
    marginTop: 50,
  },

});

//make this component available to the app
export default ForgetPassword;
