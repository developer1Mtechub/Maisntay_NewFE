import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { fecthUserCards } from '../../redux/paymentMethod/getUserCardsSlice';
import fonts from '../../theme/fonts';

const PaymentCardList = ({ onCardSelect, selectedCard, onCardDeselect }) => {
    const dispatch = useDispatch();
    const { cardsList, status } = useSelector((state) => state.userSavedCard)
    const { user_id } = useSelector(state => state.userLogin)
    //const [selectedCard, setSelectedCard] = useState(null);
    const visa = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1280px-Visa.svg.png'
    const master = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/2560px-Mastercard_2019_logo.svg.png'


    useEffect(() => {
        dispatch(fecthUserCards({ user_id: user_id }))
    }, [dispatch, user_id])

    // const handleCardSelect = (card) => {
    //     setSelectedCard(card);
    //     onCardSelect(card);
    // };

    const handleCardSelect = (card) => {
        if (selectedCard === card) {
            // If the same card is selected again, deselect it
            onCardDeselect();
        } else {
            onCardSelect(card);
        }
    };

    return (
        <SafeAreaView>
            <Text style={{
                fontFamily: fonts.fontsType.semiBold,
                fontSize: 14,
                color: colors.primaryColor,
                marginStart: 10,
                marginTop: 20,
                marginBottom:8,
                alignSelf:'center'
            }}>{cardsList?.result?.length > 0 ? "Saved Card List" : "No saved card available, Add new one"}</Text>
            {
                status == 'loading' ?
                    <ActivityIndicator
                        size={'large'}
                        color={colors.primaryColor} /> : <ScrollView horizontal>
                        {cardsList?.result?.map((card, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.cardContainer, selectedCard === card && styles.selectedCard]}
                                onPress={() => handleCardSelect(card)}
                            >
                                {(
                                    <Image source={{ uri: card.brand_name === 'visa' ? visa : master }} style={styles.cardImage} />
                                )}
                                {/* Add more conditional rendering for other card brands */}

                                <Text style={styles.cardText}>{`**** **** **** ${card.last_digit}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        width: 120,

    },
    selectedCard: {
        borderColor: colors.primaryColor,
    },
    cardImage: {
        width: 50,
        height: 30,
        marginTop: 5
    },
    cardText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10

    },
});

export default PaymentCardList;
