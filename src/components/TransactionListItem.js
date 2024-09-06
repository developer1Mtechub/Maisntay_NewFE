import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import HorizontalDivider from './DividerLine';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import useCustomTranslation from '../utilities/useCustomTranslation';

const TransactionListItem = ({ amount, out_going, date }) => {
    const { t } = useCustomTranslation();
    return (
        <View>
            <View style={styles.transactionItem}>
                <Text style={styles.amount}>{`${amount} ${'CHF'}`}
                    <Text style={[styles.outGoingStatus,
                    { color: out_going === false ? '#00CB14' : '#FF3030' }]}>
                        {`${out_going === false ? t('credit') : t('debit')}`}
                    </Text>
                </Text>
                <Text style={styles.date}>{moment(date).format('DD MMM, hh:mm a')}</Text>
            </View>
            <HorizontalDivider
                height={1}
                customStyle={{ width: wp('90%'), alignSelf: 'center' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 16,
        paddingVertical: 15,
        marginTop: 10
    },
    amount: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: 17,
        color: colors.primaryColor,
    },
    outGoingStatus: {
        fontFamily: fonts.fontsType.medium,
        fontSize: 11,
        color: colors.primaryColor,
    },
    date: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 13,
        color: '#000000',
        opacity: 0.6,
    },
});

export default TransactionListItem;
