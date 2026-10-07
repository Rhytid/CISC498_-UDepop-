import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function PhotosTest() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const attach = useMutation(api.photos.attach);
  const removePhoto = useMutation(api.photos.removePhoto);

  const [listingId, setListingId] = useState("");
  const [storageId, setStorageId] = useState("");
  const [result, setResult] = useState("");

  const doGenerate = async () => {
    try {
      const url = await generateUploadUrl();
      setResult(url);
    } catch (e) {
      setResult(String(e));
    }
  };

  const doAttach = async () => {
    if (!listingId || !storageId) return;
    try {
      const listing = await attach({
        listingId: listingId as Id<"listings">,
        storageId: storageId as Id<"_storage">,
      });
      setResult(JSON.stringify(listing, null, 2));
    } catch (e) {
      setResult(String(e));
    }
  };

  const doRemove = async () => {
    if (!listingId || !storageId) return;
    try {
      const listing = await removePhoto({
        listingId: listingId as Id<"listings">,
        storageId: storageId as Id<"_storage">,
      });
      setResult(JSON.stringify(listing, null, 2));
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Upload URL</Section>
      <Button label="Generate upload URL" onPress={doGenerate} />

      <Section>Attach / remove photo</Section>
      <Field label="Listing id" value={listingId} onChangeText={setListingId} />
      <Field label="Storage id" value={storageId} onChangeText={setStorageId} />
      <Button label="Attach photo" onPress={doAttach} />
      <Button label="Remove photo" onPress={doRemove} />

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
});
