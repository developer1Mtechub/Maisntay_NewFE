import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import DatePicker from "react-native-date-picker";
import { BottomSheet, ButtonGroup } from "@rneui/themed";
import colors from '../../theme/colors';
import ToggleSwitch from "toggle-switch-react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from '@rneui/base';
import HeaderComponent from '../../components/HeaderComponent';
import fonts from '../../theme/fonts';
import RemoveIcon from '../../assets/svgs/remove_item_icon.svg'
import CustomButton from '../../components/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { postAvailabilities } from '../../redux/coachSlices/postAvailabilitySlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import CustomSnackbar from '../../components/CustomToast';
import moment from 'moment';
import useBackHandler from '../../components/useBackHandler';
import useCustomTranslation from '../../utilities/useCustomTranslation';


const AvailabilityScreen = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.availability);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [availability, setAvailability] = useState({
        Monday: { enabled: false, timeSessions: [] },
        Tuesday: { enabled: false, timeSessions: [] },
        Wednesday: { enabled: false, timeSessions: [] },
        Thursday: { enabled: false, timeSessions: [] },
        Friday: { enabled: false, timeSessions: [] },
        Saturday: { enabled: false, timeSessions: [] },
        Sunday: { enabled: false, timeSessions: [] },
    });
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [departureSheetVisible, setDepatSheetVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');



    const toggleDatePicker = (day, index = null) => {
        setDepatSheetVisible(true);
        setSelectedDay(day);
        setSelectedTimeIndex(index);
    };

    const toggleDay = (day) => {
        setSelectedDay(day);
        setAvailability((prevAvailability) => {
            const updatedAvailability = { ...prevAvailability };
            updatedAvailability[day].enabled = !updatedAvailability[day].enabled;
            return updatedAvailability;
        });
    };

    const addAvailability = (startTime, endTime) => {
        if (selectedDay && startTime && endTime) {
            setAvailability((prevAvailability) => {
                const updatedAvailability = { ...prevAvailability };
                updatedAvailability[selectedDay]?.timeSessions.unshift({
                    start: moment(startTime).format('hh:mm'),
                    end: moment(endTime).format('hh:mm'),
                });
                return updatedAvailability;
            });
            setDepatSheetVisible(false);
            setSelectedIndex(0);
            setDate(new Date());
            setEndDate(new Date());
        }

    }


    const removeTimeSession = (day, index) => {
        setAvailability((prevAvailability) => {
            const updatedAvailability = { ...prevAvailability };
            updatedAvailability[day].timeSessions.splice(index, 1);
            return updatedAvailability;
        });
    };

    const renderDepartureSheet = () => {
        return <BottomSheet
            onBackdropPress={() =>
                setDepatSheetVisible(false)

            }
            modalProps={{}} isVisible={departureSheetVisible}>
            <View
                style={{
                    backgroundColor: '#fff',
                    width: "100%",
                    height: hp("55%"),
                    borderTopEndRadius: 16,
                    borderTopStartRadius: 16,
                    padding: 20,
                }}
            >

                <ButtonGroup
                    buttons={["Start Time", "End Time"]}
                    selectedIndex={selectedIndex}
                    onPress={(value) => {
                        setSelectedIndex(value);
                        if (value === 0) {
                        }
                        else {
                        }
                    }}
                    textStyle={{ color: "black", fontSize: 16, fontFamily: fonts.fontsType.semiBold }}
                    innerBorderStyle={{ color: 'white', fontSize: 16, fontFamily: fonts.fontsType.semiBold }}
                    buttonContainerStyle={{ borderRadius: 32 }}
                    selectedButtonStyle={{
                        backgroundColor: colors.primaryColor,
                        borderRadius: 32,
                    }}
                    containerStyle={{
                        marginBottom: 20,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 32,
                        marginTop: 30,
                        marginHorizontal: 40,
                        height: 46,
                    }}
                />

                {selectedIndex === 0 ? <DatePicker
                    mode='time'
                    style={{
                        alignSelf: 'center',
                    }}
                    date={date}
                    onDateChange={setDate}
                    minuteInterval={5} />
                    : <DatePicker
                        mode='time'
                        style={{
                            alignSelf: 'center',
                        }}
                        date={endDate}
                        onDateChange={setEndDate}
                        minuteInterval={5} />

                }
                <CustomButton
                    onPress={() => {
                        addAvailability(date, endDate)
                    }}
                    title={'Save Time'}
                    customStyle={{
                        marginTop: 10,
                        marginBottom: 0,
                        width: '90%',
                        height: 40
                    }} />
                <CustomButton
                    onPress={() => { setDepatSheetVisible(false) }}
                    title={'Cancel'}
                    customStyle={{
                        backgroundColor: colors.transparent,
                        marginTop: 0,
                        marginBottom: 0,
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    }

    const handleSubmitProfile = () => {

        const availabilityPayload = {
            sectionDetails: availability
        }
        dispatch(postAvailabilities(availabilityPayload)).then((result) => {
            if (result?.payload?.success == true) {
                renderSuccessMessage('Availability Added Successfully')
                setTimeout(() => {
                    //resetNavigation(navigation, 'SessionDuration')
                    navigation.navigate('SessionDuration')
                }, 3000);

            }
            else {
                renderErrorMessage(result?.payload?.error)
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

    const handleBackPress = () => {
        resetNavigation(navigation, 'CoachingAreas')
        return true;
    };

    useBackHandler(handleBackPress)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderComponent
                navigation={navigation}
                navigateTo={'CoachingAreas'}
                customContainerStyle={{ marginStart: 20 }}
            />

            <Text style={{
                fontFamily: fonts.fontsType.bold,
                fontSize: 25,
                fontWeight: fonts.fontWeight.bold,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}>{t('avialabiltyTitle')}</Text>

            <Text style={{
                fontFamily: fonts.fontsType.regular,
                fontSize: 15,
                color: 'rgba(49, 40, 2, 1)',
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 10,
            }}>{t('avialabilitySubTitle')}</Text>

            {renderToastMessage()}

            <ScrollView style={{ marginTop: 5 }}>
                {daysOfWeek.map((day, index) => (
                    <View key={day} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 20,
                    }}>
                        <ToggleSwitch
                            isOn={availability[day].enabled}
                            onColor={"rgba(15, 109, 106, 0.15)"}
                            offColor="rgba(244, 244, 244, 1)"
                            //label={day}
                            onValueChange={() => { toggleDay(day) }}
                            value={availability[day].enabled}
                            thumbOffStyle={{ backgroundColor: 'rgba(194, 194, 194, 1)' }}
                            thumbOnStyle={{ backgroundColor: colors.primaryColor }}
                            labelStyle={{
                                fontSize: 12,
                                fontWeight: "700",
                                color: "rgba(140, 138, 147, 1)",
                                marginLeft: 5,
                            }}
                            size="small"
                            onToggle={(isOn) => { toggleDay(day) }}
                        />
                        <TouchableOpacity onPress={() => toggleDay(day)}>
                            <Text style={{
                                color: availability[day].enabled ? 'rgba(49, 40, 2, 1)' : 'rgba(194, 194, 194, 1)',
                                fontFamily: fonts.fontsType.medium,
                                marginStart: 10
                            }}>{day}</Text>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'column',
                            marginTop: 5,
                            marginStart: 10,
                            flex: 1,
                        }}>
                            {availability[day].enabled && availability[day].timeSessions.map((timeSession, index) => (

                                <View key={index} style={{
                                    flexDirection: 'row',
                                    // marginTop: 10,
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}>

                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        marginTop: 5,
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(245, 245, 245, 1)',
                                        borderRadius: 100,
                                        alignSelf: 'center',
                                        height: 42,
                                    }}>
                                        <Text style={{
                                            fontSize: 13,
                                            color: '#1E1E1E',
                                            margin: 8,
                                            fontFamily: fonts.fontsType.regular
                                        }}>{`${timeSession.start + 'am-' + timeSession.end}pm`}</Text>

                                    </View>
                                    <TouchableOpacity style={{
                                        marginTop: 5,
                                        marginStart: 10
                                    }}
                                        onPress={() => removeTimeSession(day, index)}>
                                        <RemoveIcon />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        {availability[day].enabled && (
                            <TouchableOpacity onPress={() => {
                                toggleDatePicker(day, index)
                                //setDepatSheetVisible(true)
                            }}>
                                <Text style={{
                                    marginLeft: 10,
                                    color: 'rgba(15, 109, 106, 1)',
                                    fontSize: 35,
                                }}>+</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                {renderDepartureSheet()}
            </ScrollView>
            <CustomButton
                loading={status == 'loading' ? true : false}
                onPress={() => { handleSubmitProfile() }}
                title={t('nextButtonTitle')}
                customStyle={{ marginBottom: -0 }} />
        </SafeAreaView>
    );
};

export default AvailabilityScreen;
