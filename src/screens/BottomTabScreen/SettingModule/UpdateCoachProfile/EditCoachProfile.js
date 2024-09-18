import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    Platform,
    ScrollView
} from "react-native";
import CustomInput from "../../../../components/TextInputComponent";
import CustomButton from "../../../../components/ButtonComponent";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from "../../../../theme/fonts";
import HeaderComponent from "../../../../components/HeaderComponent";
import EditButton from "../../../../assets/svgs/profile_edit_icon.svg";
import { BottomSheet } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import CancleIcon from "../../../../assets/svgs/cross_icon.svg";
import CameraIcon from "../../../../assets/svgs/camera_icon.svg";
import GalleryIcon from "../../../../assets/svgs/gallery_icon.svg";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { postCoacheeProfile } from "../../../../redux/CoacheeSlices/submitCoacheeProfileSlice";
import { getData, storeData } from "../../../../utilities/localStorage";
import CustomSnackbar from "../../../../components/CustomToast";
import { resetNavigation } from "../../../../utilities/resetNavigation";
import { fetchUserProfile } from "../../../../redux/authSlices/getUserProfileSlice";
import FullScreenLoader from "../../../../components/CustomLoader";
import moment from "moment";
import ChipComponent from "../../../../components/ChipComponent";
import colors from "../../../../theme/colors";
import AddIcon from '../../../../assets/svgs/plus_icon.svg'
import { setAnyData, setUserId } from "../../../../redux/setAnyTypeDataSlice";
import { requestCameraPermission } from "../../../../utilities/cameraPermission";
import useBackHandler from "../../../../components/useBackHandler";
import useCustomTranslation from "../../../../utilities/useCustomTranslation";
import getCurrentLanguage from "../../../../utilities/currentLanguage";
import { useAlert } from "../../../../providers/AlertContext";

