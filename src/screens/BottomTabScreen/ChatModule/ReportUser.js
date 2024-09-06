import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import fonts from '../../../theme/fonts';
import HeaderComponent from '../../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../../components/ButtonComponent';
import CustomSnackbar from '../../../components/CustomToast';
import { reportUser } from '../../../redux/reportChatUserSlice';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';

const reportReasons = ["Scam", "Fake Profile", "Inappropriate Picture", "Bad behavior", "Underage"];

const ReportUser = ({ navigation, route }) => {
    const { receiverId } = route.params
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.reportChatUser);
    const { user_id } = useSelector(state => state.userLogin)
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [selectedReason, setSelectedReason] = useState(null);

    const handleSubmit = () => {
        const currentUserId = parseInt(user_id);
        const selectedUserId = parseInt(receiverId);
        dispatch(reportUser({
            reported_by: currentUserId,
            reported: selectedUserId,
            reason: selectedReason
        })).then((result) => {
            //console.log('result', result?.payload);
            if (result?.payload?.success === true) {
                renderSuccessMessage(result?.payload?.message)
            } else {
                renderErrorMessage(result?.payload?.message)
            }
        })
    }

    const renderSuccessMessage = async (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        setTimeout(() => {
            resetNavigation(navigation, 'Dashboard', { screen: 'Chat' })
        }, 3000);
    }

    const renderErrorMessage = (message) => {
        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => setSelectedReason(item)}
            activeOpacity={0.8}
            style={{
                marginVertical: 5,
                borderRadius: 12,
                height: 52,
                overflow: 'hidden' // Ensure LinearGradient doesn't overflow
            }}>
            <LinearGradient
                colors={selectedReason === item ? ['#073F3D', '#0F6D6A'] : ['rgba(241, 241, 241, 1)', 'rgba(241, 241, 241, 1)']}
                style={{
                    flex: 1,

                    justifyContent: 'center'
                }}>
                <Text style={{
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    marginHorizontal: 15,
                    color: selectedReason === item ? 'white' : 'rgba(118, 118, 118, 1)'
                }}>{item}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Chat" })
        return true;
    };
    useBackHandler(handleBackPress);

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: 'Chat' }}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />

            <Text style={{
                fontFamily: fonts.fontsType.semiBold,
                fontSize: 24,
                color: '#191919',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                width: wp('90%')
            }}>Tell us the reason why are you reporting Smith?</Text>
            {renderToastMessage()}
            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    data={reportReasons}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item + index}
                />
                <CustomButton
                    loading={status === 'loading'}
                    onPress={() => {
                        handleSubmit();
                    }}
                    title={'Submit'}
                    customStyle={{ marginBottom: -0 }} />

            </View>
        </SafeAreaView>
    );
};

export default ReportUser;
