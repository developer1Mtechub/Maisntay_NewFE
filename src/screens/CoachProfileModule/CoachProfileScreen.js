import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, Platform, SafeAreaView
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import CustomInput from '../../components/TextInputComponent';
import CustomButton from '../../components/ButtonComponent';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from '../../theme/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import EditButton from '../../assets/svgs/profile_edit_icon.svg'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import CameraIcon from "../../assets/svgs/camera_icon.svg";
import GalleryIcon from "../../assets/svgs/gallery_icon.svg";
import { BottomSheet } from "@rneui/themed";
import CustomLayout from '../../components/CustomLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setAnyData } from '../../redux/setAnyTypeDataSlice';
import { requestCameraPermission } from '../../utilities/cameraPermission';
import colors from '../../theme/colors';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import Toast from 'react-native-simple-toast';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const CoachProfileScreen = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const profilePayload = useSelector((state) => state.anyData.anyData)
    const [avatarSource, setAvatarSource] = useState(null);
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const [inputValues, setInputValues] = useState({
        firstname: "",
        lastname: "",
        description: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        firstname: "",
        lastname: "",
        description: ""
    });


    const handleInputChange = (text, identifier) => {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [identifier]: text,
        }));

        if (text?.trim() === '') {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [identifier]: t('errorMsg'),
            }));
        } else {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [identifier]: '',
            }));
        }
    };

    useEffect(() => {
        requestCameraPermission();
    }, [])

    useEffect(() => {
        if (profilePayload) {
            setInputValues({
                firstname: profilePayload?.first_name,
                lastname: profilePayload?.last_name,
                description: profilePayload?.description,
            })
            setSelectedImage(profilePayload?.profile_pic)
        }
    }, [profilePayload])

    const openImagePicker = () => {
        setPhotoSheetVisible(false)
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        // requestCameraPermission();
        setPhotoSheetVisible(false)

        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            cameraType: 'front', // Use 'back' for the rear camera
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
    }

    const handleSubmitProfile = () => {

        if (!selectedImage) {
            Toast.show(t('toastSelectImage'));
            return;
        }

        const newValidationErrors = {};

        // Check for empty required fields
        if (!inputValues.firstname?.trim()) {
            newValidationErrors.firstname = t('errorMsg');
        }
        if (!inputValues.lastname?.trim()) {
            newValidationErrors.lastname = t('errorMsg');
        }
        if (!inputValues.description?.trim()) {
            newValidationErrors.description = t('errorMsg');
        }

        setValidationErrors(newValidationErrors);

        if (Object.keys(newValidationErrors).length > 0) {
            return;
        }

        const newPayload = {
            profile_pic: selectedImage,
            first_name: inputValues?.firstname,
            last_name: inputValues?.lastname,
            description: inputValues?.description,
            role: 'coach'
        }

        dispatch(setAnyData(newPayload))
        navigation.navigate("SelectLanguage");

    }

    const renderPhotoBottomSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    setPhotoSheetVisible()

                }
                modalProps={{}} isVisible={photoSheetVisible}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('45%'),
                        borderTopEndRadius: 16,
                        borderTopStartRadius: 16,
                        padding: 10,
                    }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text
                            style={{
                                fontSize: 22,
                                color: "rgba(49, 40, 2, 1)",
                                fontFamily: fonts.fontsType.semiBold,
                            }}>
                            {t('selectAnOption')}
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                setPhotoSheetVisible(false);
                            }}
                        />
                    </View>

                    {/* renderList here */}

                    <View style={{ alignItems: "center", marginTop: 30 }}>
                        <TouchableOpacity
                            style={{
                                width: 360,
                                height: 128,
                                borderRadius: 15,
                                backgroundColor: "rgba(229, 239, 239, 1)",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => { handleCameraLaunch() }}>
                            <CameraIcon />
                            <Text
                                style={{
                                    color: "rgba(15, 109, 106, 1)",
                                    fontSize: 19,
                                    fontFamily: fonts.fontsType.semiBold,
                                    marginTop: 10,
                                }}>
                                {t('camera')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: 360,
                                height: 128,
                                borderRadius: 15,
                                backgroundColor: "rgba(229, 239, 239, 1)",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 20,
                            }}
                            onPress={() => { openImagePicker() }}>
                            <GalleryIcon />
                            <Text
                                style={{
                                    color: "rgba(15, 109, 106, 1)",
                                    fontSize: 19,
                                    fontFamily: fonts.fontsType.semiBold,
                                    marginTop: 10,
                                }}>
                                {t('gallery')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const handleBackPress = () => {
        resetNavigation(navigation, 'SignIn')
        return true;
    };

    useBackHandler(handleBackPress)

    const renderError = (error) => (
        <Text style={styles.errorStyle}>{error}</Text>
    );

    return (
        <CustomLayout>
            <SafeAreaView style={styles.container}>
                <HeaderComponent
                    navigation={navigation}
                    navigateTo={'SignIn'}
                    customContainerStyle={{
                        //marginTop: hp('5%'),
                        marginStart: wp('-2%')
                    }} />
                <View style={{
                    alignItems: 'center',
                    marginTop: hp('2%')
                }}>
                    <Text style={styles.headerTextStyle}>
                        {t('coacheeHeaderTitle')}
                    </Text>
                    <Text style={styles.descriptionStyle}>
                        {t('descriptionText')}
                    </Text>
                </View>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={() => { setPhotoSheetVisible(true); }}>
                        {selectedImage ? <Image
                            source={{ uri: selectedImage }}
                            style={styles.avatar}
                        /> :
                            <Image
                                source={require("../../assets/images/user_profile_dummy.png")}
                                style={styles.imageStyle}
                            />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton}
                        onPress={() => { setPhotoSheetVisible(true); }}>
                        <EditButton />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <CustomInput
                        value={inputValues?.firstname}
                        identifier="firstname"
                        placeholder={t('firstNameLabel')}
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginRight: 10 }}
                    />
                    <CustomInput
                        value={inputValues?.lastname}
                        identifier="lastname"
                        placeholder={t('lastNameLabel')}
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginLeft: 10 }}
                    />
                </View>

                <View style={styles.inputRow}>
                    {inputValues.firstname !== '' && renderError(validationErrors.firstname)}
                    {validationErrors.lastname !== '' && renderError(validationErrors.lastname)}
                </View>

                {/* <CustomInput
                    value={inputValues?.description}
                    identifier="description"
                    placeholder="Description"
                    onValueChange={handleInputChange}
                    multiline={true}
                /> */}

                <Text style={styles.textDesc}>
                    {`${inputValues?.description?.length > 0 ? inputValues?.description?.length : 0}/250`}
                </Text>

                <CustomInput
                    value={inputValues?.description}
                    identifier="description"
                    placeholder={t('description')}
                    onValueChange={handleInputChange}
                    multiline={true}
                />
                {validationErrors.description !== '' && renderError(validationErrors.description)}

                <CustomButton
                    title={t('nextButtonTitle')}
                    customStyle={{ marginTop: hp('15%'), width: wp('90%') }}
                    onPress={() => { handleSubmitProfile() }} />
                {renderPhotoBottomSheet()}

            </SafeAreaView>
        </CustomLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 20,
        backgroundColor: 'white'
    },
    avatarContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
        marginTop: hp('4%'),
        backgroundColor: 'rgba(246, 246, 246, 1)',
        borderRadius: 40
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 24,
        color: 'rgba(49, 40, 2, 1)'
    },
    descriptionStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 14,
        color: 'rgba(125, 125, 125, 1)',
        width: wp('100%'),
        textAlign: 'center',
        marginTop: hp('2%'),
        //marginHorizontal:15
        // lineHeight: 24,
    },
    textDesc: {
        fontFamily: fonts.fontsType.medium,
        //position: 'absolute',
        top: 10,
        right: 5,
        color: colors.primaryColor,
        fontSize: 12,
        alignSelf: 'flex-end'
    },
    imageStyle: { width: 60, height: 60, top: 20, borderRadius: 30 },
    errorStyle: {
        color: 'red',
        fontSize: 12, flex: 1,
        alignSelf: 'flex-start',
        fontFamily: fonts.fontsType.regular
    }
});

export default CoachProfileScreen;
