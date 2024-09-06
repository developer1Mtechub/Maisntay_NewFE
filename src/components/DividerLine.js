import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalDivider = ({ color, height, customStyle }) => {
    const dividerStyle = {
        backgroundColor: color || 'rgba(0, 0, 0, 0.09)',
        height: height || 1,
    };

    return <View style={[styles.divider, dividerStyle, customStyle]} />;
};

const styles = StyleSheet.create({
    divider: {
        width: '100%',
    },
});

export default HorizontalDivider;
