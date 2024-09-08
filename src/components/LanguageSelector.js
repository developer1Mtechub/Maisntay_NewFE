import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';
import useCustomTranslation from '../utilities/useCustomTranslation';

const LanguageSelector = ({ dropDownStyle, buttonStyle }) => {
    const { changeLanguage } = useCustomTranslation();
    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    return (
        <View>
            <TouchableOpacity
                style={[styles.languageButton, buttonStyle]}
                onPress={() => setLanguageDropdownVisible(!languageDropdownVisible)}
            >
                <Text style={styles.languageButtonText}>{selectedLanguage}</Text>
            </TouchableOpacity>

            {languageDropdownVisible && (
                <View style={[styles.languageDropdown, { dropDownStyle }]}>
                    <TouchableOpacity
                        style={styles.languageOption}
                        onPress={() => {
                            changeLanguage('en');
                            setSelectedLanguage('English');
                            setLanguageDropdownVisible(false);
                        }}
                    >
                        <Text style={styles.text}>
                            English
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.languageOption}
                        onPress={() => {
                            changeLanguage('de');
                            setSelectedLanguage('German');
                            setLanguageDropdownVisible(false);
                        }}
                    >
                        <Text style={styles.text}>
                            German
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    languageButton: {
        position: 'absolute',
        top: 20,
        right: 10,
        backgroundColor: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: colors.primaryColor,
    },
    languageButtonText: {
        fontSize: 16,
        fontFamily: fonts.fontsType.medium,
        color: colors.primaryColor
    },
    languageDropdown: {
        position: 'absolute',
        top: 20,
        right: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        shadowColor: colors.primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 35,
        zIndex: 1000

    },
    languageOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    text: { fontFamily: fonts.fontsType.medium, fontSize: 14, color: colors.blackTransparent }
});

export default LanguageSelector;
