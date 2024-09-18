import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import EmailIcon from "../../assets/svgs/email_icon.svg";
import ButtonComponent from "../../components/ButtonComponent";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../components/HeaderComponent";
import CountdownTimer from "../../components/CountDownTimer";
import fonts from "../../theme/fonts";
import { sendVerificationCode } from "../../redux/authSlices/sendVerificationCodeSlice";
import { resetNavigation } from "../../utilities/resetNavigation";
import CustomSnackbar from "../../components/CustomToast";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomLayout from "../../components/CustomLayout";
import useBackHandler from "../../components/useBackHandler";
import useCustomTranslation from "../../utilities/useCustomTranslation";
import LanguageSelector from "../../components/LanguageSelector";
import { useAlert } from "../../providers/AlertContext";

const CELL_COUNT = 4;

const VerificationCode = ({ navigation, route }) => {
  const { t } = useCustomTranslation()
  const dispatch = useDispatch();
  const { showAlert } = useAlert()
  const { status, error } = useSelector((state) => state.sendVerificationCode);
  const { email, code } = route.params;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleSendVerificationCode = (code) => {
    const sendPayload = {
      email: email,
      code: code
    }

    dispatch(sendVerificationCode(sendPayload)).then((result) => {
      if (result?.payload?.success == true) {
        renderSuccessMessage(result?.payload?.message)
      } else {
        showAlert("Error", 'error', result?.payload?.message)
      }
    });
  };

  const renderSuccessMessage = (message) => {
    showAlert("Success", 'success', message)
    setTimeout(() => {
      const params = {
        email: email
      }
      resetNavigation(navigation, 'ResetPassword', params)
    }, 3000);

  }

  const handleBackPress = () => {
    resetNavigation(navigation, 'ForgetPassword')
    return true;
  };

  useBackHandler(handleBackPress)

  return (
    <CustomLayout>
      <SafeAreaView style={styles.container}>
        <LanguageSelector />
        <View style={{ marginTop: '5%', marginLeft: 20 }}>
          <HeaderComponent
            navigation={navigation}
            navigateTo={'ForgetPassword'}
            headerTitle={t('verificationHeaderTitle')}
            // customTextStyle={{ marginStart: wp('15%') }}
            customTextStyle={{ flex: 0, marginStart: 10 }}
          />
          <Image
            source={require("../../assets/images/verification_logo.png")}
            resizeMode="contain"
            style={styles.imageStyle}
          />
        </View>

        <View>
          {/* <Text style={styles.welcomeTextStyle}>Verification</Text> */}
          <Text
            style={{
              fontSize: 15,
              alignSelf: "center",
              color: "rgba(125, 125, 125, 1)",
              marginTop: 10,
              textAlign: "center",
              fontFamily: fonts.fontsType.medium
            }}
          >
            {`${t('codeSentMessage')} ${email}`}
          </Text>

          <View style={{ marginHorizontal: 50 }}>
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>

          {/* <CountdownTimer
          initialTime={60}
          onTimeExpired={handleTimeExpired}
          onResendCode={handleResendCode}
        /> */}


          <View style={styles.buttonStyle}>
            <ButtonComponent
              loading={status === 'loading' ? true : false}
              title={t('verifyButtonTitle')}
              customStyle={{ width: wp('80%') }}
              onPress={() => {
                handleSendVerificationCode(value)
              }}
            />
          </View>
        </View>
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
    width: 274,
    height: 211,
    alignSelf: "center",
    marginTop: 60,
  },
  buttonStyle: { marginTop: 50, alignItems: "center" },
  inputTextStyle: {
    width: 360,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F6F6F6",
    alignSelf: "center",
    marginTop: 50,
  },
  welcomeTextStyle: {
    fontSize: 28,
    alignSelf: "center",
    marginTop: 30,
  },
  codeFieldRoot: { marginTop: 50 },
  cell: {
    width: 55,
    height: 52,
    lineHeight: 50,
    fontSize: 24,
    backgroundColor: "#F6F6F6",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#FD8926",
  },
});

//make this component available to the app
export default VerificationCode;
