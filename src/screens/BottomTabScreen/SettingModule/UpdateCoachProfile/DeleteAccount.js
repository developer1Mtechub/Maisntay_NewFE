import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, SafeAreaView, ScrollView } from 'react-native';
import HeaderComponent from '../../../../components/HeaderComponent';
import fonts from '../../../../theme/fonts';
import colors from '../../../../theme/colors';
import CustomButton from '../../../../components/ButtonComponent';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import useBackHandler from '../../../../components/useBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCoachAccount } from '../../../../redux/DeleteAccount/deleteCoachAccountSlice';
import { removeData } from '../../../../utilities/localStorage';
import { resetState } from '../../../../redux/authSlices/userLoginSlice';
import CustomSnackbar from '../../../../components/CustomToast';
import useCustomTranslation from '../../../../utilities/useCustomTranslation';
import { useAlert } from '../../../../providers/AlertContext';

const DeleteAccount = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const { status } = useSelector((state) => state.deleteCoachAccount)
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');

    const clearCoachData = async () => {
        dispatch(resetState({
            token: null,
            role: null,
            user_name: null,
            tempAccessToken: null,
            user_id: null

        }));
        try {
            await removeData("token");
            await removeData('userData');
        } catch (error) {
            console.log(error);
        }
    };


    const handleEmailLink = () => {
        Linking.openURL('mailto:Main-Stays@gmail.com');
    };

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };

    useBackHandler(handleBackPress)

    const handleDelete = () => {
        dispatch(deleteCoachAccount()).then((result) => {
            if (result?.payload?.status === true) {
                renderSuccessMessage(result?.payload?.message);
            } else {
                showAlert("Error", 'error', result?.payload?.message)
            }
        });
    }


    const renderSuccessMessage = (message) => {
        showAlert("Success", 'success', message)
        setTimeout(() => {
            clearCoachData();
        }, 3000);

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ margin: 10 }}>

                <HeaderComponent
                    navigateTo={"Dashboard"}
                    navigation={navigation}
                    params={{ screen: "Setting" }}
                    headerTitle={t('deleteAccount')}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../../assets/images/delete_account_img.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{t('deleteText1')}<Text style={styles.email} onPress={handleEmailLink}> Main-Stays@gmail.com</Text>
                        </Text>
                        <Text style={styles.text}>
                            {t('deleteText2')}
                        </Text>
                        <Text style={styles.text}>{t('deleteText3')}</Text>
                        <Text style={styles.text}>{t('deleteText4')}</Text>
                        <Text style={styles.text}>{t('deleteText5')}</Text>
                        <Text style={styles.text}>{t('deleteText6')}</Text>
                        <Text style={styles.text}>{t('deleteText7')}</Text>
                    </View>

                    <CustomButton
                        loading={status === 'loading' ? true : false}
                        title={t('deleteAccount')}
                        onPress={() => {
                            handleDelete();
                        }}
                        customStyle={{ marginTop: 30 }}
                    />

                </ScrollView>

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        marginBottom: 20,
        marginTop: 30
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center'
    },
    textContainer: {
        paddingHorizontal: 8,
    },
    text: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 14,
        lineHeight: 24,
        color: '#666666',
        textAlign: 'left',
        marginBottom: 10,
    },
    email: {
        color: colors.primaryColor,
        textDecorationLine: 'underline',
        fontFamily: fonts.fontsType.bold,
        fontSize: 14
    },
});

export default DeleteAccount;
