// MultiSelectAreas.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';
import getCurrentLanguage from '../utilities/currentLanguage';

const MultiSelectAreas = ({ areas, selectedAreas, onSelect }) => {
    const currentLanguage = getCurrentLanguage();
    const toggleAreaSelection = (areaId, area) => {
        const newSelectedAreas = selectedAreas.find(item => item.areaId === areaId)
            ? [] // Clear all selections
            : [{ areaId, area }]; // Select the new area
        onSelect(newSelectedAreas);
    };

    // const toggleAreaSelection = (area) => {
    //     const newSelectedAreas = selectedAreas.includes(area)
    //         ? [] // Clear all selections
    //         : [area]; // Select the new area
    //     onSelect(newSelectedAreas);
    // };

    // const toggleAreaSelection = (area) => {
    //     const newSelectedAreas = selectedAreas.includes(area)
    //         ? selectedAreas.filter((item) => item !== area)
    //         : [...selectedAreas, area];
    //     onSelect(newSelectedAreas);
    // };

    return (
        <ScrollView
            // showsHorizontalScrollIndicator={false}
            // horizontal
            contentContainerStyle={styles.container}>
            {areas?.map((area, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.areaButton,
                        selectedAreas.find(item => item.areaId === area?.coaching_area_id) && styles.selectedAreaButton,
                    ]}
                    onPress={() => toggleAreaSelection(area?.coaching_area_id, currentLanguage === "de" ? area?.german_name : area?.name)}
                >
                    <Image style={{ height: 22, width: 22, alignSelf: 'center', marginStart: 10 }} source={{ uri: area?.icon }} />
                    <Text style={[
                        styles.areaButtonText,
                        selectedAreas.find(item => item.areaId === area?.coaching_area_id) && styles.selectedAreaButtonText
                    ]}>{
                            currentLanguage === "de" ? area?.german_name : area?.name
                        }</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        
        // flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',
         alignItems: 'flex-start',
        marginTop: 10
    },
    areaButton: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        backgroundColor: '#EEEEEE',
        height: 45,
        // width:'98%',
        marginEnd: 8,
        marginTop: 10,
    },
    selectedAreaButton: {
        backgroundColor: colors.primaryColor,
        margin: 5,
        borderRadius: 12,
        borderWidth: 1,

    },
    areaButtonText: {
        fontSize: 14,
        fontFamily: fonts.fontsType.medium,
        lineHeight: 17,
        color: '#767676',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    selectedAreaButtonText: {
        color: colors.white,
        fontSize: 14,
        fontFamily: fonts.fontsType.medium,
        lineHeight: 17,
        marginHorizontal: 10
    },
});

export default MultiSelectAreas;
