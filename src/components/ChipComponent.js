import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import RemoveIcon from '../assets/svgs/item_remove_icon.svg'
import { widthPercentageToDP } from 'react-native-responsive-screen';
import getCurrentLanguage from '../utilities/currentLanguage';

const ChipComponent = ({ data, onRemove, areas = false }) => {
    const currentLanguage = getCurrentLanguage();
    return (
        <View style={styles.areaContainer}>
            <LinearGradient
                colors={['#0F4947', '#0F6D6A']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.areaText}>{
                    areas ? currentLanguage === "de" ? data?.german_name : data?.name : data
                }</Text>

            </LinearGradient>
            <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                <RemoveIcon />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    areaContainer: {
        //  flex: 1,
        flex: 0.5,
        marginTop: 20
    },
    container: {
        position: 'relative',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginStart: 8,
        height: 45,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    areaText: {
        color: '#fff',
        fontSize: 14,
        alignSelf: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -6,
        padding: 5,

    },
});

export default ChipComponent;
