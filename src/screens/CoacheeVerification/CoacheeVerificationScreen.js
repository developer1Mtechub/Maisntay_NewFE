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
import { sendVerificationCode } from "../../redux/authSlices/sendVerificationCodeSlice";
import { resetNavigation } from "../../utilities/resetNavigation";
import CustomSnackbar from "../../components/CustomToast";
import fonts from "../../theme/fonts";
import { widthPercentageToDP } from "react-native-responsive-screen";
import useBackHandler from "../../components/useBackHandler";
import useCustomTranslation from "../../utilities/useCustomTranslation";

const CELL_COUNT = 4;

const CoacheeVerificationScreen = ({ navigation, route }) => {
  const { t } = useCustomTranslation();
  const { email, code, routeData } = route.params;
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.sendVerificationCode);
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [toastType, setToastType] = useState('');

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleSendVerificationCode = (value) => {
    const sendPayload = {
      email: email,
      code: value
    }
    console.log("sendPayload", sendPayload);
    dispatch(sendVerificationCode(sendPayload)).then((result) => {
      //console.log(result?.payload)
      if (result?.payload?.success == true) {
        renderSuccessMessage(result?.payload?.message)
      } else {
        renderErrorMessage(result?.payload?.message)
      }
    });
  };

  const renderSuccessMessage = (message) => {
    setMessage('Success')
    setDescription(message)
    setIsVisible(true);
    setToastType('success')
    setTimeout(() => {
      resetNavigation(navigation, 'GenderSelection', { routeData: routeData })
    }, 3000);

  }

  const renderErrorMessage = (message) => {
    setMessage('Error')
    setDescription(message)
    setIsVisible(true);
    setToastType('error')
  }


  const handleTimeExpired = () => {
    // Handle what should happen when the timer expires
    console.log('Timer expired');
  };

  const handleResendCode = () => {
    // Handle the logic to resend the verification code
    console.log('Resending code...');
  };


  const renderToastMessage = () => {
    return <CustomSnackbar visible={isVisible} message={message}
      messageDescription={description}
      onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
  }

  const handleBackPress = () => {
    resetNavigation(navigation, 'SignUp')
    return true;
  };

  useBackHandler(handleBackPress)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <HeaderComponent
          navigation={navigation}
          navigateTo={'SignUp'}
          headerTitle={t('verificationHeaderTitle')} />
        <Image
          source={require("../../assets/images/verification_logo.png")}
          resizeMode="contain"
          style={styles.imageStyle}
        />
      </View>
      {renderToastMessage()}
      <View>
        {/* <Text style={styles.welcomeTextStyle}>Verification</Text> */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.fontsType.medium,
            alignSelf: "center",
            color: "#A9A9A9",
            marginTop: 10,
            textAlign: "center",
            marginHorizontal: widthPercentageToDP('8%')
          }}
        >
          {`${t('codeSentMessage1')} ${email} ${t('codeSentMessage2')}`}
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
            onPress={() => {
              handleSendVerificationCode(value)
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageStyle: {
    width: 173,
    height: 138,
    alignSelf: "center",
    marginTop: 60,
  },
  buttonStyle: { marginTop: 80, alignItems: "center" },
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
export default CoacheeVerificationScreen;
