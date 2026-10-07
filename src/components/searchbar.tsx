import { useState } from 'react';
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar() {
  const [search, setSearch] = useState('');

  return (
    <View style={[styles.searchBubble]}>
    <TextInput
      style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
    />
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
    alignSelf: "flex-start"
  },
});
