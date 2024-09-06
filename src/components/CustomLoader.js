import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const FullScreenLoader = ({ visible }) => {
  return (
    visible === 'loading' && <View style={styles.loaderContainer}>
      <ActivityIndicator color={colors.primaryColor} size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FullScreenLoader;
