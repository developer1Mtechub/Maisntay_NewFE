import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import fonts from '../../../../theme/fonts';
import HorizontalDivider from '../../../../components/DividerLine';
import HeaderComponent from '../../../../components/HeaderComponent';
import SearchIcon from '../../../../assets/svgs/search_gray.svg'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLanguages } from '../../../../redux/coachSlices/fetchLanguagesSlice';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../../../components/ButtonComponent';
import FullScreenLoader from '../../../../components/CustomLoader';
import CustomCheckbox from '../../../../components/CustomCheckbox';
import CustomSnackbar from '../../../../components/CustomToast';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import { postCoacheeProfile } from '../../../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import { useIsFocused } from '@react-navigation/native';
import useBackHandler from '../../../../components/useBackHandler';
import useCustomTranslation from '../../../../utilities/useCustomTranslation';

const UpdateLanguages = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const languages = useSelector((state) => state.languages.languages);
    const { role } = useSelector((state) => state.userLogin);
    const status = useSelector((state) => state.languages.status);
    const profileStatus = useSelector((state) => state.coacheeProfile.status);
    const error = useSelector((state) => state.languages.error);
    const { anyData } = useSelector((state) => state.anyData);
    const [searchText, setSearchText] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');

    const handleBackPress = () => {
        resetNavigation(navigation, anyData?.route ? anyData?.route : 'CoachSettingProfile')
        return true;
    };

    useBackHandler(handleBackPress)


    const getCoachAreaIdByName = (name) => {
        const languageId = languages?.languages?.find(language => language.name === name);
        return languageId ? languageId.id : null;
    };

    useEffect(() => {
        if (anyData && anyData.anyData && languages && languages.languages) {
            const languageIds = anyData.anyData.map(name => getCoachAreaIdByName(name));
            console.log("Language IDs:", languageIds);
            setSelectedLanguages(languageIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anyData, languages]);

    const handleCheckboxClick = (languageId) => {
        const isSelected = selectedLanguages.includes(languageId);
        if (isSelected) {
            setSelectedLanguages((prevSelected) =>
                prevSelected.filter((id) => id !== languageId)
            );
        } else {
            setSelectedLanguages((prevSelected) => [...prevSelected, languageId]);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        dispatch(fetchLanguages());
    }, [dispatch]);

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }


    const renderLanguageItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleCheckboxClick(item.id)
            }}
            style={{ margin: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text style={{
                    flex: 1, fontFamily: fonts.fontsType.medium,
                    fontSize: 17, color: 'rgba(115, 115, 115, 1)',
                    lineHeight: 29
                }}>{item.name}</Text>
                <CustomCheckbox
                    isUpdate={true}
                    isSelected={selectedLanguages.includes(item.id)}
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => { handleCheckboxClick(item.id) }}
                />

            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
        </TouchableOpacity>
    );


    const renderSuccessMessage = async (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')

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

    const handleSubmitProfile = () => {
        const objectConverted = "{" + selectedLanguages.join(",") + "}";
        const formData = new FormData();
        formData.append('role', role);
        formData.append('language_ids', objectConverted);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success == true) {
                renderSuccessMessage(t('saveChangedMsg'))
                setTimeout(() => {
                    if (anyData?.route) {
                        resetNavigation(navigation, anyData?.route)
                    } else {
                        resetNavigation(navigation, "CoachSettingProfile")
                    }

                }, 3000);


            } else {
                renderErrorMessage(result?.payload?.message ? result?.payload?.message
                    : 'Network Error')
            }
        })
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={anyData?.route ? anyData?.route : 'CoachSettingProfile'}
                headerTitle={t('selectLanguage')}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />
            {renderToastMessage()}
            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
                    borderRadius: 12,
                    backgroundColor: isFocused ? 'transparent' : 'rgba(238, 238, 238, 1)',
                    height: 45,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: isFocused ? 'rgba(15, 109, 106, 1)' : 'rgba(238, 238, 238, 1)',
                }}>
                    <SearchIcon style={{ marginStart: 10 }} />
                    <TextInput
                        placeholder={t('searchLanguagePlaceholder')}
                        value={searchText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChangeText={(text) => setSearchText(text)}
                        placeholderTextColor={'rgba(118, 118, 118, 1)'}
                        style={{
                            marginStart: 10,
                            fontFamily: fonts.fontsType.medium,
                            fontSize: 15,
                            width: wp('100%'),

                        }}
                    />
                </View>

                <FlatList
                    data={languages?.languages?.filter((language) =>
                        language.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLanguageItem}
                    keyExtractor={(item) => item.id.toString()}
                />



            </View>

            <CustomButton
                loading={profileStatus === 'loading' ? true : false}
                onPress={() => { handleSubmitProfile() }}
                title={t('select')}
                customStyle={{ marginBottom: 30 }} />

        </SafeAreaView>
    );
};

export default UpdateLanguages;
