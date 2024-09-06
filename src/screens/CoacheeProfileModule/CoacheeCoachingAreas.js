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
import { resetNavigation } from '../../utilities/resetNavigation';
import CustomSnackbar from '../../components/CustomToast';
import { storeData } from '../../utilities/localStorage';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../utilities/currentLanguage';

const CoacheeCoachingAreas = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const dispatch = useDispatch();
    const profilePayload = useSelector((state) => state.anyData.anyData);
    const coachingAreasList = useSelector((state) => state.coachingAreas.coachingAreasList);
    const cocaheeStatus = useSelector((state) => state.coacheeProfile.status);
    const status = useSelector((state) => state.coachingAreas.status);
    const error = useSelector((state) => state.coachingAreas.error);
    const [searchText, setSearchText] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');


    const handleBackPress = () => {
        resetNavigation(navigation, 'CoacheeProfile')
        return true;
    };

    useBackHandler(handleBackPress)

    const handleCheckboxClick = (areaId) => {
        const isSelected = selectedAreas.includes(areaId);
        if (isSelected) {
            console.log('areaId', areaId)
            setSelectedAreas((prevSelected) =>
                prevSelected.filter((id) => id !== areaId)
            );
        } else {
            console.log('areaId2', areaId)
            setSelectedAreas((prevSelected) => [...prevSelected, areaId]);
        }
    };


    useEffect(() => {
        dispatch(fetchAreas());
    }, [dispatch]);

    const handleSubmitProfile = () => {

        const newPayload = {
            ...profilePayload,
            interests: selectedAreas,
        }

        //console.log('newPayload', newPayload);
        const objectConverted = "{" + selectedAreas.join(",") + "}";
        const imageType = newPayload?.profile_pic.endsWith('.png') ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('profile_pic', {
            uri: newPayload?.profile_pic,
            type: imageType,
            name: `image_${Date.now()}.${imageType.split('/')[1]}`,
        });
        formData.append('first_name', newPayload?.first_name);
        formData.append('last_name', newPayload?.last_name);
        formData.append('phone', newPayload?.phone);
        formData.append('country_id', newPayload?.country_id);
        formData.append('date_of_birth', newPayload?.date_of_birth);
        formData.append('gender', newPayload?.gender);
        formData.append('role', newPayload?.role);
        formData.append('interests', objectConverted);
        // formData.append('interests', newPayload?.interests);

        //console.log('formData', JSON.stringify(formData));

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success == true) {
                renderSuccessMessage(result?.payload?.message, result)

            } else {
                renderErrorMessage(result?.payload?.message ? result?.payload?.message
                    : 'Network Error')
            }
        })

    }

    async function delayAndStoreData(result) {

        await storeData('userData', result?.payload);
    }

    const renderSuccessMessage = async (message, result) => {

        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        delayAndStoreData(result)
        setTimeout(async () => {

            resetNavigation(navigation, "CoacheeProfileCompletion");
        }, 3000);

    }

    const renderErrorMessage = (message) => {

        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }


    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={isVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

   // console.log(selectedAreas)

    const renderAreas = ({ item }) => {
        return <TouchableOpacity
            onPress={() => {
                console.log(item?.id)
                handleCheckboxClick(item?.id)
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
    }



    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderComponent
                navigateTo={'CoacheeProfile'}
                navigation={navigation}
                customContainerStyle={{
                    //marginTop: hp('5%'),
                    marginStart: 10
                }} />

            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 24,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
                width: wp('70%')
            }}>{t('coachingHeaderTitle')}</Text>
            {renderToastMessage()}

            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    // data={coachingAreasList?.coachAreas?.filter((language) =>
                    data={coachingAreasList?.result?.filter((area) =>
                        area?.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderAreas}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CustomButton
                    loading={cocaheeStatus === 'loading' ? true : false}
                    onPress={() => {
                        handleSubmitProfile()
                        //navigation.navigate('CoacheeProfileCompletion')
                    }}
                    title={t('nextButtonTitle')}
                    customStyle={{ marginBottom: -0 }} />

            </View>



        </SafeAreaView>
    );
};

export default CoacheeCoachingAreas;
