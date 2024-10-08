import React, { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, RefreshControl, View, ScrollView } from 'react-native';
import colors from '../../../../theme/colors';
import TransactionListItem from '../../../../components/TransactionListItem';
import fonts from '../../../../theme/fonts';
import MyWalletHeader from '../../Components/MyWalletHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../../../redux/paymentMethod/getTransactionsSlice';
import FullScreenLoader from '../../../../components/CustomLoader';
import { BottomSheet } from '@rneui/themed';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import CancleIcon from "../../../../assets/svgs/cross_icon.svg";
import CustomInput from '../../../../components/TextInputComponent';
import CustomButton from '../../../../components/ButtonComponent';
import { withDrawAmount } from '../../../../redux/paymentMethod/withDrawAmountSlice';
import CustomSnackbar from '../../../../components/CustomToast';
import { resetNavigation } from '../../../../utilities/resetNavigation';
import useBackHandler from '../../../../components/useBackHandler';
import useCustomTranslation from '../../../../utilities/useCustomTranslation';
import { useAlert } from '../../../../providers/AlertContext';

const MyWallet = ({ navigation }) => {
    const { t } = useCustomTranslation();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const { transactions, status } = useSelector((state) => state.transactions)
    const withdrawStatus = useSelector((state) => state.withDrawAmount.status)
    const { user_id } = useSelector((state) => state.anyData);
    const { anyData } = useSelector((state) => state.anyData)
    const [withdrawSheet, setWithdrawSheet] = useState(false);
    const [amount, setAmount] = useState('')
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchTransactions({ coach_id: user_id }))
    }, [dispatch, user_id])

    const toggleSheet = () => {
        setWithdrawSheet(!withdrawSheet);
    }

    const handleWithdrawAmount = () => {
        if (amount == '') {
            showAlert("Error", 'error', "Enter amount to withdraw.")
            return
        }
        const withdrawAmountPayload = {
            coachId: user_id,
            amount: amount
        }
        dispatch(withDrawAmount(withdrawAmountPayload)).then((result) => {
            if (result?.payload?.success === true) {
                renderSuccessMessage(result?.payload?.message)
            } else {
                showAlert("Error", 'error', result?.payload?.message)
            }
        })
    }

    const renderSuccessMessage = (message) => {

        showAlert("Success", 'success', message)
        setTimeout(() => {
            toggleSheet();
            setAmount('');
        }, 3000);

    }

    const renderWithdrawSheet = () => {
        return (
            <BottomSheet
                onBackdropPress={() =>
                    handleWithdrawAmount(false)

                }
                modalProps={{}} isVisible={withdrawSheet}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: '100%',
                        height: hp('30%'),
                        borderTopEndRadius: 30,
                        borderTopStartRadius: 30,
                        padding: 10,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10
                    }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "black",
                                fontFamily: fonts.fontsType.bold,
                            }}>
                            {t('withdrawAmount')}
                        </Text>
                        <CancleIcon
                            onPress={() => {
                                toggleSheet();
                                setAmount('');
                            }}
                        />
                    </View>

                    <CustomInput
                        inputType={'number-pad'}
                        value={amount}
                        placeholder={t('amount')}
                        onValueChange={(text) => setAmount(text)}
                        customContainerStyle={{ width: wp('85%'), alignSelf: 'center' }}
                    />

                    <CustomButton
                        loading={withdrawStatus == 'loading' ? true : false}
                        onPress={() => {
                            handleWithdrawAmount()
                        }}
                        title={t('withdraw')}
                        customStyle={{ marginTop: 40 }}
                    />



                </View>
            </BottomSheet>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const fetchData = async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            await dispatch(fetchTransactions({ coach_id: user_id }))
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
        setRefreshing(false);
    };

    const handleBackPress = () => {
        if (anyData?.route === 'NotificationList') {
            resetNavigation(navigation, "NotificationList")
        } else {
            resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        }

        return true;
    };
    useBackHandler(handleBackPress)

    return (
        <ScrollView nestedScrollEnabled={true} style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                />
            }
        >

            <MyWalletHeader
                amount={transactions?.result?.wallet?.balance !== undefined ? `${transactions?.result?.wallet?.balance} CHF` : 'N/A'}
                navigation={navigation}
                status={status}
                onWithdraw={() => {
                    toggleSheet()
                }}
                route={anyData?.route}
            />

            <View style={{ margin: 20, flex: 1 }}>

                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: 17,
                    color: '#212121',
                }}>{t('transactionHistory')}</Text>
                {
                    status == 'loading' && !refreshing ? <FullScreenLoader visible={status} /> :
                        transactions?.result?.transactions.length > 0 ? <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginBottom: 20 }}
                            data={transactions?.result?.transactions}
                            renderItem={({ item }) => (
                                <TransactionListItem
                                    amount={item.amount}
                                    //currency={item.currency}
                                    out_going={item?.out_going}
                                    date={item.date}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString() + item}
                        /> :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: fonts.fontsType.medium,
                                    fontSize: 16,
                                    color: colors.primaryColor,
                                }}>{t('emptyMessage')}</Text>
                            </View>
                }

            </View>
            {renderWithdrawSheet()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default MyWallet;
