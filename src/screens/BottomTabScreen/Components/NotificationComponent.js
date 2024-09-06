import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import fonts from '../../../theme/fonts';
import colors from '../../../theme/colors';

const NotificationComponent = ({ text, switchValue, onSwitchChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Switch
                value={switchValue}
                onValueChange={onSwitchChange}
                style={styles.switch}
                trackColor={{ false: '#EEEEEE', true: 'rgba(15, 109, 106, 0.3)' }}
                thumbColor={switchValue ? colors.primaryColor : '#CCCCCC'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#EEEEEE', 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        marginVertical: 12, 
        height:50
    },
    text: {
        flex: 1,
        marginRight: 8, 
        fontFamily:fonts.fontsType.medium,
        color:'#767676',
        fontSize:14
    },
    switch: {
        transform: [{ scaleX: 0.7}, { scaleY: 0.7}],
    },
});

export default NotificationComponent;
