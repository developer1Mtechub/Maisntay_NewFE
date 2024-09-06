import Metrics from './metrics';

const fontSize = {
  font6: Metrics.screenWidth * (6 / 365),
  font8: Metrics.screenWidth * (8 / 365),
  font10: Metrics.screenWidth * (10 / 365),
  font12: Metrics.screenWidth * (12 / 365),
  font13: Metrics.screenWidth * (13 / 365),
  font11: Metrics.screenWidth * (11 / 365),
  font14: Metrics.screenWidth * (14 / 365),
  font15: Metrics.screenWidth * (15 / 365),
  font16: Metrics.screenWidth * (16 / 365),
  font17: Metrics.screenWidth * (17 / 365),
  font18: Metrics.screenWidth * (18 / 365),
  font19: Metrics.screenWidth * (19 / 365),
  font20: Metrics.screenWidth * (20 / 365),
  font24: Metrics.screenWidth * (24 / 365),
  font26: Metrics.screenWidth * (26 / 365),
  font27: Metrics.screenWidth * (27 / 365),
  font35: Metrics.screenWidth * (35 / 365),
  font32: Metrics.screenWidth * (32 / 365),
};

const fontWeight = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const fontsType = {
  bold: 'Montserrat-Bold',
  medium: 'Montserrat-Medium',
  regular: 'Montserrat-Regular',
  semiBold: 'Montserrat-SemiBold',
  light: 'Montserrat-Light',
  thin: 'Montserrat-Thin',
};

export default {
  fontSize,
  fontWeight,
  fontsType,
};
