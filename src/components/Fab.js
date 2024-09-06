import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const FAB = (props) => {
    return (
        <Pressable style={styles.container}
            onPress={props.onPress}
        >
            <Text style={styles.title}>{props.title}</Text>
        </Pressable>
    );
};

export default FAB;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        position: "relative",
        marginLeft: 15,
        backgroundColor: "#26653A",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});