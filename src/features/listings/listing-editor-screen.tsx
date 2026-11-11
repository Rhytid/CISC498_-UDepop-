// In-app listing editor: opens when you edit one of your own listings.
import AnimatedMulti, { TagType } from "@/features/tags/tagDef";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

import { useTheme } from "@/shared/hooks/use-theme";

export default function ListingEditorScreen() {
  const theme = useTheme();
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const listing = useQuery(api.listings.get, {
    id: listingId as Id<"listings">,
  });
  const update = useMutation(api.listings.update);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [Tags, setTags] = useState<TagType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fill the form once the listing loads
  useEffect(() => {
    if (!listing) return;
    setTitle(listing.title);
    setDescription(listing.description);
    setPrice(String(listing.price));
    setTags(listing.tags.map((t) => ({ value: t, label: t })));
  }, [listing?._id]);

  if (listing === undefined) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ paddingVertical: 20, color: theme.textSecondary }}>
          Loading...
        </Text>
      </View>
    );
  }
  if (listing === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ paddingVertical: 20, color: theme.textSecondary }}>
          Listing not found.
        </Text>
      </View>
    );
  }

  const onSave = async () => {
    setError(null);
    const parsedPrice = Number(price);
    if (!title.trim() || Number.isNaN(parsedPrice)) {
      setError("Enter a title and a valid price.");
      return;
    }

    setSaving(true);
    try {
      await update({
        id: listing._id,
        title: title.trim(),
        description,
        price: parsedPrice,
        tags: Tags.map((t) => t.value),
        category: listing.category,
        photos: listing.photos,
      });
      router.back();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const input = {
    borderWidth: 1,
    borderColor: theme.backgroundSelected,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    color: theme.text,
    backgroundColor: theme.backgroundElement,
  } as const;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
      </Pressable>

      <Text style={[styles.heading, { color: theme.text }]}>Edit listing</Text>

      <Text style={[styles.label, { color: theme.text }]}>Title</Text>
      <TextInput style={input} value={title} onChangeText={setTitle} />

      <Text style={[styles.label, { color: theme.text }]}>Price</Text>
      <TextInput
        style={input}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Text style={[styles.label, { color: theme.text }]}>Description</Text>
      <TextInput
        style={[input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <AnimatedMulti value={Tags} onChange={setTags} />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={saving ? "Saving..." : "Save changes"}
        onPress={onSave}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 8 },
  backText: { fontSize: 16, fontWeight: "600" },
  heading: { fontWeight: "bold", fontSize: 18, paddingBottom: 12 },
  label: { marginBottom: 4 },
  multiline: { height: 100 },
  error: { color: "#dc2626", marginBottom: 8 },
});