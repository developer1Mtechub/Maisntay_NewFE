import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import ChatUserItem from './Components/ChatUserListComponent';
import colors from '../../theme/colors';
import { Text } from 'react-native-elements';
import fonts from '../../theme/fonts';
import SearchIcon from '../../assets/svgs/list_search.svg'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/ButtonComponent';
import { BottomSheet } from '@rneui/themed';
import HorizontalDivider from '../../components/DividerLine';
import { reportUser } from '../../redux/reportChatUserSlice';
import { fetchContactList } from '../../redux/ChatModuleSlice/fetchContactListSlice';
import { resetNavigation } from '../../utilities/resetNavigation';
import { deleteChat } from '../../redux/ChatModuleSlice/deleteChatSlice';
import CustomSnackbar from '../../components/CustomToast';
import useCustomTranslation from '../../utilities/useCustomTranslation';
import { useAlert } from '../../providers/AlertContext';

const Chat = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch()
    const { showAlert } = useAlert()
    const [contacts, setContacts] = useState([]);
    const { user_id } = useSelector(state => state.userLogin)
    const { contactsList, status } = useSelector(state => state.contactsList)
    const [searchQuery, setSearchQuery] = useState('');
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [showReportSheet, setShowReportSheet] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        dispatch(fetchContactList({ user_id: user_id })).then((result) => {
            setContacts(result?.payload)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user_id]);

    useEffect(() => {

        const filteredContacts = contactsList?.filter(contact =>
            contact?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact?.last_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setContacts(filteredContacts)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);


    if (status == 'loading') {
        return <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
        </View>
    }


    const renderDeleteBottomSheet = () => {
        return <BottomSheet
            onBackdropPress={() =>
                setIsSheetVisible(false)

            }
            modalProps={{}} isVisible={isSheetVisible}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 40,
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontFamily: fonts.fontsType.semiBold,
                    color: 'rgba(255, 72, 72, 1)',
                    alignSelf: 'center',
                    marginBottom: 15,
                    marginTop: -15
                }}>Delete Chat</Text>
                <HorizontalDivider />
                <Text style={{
                    fontSize: 16,
                    fontFamily: fonts.fontsType.medium,
                    color: 'rgba(49, 40, 2, 1)',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20
                }}>
                    Are you sure you want to delete chat?
                </Text>
                <CustomButton
                    onPress={() => {
                        handleDelete()
                    }}
                    title={'Yes, Delete'}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
                <CustomButton
                    onPress={() => {
                        setIsSheetVisible(false)
                    }}
                    title={'Cancel'}
                    customStyle={{
                        width: '100%',
                        marginBottom: -10,
                        backgroundColor: colors.transparent
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    }

    const renderReportBottomSheet = () => {
        return <BottomSheet
            onBackdropPress={() =>
                setShowReportSheet(false)

            }
            modalProps={{}} isVisible={showReportSheet}>
            <View
                style={{
                    backgroundColor: 'white',
                    width: "100%",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 40,
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontFamily: fonts.fontsType.semiBold,
                    color: 'rgba(255, 72, 72, 1)',
                    alignSelf: 'center',
                    marginBottom: 15,
                    marginTop: -15
                }}>Report User</Text>
                <HorizontalDivider />
                <Text style={{
                    fontSize: 16,
                    fontFamily: fonts.fontsType.medium,
                    color: 'rgba(49, 40, 2, 1)',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20
                }}>
                    Are you sure you want to report chat?
                </Text>
                <CustomButton
                    onPress={() => {
                        handleReport()
                    }}
                    title={'Yes, Report'}
                    customStyle={{ width: '100%', marginBottom: -10 }}
                />
                <CustomButton
                    onPress={() => {
                        setShowReportSheet(false)
                    }}
                    title={'Cancel'}
                    customStyle={{
                        width: '100%',
                        marginBottom: -10,
                        backgroundColor: colors.transparent
                    }}
                    textCustomStyle={{ color: colors.primaryColor }}
                />
            </View>
        </BottomSheet>
    }

    const handleDelete = () => {
        const currentUserId = parseInt(user_id);
        const selectedUserId = parseInt(selectedContactId);
        dispatch(deleteChat({
            sender_id: currentUserId,
            receiver_id: selectedUserId
        })).then((result) => {
            //console.log(result?.payload)
            if (result?.payload?.chats.length > 0) {
                renderSuccessMessage(result?.payload?.message)
            } else {
                showAlert("Error", 'error', 'Chat not deleted.')
                //renderErrorMessage('Chat not deleted.')
            }
        })
        setIsSheetVisible(false);
    };


    const handleReport = () => {
        const selectedUserId = parseInt(selectedContactId);
        resetNavigation(navigation, "ReportUser", {
            receiverId: selectedUserId
        })

        setShowReportSheet(false);
    };


    const renderItem = ({ item }) => (
        <ChatUserItem
            user={item}
            onDeletePress={() => {
                setSelectedContactId(item?.id);
                setIsSheetVisible(true);
            }}
            onReportPress={() => {
                setSelectedContactId(item?.id);
                setShowReportSheet(true);
            }}
            navigation={navigation}
        />
    );


    const renderSuccessMessage = async (message) => {

        showAlert("Success", 'success', message)
        setTimeout(async () => {

            await dispatch(fetchContactList({ user_id: user_id })).then((result) => {
                setContacts(result?.payload)
            })

        }, 3000);
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const fetchData = async () => {

        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            await dispatch(fetchContactList({ user_id: user_id })).then((result) => {
                setContacts(result?.payload)
            })
        } catch (error) {
            console.error('Error fetching contact list:', error);
        }
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.headerStyle}>{t('chat')}</Text>

                <View style={styles.textInputContainer}>
                    <SearchIcon />
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder={t('searchHere')}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor='rgba(137, 137, 137, 0.83)'
                    />
                </View>

            </View>

            <FlatList
                data={contacts}
                renderItem={renderItem}
                keyExtractor={(item, index) => item + index}
                style={{ marginTop: 20, flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('noContct')}</Text>
                    </View>
                }
            />
            {renderDeleteBottomSheet()}
            {renderReportBottomSheet()}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 253, 253, 1)',
        borderRadius: 28,
        paddingHorizontal: 10,
        width: wp('90%'),
        alignSelf: 'center',
        height: 45,
        marginTop: 30,
        borderWidth: 0.5,
        borderColor: 'rgba(229, 229, 229, 1)'
    },
    headerStyle: {
        color: 'rgba(49, 40, 2, 1)',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 23,
        alignSelf: 'center'
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 8,
        color: colors.black
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 18,
        color: colors.primaryColor
    }
})

export default Chat;
