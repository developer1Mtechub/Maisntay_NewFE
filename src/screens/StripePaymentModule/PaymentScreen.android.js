import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
//import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import {
    useStripe,
    CardField,
    StripeProvider,
    CardForm
} from '@stripe/stripe-react-native';
import CustomButton from '../../components/ButtonComponent';
import PaymentCardList from './PaymentCardList';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../theme/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer } from '../../redux/paymentMethod/createCustomerSlice';
import { makePayment } from '../../redux/paymentMethod/makePaymentSlice';
import CrossIcon from '../../assets/svgs/cross_icon.svg'
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import colors from '../../theme/colors';
import HeaderComponent from '../../components/HeaderComponent';
import useBackHandler from '../../components/useBackHandler';
import { createNotification } from '../../redux/NotificationModuleSlices/createNotificationSlice';
import useCustomTranslation from '../../utilities/useCustomTranslation';
const PaymentScreen = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const { paymentPayload } = route.params;
    const { createPaymentMethod } = useStripe();
    const dispatch = useDispatch();
    const createCustomerStatus = useSelector((state) => state.createCustomer.status)
    const makePaymentStatus = useSelector((state) => state.makePayment.status)
    const [cardDetails, setCradDetails] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [paymentMethodId, setPaymentMethodId] = useState(null);
    const [toastVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const [toastType, setToastType] = useState('');
    const buttonText = selectedCard ? "Pay Now" : "Add Card";
    const labelText = selectedCard ? "Pay with selected card" : "Add New Card";
    const stripeKey = "pk_test_51OmriNHtA3SK3biQ6qq8s1IrRmnZ08NsSlklyXD9GN8gLPGsR4tGqH08FkxkBDvPrEMIPLEIQMkAc8NrASOByh6E00ayjZlEWe"
    //console.log(paymentPayload?.sessionItem)

    const fetchCardInfo = (card) => {
        setSelectedCard(card);
        setPaymentMethodId(card?.card_id)
        console.log('Selected Card Info:', card);
    };

    const handleCardSelect = (card) => {
        setSelectedCard(card);
    };

    const handleCardDeselect = () => {
        setSelectedCard(null);
    };

    const handleAddNewButton = () => {
        handleCardDeselect();

    };

    const clearSelectedCard = () => {
        setSelectedCard(null);
    };

    const AddPaymentMethod = async () => {
        console.log(cardDetails.card)
        if (!selectedCard) {
            try {
                const { paymentMethod, error } = await createPaymentMethod({
                    type: 'card',
                    card: cardDetails.card,
                    paymentMethodType: 'Card',
                },);

                if (error) {
                    console.error('Error creating payment method:', error);
                } else {
                    console.log('Created payment method:', paymentMethod?.id);
                    // Now you can handle the payment using the paymentMethod
                    // For example, call a function to process the payment
                    callCreateCustomerAPI(paymentMethod?.id);
                    // setPaymentMethodId(paymentMethod?.id)
                    // clearSelectedCard(); // Clear selected card after payment
                }
            } catch (error) {
                console.error('Error creating payment method:', error);
            }
        } else {
            console.log('card selected');
        }
    };

    const callCreateCustomerAPI = (paymentMethodId) => {
        console.log(' paymentMethod id :', paymentMethodId);
        dispatch(createCustomer({
            user_id: paymentPayload?.coachee_id,
            paymentMethodId: paymentMethodId
        })).then((result) => {
            console.log('customer creation', result?.payload)
            if (result?.payload?.success === true) {
                renderSuccessMessage(result?.payload?.message, false)
                setTimeout(() => {
                    sendPayment(paymentMethodId);
                }, 3000);
            } else {
                renderErrorMessage(result?.payload?.message)
            }


        })

    };

    console.log('paymentPayload', paymentPayload)

    const sendPayment = (paymentMethodId) => {
        const sendPayemntPayload = {
            ...paymentPayload,
            paymentMethodId: paymentMethodId
        }
        //console.log('sendPayemntPayload', sendPayemntPayload)
        dispatch(makePayment(sendPayemntPayload)).then((result) => {
            console.log('send payment', result?.payload)
            if (result?.payload?.success == true) {

                dispatch(createNotification(
                    {
                        "title": "PAYMENT_SUCCESSFUL",
                        "content": "Payment successful",
                        "type": "PAYMENT", // SESSION | BADGES | PAYMENT | REVIEWS
                        "coach_id": paymentPayload?.coach_id,
                        "coachee_id": paymentPayload?.coachee_id,
                        "session_id": paymentPayload?.session_id
                    }
                )).then((result) => {
                    console.log('create notification', result?.payload?.success)

                })

                renderSuccessMessage(result?.payload?.message, true)
            } else {
                renderErrorMessage(result?.payload?.message)
            }
        })

    }

    const handleCloseModal = () => {
        clearSelectedCard();
        // onClose();
    };

    const renderSuccessMessage = (message, displayType) => {

        if (displayType) {
            setMessage('Success')
            setDescription(message)
            setIsVisible(true);
            setToastType('success')
            setTimeout(() => {
                //handleCloseModal();
                resetNavigation(navigation, "WellcoinScreen")
            }, 3000);
        }


    }

    const renderErrorMessage = (message) => {
        setMessage('Error')
        setDescription(message)
        setIsVisible(true);
        setToastType('error')
    }

    const renderToastMessage = () => {
        return <CustomSnackbar visible={toastVisible} message={message}
            messageDescription={description}
            onDismiss={() => { setIsVisible(false) }} toastType={toastType} />
    }

    const handleBackPress = () => {
        resetNavigation(navigation, 'SessionReviewBooking')
        return true;
    };

    useBackHandler(handleBackPress)


    return (
        <StripeProvider publishableKey={stripeKey}>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
                <HeaderComponent
                    navigation={navigation}
                    navigateTo={'SessionReviewBooking'}
                    //params={{ sessionItem: paymentPayload?.sessionItem }}
                    headerTitle={t('payment')}
                />

                <View style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    paddingHorizontal: 20
                }}>

                    {renderToastMessage()}

                    {/* <PaymentCardList
                        onCardSelect={fetchCardInfo}
                        selectedCard={selectedCard}
                        onCardDeselect={handleCardDeselect}
                    /> */}

                    <Text style={{
                        fontFamily: fonts.fontsType.semiBold,
                        fontSize: 18,
                        marginTop: 50,
                        alignSelf: 'center',
                        color: colors.black
                    }}>{labelText}</Text>

                    {!selectedCard && (


                        <CardField
                            postalCodeEnabled={false}
                            // autofocus={true}
                            placeholder={{
                                number: '4242 4242 4242 4242',
                            }}
                            cardStyle={{
                                backgroundColor: '#FFFFFF',
                                textColor: '#000000',
                            }}
                            style={{
                                width: '100%',
                                height: '20%',
                            }}
                            onCardChange={(cardDetails) => {
                                setCradDetails({ type: 'card', card: cardDetails });
                            }}

                            onFocus={(focusedField) => {
                                console.log('focusField', focusedField);
                            }}
                        />
                    )}
                    <View style={styles.modalContainer}>

                        <CustomButton
                            title={buttonText}
                            loading={makePaymentStatus == 'loading' || createCustomerStatus == 'loading' ? true : false}
                            customStyle={{
                                marginTop: 10,
                                width: wp('80%')
                            }}
                            onPress={() => {
                                if (selectedCard) {
                                    sendPayment(paymentMethodId);
                                } else {
                                    AddPaymentMethod()
                                    console.log('adding card');
                                }
                            }}
                        />

                        {selectedCard && <CustomButton
                            title={t('addNewCard')}
                            customStyle={{
                                marginTop: -20,
                                width: wp('80%')
                            }}
                            onPress={() => {
                                handleAddNewButton()
                                //clearSelectedCard()
                            }}
                        />

                        }
                    </View>
                </View>

            </SafeAreaView>

        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        //flex: 1,
        alignItems: 'center',
        marginTop: 10,
        // justifyContent: 'flex-end',
        // backgroundColor: 'white',
    },
    cardFieldContainer: {
        width: '90%',
        height: 50
    },
});

export default PaymentScreen;