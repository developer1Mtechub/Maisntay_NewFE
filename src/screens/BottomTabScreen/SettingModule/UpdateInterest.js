import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import fonts from '../../../theme/fonts';
import HeaderComponent from '../../../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../../../redux/coachSlices/coachingAreaSlices';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from '../../../components/ButtonComponent';
import FullScreenLoader from '../../../components/CustomLoader';
import CustomCheckbox from '../../../components/CustomCheckbox';
import { postCoacheeProfile } from '../../../redux/CoacheeSlices/submitCoacheeProfileSlice';
import CustomSnackbar from '../../../components/CustomToast';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../theme/colors';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import useCustomTranslation from '../../../utilities/useCustomTranslation';
import getCurrentLanguage from '../../../utilities/currentLanguage';

const UpdateInterest = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const currentLanguage = getCurrentLanguage();
    const { role, interestAreas } = route.params
    // console.log(role)
    // console.log(interestAreas)
    const dispatch = useDispatch();
    const coachingAreasList = useSelector((state) => state.coachingAreas.coachingAreasList);
    const status = useSelector((state) => state.coachingAreas.status);
    const profileStatus = useSelector((state) => state.coacheeProfile.status);
    const error = useSelector((state) => state.coachingAreas.error);
    const [searchText, setSearchText] = useState('');
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [selected, setSelected] = useState(false);


    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
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


    // const getCoachAreaIdByName = (name) => {
    //     const coachArea = coachingAreasList?.result?.find(area => {
    //         return currentLanguage === "de" ? area?.german_name === name : area?.name === name;
    //     });
    //     return coachArea ? coachArea.id : null;
    // };
    
    // useEffect(() => {
    //     if (interestAreas && coachingAreasList && coachingAreasList.result) {
    //         const coachAreaIds = interestAreas?.map(item => {
    //             const nameToCheck = currentLanguage === "de" ? item.german_name : item.name;
    //             return getCoachAreaIdByName(nameToCheck);
    //         });
    //         console.log("Coach Area IDs:", coachAreaIds);
    //         setSelectedAreas(coachAreaIds);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [interestAreas, coachingAreasList]);


    const getAreaIdByName = (name) => {
        const coachArea = coachingAreasList?.result?.find(area => area.name === name);
        return coachArea ? coachArea.id : null;
    };

    useEffect(() => {
        if (interestAreas && coachingAreasList && coachingAreasList.result) {
            const areaIds = interestAreas?.map(name => getAreaIdByName(name));
            console.log("Area IDs:", areaIds);
            setSelectedAreas(areaIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interestAreas, coachingAreasList]);


    useEffect(() => {
        dispatch(fetchAreas());
    }, [dispatch]);


    if (status === 'loading') {
        return <FullScreenLoader visible={status} />
    }

    const handleSubmitProfile = () => {

        //console.log(selectedAreas)

        const objectConverted = "{" + selectedAreas.join(",") + "}";
        // console.log(JSON.stringify(objectConverted));

        const formData = new FormData();
        formData.append('interests', objectConverted);
        formData.append('role', role);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            //console.log('result coach', result?.payload);
            if (result?.payload?.success == true) {
                renderSuccessMessage(result?.payload?.message)
                setTimeout(() => {
                    resetNavigation(navigation, "Dashboard", { screen: 'Setting' })
                }, 3000);


            } else {
                renderErrorMessage(result?.payload?.message ? result?.payload?.message
                    : 'Network Error')
            }
        })
    }


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

    const renderAreaItem = ({ item }) => {
        const isSelected = selectedAreas.includes(item.id);
        const backgroundColor = isSelected ? { backgroundColor: 'transparent' } : { backgroundColor: 'rgba(241, 241, 241, 1)' };
        const gradientColors = isSelected ? ['#073F3D', '#0F6D6A'] : ['rgba(241, 241, 241, 1)', 'rgba(241, 241, 241, 1)'];

        return <TouchableOpacity
            onPress={() => {
                handleCheckboxClick(item?.id)
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
                borderRadius: 12,
                height: 48,
                ...backgroundColor,
            }}>
            <LinearGradient
                colors={isSelected ? ['#073F3D', '#0F6D6A'] : ['rgba(241, 241, 241, 1)', 'rgba(241, 241, 241, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 12,
                }}
            />
            <Image
                style={{ height: 22, width: 22, marginStart: 10 }}
                source={{ uri: item.icon }}
            />
            <Text style={{
                flex: 1,
                fontFamily: fonts.fontsType.medium,
                fontSize: 14,
                color: isSelected ? colors.white : 'rgba(118, 118, 118, 1)',
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
            {/* <CustomCheckbox
                checkedColor={isSelected ? colors.white : "rgba(15, 109, 106, 1)"}
                uncheckedColor="rgba(238, 238, 238, 1)"
                onToggle={() => {
                    setSelected(!selected);
                    handleCheckboxClick(item.id);
                }}
                isSelected={isSelected}
                customStyle={{ borderColor: 'rgba(187, 187, 187, 1)', borderWidth: 0.5 }}
            /> */}
        </TouchableOpacity>

    }


    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <HeaderComponent
                headerTitle={t('updateInterest')}
                navigation={navigation}
                navigateTo={'Dashboard'}
                params={{ screen: 'Setting' }}
                customContainerStyle={{
                    // marginTop: hp('5%'),
                    marginStart: 20
                }} />

            {renderToastMessage()}

            <View style={{ padding: 20, marginTop: hp('2%'), flex: 2 }}>

                <FlatList
                    // data={coachingAreasList?.coachAreas?.filter((language) =>
                    data={coachingAreasList?.result?.filter((language) =>
                        language.name.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderAreaItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CustomButton
                    loading={profileStatus === 'loading' ? true : false}
                    onPress={() => {
                        handleSubmitProfile()
                    }}
                    title={t('saveChangesBtn')}
                    customStyle={{ marginBottom: -0 }} />

            </View>



        </SafeAreaView>
    );
};

export default UpdateInterest;
