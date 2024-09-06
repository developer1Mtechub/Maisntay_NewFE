import { color } from '@rneui/base';
import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import colors from '../theme/colors';
import fonts from '../theme/fonts';

const CustomTimeSlots = ({ times, selectedTime, onSelectTime }) => {

  const handleTimeSelection = (time) => {
    onSelectTime(time);
    // You can perform additional actions here when a time is selected
  };

  const renderTimeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.timeItem, selectedTime === item && styles.selectedTimeItem]}
      onPress={() => handleTimeSelection(item)}
    >
      <Text style={[styles.timeText, selectedTime === item && styles.selectedTimeText]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={times}
        renderItem={renderTimeItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  timeItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    marginHorizontal: 5,
    width:100,
    height:35,
    justifyContent:'center'
  },
  timeText: {
    fontSize: 17,
    color:'#858585',
    fontFamily:fonts.fontsType.medium,
    alignSelf:'center'
  },
  selectedTimeItem: {
    backgroundColor: colors.primaryColor, // Change the background color of selected item
  },
  selectedTimeText: {
    fontSize: 17,
    color:colors.white,
    fontFamily:fonts.fontsType.medium,
    alignSelf:'center'
  },
};

export default CustomTimeSlots;
