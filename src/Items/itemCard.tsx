import React from "react";
import itemData from "../data/itemData.json";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ItemCard() {

    return (
        <View style={styles.card}>
            <Image source={{ uri: itemData.image }} style={styles.image} />
            <Text>{itemData.name}</Text>
            <Text>{itemData.price}</Text>
            <Text>{itemData.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        width: '20%'
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
})