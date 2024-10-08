import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import fonts from '../../theme/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../../redux/coachSlices/coachingAreaSlices';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../components/ButtonComponent';
import FullScreenLoader from '../../components/CustomLoader';
import CustomCheckbox from '../../components/CustomCheckbox';
import { postCoacheeProfile } from '../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import CustomSnackbar from '../../components/CustomToast';
import { storeData } from '../../utilities/localStorage';
import { resetNavigation } from '../../utilities/resetNavigation';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';
import { useAlert } from '../../providers/AlertContext';

const CoachingAreas = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const coachingAreasList = useSelector((state) => state.coachingAreas.coachingAreasList);
    const status = useSelector((state) => state.coachingAreas.status);
    const profileStatus = useSelector((state) => state.coacheeProfile.status);
    const error = useSelector((state) => state.coachingAreas.error);
    const profilePayload = useSelector((state) => state.anyData.anyData);
    const [searchText, setSearchText] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);

    const handleBackPress = () => {
        resetNavigation(navigation, 'SelectLanguage')
        return true;
    };

    useBackHandler(handleBackPress)

    const handleCheckboxClick = (areaId) => {
        const isSelected = selectedAreas.includes(areaId);
        if (isSelected) {
            setSelectedAreas((prevSelected) =>
                prevSelected.filter((id) => id !== areaId)
            );
        } else {
            setSelectedAreas((prevSelected) => [...prevSelected, areaId]);
        }
    };


    useEffect(() => {
        dispatch(fetchAreas()).then((result) => {
            //console.log('result', result)
        });
    }, [dispatch]);


    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    const handleSubmitProfile = () => {

        const newPayload = {
            ...profilePayload,
            interests: selectedAreas,
        }
        //console.log('newPayload', newPayload);

        const objectConverted = "{" + selectedAreas.join(",") + "}";
        const languages = "{" + newPayload?.languages?.join(",") + "}";

        const imageType = newPayload?.profile_pic.endsWith('.png') ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('profile_pic', {
            uri: newPayload?.profile_pic,
            type: imageType,
            name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        });
        formData.append('first_name', newPayload?.first_name);
        formData.append('last_name', newPayload?.last_name);
        formData.append('about', newPayload?.description);
        formData.append('role', newPayload?.role);
        formData.append('coaching_area_ids', objectConverted);
        formData.append('language_ids', languages);
        formData.append('is_completed', true);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success == true) {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    navigation.navigate('Availability')
                }, 3000);


            } else {
                showAlert("Error", "error", result?.payload?.message || 'Network Error')
            }
        })
    }


    const renderLanguageItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                handleCheckboxClick(item.id)
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center', marginVertical: 5,
                backgroundColor: 'rgba(241, 241, 241, 1)',
                borderRadius: 12,
                height: 52
            }}>
            <Image
                style={{ height: 22, width: 22, marginStart: 10, }}
                source={{ uri: item.icon }}
            />
            <Text style={{
                flex: 1, fontFamily: fonts.fontsType.medium,
                fontSize: 14, color: 'rgba(118, 118, 118, 1)', marginStart: 10
            }}>{currentLanguage === "de" ? item.german_name : item.name}</Text>
        
            <CustomCheckbox
                isUpdate={true}
                isSelected={selectedAreas.includes(item.id)}
                checkedColor="rgba(15, 109, 106, 1)"
                uncheckedColor="rgba(238, 238, 238, 1)"
                onToggle={() => { handleCheckboxClick(item.id) }}
                customStyle={{ borderColor: 'rgba(187, 187, 187, 1)', borderWidth: 0.5 }}
            />

        </TouchableOpacity>
    );



    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

            <HeaderComponent
                navigation={navigation}
                navigateTo={'SelectLanguage'}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />

            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 24,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                width: wp('70%')
            }}>{t('durationHeaderTitle')}</Text>
            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    // data={coachingAreasList?.coachAreas?.filter((language) =>
                    data={coachingAreasList?.result?.filter((area) =>
                        area?.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLanguageItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CustomButton
                    loading={profileStatus === 'loading' ? true : false}
                    onPress={() => { handleSubmitProfile() }}
                    title={t('select')}
                    customStyle={{ marginBottom: -0 }} />

            </View>



        </SafeAreaView>
    );
};

export default CoachingAreas;
