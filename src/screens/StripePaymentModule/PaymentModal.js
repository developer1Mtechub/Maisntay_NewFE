import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
//import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import {
    useStripe,
    CardField,
    StripeProvider
} from '@stripe/stripe-react-native';
import CustomButton from '../../components/ButtonComponent';
import PaymentCardList from './PaymentCardList';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../theme/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer } from '../../redux/paymentMethod/createCustomerSlice';
import { makePayment } from '../../redux/paymentMethod/makePaymentSlice';
import CrossIcon from '../../assets/svgs/cross_icon.svg'
import CustomSnackbar from '../../components/CustomToast';
import { resetNavigation } from '../../utilities/resetNavigation';
import { useAlert } from '../../providers/AlertContext';

const PaymentModal = ({ onClose, paymentPayload, navigation }) => {
    const { createPaymentMethod } = useStripe();
    const dispatch = useDispatch();
    const { showAlert } = useAlert()
    const createCustomerStatus = useSelector((state) => state.createCustomer.status)
    const makePaymentStatus = useSelector((state) => state.makePayment.status)
    const [cardDetails, setCradDetails] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [paymentMethodId, setPaymentMethodId] = useState(null);
    const buttonText = selectedCard ? "Pay Now" : "Add Card";
    const labelText = selectedCard ? "Pay with selected card" : "Add New Card";
    const stripeKey = "pk_test_51OmriNHtA3SK3biQ6qq8s1IrRmnZ08NsSlklyXD9GN8gLPGsR4tGqH08FkxkBDvPrEMIPLEIQMkAc8NrASOByh6E00ayjZlEWe"


    const fetchCardInfo = (card) => {
        setSelectedCard(card);
        setPaymentMethodId(card?.card_id)
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
        dispatch(createCustomer({
            user_id: paymentPayload?.coachee_id,
            paymentMethodId: paymentMethodId
        })).then((result) => {
            if (result?.payload?.success === true) {
                renderSuccessMessage(result?.payload?.message, false)
                setTimeout(() => {
                    sendPayment(paymentMethodId);
                }, 3000);
            } else {
                showAlert("Error", 'error', result?.payload?.message)
            }


        })

    };

    const sendPayment = (paymentMethodId) => {
        const sendPayemntPayload = {
            ...paymentPayload,
            paymentMethodId: paymentMethodId
        }
        dispatch(makePayment(sendPayemntPayload)).then((result) => {
            if (result?.payload?.success == true) {
                renderSuccessMessage(result?.payload?.message, true)
            } else {
                showAlert("Error", 'error', result?.payload?.message)
            }
        })

    }

    const handleCloseModal = () => {
        clearSelectedCard();
        onClose();
    };

    const renderSuccessMessage = (message, displayType) => {
        showAlert("Success", 'success', message)
        if (displayType) {
            setTimeout(() => {
                handleCloseModal();
                resetNavigation(navigation, "WellcoinScreen")
            }, 3000);
        }


    }



    return (
        <StripeProvider publishableKey={stripeKey}>
            <View>

                <PaymentCardList
                    onCardSelect={fetchCardInfo}
                    selectedCard={selectedCard}
                    onCardDeselect={handleCardDeselect}
                />
                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: 18,
                    marginTop: 50,
                    alignSelf: 'center'
                }}>{labelText}</Text>

                {!selectedCard && (
                    <CardField
                        postalCodeEnabled={false}
                        autofocus={true}
                        placeholder={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                        }}
                        style={{
                            width: '100%',
                            height: '50%',
                            marginVertical: 30,
                        }}
                        onCardChange={(cardDetails) => {
                            setCradDetails({ type: 'card', card: cardDetails });
                        }}

                        onFocus={(focusedField) => {
                            console.log('focusField', focusedField);
                        }}
                    />)}
                <View style={styles.modalContainer}>




                    <CustomButton
                        title={buttonText}
                        loading={makePaymentStatus == 'loading' || createCustomerStatus == 'loading' ? true : false}
                        customStyle={{
                            marginTop: 50,
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
                        title={'Add new Card'}
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

export default PaymentModal;