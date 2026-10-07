import AnimatedMulti, { type TagType } from "@/tag/tagDef";
import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useConvex, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

// Test screen for the listings backend functions.
export default function ListingsTest() {
  const convex = useConvex();

  const listings = useQuery(api.listings.list, {});
  const createListing = useMutation(api.listings.create);
  const removeListing = useMutation(api.listings.remove);
  const markSold = useMutation(api.listings.markSold);

  // Create form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);

  // Lookup state
  const [lookupId, setLookupId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState("");

  const submitCreate = async () => {
    if (!title || !price) return;
    try {
      await createListing({
        title,
        description,
        category: category || "Other",
        price: Number(price),
        tags: tags.map((t) => t.value),
        photos: [],
      });
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setTags([]);
      setResult("");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doGet = async () => {
    if (!convex || !lookupId) return;
    const doc = await convex.query(api.listings.get, {
      id: lookupId as Id<"listings">,
    });
    setResult(doc === null ? "Not found" : JSON.stringify(doc, null, 2));
  };

  const doSearch = async () => {
    if (!convex || !searchQuery) return;
    const found = await convex.query(api.listings.search, {
      query: searchQuery,
    });
    setResult(JSON.stringify(found, null, 2));
  };

  const doMarkSold = async (id: string, sold: boolean) => {
    try {
      await markSold({ id: id as Id<"listings">, sold });
    } catch (e) {
      setResult(String(e));
    }
  };

  const doDelete = async (id: string) => {
    try {
      await removeListing({ id: id as Id<"listings"> });
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Create</Section>
      <Field label="Title" value={title} onChangeText={setTitle} />
      <Field
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Field label="Description" value={description} onChangeText={setDescription} />
      <Field label="Category" value={category} onChangeText={setCategory} />
      <AnimatedMulti value={tags} onChange={setTags} />
      <Button label="Create listing" onPress={submitCreate} />

      <Section>List ({(listings?.page ?? []).length})</Section>
      {listings === undefined ? (
        <Text>Loading…</Text>
      ) : (
        (listings.page ?? []).map((item) => (
          <View key={item._id} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>
                {item.title} (id: {item._id}) — ${item.price}
                {item.sold ? " — SOLD" : ""}
              </Text>
              <Text>{item.description}</Text>
              <Text style={styles.rowTags}>
                {item.category}
                {item.tags.length > 0 ? ` · ${item.tags.join(", ")}` : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => doMarkSold(item._id, !item.sold)}
              style={styles.soldButton}
            >
              <Text style={styles.soldText}>{item.sold ? "Unsell" : "Sold"}</Text>
            </Pressable>
            <Pressable
              onPress={() => doDelete(item._id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}

      <Section>Get by id</Section>
      <Field label="Listing id" value={lookupId} onChangeText={setLookupId} />
      <Button label="Get" onPress={doGet} />

      <Section>Search</Section>
      <Field label="Query" value={searchQuery} onChangeText={setSearchQuery} />
      <Button label="Search" onPress={doSearch} />

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
    gap: 6,
  },
  rowText: { flex: 1 },
  rowTitle: { fontWeight: "600" },
  rowTags: { color: "#666", fontSize: 12 },
  soldButton: {
    padding: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
  },
  soldText: { color: "#3730a3", fontSize: 12 },
  deleteButton: { padding: 8 },
  deleteText: { color: "#dc2626" },
});

