import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const suggestions = ["Shirt", "T-Shirt", "Jeans", "Furniture", "Technology"];
  const filteredSuggestions = suggestions.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={[styles.searchBubble]}>
    <TextInput
      style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
    />
    {search.trim().length > 0 && !suggestions.some((item) => item.toLowerCase() === search.trim().toLowerCase()) && (
      <View style={styles.dropDown}>
        {filteredSuggestions.map((item) => (
          <TouchableOpacity key={item} onPress={() => setSearch(item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  searchBar: {
    borderRadius: 20,
    borderBlockColor: "black",
    borderWidth: 2,
    paddingHorizontal: 15,
    backgroundColor: "white",
    width: 400,
    height: 36,
  },
  
  searchBubble: {
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    padding: 6,
    alignSelf: "flex-start",
    zIndex: 100,
    position: 'relative',
  },
  
  dropDown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
    zIndex: 100,
    elevation: 10,
    width: 400,
  }
});
