import React, { useState, useEffect, useRef } from 'react';
import {
    View, Platform, KeyboardAvoidingView, TouchableOpacity,
    Dimensions, TextInput, StyleSheet, SafeAreaView, ActivityIndicator,
    Image
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../../theme/fonts';
import SendIcon from '../../../assets/svgs/send_btn.svg'
const { width: screenWidth } = Dimensions.get('window');
import ChatHeader from '../../../components/ChatHeader';
import colors from '../../../theme/colors';
import HorizontalDivider from '../../../components/DividerLine';
import { resetNavigation } from '../../../utilities/resetNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageIcon from 'react-native-vector-icons/Feather';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachDetail } from '../../../redux/DashboardSlices/getSingleCoachDetailSlice';
import { fetchMessages } from '../../../redux/ChatModuleSlice/fetchAllmessagesSlices';
import useBackHandler from '../../../components/useBackHandler';
import { launchImageLibrary } from 'react-native-image-picker';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const SERVER_URL = 'https://mainstays-be.mtechub.com/';
const DATA_FETCH_TIMEOUT = 5000; // 5 seconds timeout for data fetching

export default function ChatScreen({ navigation }) {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch()
    const messagesStatus = useSelector((state) => state.messages.status)
    const { coachDetails, status, error } = useSelector((state) => state.getCoachDetail)
    const receiverId = useSelector(state => state.setReceiverId.receiverId.receiverId)
    const role = useSelector(state => state.setReceiverId.receiverId.role)
    const is_online = useSelector(state => state.setReceiverId.receiverId.is_online)
    const { user_id } = useSelector(state => state.userLogin)
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false);
    const giftedChatRef = useRef(null);
    const [imageUri, setImageUri] = useState(null);

    //sender Id should be logedIn user id... (Current User)
    //receiver Id should be one you want to chat..

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: 'Chat' })
        return true;
    };
    useBackHandler(handleBackPress);

    useEffect(() => {
        dispatch(fetchCoachDetail({ coachId: receiverId, chatRole: role }))
    }, [dispatch, receiverId, role])

    useEffect(() => {
        const newSocket = io(SERVER_URL, {
            query: { userId: user_id }
        });
        setSocket(newSocket);
        // Log a message when socket is connected
        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        if (newSocket) {
            newSocket.emit("mark_messages_as_read", { userId: user_id, receiverId: receiverId });
        }


        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMessage = (newMessage) => {
        setMessages([]);
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
    };

    useEffect(() => {
        dispatch(fetchMessages({
            sender_id: user_id,
            receiver_id: receiverId,
        })).then((result) => {
            const reConstructedMessages = result?.payload?.messages?.map(message => {
                return {
                    _id: Math.round(Math.random() * 1000000),
                    text: message.message,
                    image: message?.image_url,
                    createdAt: new Date(message.created_at),
                    user: {
                        _id: parseInt(message.sender_id)
                    }
                };
            });
            // }).reverse();
            //console.log('reConstructedMessages', reConstructedMessages)
            handleMessage(reConstructedMessages)

        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on("receive_message", (receivedMessage) => {
                console.log('receivedMessage', receivedMessage)
                const transformedMessage = {
                    _id: Math.round(Math.random() * 1000000),
                    text: receivedMessage.message,
                    image: receivedMessage?.image_url,
                    createdAt: new Date(receivedMessage.last_message_time),
                    user: {
                        _id: parseInt(receivedMessage.sender_id),
                    }
                };
                setMessages((previousMessages) => GiftedChat.append(previousMessages, transformedMessage));
            });
            socket.emit("mark_messages_as_read", { userId: user_id, receiverId: receiverId });
        }

        return () => {
            if (socket) {
                socket.off("receive_message");
            }

        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])



    const onSend = (newMessages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
        setInputText(''); // Clear input text after sending message
    };

    const handleSend = () => {
        if (inputText.trim().length > 0 || imageUri) {
            const newMessage = {
                sender_id: user_id,
                receiver_id: receiverId,
                message: inputText.trim(),
                image_url: imageUri
                //createdAt: new Date(),
            }
            socket.emit('send_message', newMessage);
            const transformedMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: newMessage.message,
                image: newMessage?.image_url,
                createdAt: new Date(),
                user: {
                    _id: parseInt(newMessage.sender_id),
                }
            };
            setMessages((previousMessages) => GiftedChat.append(previousMessages, transformedMessage));
            // const newMessage2 = {
            //     _id: Math.round(Math.random() * 1000000), // Generate unique ID for the message
            //     text: inputText.trim(),
            //     createdAt: new Date(),
            //     user: {
            //         _id: parseInt(user_id),
            //     },
            // };
            // onSend(newMessage2);
            // Clear input text after sending message
            setInputText('');
            // Clear image uri after sending message
            setImageUri(null);
        }
    };

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.8,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const { uri } = response.assets[0];
                setImageUri(uri);
            }
        });
    };

    const renderInputToolbar = () => {
        return (
            <View style={styles.inputContainer}>

                {imageUri && (
                    <View style={{ width: 120, height: 120, borderRadius: 16, overflow: 'hidden', marginTop: 10 }}>
                        <Image source={{ uri: imageUri }} style={{ flex: 1 }} resizeMode="cover" />
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 2, right: 3, elevation: 4, shadowOpacity: 0.5 }}
                            onPress={() => setImageUri(null)}
                        >
                            <Icon name="times-circle" size={24} color={colors.blackTransparent} />
                        </TouchableOpacity>
                    </View>
                )}


                <View style={styles.inputIconContainer}>

                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('sendMessage')}
                        multiline
                    />

                    <TouchableOpacity style={{
                        width: 50,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 20
                    }} onPress={() => {
                        handleImagePick()
                    }}>
                        <ImageIcon name='file-plus' size={24} color='#0F6D6A' />
                    </TouchableOpacity>

                </View>

            </View>

        );
    };

    const renderBubble = (props) => {

        const messageUserId = props.currentMessage.user._id;
        const isCurrentUser = parseInt(messageUserId) === parseInt(user_id);

        // console.log('isCurrentUser', isCurrentUser)

        return (
            <Bubble
                {...props}
                isCurrentUser={isCurrentUser}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#DCEBEB',
                        ...styles.bubbleContainer,
                        borderBottomRightRadius: 0
                    },
                    left: {
                        backgroundColor: 'rgba(228, 228, 228, 0.83)',
                        ...styles.bubbleContainer,
                        borderBottomLeftRadius: 0,

                    },
                }}

                textStyle={{
                    right: {
                        color: 'rgba(15, 109, 106, 1)',
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 15
                    },
                    left: {
                        color: 'rgba(56, 55, 55, 1)',
                        fontFamily: fonts.fontsType.regular,
                        fontSize: 15
                    },
                }}

                timeTextStyle={{
                    right: {
                        color: 'gray', // Change the color of time for messages sent by the current user
                    },
                    left: {
                        color: 'gray', // Change the color of time for messages sent by other users
                    },
                }}
            />
        );
    };

    const scrollToBottom = () => {
        giftedChatRef.current.scrollToBottom();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ marginHorizontal: 10 }}>

                <ChatHeader
                    name={`${coachDetails?.first_name} ${coachDetails?.last_name}`}
                    profilePic={(coachDetails?.details?.profile_pic || coachDetails?.profile_pic) || "https://via.placeholder.com/150?text="}
                    online={is_online}
                    onPress={() => {
                        resetNavigation(navigation, "Dashboard", { screen: 'Chat' })
                    }}
                />

            </View>
            <HorizontalDivider height={1} customStyle={{ marginTop: 20 }} />
            {messagesStatus === 'loading' ? ( // Show loader if messages are still loading
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primaryColor} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        //ref={giftedChatRef}
                        messages={messages}
                        onSend={(newMessages) => onSend(newMessages)}
                        user={{
                            _id: parseInt(user_id),
                        }}
                        alignTop={false}
                        inverted={true}
                        renderAvatar={null}
                        renderBubble={renderBubble}
                        renderInputToolbar={renderInputToolbar}
                    />
                </View>
            )}
            {/* Floating button
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    alignSelf: 'center',
                    backgroundColor: 'blue',
                    borderRadius: 30,
                    padding: 10,
                }}
                onPress={() => { scrollToBottom() }}>
                <Icon name="arrow-down" size={30} color="white" />
            </TouchableOpacity> */}

            {Platform.OS === 'android' && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} />}
            <TouchableOpacity style={styles.sendButton} onPress={() => { handleSend() }}>
                {Platform.OS === 'android' ? <SendIcon width={45} height={45} /> :
                    <SendIcon />}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bubbleContainer: {
        borderRadius: 28,
        marginBottom: 30,
        marginRight: 8,
        marginLeft: 8,
    },
    sendButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 22 : 10,
        right: 10,
        marginEnd: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',

    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {
        borderRadius: 28,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        marginStart: 20,
        backgroundColor: '#E4E4E4',
        bottom: Platform.OS === 'ios' ? -10 : 10,
        width: wp('75%'),
        position: 'absolute',
    },
    inputIconContainer: {
        flexDirection: 'row',
        width: wp('75%'),
    },
    textInput: {
        fontSize: 14,
        fontFamily: fonts.fontsType.regular,
        color: 'rgba(0, 0, 0, 0.6)',
        textAlignVertical: 'center',
        flex: 1

    },
    loaderContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});





