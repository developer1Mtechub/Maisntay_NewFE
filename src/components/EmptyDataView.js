import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';
import useCustomTranslation from '../utilities/useCustomTranslation';

const EmptyDataView = ({ message, showImage, customTextStyle }) => {
    const { t } = useCustomTranslation();
    return (
        <View style={styles.container}>
            {showImage && <Image
                style={{
                    width: 150,
                    height: 150,
                    marginVertical: 20
                }}
                source={{ uri: 'https://img.freepik.com/premium-vector/flat-vector-no-data-search-error-landing-concept-illustration_939213-230.jpg?w=1060' }} />}

            {!showImage && <Text style={[{
                color: colors.blackTransparent,
                fontFamily: fonts.fontsType.medium,
                fontSize: 18,
                marginTop: 30,

            }, customTextStyle]}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginBottom: 70
    },
});

export default EmptyDataView;

