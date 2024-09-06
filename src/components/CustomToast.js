import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import fonts from '../theme/fonts';
import SuccessIcon from '../assets/svgs/success_icon.svg'
import ErrorIcon from '../assets/svgs/error_icon.svg'

// import CheckSnackBar from '../svg/CheckSnackBar.svg'

const CustomSnackbar = ({
    visible,
    message,
    messageDescription,
    onDismiss,
    height,
    translation,
    toastType,
    isPupNoti
}) => {
    const [animation] = useState(new Animated.Value(0));
    useEffect(() => {
        if (visible) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false, // Ensure you have this set to false for Android
            }).start();
            const timeout = setTimeout(() => {
                onDismiss();
            }, 3000);
            return () => clearTimeout(timeout);
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0], // Slide in from the top
                            }),
                        },
                    ],
                    height: height,
                    
                },
            ]}>
            <View style={{
                flexDirection: 'row', zIndex: 30,
                shadowOpacity: 0.3,
                backgroundColor: 'white',
                elevation: 8, 
                borderRadius: 12, 
                marginTop: Platform.OS == 'ios' ? 30 : 5,
                alignItems:'center'
            }}>
               { toastType === 'success' ? <SuccessIcon width={36} height={36}/> : <ErrorIcon width={36} height={36}/>}
                <View>
                    <View style={{ marginStart:5, marginTop: 5 }}>
                        <Text style={[styles.message,{color:toastType==='success'? 'rgba(0, 203, 20, 1)' : 'rgba(255, 42, 29, 1)'}]}>{message}</Text>
                    </View>
                    <View style={{marginStart:5, marginBottom: 5, marginTop: 5 }}>
                        <Text style={[styles.messageDescription,{width: isPupNoti ? '80%' : 'auto'}]}>{messageDescription}</Text>
                    </View>
                </View>
            </View>
            {/* <View> /}
     
      {/ </View> /}
      {/  <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
        <Text style={styles.dismissButtonText}>Dismiss</Text>
      </TouchableOpacity> */}
        </Animated.View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 25, // Display at the top of the screen
        left: 15,
        right: 15,
        // height: '30%',
        borderRadius: 10,
        backgroundColor: 'white',

        //padding: 14,
        // flexDirection: 'row-reverse',
        //alignItems: 'center',
    },
    message: {
        color: 'rgba(0, 203, 20, 1)',
        fontSize: 18,
        fontFamily: fonts.fontsType.bold,
        fontWeight:'bold'
    },
    messageDescription: {
        color: 'rgba(46, 46, 46, 1)',
        fontSize: 14,
        fontFamily: fonts.fontsType.regular,
        marginEnd:10
    },
    dismissButton: {
        marginLeft: 16,
    },
    dismissButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
export default CustomSnackbar;