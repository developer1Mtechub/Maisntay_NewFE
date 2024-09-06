import 'intl-pluralrules';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';

const defaultLanguage = 'de';

const getStoredLanguage = async () => {
    try {
        const language = await AsyncStorage.getItem('language');
        return language || defaultLanguage;
    } catch (error) {
        console.error('Error getting language from AsyncStorage:', error);
        return defaultLanguage;
    }
};

const setStoredLanguage = async (language) => {
    try {
        await AsyncStorage.setItem('language', language);
    } catch (error) {
        console.error('Error setting language to AsyncStorage:', error);
    }
};

getStoredLanguage().then((language) => {
    console.log(language)
    i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: {
                    translation: enTranslation,
                },
                de: {
                    translation: deTranslation,
                },
            },
            lng: language, // default language
            fallbackLng: defaultLanguage,
            interpolation: {
                escapeValue: false, // React already safes from XSS
            },
        });
});

// i18n
//     .use(initReactI18next)
//     .init({
//         resources: {
//             en: {
//                 translation: enTranslation,
//             },
//             de: {
//                 translation: deTranslation,
//             },
//         },
//         lng: defaultLanguage, // default language
//         fallbackLng: defaultLanguage,
//         interpolation: {
//             escapeValue: false, // React already safes from XSS
//         },
//     });

i18n.on('languageChanged', (language) => {
    setStoredLanguage(language);
});

export default i18n;
