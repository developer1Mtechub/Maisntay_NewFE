import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import fonts from '../theme/fonts';

const CustomButton = ({ title, onPress, loading, disabled, customStyle, textCustomStyle }) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.button, customStyle]}
        onPress={onPress}
        disabled={disabled}
      >
        {loading ? <ActivityIndicator size="small" color="#ffffff" /> :
          <Text style={[styles.buttonText, textCustomStyle]}>{title}</Text>}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(15, 109, 106, 1)',
    borderRadius: 30,
    width: '90%',
    //width: '80%',
    // height: 45,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: fonts.fontsType.medium,
    fontSize: fonts.fontSize.font16,
    textAlign: 'center',
  },
});

export default CustomButton;
