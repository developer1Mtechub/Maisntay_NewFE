import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import fonts from '../../../theme/fonts';
import HeaderComponent from '../../../components/HeaderComponent';
import colors from '../../../theme/colors';
import { BASE_URL } from '../../../configs/apiUrl';
import { resetNavigation } from '../../../utilities/resetNavigation';
import useBackHandler from '../../../components/useBackHandler';
import useCustomTranslation from '../../../utilities/useCustomTranslation';

const TermsAndPrivacyPolicy = ({ navigation, route }) => {
    const { t } = useCustomTranslation();
    const { type } = route.params
    const [termsAndPolicy, setTermsAndPolicy] = useState('');
    const [loading, setLoading] = useState(true);

    const handleBackPress = () => {
        resetNavigation(navigation, "Dashboard", { screen: "Setting" })
        return true;
    };

    useBackHandler(handleBackPress)

    useEffect(() => {
        fetchTermsAndPolicy(type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const fetchTermsAndPolicy = async (type) => {
        try {
            const response = await fetch(`${BASE_URL}${type === 'terms' ? '/polices/get/terms' : '/polices/get/privacy'}`);
            const data = await response.json();
            const parsedContent = JSON.parse(data.policy.content);
            const policyText = parsedContent.blocks.map(block => block.text).join('\n');
            setTermsAndPolicy(policyText);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching terms and policy:', error);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderComponent
                navigateTo={"Dashboard"}
                navigation={navigation}
                params={{ screen: "Setting" }}
                headerTitle={type === 'terms' ? t('terms&Conditions') : t('privacyPolicy')}
            />
            {loading ? (
                <ActivityIndicator size="large" color={colors.primaryColor} />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                    <Text style={styles.text}>{termsAndPolicy}</Text>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 20,
    },
    text: {
        fontFamily: fonts.fontsType.regular,
        fontSize: 15,
        lineHeight: 28,
        textAlign: 'left',
        color: '#666666'
    },
});

export default TermsAndPrivacyPolicy;
