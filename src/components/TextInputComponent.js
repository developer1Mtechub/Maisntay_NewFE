import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from '../theme/colors'
import fonts from "../theme/fonts";
import { Text } from "react-native-elements";

const CustomInput = ({
  placeholder,
  onValueChange,
  iconComponent,
  customInputStyle,
  customContainerStyle,
  multiline,
  isEditable,
  onPress,
  identifier,
  value,
  inputType
}) => {
  const [text, setText] = useState("");

  const handleChange = (inputText) => {
    setText(inputText);
    onValueChange(inputText, identifier);  // Pass the identifier to the parent component
  };

  return (
    <View
      style={[
        styles.container,
        customContainerStyle,
        multiline && styles.multilineInput,
      ]}
      onStartShouldSetResponder={onPress}
    >
      
      <TextInput
        style={[
          styles.input,
          customInputStyle,
          { 
            textAlignVertical: multiline && "top", 
          // paddingBottom:multiline&& '30%' 
        },
        ]}
        editable={isEditable}
        //onTouchStart={onPress}
        onPressIn={onPress}
        placeholder={placeholder}
        placeholderTextColor={'rgba(118, 118, 118, 1)'}
        value={value}
        onChangeText={handleChange}
        multiline={multiline}
        maxLength={multiline && 250}
        numberOfLines={multiline ? 5 : 1}
        keyboardType={inputType}
      />
      {iconComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(238, 238, 238, 1)",
    // borderRadius: 8,
    marginTop: 15,
    height: 50,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    color: Colors.black,
    fontSize: 14,
    fontFamily:fonts.fontsType.regular,
    marginStart: 20,

  },
  multilineInput: {
    height: 142,
  },
});

export default CustomInput;
