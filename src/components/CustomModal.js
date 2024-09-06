import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Overlay } from 'react-native-elements';
import CustomButton from './ButtonComponent';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LeftImg from '../assets/svgs/alert_left_img.svg'
import RightImg from '../assets/svgs/alert_right_img.svg'
import fonts from '../theme/fonts';
import { color } from '@rneui/base';
import colors from '../theme/colors';

const CustomModal = ({ isVisible, onClose, title, subtitle, buttonText, icon, flatButtonText, onFlatButtonPress, solidButtonPress }) => {
    return (
        <Overlay isVisible={isVisible} onBackdropPress={onClose} overlayStyle={styles.overlay}>
            {/* <View style={{ flexDirection: 'row', flex:1,}}>
                    <LeftImg style={{alignSelf:'flex-start'}} />
                    <RightImg style={{alignSelf:'flex-end'}}/>

                </View> */}
            <View style={styles.content}>

                <View style={styles.iconWrapper}>
                    <Image style={{ width: 80, height: 80 }} source={icon} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <CustomButton
                    title={buttonText}
                    onPress={buttonText === 'Ok' ? onClose : solidButtonPress}
                    customStyle={{
                        width: wp('70%'),
                        marginBottom: 5
                    }} />

                {flatButtonText && <CustomButton
                    title={flatButtonText}
                    onPress={onFlatButtonPress}
                    customStyle={{
                        backgroundColor: 'transparent',
                        width: wp('70%'),
                        marginBottom:-15,
                        top:-20
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />}
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    overlay: {
        width: '75%',
        borderRadius: 20,
        // padding: 20,
        // alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconWrapper: {
        //backgroundColor: '#ffeb3b',
        // borderRadius: 50,
        padding: 10,
        marginBottom: 10,
    },
    icon: {
        fontSize: 30,
    },
    title: {
        fontSize: 18,
        fontFamily: fonts.fontsType.bold,
        marginBottom: 10,
        color: '#004d40',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: fonts.fontsType.medium,
        marginBottom: 5,
        color: '#000000',
        opacity: 0.8
    },
});

export default CustomModal;
