import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import fonts from '../../theme/fonts';
import HorizontalDivider from '../../components/DividerLine';
import HeaderComponent from '../../components/HeaderComponent';
import SearchIcon from '../../assets/svgs/search_gray.svg'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLanguages } from '../../redux/coachSlices/fetchLanguagesSlice';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../components/ButtonComponent';
import FullScreenLoader from '../../components/CustomLoader';
import CustomCheckbox from '../../components/CustomCheckbox';
import { Platform } from 'react-native';
import { setAnyData } from '../../redux/setAnyTypeDataSlice';
import { useIsFocused } from '@react-navigation/native';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';

const SelectLanguageScreen = ({ navigation }) => {
    const { t } = useCustomTranslation()
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const languages = useSelector((state) => state.languages.languages);
    const profilePayload = useSelector((state) => state.anyData.anyData);
    const status = useSelector((state) => state.languages.status);
    const error = useSelector((state) => state.languages.error);
    const [searchText, setSearchText] = useState('');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [focus, setIsFocused] = useState(false);

    const handleBackPress = () => {
        resetNavigation(navigation, 'CoachProfile')
        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        if (profilePayload && profilePayload.languages && languages && languages?.languages) {
            const languageIds = profilePayload.languages;
            setSelectedLanguages(languageIds);
        }
    }, [profilePayload, languages]);

    const handleCheckboxClick = (languageId) => {
        const isSelected = selectedLanguages?.includes(languageId);
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
        // Fetch languages when the component mounts
        dispatch(fetchLanguages());
    }, [dispatch]);

    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }


    const renderLanguageItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleCheckboxClick(item?.id)
            }}
            style={{ margin: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text style={{
                    flex: 1, fontFamily: fonts.fontsType.medium,
                    fontSize: 17, color: 'rgba(115, 115, 115, 1)',
                    lineHeight: 29
                }}>{item.name}</Text>
                {/* <CheckBox
                    value={selectedLanguages.includes(item.id)}
                    onValueChange={() => handleCheckboxClick(item.id)}
                    boxType={'square'}
                    onCheckColor='white'
                    tintColor='rgba(204, 204, 204, 1)'
                    onTintColor='rgba(15, 109, 106, 1)'
                    onFillColor='rgba(15, 109, 106, 1)'
                    tintColors={{ true: 'rgba(15, 109, 106, 1)', false: 'rgba(204, 204, 204, 1)' }}
                    style={{ marginEnd: 5, }}
                /> */}

                <CustomCheckbox
                    isUpdate={true}
                    isSelected={selectedLanguages && selectedLanguages?.includes(item.id)}
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => { handleCheckboxClick(item?.id) }}
                />

            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 5 }} />
        </TouchableOpacity>
    );

    const handleSubmitProfile = () => {

        const newPayload = {
            ...profilePayload,
            languages: selectedLanguages,
        }
        dispatch(setAnyData(newPayload))

        navigation.navigate('CoachingAreas')
    }



    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'CoachProfile'}
                headerTitle={t('selectLanguage')}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />
            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
                    borderRadius: 12,
                    backgroundColor: focus ? 'transparent' : 'rgba(238, 238, 238, 1)',
                    height: 45,
                    borderWidth: focus ? 1 : 0,
                    borderColor: focus ? 'rgba(15, 109, 106, 1)' : 'rgba(238, 238, 238, 1)',
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
                <CustomButton onPress={() => {
                    handleSubmitProfile()
                }}
                    title={t('select')}
                    customStyle={{ marginBottom: Platform.OS === 'android' ? 20 : -30 }} />

            </View>



        </SafeAreaView>
    );
};

export default SelectLanguageScreen;
