import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDropdown = ({ options, customStyle }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setIsVisible(false);
        // Do something with the selected item
        console.log("Selected item:", item);
    };

    return (
        <View style={[styles.container, customStyle]}>
            <TouchableOpacity style={{
                width:120,
                borderWidth:1,
                borderColor:'gray',
                borderRadius:8,
                height:35,
                justifyContent:'center'
            }}
                onPress={() => setIsVisible(!isVisible)}>
                <Text style={{alignSelf:'center'}}>{selectedItem ? selectedItem.label : 'Select an item'}</Text>
            </TouchableOpacity>
            {isVisible && (
                <View style={styles.dropdown}>
                    {options.map((item) => (
                        <TouchableOpacity key={item.value} onPress={() => handleItemPress(item)}>
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1,
    },
    dropdown: {
        position: 'absolute',
        top: 35, // Adjust this value according to your UI
        backgroundColor: '#fff',
       
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        zIndex: 2,
        width:120,
    },
});

export default CustomDropdown;