import {StyleSheet} from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  titleStyle: {
    color: colors.black,
    fontFamily: fonts.fontsType.bold,
    fontSize: fonts.fontSize.font32,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    marginHorizontal: 50,
  },
  subTitleStyle: {
    color: colors.textLight,
    fontFamily: fonts.fontsType.regular,
    fontSize: fonts.fontSize.font13,
    marginBottom: 50,
    textAlign: 'center',
    marginHorizontal: 30,
  },

  nextButtonStyle: {
    backgroundColor: colors.primaryColor,
    borderRadius: 50,
    width: '65%',
    height: '70%',
    justifyContent: 'center',
    marginEnd: 30,
    marginBottom: 20,
  },

  skipButtonStyle: {
    width: '65%',
    height: '70%',
    justifyContent: 'center',
    marginEnd: 30,
    marginBottom: 20,
  },

  nextButtonTextStyle: {
    color: colors.white,
    fontFamily: fonts.fontsType.semiBold,
    fontSize: fonts.fontSize.font17,
    textAlign: 'center',
  },

  skipButtonTextStyle: {
    color: colors.black,
    fontFamily: fonts.fontsType.semiBold,
    fontSize: fonts.fontSize.font17,
    textAlign: 'center',
  },
});
