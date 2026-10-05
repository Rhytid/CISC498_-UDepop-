import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";

// Minimal demo screen proving the app can read and write via Convex.
// Navigate to /listings in the browser (or add it as a tab later).
export default function ListingsScreen() {
  const listings = useQuery(api.listings.list);
  const createListing = useMutation(api.listings.create);
  const removeListing = useMutation(api.listings.remove);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    if (!title || !price) return;
    await createListing({
      title,
      price: Number(price),
      description,
      tags: ["demo"],
    });
    setTitle("");
    setPrice("");
    setDescription("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Listings</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Pressable onPress={submit} style={styles.button}>
          <Text style={styles.buttonText}>Add listing</Text>
        </Pressable>
      </View>

      {listings === undefined ? (
        <Text>Loading…</Text>
      ) : (
        listings.map((item) => (
          <View key={item._id} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>
                {item.title} — ${item.price}
              </Text>
              <Text>{item.description}</Text>
            </View>
            <Pressable
              onPress={() => removeListing({ id: item._id })}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 24, fontWeight: "700" },
  form: { gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  rowText: { flex: 1 },
  rowTitle: { fontWeight: "600" },
  deleteButton: { padding: 8 },
  deleteText: { color: "#dc2626" },
});
