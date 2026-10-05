import { useState } from 'react';
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
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
    borderWidth: 10 ,
    paddingHorizontal: 15,
    backgroundColor: "white",
    width: "20%",
  }
});
