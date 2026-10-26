import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function PhotosTest() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const attach = useMutation(api.photos.attach);
  const removePhoto = useMutation(api.photos.removePhoto);
  // Optional: if you have a storage.getUrl query, you can use it to preview uploaded images
  // const getUrl = useQuery ? useQuery(api.storage.getUrl) : null;

  const [listingId, setListingId] = useState("");
  const [storageId, setStorageId] = useState("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [result, setResult] = useState("");

  // Pick an image from the device
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setResult("Permission to access media library denied");
        return;
      }

      // Newer expo-image-picker uses `mediaTypes` and returns `assets` array.
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // or "Images"
        quality: 0.8,
      });

      if ("canceled" in res && res.canceled) {
        return;
      }
      if ("cancelled" in res && res.cancelled) {
        return;
      }

      // Prefer the new `assets` array when present
      let uri: string | undefined;
      if (
        "assets" in res &&
        Array.isArray(res.assets) &&
        res.assets.length > 0
      ) {
        uri = res.assets[0].uri;
      } else if ("uri" in res && typeof res.uri === "string") {
        uri = res.uri;
      }

      if (!uri) {
        setResult("No image selected");
        return;
      }

      setLocalUri(uri);
      setResult("Image picked. Now generate upload URL and upload.");
    } catch (e) {
      setResult(String(e));
    }
  };

  // Upload the picked file to Convex signed URL and return storageId
  const uploadFileToConvex = async (uploadUrl: string, fileUri: string) => {
    try {
      // Fetch the file as blob
      const fileResp = await fetch(fileUri);
      const blob = await fileResp.blob();

      const uploadResp = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": blob.type || "application/octet-stream",
        },
        body: blob,
      });

      if (!uploadResp.ok) {
        const text = await uploadResp.text();
        throw new Error(`Upload failed: ${uploadResp.status} ${text}`);
      }

      const json = await uploadResp.json();
      if (!json.storageId) {
        throw new Error("Upload response missing storageId");
      }
      return json.storageId as string;
    } catch (e) {
      throw e;
    }
  };

  // Full flow: generate URL -> upload -> attach
  const doGenerateUploadAndAttach = async () => {
    if (!listingId) {
      setResult("Please enter a listing id first");
      return;
    }
    if (!localUri) {
      setResult("Please pick an image first");
      return;
    }

    try {
      setResult("Generating upload URL...");
      const uploadUrl = await generateUploadUrl();
      setResult("Uploading file...");
      const sid = await uploadFileToConvex(uploadUrl, localUri);
      setStorageId(sid);
      setResult(`Uploaded. storageId: ${sid}\nAttaching to listing...`);

      const listing = await attach({
        listingId: listingId as Id<"listings">,
        storageId: sid as Id<"_storage">,
      });

      setResult(JSON.stringify(listing, null, 2));
    } catch (e) {
      setResult(String(e));
    }
  };

  const doAttachManual = async () => {
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

      <Section>Upload URL flow</Section>
      <Button label="Pick image" onPress={pickImage} />
      {localUri ? (
        <Image source={{ uri: localUri }} style={styles.preview} />
      ) : null}
      <Field label="Listing id" value={listingId} onChangeText={setListingId} />
      <Field
        label="Storage id (filled after upload)"
        value={storageId}
        onChangeText={setStorageId}
      />

      <Button
        label="Generate upload URL, upload file, attach"
        onPress={doGenerateUploadAndAttach}
      />
      <Button
        label="Attach manually (if you already have storageId)"
        onPress={doAttachManual}
      />
      <Button label="Remove photo" onPress={doRemove} />

      <Section>Result</Section>
      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  preview: { width: 200, height: 200, borderRadius: 8, marginVertical: 8 },
});
