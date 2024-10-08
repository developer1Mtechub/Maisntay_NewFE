import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './locationPermission';
import { Platform } from 'react-native';


export const getLocationWithPermission = async () => {
    try {
        const permissionGranted = await requestLocationPermission();

        if (!permissionGranted && Platform.OS === 'android') {
            console.log('Location permission denied');
            return null;
        }

        const getPosition = () => new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject);
        });

        const { coords: { latitude, longitude } } = await getPosition();

        return { latitude, longitude };
    } catch (error) {
        console.log("Error fetching location:", error);
        return null;
    }
};
