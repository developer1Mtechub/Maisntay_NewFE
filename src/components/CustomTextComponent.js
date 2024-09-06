import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../theme/fonts';
import colors from '../theme/colors';

const CustomTextComponent = ({ text, icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30
    },
    icon: {
        marginRight: 10,
    },
    text: {
        marginLeft: 10,
        fontFamily: fonts.fontsType.medium,
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.8)'
    },
});

export default CustomTextComponent;