const EditCoachProfile = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const { user_id } = useSelector(state => state.userLogin);
    const { status } = useSelector(state => state.coacheeProfile);
    const profileStatus = useSelector(state => state.getUserProfile.status);
    const [areas, setAreas] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [inputValues, setInputValues] = useState({
        firstname: '',
        lastname: '',
        profile_pic: '',
        email: '',
        role: '',
        about: ''
    });

    useEffect(() => {
        requestCameraPermission();
    }, [])


    const removeLanguages = (index) => {
        setLanguages(prevLang => {
            const newLang = [...prevLang];
            newLang.splice(index, 1);
            return newLang;
        });
    };

    const removeArea = (index) => {
        setAreas(prevAreas => {
            const newAreas = [...prevAreas];
            newAreas.splice(index, 1);
            return newAreas;
        });
    };


    const handleInputChange = (text, identifier) => {
        setInputValues(prevInputValues => ({
            ...prevInputValues,
            [identifier]: text,
        }));
    };

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };

    useBackHandler(handleBackPress)


    useEffect(() => {
        const getUserData = async () => {
            const userData = await getData('userData');
            dispatch(fetchUserProfile({
                user_id: userData?.user?.id ? userData?.user?.id : user_id,
                role: userData?.user?.role
            })).then((result) => {
                setAreas(result?.payload?.user?.details?.coaching_areas || result?.payload?.user?.coaching_areas)
                setLanguages(result?.payload?.user?.details?.languages || result?.payload?.user?.languages)
                setInputValues(prevInputValues => ({
                    ...prevInputValues,
                    firstname: result?.payload?.user?.first_name,
                    lastname: result?.payload?.user?.last_name,
                    profile_pic: result?.payload?.user?.details?.profile_pic || result?.payload?.user?.profile_pic,
                    email: result?.payload?.user?.email,
                    role: result?.payload?.user?.role,
                    about: result?.payload?.user?.details?.about || result?.payload?.user?.about
                }));
            });

        }

        getUserData();
    }, [dispatch, user_id])

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
                handleInputChange(imageUri, 'profile_pic')
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
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                handleInputChange(imageUri, 'profile_pic')
                //console.log(imageUri);
            }
        });
    }

    const handleSubmitProfile = () => {

        const newPayload = {
            profile_pic: inputValues?.profile_pic,
            first_name: inputValues?.firstname,
            last_name: inputValues?.lastname,
            role: inputValues?.role,
            about: inputValues?.about,
        }

        //console.log('newPayload', newPayload);

        const imageType = newPayload?.profile_pic?.endsWith('.png') ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('profile_pic', {
            uri: newPayload?.profile_pic,
            type: imageType,
            name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        });
        formData.append('first_name', newPayload?.first_name);
        formData.append('last_name', newPayload?.last_name);
        formData.append('role', newPayload?.role);
        formData.append('about', newPayload?.about);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success === true) {
                renderSuccessMessage(t('profileEditedSuccess'), result)
            }
            else {
                showAlert("Error", 'error', t('errorMessage'))
            }
        })

    }


    const updateUserData = async (result) => {
        const userData = await getData('userData');
        const { first_name, last_name } = result?.payload?.data;
        const updatedUserData = {
            ...userData,
            user: {
                ...userData.user,
                first_name: first_name,
                last_name: last_name
            }
        };

        await storeData("userData", updatedUserData)
    }


    const renderSuccessMessage = (message, result) => {
        showAlert("Success", 'success', message)
        updateUserData(result)
        setTimeout(() => {
            resetNavigation(navigation, "Dashboard", { screen: 'Setting' });
        }, 3000);

    }



    const renderPhotoBottomSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    setPhotoSheetVisible(false)

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


    if (profileStatus === 'loading') {
        return <FullScreenLoader visible={profileStatus} />
    }

    const handleNavigation = (screen, tobeUpdatedData, user_id) => {
        if (user_id) {
            dispatch(setUserId({ user_id: user_id, route: 'EditCoachProfile' }))
        } else {
            dispatch(setAnyData({ anyData: tobeUpdatedData, route: 'EditCoachProfile' }))
        }

        resetNavigation(navigation, screen)
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            enabled>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'Dashboard'}
                headerTitle={t('editProfileHeader')}
                params={{ screen: 'Setting' }}
                customContainerStyle={{
                    marginTop: Platform.OS == 'ios' ? 40 : 0,

                }}
                customTextStyle={{ marginStart: 70 }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ alignItems: "center", }}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image

                                source={
                                    inputValues?.profile_pic
                                        ? { uri: inputValues?.profile_pic }
                                        : require("../../../../assets/images/user_profile_dummy.png")
                                }
                                style={styles.avatar}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                setPhotoSheetVisible(true);
                            }}>
                            <EditButton />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={{ flex: 1, }}>

                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#312802',
                            fontSize: 16,
                        }}>
                            {t('firstNameLabel')}
                        </Text>

                        <CustomInput
                            value={inputValues?.firstname}
                            identifier="firstname"
                            placeholder={t('firstNamePlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{ marginRight: 10 }}
                            customInputStyle={{ color: '#767676' }}
                        />

                    </View>

                    <View style={{ flex: 1, }}>

                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            color: '#312802',
                            fontSize: 16,
                        }}>
                            {t('lastNameLabel')}
                        </Text>

                        <CustomInput
                            value={inputValues?.lastname}
                            identifier="lastname"
                            placeholder={t('lastNamePlaceholder')}
                            onValueChange={handleInputChange}
                            customContainerStyle={{}}
                            customInputStyle={{ color: '#767676' }}
                        />

                    </View>


                </View>



                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        {t('emailLabel')}
                    </Text>

                    <CustomInput
                        value={inputValues?.email}
                        identifier="email"
                        placeholder="Email Address"
                        onValueChange={handleInputChange}
                        isEditable={false}
                        customInputStyle={{ color: '#767676' }}
                    />

                    <Text style={{
                        fontFamily: fonts.fontsType.regular,
                        color: '#FF1919',
                        fontSize: 13,
                        top: 5
                    }}>
                        {t('emailWarning')}
                    </Text>

                </View>


                <View style={{ marginTop: 20 }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        color: '#312802',
                        fontSize: 16,
                    }}>
                        {t('aboutLabel')}
                    </Text>

                    <CustomInput
                        value={inputValues?.about}
                        identifier="about"
                        placeholder="About"
                        onValueChange={handleInputChange}
                        multiline={true}
                        customInputStyle={{ color: '#767676', }}

                    />

                    <Text style={{
                        fontFamily: fonts.fontsType.medium,
                        position: 'absolute',
                        top: 20,
                        right: 5,
                        color: colors.primaryColor,
                        fontSize: 12,
                    }}>
                        {`${inputValues.about.length}/250`}
                    </Text>

                </View>

                <View style={{ marginTop: 20, }}>
                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        fontSize: 18,
                        color: colors.primaryColor,
                        marginStart: 10
                    }}>{t('languagesLabel')}</Text>

                    <FlatList
                        data={languages}
                        renderItem={({ item, index }) => (
                            <ChipComponent data={item} onRemove={() => removeLanguages(index)} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                    />

                    <TouchableOpacity onPress={() => {
                        handleNavigation('UpdateLanguages',
                            languages)
                    }}
                        style={styles.addNewConatiner}>
                        <AddIcon />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: 13,
                            color: '#312802',
                            marginStart: 10,
                            alignSelf: 'center'
                        }}>{t('addLanguage')}</Text>
                    </TouchableOpacity>

                </View>


                <View style={{ marginTop: 20, }}>
                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        fontSize: 18,
                        color: colors.primaryColor,
                        marginStart: 10
                    }}>{t('coachingAreasLabel')}</Text>

                    <FlatList
                        data={areas}
                        renderItem={({ item, index }) => (
                            <ChipComponent
                                data={item}
                                onRemove={() => removeArea(index)}
                                areas={true}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            handleNavigation('UpdateCoachingAreas', areas)
                        }}
                        style={styles.addNewConatiner}>
                        <AddIcon />
                        <Text style={{
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: 13,
                            color: '#312802',
                            marginStart: 10,
                            alignSelf: 'center'
                        }}>{t('addArea')}</Text>
                    </TouchableOpacity>


                </View>


                <CustomButton
                    loading={status === 'loading' ? true : false}
                    title={t('editProfileButton')}
                    customStyle={{ marginTop: hp("5%"), width: wp("85%"), }}
                    onPress={() => {
                        handleSubmitProfile()
                    }}
                />

            </ScrollView>

            {renderPhotoBottomSheet()}

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
        position: "relative",
        marginTop: hp("4%"),
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#F6F6F6'
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        borderRadius: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    headerTextStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: 27,
        fontWeight: fonts.fontWeight.bold,
        color: "rgba(49, 40, 2, 1)",
    },
    descriptionStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 16,
        color: "rgba(125, 125, 125, 1)",
        width: wp("100%"),
        textAlign: "center",
        marginTop: hp("2%"),
        lineHeight: 24,
    },
    addNewConatiner: {
        flexDirection: 'row',
        marginTop: 20,
        marginStart: 10
    }
});

export default EditCoachProfile;
