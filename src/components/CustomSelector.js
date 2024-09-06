import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CustomSelector = () => {
  const [selectedItem, setSelectedItem] = useState('Upcoming');


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setSelectedItem('Upcoming')}
        style={styles.item}
      >
        {selectedItem === 'Upcoming' ? (
          <LinearGradient
            colors={['#0A3938', '#0F6D6A']}
            style={styles.selectedItem}
          >
            <Text style={styles.text}>Upcoming</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.text}>Upcoming</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedItem('Completed')}
        style={styles.item}
      >
        {selectedItem === 'Completed' ? (
          <LinearGradient
            colors={['#0A3938', '#0F6D6A']}
            style={styles.selectedItem}
          >
            <Text style={styles.text}>Completed</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.text}>Completed</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
      },
      item: {
        padding: 10,
        borderRadius: 10,
      },
      selectedItem: {
        borderRadius: 10,
      },
      text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // Change text color to white
        textAlign: 'center',
      },
});

export default CustomSelector;
