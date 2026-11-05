import type { NewListingInput } from "@/hooks/listingActions";
import type { TagType } from "@/tags/tags";
import { TagPicker } from "@/tags/tags";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
	Button,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView
} from "react-native";
import { api } from "../../convex/_generated/api";

interface NewItemProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (input: NewListingInput) => Promise<boolean>;
}

export function NewItem({ visible, onClose, onSubmit }: NewItemProps) {
	const [title, setTitle] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [tags, setTags] = useState<TagType[]>([]);
	const [description, setDescription] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [photos, setPhotos] = useState<string[]>([]);

	const pickPhotos = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required.");
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsMultipleSelection: true,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
			console.log(photos);
		}
	};

	const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
	async function uploadPhoto(uri: string): Promise<string> {
		const uploadUrl = await generateUploadUrl();

		// Turn the local file into a Blob so it can be sent as a request body
		const blob = await (await fetch(uri)).blob();

		const res = await fetch(uploadUrl, {
			method: "POST",
			headers: { "Content-Type": blob.type || "image/jpeg" },
			body: blob,
		});
		if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

		const { storageId } = await res.json();
		return storageId;
	}

	async function handleSubmit() {
		try {
			// Upload all photos, get back storage IDs
			const storageIds = await Promise.all(photos.map(uploadPhoto));

			const ok = await onSubmit({
				title,
				description,
				price,
				category,
				tags: tags.map((t) => t.value),
				photos: storageIds, // IDs, not local URIs
			});
			if (ok) {
				setTitle("");
				setPrice(0);
				setTags([]);
				setDescription("");
				setPhotos([]);
				onClose();
			}
		} catch (e) {
			console.error(e);
			alert("Couldn't upload photos. Please try again.");
		}
	}

	return (
		<Modal
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
			transparent
		>
			<ScrollView contentContainerStyle={styles.overlay}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<View style={styles.card}>
					<Pressable style={styles.closeButton} onPress={onClose}>
						<Ionicons name="close" size={24} color="#000" />
					</Pressable>
					<Text
						style={{
							paddingBottom: 10,
							paddingTop: 10,
							fontWeight: "bold",
						}}
					>
						Add New Listing:
					</Text>
					<Button title={"Add Pictures"} onPress={pickPhotos} />
					<View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
						{photos.length > 0 &&
							photos.map((p) => (
								<View key={p}>
									<Image
										source={{ uri: p }}
										style={{
											width: 150,
											height: 150,
											margin: 5,
										}}
									/>
									<Pressable
										onPress={() =>
											setPhotos((current) =>
												current.filter(
													(photo) => photo !== p,
												),
											)
										}
									>
										<Ionicons name="close" color={"red"} />
									</Pressable>
								</View>
							))}
					</View>
					<TextInput
						style={styles.input}
						placeholder="Enter title"
						value={title}
						onChangeText={setTitle}
					/>
					<TextInput
						style={styles.input}
						placeholder="Enter price"
						inputMode="numeric"
						value={price === 0 ? "" : price.toString()}
						onChangeText={(value) => setPrice(+value)}
					/>
					<TextInput
						style={[styles.input, styles.multilineinput]}
						multiline
						maxLength={500}
						placeholder="Enter description (max 500 characters)"
						value={description}
						onChangeText={setDescription}
					/>
					<TagPicker value={tags} onChange={setTags} />
					<Button title={"Create"} onPress={handleSubmit} />
				</View>
			</ScrollView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: "50%",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 16,
		boxShadow: "0px 6px 6px rgba(0, 0, 0, 0.3)",
	},
	closeButton: {
		alignSelf: "flex-end",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		color: "#999",
		padding: 10,
		marginBottom: 10,
	},
	multilineinput: {
		minHeight: 80,
		textAlignVertical: "top",
	},
});
