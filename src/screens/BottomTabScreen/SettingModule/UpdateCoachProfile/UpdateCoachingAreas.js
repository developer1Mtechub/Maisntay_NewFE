import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import fonts from '../../../../theme/fonts';
import HeaderComponent from '../../../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../../../../redux/coachSlices/coachingAreaSlices';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../../../components/ButtonComponent';
import FullScreenLoader from '../../../../components/CustomLoader';
import CustomCheckbox from '../../../../components/CustomCheckbox';
import { postCoacheeProfile } from '../../../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import CustomSnackbar from '../../../../components/CustomToast';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import LinearGradient from 'react-native-linear-gradient';
import useBackHandler from '../../../../components/useBackHandler';
import useCustomTranslation from '../../../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../../../utilities/currentLanguage';
import { useAlert } from '../../../../providers/AlertContext';

const UpdateCoachingAreas = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const coachingAreasList = useSelector((state) => state.coachingAreas.coachingAreasList);
    const status = useSelector((state) => state.coachingAreas.status);
    const profileStatus = useSelector((state) => state.coacheeProfile.status);
    const error = useSelector((state) => state.coachingAreas.error);
    const { role } = useSelector((state) => state.userLogin);
    const { anyData } = useSelector((state) => state.anyData);
    const [searchText, setSearchText] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);
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
        const coachArea = coachingAreasList?.result?.find(area => {
            return currentLanguage === "de" ? area?.german_name === name : area?.name === name;
        });
        return coachArea ? coachArea.id : null;
    };

    useEffect(() => {
        if (anyData?.anyData && coachingAreasList?.result) {
            const coachAreaIds = anyData.anyData.map(item => {
                const nameToCheck = currentLanguage === "de" ? item.german_name : item.name;
                return getCoachAreaIdByName(nameToCheck);
            });
            setSelectedAreas(coachAreaIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anyData, coachingAreasList]);


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
        dispatch(fetchAreas());
    }, [dispatch]);


    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }


    const handleSubmitProfile = () => {
        const objectConverted = "{" + selectedAreas.join(",") + "}";
        const formData = new FormData();
        formData.append('role', role);
        formData.append('coaching_area_ids', objectConverted);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success == true) {
                showAlert("Success", "success", result?.payload?.message)
                setTimeout(() => {
                    if (anyData?.route) {
                        resetNavigation(navigation, anyData?.route)
                    } else {
                        resetNavigation(navigation, "CoachSettingProfile")
                    }

                }, 3000);


            } else {
                showAlert("Error", "error", result?.payload?.message || 'Network Error')
            }
        })
    }


    const renderLanguageItem = ({ item }) => {
        const isSelected = selectedAreas.includes(item.id);
        return <TouchableOpacity onPress={() => handleCheckboxClick(item?.id)}>
            <LinearGradient
                colors={isSelected ? ['#073F3D', '#0F6D6A'] : ['rgba(241, 241, 241, 1)', 'rgba(241, 241, 241, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                    borderRadius: 12,
                    height: 52,
                    overflow: 'hidden' // Ensure borderRadius is applied
                }}>
                <Image
                    style={{ height: 22, width: 22, marginStart: 10 }}
                    source={{ uri: item.icon }}
                />
                <Text style={{
                    flex: 1,
                    fontFamily: fonts.fontsType.medium,
                    fontSize: 14,
                    color: isSelected ? '#FFF' : 'rgba(118, 118, 118, 1)',
                    marginStart: 10
                }}>{currentLanguage === "de" ? item.german_name : item.name}</Text>
                <CustomCheckbox
                    isUpdate={true}
                    isSelected={selectedAreas.includes(item.id)}
                    checkedColor="rgba(15, 109, 106, 1)"
                    uncheckedColor="rgba(238, 238, 238, 1)"
                    onToggle={() => { handleCheckboxClick(item?.id) }}
                    customStyle={{ borderColor: 'rgba(187, 187, 187, 1)', borderWidth: 0.5 }}
                />
            </LinearGradient>
        </TouchableOpacity>
    }



    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

            <HeaderComponent
                navigation={navigation}
                navigateTo={anyData?.route ? anyData?.route : 'CoachSettingProfile'}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />
            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 27,
                fontWeight: fonts.fontWeight.bold,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                width: wp('70%')
            }}>{t('durationHeaderTitle')}</Text>

            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    // data={coachingAreasList?.coachAreas?.filter((language) =>
                    data={coachingAreasList?.result?.filter((language) =>
                        language.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLanguageItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CustomButton
                    loading={profileStatus === 'loading' ? true : false}
                    onPress={() => { handleSubmitProfile() }}
                    title={t('saveChangesBtn')}
                    customStyle={{ marginBottom: -0 }} />

            </View>



        </SafeAreaView>
    );
};

export default UpdateCoachingAreas;
