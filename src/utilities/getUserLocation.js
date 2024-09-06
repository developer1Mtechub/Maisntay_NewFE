import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './locationPermission';


export const getLocationWithPermission = async () => {
    try {
        const permissionGranted = await requestLocationPermission();

        if (!permissionGranted) {
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
