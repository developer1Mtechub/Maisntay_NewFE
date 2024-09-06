import axios from 'axios';
import { BASE_URL } from './apiUrl';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';

const apiService = axios.create({
    baseURL: BASE_URL,
    headers: {
        'content-type': 'application/json'
    },
});

const makeRequest = (method, endpoint, data = null, params = null, accessToken) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            try {
                if (state.isConnected) {
                    const requestData = data ? { data } : {}; // Include data only if it's not null

                    try {
                        const response = await apiService({
                            method,
                            url: `${apiService.defaults.baseURL}${endpoint}`,
                            ...requestData,
                            params,
                            headers: {
                                ...apiService.defaults.headers,
                                'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
                                'Authorization': accessToken
                            },
                        });
                        resolve(response.data);
                    } catch (error) {
                        if (error.response) {
                            console.log('response error', error.response.data);
                            reject(error.response.data);
                        } else if (error.request) {
                            //console.log('request error, no response received from server', error.request);
                            reject('No response received from server.');
                        } else {
                            console.log('error message', error.message);
                            reject(error.message);
                        }
                    }
                } else {
                    console.log('Network not available.');
                    reject('Network not available.');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                reject('An unexpected error occurred.');
            } finally {
                unsubscribe(); // Always unsubscribe after use
            }
        });
    });
};

export default makeRequest;
