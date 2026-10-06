import React, { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Item } from "./itemDef";

export default function ItemCard({ item }: { item: Item }) {
    const translateY = useRef(new Animated.Value(0)).current;

    const handleHoverIn = () => {
        Animated.timing(translateY, {
            toValue: -10,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleHoverOut = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
    <Pressable style={styles.cardWrapper} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
        <Animated.View style={[styles.card, { transform: [{ translateY }] }]} key={item.name}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text>{item.description}</Text>
        </Animated.View>
    </Pressable>
    );
}

const styles = StyleSheet.create({
cardWrapper: {
    width: "100%",
    margin: 10,
  },
  card: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    margin: 10,
    backgroundColor: "#be3333",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
  },
});
