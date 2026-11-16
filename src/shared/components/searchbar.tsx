import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
  search: string;
  setSearch: (text: string) => void;
  onSubmit: () => void;
  listings: {
    _id: string;
    title: string;
    tags: string[];
  }[];
};

export default function SearchBar({ search, setSearch, onSubmit, listings }: SearchBarProps) {
  const [delayedSearch, setDelayedSearch] = useState("") 
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => { const timer = setTimeout(() => { setDelayedSearch(search);}, 1000);
    return () => clearTimeout(timer);}, [search]);

  const filteredSuggestions = delayedSearch.trim() ? listings.filter(
      (item) => item.title.toLowerCase().includes(delayedSearch.toLowerCase()) || item.tags.some((tag) => tag.toLowerCase().includes(delayedSearch.toLowerCase())))
      .slice(0, 5): [];

  return (
    <View style={[styles.searchBubble]}>
    <TextInput
      style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={(text) => {setSearch(text); setShowSuggestions(true)}}
        onSubmitEditing={() => {setShowSuggestions(false); onSubmit()}}
    />
    {showSuggestions && delayedSearch === search && filteredSuggestions.length > 0 && (
      <View style={styles.dropDown}>
        {filteredSuggestions.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => {
              setSearch(item.title);
              setShowSuggestions(false);
              onSubmit();
            }}
          >
            <Text style={{padding: 8}}>
              {item.title}
            </Text>
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
    alignSelf: "center",
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
