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
            <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
    </Pressable>
    );
}

const styles = StyleSheet.create({
cardWrapper: {
    alignSelf: "flex-start",
    borderRadius: 20,
  },
  card: {
    width: 300,
    height: 400,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    margin: 10,
    backgroundColor: "#ddd",
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
  description: {
    fontSize: 14,
    padding: 10,
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
