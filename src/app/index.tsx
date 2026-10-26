import * as Device from "expo-device";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SearchBar from '@/components/searchbar';
import { ThemedText } from "@/components/themed-text";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import ItemCard from "@/Items/itemCard";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import itemData from "../data/itemData.json";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const itemList = useQuery(api.listings.list, {});
  const rotatingWords = ['outfit.', 'book.', 'hobby.', 'couch.'];
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const categories = [ 
    {name: 'Furniture', icon: 'sofa' },
    {name: 'Clothing', icon: 'tshirt-crew' },
    {name: 'Electronics', icon: 'laptop'},
  ] as const;
  const items = Object.values(itemData).flat();

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideAnim, {
        toValue: -40,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;

        setRotatingWordIndex((previous) => (previous + 1) % rotatingWords.length);

        // Place the next word below
        slideAnim.setValue(40);

        // Slide the new word upward into position
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      slideAnim.stopAnimation();
    };
  }, [slideAnim]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Banner & Search Code */}
      <View style={styles.banner}>
        <View style={styles.insideBanner}>
          <View style={styles.textContainer}>
            <Text style={styles.searchBannerText}>
              Find your new favorite {""}
            </Text>
            <View>
              <Animated.Text style={[styles.searchBannerText, styles.rotatingText, { transform: [{ translateY: slideAnim }],},]}>
                {rotatingWords[rotatingWordIndex]}
              </Animated.Text>
            </View>
          </View>
          <SearchBar/>
        </View>
      </View>
      {/* End Banner & Search Code */}

      {/* Category Buttons */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>
          Start Here:
        </Text>

        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable key={category.name}
              style={styles.categoryButton}
              onPress={() => console.log(category.name)}
            >
              <MaterialCommunityIcons
              name={category.icon}
              size={32}
              color="white"
              />
              <Text style={styles.categoryText}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.itemContainer}>
        {items.map((item) => (
          <ItemCard key={item.name} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  banner: {
    width: '75%',
    height: '25%',
    borderRadius: 20,
    backgroundColor: '#607D8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBannerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  insideBanner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  rotatingContainer: {
    width: 200,
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  rotatingText: {
    color: '#FFDF85',
    textAlign: 'left',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  categoriesContainer: {
    width: '75%',
    marginTop: 40,
  },
  categoriesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexGrow: 1,
    flexBasis: 160,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
