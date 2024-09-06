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
    SafeAreaView
} from "react-native";
import CustomInput from "../../components/TextInputComponent";
import CustomButton from "../../components/ButtonComponent";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from "../../theme/fonts";
import HeaderComponent from "../../components/HeaderComponent";
import EditButton from "../../assets/svgs/profile_edit_icon.svg";
import ArrowDown from "../../assets/svgs/arrow_down.svg";
import { BottomSheet } from "@rneui/themed";
import FullScreenLoader from "../../components/CustomLoader";
import CustomCheckbox from "../../components/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../redux/CoacheeSlices/CountrySlice";
import SearchIcon from "../../assets/svgs/search_gray.svg";
import CancleIcon from "../../assets/svgs/cross_icon.svg";
import HorizontalDivider from "../../components/DividerLine";
import CameraIcon from "../../assets/svgs/camera_icon.svg";
import GalleryIcon from "../../assets/svgs/gallery_icon.svg";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { postCoacheeProfile } from "../../redux/CoacheeSlices/submitCoacheeProfileSlice";
import CustomLayout from "../../components/CustomLayout";
import { requestCameraPermission } from "../../utilities/cameraPermission";
import { setAnyData } from "../../redux/setAnyTypeDataSlice";
import { resetNavigation } from "../../utilities/resetNavigation";
import Toast from 'react-native-simple-toast';
import DatePicker from "react-native-date-picker";
import moment from "moment";
import useBackHandler from "../../components/useBackHandler";
import useCustomTranslation from "../../utilities/useCustomTranslation";
import CountryCodePicker from "../../components/CountryCodePicker";

