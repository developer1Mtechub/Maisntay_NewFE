import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import fonts from '../theme/fonts';

const CountryCodePicker = ({ onSelectCountry, customStyle }) => {
    const [countryCode, setCountryCode] = useState('DE');
    const [callingCode, setCallingCode] = useState('49');
    const [countryName, setCountryName] = useState('Germany');
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleCountrySelect = (country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
        setCountryName(country.name);
        if (onSelectCountry) {
            onSelectCountry(country);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.picker, customStyle]}
                onPress={() => setPickerVisible(true)}
            >
                <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag
                    withCallingCode
                    withModal
                    //withAlphaFilter
                    visible={isPickerVisible}
                    onClose={() => setPickerVisible(false)}
                    onSelect={handleCountrySelect}
                    flatListProps={{
                        keyboardShouldPersistTaps: 'always'
                    }}
                />
                <Text style={styles.text}>{countryCode} (+{callingCode})</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 12,
    },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: "rgba(238, 238, 238, 1)",
    },
    text: {
        fontSize: 14,
        fontFamily: fonts.fontsType.regular,
    },
});

export default CountryCodePicker;
