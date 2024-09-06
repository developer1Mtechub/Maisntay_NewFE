import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import { VideoRenderMode } from 'react-native-agora';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { updateUpcomingSession } from '../../redux/coachSlices/updateUpcomingSessionSlice';
import fonts from '../../theme/fonts';
import { resetNavigation } from '../../utilities/resetNavigation';
import CustomSnackbar from '../../components/CustomToast';
import Toast from 'react-native-simple-toast';
import { createNotification } from '../../redux/NotificationModuleSlices/createNotificationSlice';
import CustomModal from '../../components/CustomModal';
import { setSessionId } from '../../redux/Sessions/setSessionIdSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSessionEnded } from '../../redux/sessionEndedSlice';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import { heightPercentageToDP } from 'react-native-responsive-screen';
// const socketIo = io("https://mainstays-be.mtechub.com/");

const VideoCall = ({ navigation, route }) => {
    const { t } = useCustomTranslation()
    const dispatch = useDispatch();
    const { sessionDetail } = route.params;
    //console.log(sessionDetail)
    const duration = 5;
    const { role } = useSelector((state) => state.userLogin);
    const { sessionEnded } = useSelector((state) => state.sessionEnded);
    const [videoCall, setCall] = useState(true);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [remainingTimeInMinutes, setRemainingTimeInMinutes] = useState(0);
    const intervalIdRef = useRef(null);
    const socketRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        subtitle: '',
        buttonText: 'Ok',
        icon: null,
        flatButtonText: ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        const checkSessionStarted = async () => {
            const sessionStartedFlag = await AsyncStorage.getItem('session_started');
            console.log('sessionStartedFlaggggggggg', sessionStartedFlag)
            if (role === 'coachee' && sessionStartedFlag !== 'true') {
                toggleModal();
                setModalContent({
                    title: t('sessionStartedSoon'),
                    subtitle: t('waitfor'),
                    buttonText: 'Ok',
                    icon: require('../../assets/images/session_start_bell.png'),
                    sessionEndedStatus: false
                });
            }

            else if (role === 'coachee' && modalVisible) {
                toggleModal(); // Close the modal if the session starts while it's open
            }
        };
        checkSessionStarted();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStarted]);

    useEffect(() => {
        const socketIo = io("https://mainstays-be.mtechub.com/");
        socketRef.current = socketIo;
        socketIo.on('connect', () => {
            console.log('Socket connected');
        });

        if (role === "coach") {
            socketRef.current.emit("start session", {
                sessionId: sessionDetail?.channel_name,
                duration: sessionDetail?.session_duration
            });
        } else if (role === "coachee") {
            socketRef.current.emit("request time", { sessionId: sessionDetail?.channel_name });
        }

        socketIo.on("session started", async (data) => {
            console.log("Session started:", data);
            console.log('emmited')
            socketIo.emit("coach-start-session", { sessionId: sessionDetail?.channel_name, coachStarted: true });
            if (data?.sessionId === sessionDetail?.channel_name) {
                setCall(true)
                if (role === 'coach') {
                    createNotificationApi("SESSION_STARTED", "SESSION", "Your session has been started")
                    //setSessionStarted(true)
                    //await AsyncStorage.setItem('session_started', 'true');
                }
            }
            const remainingSeconds = Math.floor((data.endTime - Date.now()) / 1000);
            startCountdown(remainingSeconds);
        });

        if (role === 'coachee') {
            socketIo.on("time update", async (data) => {
                console.log("Time update:", data);
                setCall(true)
                //setSessionStarted(true)
                //await AsyncStorage.setItem('session_started', 'true');
                const remainingSeconds = Math.floor(data.remainingTime / 1000);
                startCountdown(remainingSeconds);
                // if (data.sessionId === sessionDetail?.channel_name) {
                //     setCall(true)
                //     setSessionStarted(true)
                //     const remainingSeconds = Math.floor(data.remainingTime / 1000);
                //     startCountdown(remainingSeconds);
                // }
            });
        }


        return () => {
            socketIo.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCountdown = (remainingSeconds) => {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = setInterval(() => {
            remainingSeconds--;

            if (role === 'coachee') {
                if (remainingSeconds <= 0 && sessionStarted) {

                    //Toast.show('Session Ended');
                    clearInterval(intervalIdRef.current);
                    setRemainingTime(0);
                    handleEndCall(); // End the call when time is less than zero
                    //setSessionStarted(false)

                } else {
                    const remainingMinutes = Math.floor(remainingSeconds / 60);
                    setRemainingTimeInMinutes(remainingMinutes);
                    setRemainingTime(remainingSeconds);
                }
            } else {

                if (remainingSeconds <= 0) {
                    clearInterval(intervalIdRef.current);
                    setRemainingTime(0);
                    handleEndCall(); // End the call when time is less than zero
                    Toast.show('Session Ended');
                } else {
                    const remainingMinutes = Math.floor(remainingSeconds / 60);
                    setRemainingTimeInMinutes(remainingMinutes);
                    setRemainingTime(remainingSeconds);
                }

            }


        }, 1000);
    };

    const createNotificationApi = (title, type, content) => {
        dispatch(createNotification(
            {
                "title": title,
                "content": content,
                "type": type, // SESSION | BADGES | PAYMENT | REVIEWS
                "coach_id": sessionDetail?.coach?.coach_id,
                "coachee_id": sessionDetail?.coachee?.coachee_id,
                "session_id": sessionDetail?.channel_name
            }
        )).then((result) => {
            console.log('create notification', result?.payload?.success)

        })
    }

    const handleEndCall = useCallback(async () => {

        if (role === 'coachee') {
            setCall(false);
            // await AsyncStorage.removeItem('session_started');
            // setSessionStarted(false)
            dispatch(setSessionId({
                session_id: sessionDetail?.channel_name,
                route: 'VideoCall'
            }))
            resetNavigation(navigation, "CoachingDetail")
        }
        if (role === 'coach') {
            await AsyncStorage.removeItem('session_started');
            dispatch(updateUpcomingSession({
                status: "completed",
                session_id: sessionDetail?.channel_name
            })).then(async (result) => {
                if (result?.payload?.success === true) {
                    // await AsyncStorage.removeItem('session_started');
                    // setSessionStarted(false) // shift from coacheee end call
                    createNotificationApi("SESSION_REVIEW", "REVIEWS", "Review the session")
                    renderSuccessMessage('Session Completed.')

                } else {
                    Toast.show('Session Not completed.');
                    renderErrorMessage(result?.payload?.error?.message || result?.payload?.error)
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connectionData = useMemo(() => ({
        appId: "a67ec068b8974a049b315e2aa9d85483",
        channel: sessionDetail?.channel_name?.toString(),
        uid: Math.floor(Math.random() * 1000000), // Generate a random UID
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);


    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;


    const renderSuccessMessage = (message) => {
        setMessage('Success')
        setDescription(message)
        setIsVisible(true);
        setToastType('success')
        Toast.show('Session Completed');
        // resetNavigation(navigation, "Dashboard", { screen: 'MyCoaching' })
        // setCall(false);
        dispatch(setSessionEnded({
            isSessionCompleted: true
        }))
        setTimeout(() => {
            resetNavigation(navigation, "Dashboard", { screen: 'MyCoaching' })
            setCall(false);
        }, 3000);

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


    return videoCall && (
        <View style={styles.container}>

            <AgoraUIKit
                // style={styles.fullScreen}
                connectionData={connectionData}
                rtcCallbacks={{ EndCall: handleEndCall }}
                styleProps={{
                    localBtnContainer: {
                        position: 'absolute',
                        top: 20,
                        width: '100%',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        flexDirection: 'row',
                    },
                    // localBtnStyles: {
                    //     switchCamera: {
                    //     }
                    // },
                    minViewContainer: {
                        // bottom: 80,
                        bottom: 20,
                        // left: -20,
                        top: undefined,
                        height: '26%',
                    },
                    minViewStyles: {
                        height: 150,
                        width: 120,
                    },
                    UIKitContainer: { height: '94%' },
                    iconSize: 24,
                    //theme: '#ffffffee',
                }}
            />

            {renderToastMessage()}

            <View style={styles.detailContainer}>
                {<View style={{
                }}>
                    <Text style={[styles.waitText, {
                    }]}>
                        {`Session : ${sessionDetail?.area_name}`}
                    </Text>
                    {role === 'coachee' ? <Text style={styles.waitText}>
                        {`${sessionDetail?.coachee_name}`}
                    </Text> : <Text style={styles.waitText}>
                        {`${sessionDetail?.coach_name}`}
                    </Text>}
                </View>}

                {/* <Text style={styles.remainingTimeText}>
                    Time Left : {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </Text> */}

            </View>

            <Text style={styles.remainingTimeText}>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>

            {role === 'coach' ? <Text style={[styles.waitText, { // bottom: 80,
                bottom: 75,
                left: 15,
                top: undefined
            }]}>
                {`${sessionDetail?.coachee_name}`}
            </Text> : <Text style={styles.waitText}>
                {`${sessionDetail?.coach_name}`}
            </Text>}

            <CustomModal
                isVisible={modalVisible}
                onClose={toggleModal}
                title={modalContent.title}
                subtitle={modalContent.subtitle}
                buttonText={modalContent.buttonText}
                icon={modalContent.icon}
                flatButtonText={modalContent.flatButtonText && modalContent.flatButtonText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    fullScreen: {
        width: Dimensions.get('window').width, // Set width to full screen
        height: Dimensions.get('window').height // Set height to full screen
    },
    remainingTimeText: {
        position: 'absolute',
        top: 110,
        right: '45%',
        fontSize: 16,
        fontFamily: fonts.fontsType.bold,
        color: 'white',
        alignSelf: 'center'

    },
    // waitText: {
    //     position: 'absolute',
    //     top: 20,
    //     left: 20,
    //     fontSize: 12,
    //     fontFamily: fonts.fontsType.regular,
    //     color: 'white',
    //     alignSelf: 'center'
    // },
    // remainingTimeText: {
    //     fontSize: 12,
    //     fontFamily: fonts.fontsType.medium,
    //     color: 'white',
    //     marginVertical: 4
    // },
    overlayContainer: {
        // ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 70,
        width: 130,
        height: 40,
        position: 'absolute',
        bottom: 20,
        right: 10

    },

    detailContainer: {
        padding: 10,
        // backgroundColor: 'black',
        // opacity: 0.8,
        borderRadius: 16,
        width: '42%',
        //height: '20%',
        position: 'absolute',
        bottom: 55,
        right: 10
    },
    waitText: {
        fontSize: 12,
        fontFamily: fonts.fontsType.medium,
        color: 'white',
        marginVertical: 4,
    },
});

export default VideoCall;
