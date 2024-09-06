import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomCheckbox = ({ label, checkedColor, uncheckedColor, onToggle, customStyle, isSelected, isUpdate }) => {
  const [isChecked, setIsChecked] = useState(isUpdate ? isSelected : false);

  useEffect(() => {
    if (isUpdate) {
      setIsChecked(isSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);


  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggle && onToggle(newCheckedState);
  };

  return (
    <TouchableOpacity onPress={handleToggle} style={[styles.checkboxContainer]}>
      <View
        style={[
          styles.checkbox,
          { backgroundColor: isChecked ? checkedColor : uncheckedColor },
          customStyle
        ]}
      >
        {isUpdate ? isChecked && <Icon name="check" size={15} color={isChecked ? "#fff" : 'rgba(15, 109, 106, 1)'} /> :
          isChecked && (
            <Icon name="check" size={15} color={isSelected ? 'rgba(15, 109, 106, 1)' : "#fff"} /> // Replace with the appropriate icon component
          )}
      </View>
      {/* <Text>{label}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: 'rgba(187, 187, 187, 1)',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCheckbox;
