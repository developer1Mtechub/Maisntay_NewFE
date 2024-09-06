import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler, TouchableOpacity, Text, SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentAccount } from '../../redux/paymentMethod/createAccountLinkSlice';
import FullScreenLoader from '../../components/CustomLoader';
import BackArrow from '../../assets/svgs/backArrow.svg';
import { resetNavigation } from '../../utilities/resetNavigation';
import { verifyAccountStatus } from '../../redux/paymentMethod/verifyAccountStatusSlice';
import queryString from 'query-string';
import { storeData } from '../../utilities/localStorage';
import { postCoacheeProfile } from '../../redux/CoacheeSlices/submitCoacheeProfileSlice';

const CreateStripeAccount = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.createAccountLink);
    const [webViewUrl, setWebViewUrl] = useState(null);
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);
    const webViewRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        dispatch(createPaymentAccount()).then((result) => {
            if (result?.payload?.success === true) {
                setWebViewUrl(result?.payload?.result?.url);
            }
        });

        // Set loader to false after 5 seconds
        const loaderTimeout = setTimeout(() => {
            setIsLoaderVisible(false);
        }, 5000);

        return () => clearTimeout(loaderTimeout);
    }, [dispatch]);

    const parseResponseDataTest = (url) => {
        const parsed = queryString.parseUrl(url);
        const { query } = parsed;
        return query;
    };

    const parseResponseData = (url) => {
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const secondLastPart = urlParts[urlParts.length - 2];
        let accountId = null;
        let uniqueIdentifier = null;
        let query = {};

        if (lastPart.includes('?')) {
            const parsed = queryString.parseUrl(url);
            query = parsed.query;
        } else {
            accountId = secondLastPart;
            uniqueIdentifier = lastPart;
        }

        return { accountId, uniqueIdentifier, query };
    };

    const handleBackButton = () => {
        if (webViewRef.current && webViewRef.current.canGoBack()) {
            webViewRef.current.goBack();
            return true;
        }
        return false;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    // Update stripe status to coach profile
    async function delayAndStoreData(result) {
        await storeData('userData', result);
    }

    const handleSubmitProfile = () => {
        const formData = new FormData();
        formData.append('role', "coach");
        formData.append('is_stripe_completed', true);

        dispatch(postCoacheeProfile(formData)).then((result) => {
            if (result?.payload?.success === true) {
                const { first_name, last_name, role, user_id } = result?.payload?.data;

                const user = {
                    first_name: first_name,
                    last_name: last_name,
                    role: role,
                    id: user_id,
                    user_id: user_id
                };

                delayAndStoreData({ user });
                setTimeout(() => {
                    resetNavigation(navigation, "CoachProfileCompletion");
                }, 3000);
            } else {
                console.log('updating stripe status error', result?.payload?.message);
            }
        });
    };

    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        let responseData = {};

        if (url.startsWith('https://connect.stripe.com/setup/s')) {
            responseData = parseResponseData(url);
        } else if (url.startsWith('http://localhost:3001/coach-profile-complete')) {
            responseData = parseResponseData(url);
        }

        if (responseData) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                verifyAccount(responseData);
            }, 500);
        }
    };

    const verifyFilledDetail = (payload) => {
        const { result } = payload;

        const areKeysFilled = Object.keys(result).every(key => {
            if (key === 'eventually_due') return true;

            if (Array.isArray(result[key])) {
                return result[key].length === 0;
            }
            return result[key] == null;
        });

        return areKeysFilled;
    };

    const verifyAccount = (data) => {
        dispatch(verifyAccountStatus({
            account_id: data?.accountId != null ? data?.accountId : data?.query?.account_id
        })).then((result) => {
            const isVerified = verifyFilledDetail(result?.payload);
            if (isVerified) {
                handleSubmitProfile();
            } else {
                console.log('Your account detail is not filled.');
            }
        });
    };

    if (isLoaderVisible) {
        return <FullScreenLoader visible={isLoaderVisible ? 'loading' :'nothing'} />;
    }

    const renderWebView = () => {
        if (!webViewUrl) {
            return <Text>No URL available</Text>;
        }

        return (
            <WebView
                ref={webViewRef}
                source={{ uri: webViewUrl }}
                incognito={true}
                cacheEnabled={false}
                onNavigationStateChange={handleWebViewNavigationStateChange}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => resetNavigation(navigation, "SignIn")}
                >
                    <BackArrow />
                </TouchableOpacity>
            </View>
            {renderWebView()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateStripeAccount;

