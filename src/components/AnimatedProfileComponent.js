import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import fonts from '../theme/fonts';
import CircularProgress from 'react-native-circular-progress-indicator';
import { resetNavigation } from '../utilities/resetNavigation';
import { storeData } from '../utilities/localStorage';
import { resetState, signInUser } from '../redux/authSlices/userLoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getData } from '../utilities/localStorage';
import useCustomTranslation from '../utilities/useCustomTranslation';

const AnimatedProfile = ({ percentage, role, navigation }) => {
  const { t } = useCustomTranslation();
  const { signUpToken } = useSelector((state) => state.setToken)
  const { credentials } = useSelector((state) => state.credentials)
  const [fill, setFill] = useState(0);
  const dispatch = useDispatch();

  async function delayAndStoreData(result) {
    const { payload } = result;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await storeData("token", payload?.result?.accessToken);
    await storeData('userData', payload?.result);

  }

  useEffect(() => {

    const navigateToDashboard = async () => {
      const user = {
        email: credentials?.email,
        password: credentials?.password,
        lat: credentials?.lat,
        long: credentials?.long
      };
      dispatch(signInUser(user)).then((result) => {
        if (result?.payload?.success == true) {
          delayAndStoreData(result)
          console.log('animated screen:User Signed In Successfully')
        } else {
          console.log('animated screen error:', result?.payload?.message)
        }

      });
    };

    if (fill === 100) {
      setTimeout(() => {
        navigateToDashboard();
        //checkToken();
      }, 3000);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fill]);


  return (
    <View style={styles.container}>

      <AnimatedCircularProgress
        size={150}
        width={8}
        fill={fill}
        prefill={0}
        duration={2000}
        tintColor="white"
        // delay={50}
        onAnimationComplete={() => { setFill(100) }}
        backgroundColor="rgba(170, 170, 170, 1)" >

        {(fill) => (
          <Text style={{
            fontSize: 34,
            fontFamily: fonts.fontsType.semiBold,
            color: 'white'
          }}>{`${Math.round(fill)}%`}</Text>
        )}



      </AnimatedCircularProgress>

      <Text style={styles.title}>{t('nimatedTitle')}</Text>

      <Text style={styles.subTitle}>{t('nimatedSubTitle')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: fonts.fontsType.bold,
    fontWeight: fonts.fontWeight.bold,
    color: 'rgba(255, 255, 255, 1)',
    width: 353,
    textAlign: 'center',
    marginTop: 20
  },
  subTitle: {
    fontSize: 15,
    fontFamily: fonts.fontsType.medium,
    color: 'rgba(255, 255, 255, 1)',
    width: 353,
    textAlign: 'center',
    marginTop: 20
  }
});

export default AnimatedProfile;
