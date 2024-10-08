import { PermissionsAndroid, Alert, Linking, Platform } from 'react-native';

function showPermissionSettingsAlert(permissionType) {
    Alert.alert(
        `${permissionType} Permission Denied`,
        `To enable ${permissionType.toLowerCase()} access, please go to Settings and allow ${permissionType.toLowerCase()} permissions.`,
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Settings', onPress: () => openAppSettings() },
        ],
        { cancelable: false }
    );
}

function openAppSettings() {
    // Open app settings
    Linking.openSettings();
}

export const requestLocationPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
                return true; // Permission granted
            } else {
                console.log('Location permission denied');
                showPermissionSettingsAlert("Location")
                return false; // Permission denied
            }
        }
    } catch (err) {
        console.warn(err);
    }
};