const CoacheeProfile = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    //const { routeData } = route.params
    const dispatch = useDispatch();
    const [avatarSource, setAvatarSource] = useState(null);
    const profilePayload = useSelector((state) => state.anyData.anyData);
    const [countrySheetVisible, setCountrySheetVisible] = useState(false);
    const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const countries = useSelector(state => state.countries.countries);
    const status = useSelector(state => state.countries.status);
    const error = useSelector(state => state.countries.error);
    //console.log('profilePayload', profilePayload)
    const [searchText, setSearchText] = useState("");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [countryCode, setCountryCode] = useState(null)

    const [inputValues, setInputValues] = useState({
        firstname: '',
        lastname: '',
        date_of_birth: '',
        phone: '',
        country: ''
    });

    const [validationErrors, setValidationErrors] = useState({
        firstname: '',
        lastname: '',
        date_of_birth: '',
        phone: '',
        //country: ''
    });

    useEffect(() => {
        if (profilePayload) {
            setInputValues({
                firstname: profilePayload?.first_name,
                lastname: profilePayload?.last_name,
                date_of_birth: profilePayload?.date_of_birth,
                phone: profilePayload?.phone,
                country: profilePayload?.country_id,
            })
            setSelectedImage(profilePayload?.profile_pic)
        }
    }, [profilePayload])

    const handleInputChange = (text, identifier) => {
        setInputValues(prevInputValues => ({
            ...prevInputValues,
            [identifier]: text,
        }));


        if (identifier !== 'country') {
            if (text?.trim() === '') {
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    [identifier]: 'This field is required',
                }));
            } else {
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    [identifier]: '',
                }));
            }
        }

    };

    const handleCheckboxClick = languageId => {
        const isSelected = selectedCountries.includes(languageId);
        if (!isSelected) {
            setSelectedCountries([languageId]);
            handleInputChange(languageId, 'country');
            setCountrySheetVisible(false);
        } else {
            setCountrySheetVisible(false);
        }
    };

    // const handleCheckboxClick = languageId => {
    //     const isSelected = selectedCountries.includes(languageId);
    //     if (isSelected) {
    //         setSelectedCountries(prevSelected =>
    //             prevSelected.filter(id => id !== languageId),
    //         );
    //     } else {
    //         setSelectedCountries(prevSelected => [...prevSelected, languageId]);
    //         handleInputChange(languageId, 'country')
    //         setCountrySheetVisible(false)
    //     }
    // };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        requestCameraPermission();
        dispatch(fetchCountries());
    }, [dispatch]);

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
            newValidationErrors.firstname = 'This field is required';
        }
        if (!inputValues.lastname?.trim()) {
            newValidationErrors.lastname = 'This field is required';
        }
        if (!inputValues.date_of_birth?.trim()) {
            newValidationErrors.date_of_birth = 'This field is required';
        }
        else {
            validateDateOfBirth(inputValues.date_of_birth);
            if (validationErrors.date_of_birth) {
                newValidationErrors.date_of_birth = validationErrors.date_of_birth;
            }
        }
        if (!inputValues.phone?.trim()) {
            newValidationErrors.phone = 'This field is required';
        }
        if (selectedCountries?.length == 0) {
            newValidationErrors.country = 'This field is required';
        }

        //console.log('newValidationErrors', newValidationErrors)

        // Update validation errors state
        setValidationErrors(newValidationErrors);

        // If any required field is empty, return
        if (Object.keys(newValidationErrors).length > 0) {
            return;
        }

        const formatedPhoneNo = `${countryCode}${inputValues?.phone}`

        const newPayload = {
            ...profilePayload,
            profile_pic: selectedImage,
            first_name: inputValues?.firstname,
            last_name: inputValues?.lastname,
            phone: formatedPhoneNo,
            country_id: inputValues?.country,
            date_of_birth: inputValues?.date_of_birth
        }

        dispatch(setAnyData(newPayload));
        resetNavigation(navigation, "CoacheeCoachingAreas");
    }

    const getCountryNameById = (countryId) => {
        const country = countries?.country?.find(country => country.id === countryId);
        return country ? country.name : null;
    };

    const renderLanguageItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleCheckboxClick(item.id);
            }}
            style={{ margin: 8, flex: 1 }}>
            <View
                style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                <Text
                    style={{
                        flex: 1,
                        fontFamily: fonts.fontsType.medium,
                        fontSize: 17,
                        color: "rgba(115, 115, 115, 1)",
                        lineHeight: 29,
                    }}>
                    {item.name}
                </Text>
                <CustomCheckbox
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => {
                        handleCheckboxClick(item.id);
                    }}
                />
            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
        </TouchableOpacity>
    );

    const rendercountrySheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() => setCountrySheetVisible(false)}
                modalProps={{}}
                isVisible={countrySheetVisible}
            >
                <View style={styles.containerSheet}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {t('selectCountry')}
                        </Text>
                        <CancleIcon onPress={() => setCountrySheetVisible(false)} />
                    </View>

                    <View style={styles.searchContainer}>
                        <View
                            style={[
                                styles.searchBox,
                                {
                                    backgroundColor: isFocused ? 'transparent' : 'rgba(238, 238, 238, 1)',
                                    borderWidth: isFocused ? 1 : 0,
                                    borderColor: isFocused ? 'rgba(15, 109, 106, 1)' : 'rgba(238, 238, 238, 1)',
                                }
                            ]}
                        >
                            <SearchIcon style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search country here"
                                value={searchText}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={text => setSearchText(text)}
                                placeholderTextColor="rgba(118, 118, 118, 1)"
                                style={styles.textInput}
                            />
                        </View>

                        <FlatList
                            data={countries?.country?.filter(country =>
                                country.name.toLowerCase().includes(searchText.toLowerCase())
                            )}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderLanguageItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const renderPhotoBottomSheet = () => {

        return (
            <BottomSheet
                onBackdropPress={() => setPhotoSheetVisible(false)}
                modalProps={{}}
                isVisible={photoSheetVisible}
            >
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTextSheet}>
                            {t('selectAnOption')}
                        </Text>
                        <CancleIcon onPress={() => setPhotoSheetVisible(false)} />
                    </View>

                    {/* renderList here */}

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={handleCameraLaunch}
                        >
                            <CameraIcon />
                            <Text style={styles.optionText}>
                                {t('cameraOptionText')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, styles.galleryButton]}
                            onPress={openImagePicker}
                        >
                            <GalleryIcon />
                            <Text style={styles.optionText}>
                                {t('galleryOptionText')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    };

    const renderError = (error) => (
        <Text style={{
            color: 'red',
            fontSize: 12, flex: 1,
            alignSelf: 'flex-start',
            fontFamily: fonts.fontsType.regular
        }}>{error}</Text>
    );

    const handleBackPress = () => {
        resetNavigation(navigation, 'GenderSelection')
        return true;
    };

    useBackHandler(handleBackPress)

    const validateDateOfBirth = (dob) => {
        const birthDate = moment(dob, 'YYYY-MM-DD');
        const currentDate = moment();
        const age = currentDate.diff(birthDate, 'years');

        if (age < 18) {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                date_of_birth: t('dobValidationMessage'),
            }));
        } else {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                date_of_birth: '',
            }));
        }
    };

    const handleCountrySelect = (country) => {
        setCountryCode(country?.callingCode[0])
    };

    return (
        <CustomLayout>
            <SafeAreaView style={styles.container}>
                <HeaderComponent
                    navigateTo={'GenderSelection'}
                    navigation={navigation}
                    customContainerStyle={{
                        //marginTop: hp("5%"), 
                        marginStart: wp("-3%")
                    }}
                />
                <View style={{ alignItems: "center", marginTop: hp("2%") }}>
                    <Text style={styles.headerTextStyle}>{t('coacheeHeaderTitle')}</Text>
                    <Text style={styles.descriptionStyle}>
                        {t('descriptionText')}
                    </Text>
                </View>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={() => {
                        setPhotoSheetVisible(true);
                    }}>
                        {selectedImage ? <Image
                            source={{ uri: selectedImage }}
                            style={styles.avatar}
                        /> :
                            <Image
                                source={require("../../assets/images/user_profile_dummy.png")}
                                style={{ width: 60, height: 60, top: 20, borderRadius: 30 }}
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
                        placeholder="First Name"
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginRight: 10 }}
                    />
                    <CustomInput
                        value={inputValues?.lastname}
                        identifier="lastname"
                        placeholder="Last Name"
                        onValueChange={handleInputChange}
                        customContainerStyle={{ flex: 1, marginLeft: 10 }}
                    />
                </View>
                <View style={styles.inputRow}>
                    {inputValues?.firstname !== '' && renderError(validationErrors.firstname)}
                    {validationErrors.lastname !== '' && renderError(validationErrors.lastname)}
                </View>


                <CustomInput
                    value={inputValues?.date_of_birth}
                    identifier="date_of_birth"
                    placeholder={t('dateOfBirthPlaceholder')}
                    //inputType={'number-pad'}
                    isEditable={false}
                    onPress={() => {
                        setOpen(true)
                    }}
                    onValueChange={handleInputChange}
                />
                {validationErrors.date_of_birth !== '' && renderError(validationErrors.date_of_birth)}

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <CountryCodePicker
                        customStyle={{ marginRight: 8 }}
                        onSelectCountry={handleCountrySelect} />
                    <CustomInput
                        value={inputValues?.phone}
                        identifier="phone"
                        placeholder={t('phoneNumberPlaceholder')}
                        inputType={'number-pad'}
                        onValueChange={handleInputChange}
                        customInputStyle={{ width: '52%', flex: 0, }}
                    />
                </View>
                {validationErrors.phone !== '' && renderError(validationErrors.phone)}

                <CustomInput
                    value={getCountryNameById(inputValues?.country)}
                    identifier="country"
                    placeholder={t('countryPlaceholder')}
                    onValueChange={handleInputChange}
                    isEditable={false}
                    onPress={() => {
                        setCountrySheetVisible(true);
                    }}
                    iconComponent={
                        <ArrowDown
                            style={{ marginRight: 20 }}
                            onPress={() => {
                                setCountrySheetVisible(true);
                            }}
                        />
                    }
                />
                {selectedCountries?.length == 0 && renderError(validationErrors.country)}
                <CustomButton
                    title={"Next"}
                    customStyle={{ marginTop: hp("8%"), width: wp("85%") }}
                    onPress={() => {
                        handleSubmitProfile()
                        // navigation.navigate("CoacheeCoachingAreas");
                    }}
                />

                {rendercountrySheet()}
                {renderPhotoBottomSheet()}
                {open && <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        const formattedDate = moment(date).format('YYYY-MM-DD');
                        handleInputChange(formattedDate, 'date_of_birth')
                        validateDateOfBirth(formattedDate);
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />}
            </SafeAreaView>
        </CustomLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        margin: 20,
        backgroundColor: "white",
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
        position: "absolute",
        bottom: 0,
        right: 0,
        borderRadius: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },
    containerSheet: {
        backgroundColor: '#fff',
        width: '100%',
        height: hp('65%'),
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 18,
        color: 'rgba(49, 40, 2, 1)',
        fontFamily: fonts.fontsType.semiBold,
    },
    searchContainer: {
        padding: 10,
        marginTop: hp('2%'),
        flex: 2,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 12,
        height: 45,
    },
    searchIcon: {
        marginStart: 10,
    },
    textInput: {
        marginStart: 10,
        fontFamily: fonts.fontsType.medium,
        fontSize: 15,
        width: wp('100%'),
    },

    bottomSheetContainer: {
        backgroundColor: "#fff",
        width: '100%',
        height: hp('45%'),
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
        padding: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTextSheet: {
        fontSize: 22,
        color: "rgba(49, 40, 2, 1)",
        fontFamily: fonts.fontsType.semiBold,
    },
    optionButton: {
        width: 360,
        height: 128,
        borderRadius: 15,
        backgroundColor: "rgba(229, 239, 239, 1)",
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        color: "rgba(15, 109, 106, 1)",
        fontSize: 19,
        fontFamily: fonts.fontsType.semiBold,
        marginTop: 10,
    },
    optionsContainer: {
        alignItems: "center",
        marginTop: 30,
    },
    galleryButton: {
        marginTop: 20,
    },

});

export default CoacheeProfile;
