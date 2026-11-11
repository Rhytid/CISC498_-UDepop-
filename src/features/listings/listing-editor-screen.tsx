// In-app listing editor: opens when you edit one of your own listings.
import AnimatedMulti, { TagType } from "@/features/tags/tagDef";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function ListingEditorScreen() {
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

  if (listing === undefined)
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  if (listing === null)
    return <Text style={{ padding: 20 }}>Listing not found.</Text>;

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
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  } as const;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Pressable
        onPress={() => router.back()}
        style={{ alignSelf: "flex-start", paddingVertical: 8, marginBottom: 8 }}
      >
        <Text style={{ color: "#2563eb", fontSize: 16, fontWeight: "600" }}>
          ← Back
        </Text>
      </Pressable>

      <Text style={{ fontWeight: "bold", fontSize: 18, paddingBottom: 12 }}>
        Edit listing
      </Text>

      <Text>Title</Text>
      <TextInput style={input} value={title} onChangeText={setTitle} />

      <Text>Price</Text>
      <TextInput
        style={input}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Text>Description</Text>
      <TextInput
        style={[input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <AnimatedMulti value={Tags} onChange={setTags} />

      {error && (
        <Text style={{ color: "#dc2626", marginBottom: 8 }}>{error}</Text>
      )}

      <Button
        title={saving ? "Saving..." : "Save changes"}
        onPress={onSave}
        disabled={saving}
      />
    </View>
  );
}
