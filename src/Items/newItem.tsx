import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, StyleSheet } from "react-native";
import type { NewListingInput } from "@/items/listingActions";
import type { TagType } from "@/tags/tagDef";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Ionicons } from "@expo/vector-icons";

interface NewItemProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (input: NewListingInput) => Promise<boolean>;
}

export function NewItem({ visible, onClose, onSubmit}: NewItemProps) {
	const [title, setTitle] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [tags, setTags] = useState<TagType[]>([]);
	const [description, setDescription] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [photos, setPhotos] = useState<string[]>([]);

	const createItem = useMutation(api.listings.create);
	async function handleSubmit() {
		try {
			await createItem({
				title: title,
				description: description,
				price: price,
				category: category,
				tags: tags.map((t) => t.value),
				photos: [...photos],
			});
			// reset the form after success
			setTitle("");
			setPrice(0);
			setTags([]);
			setDescription("");
			setPhotos([]);
		} catch (err) {
			console.error("Failed to create listing:", err);
		}
	}

	return (
		<Modal visible={visible} animationType="fade" onRequestClose={onClose} transparent>
			<ScrollView style={styles.popup}>
                <Text>Popup</Text>
                <Pressable onPress={onClose}><Ionicons name="close"></Ionicons></Pressable>
            </ScrollView>
		</Modal>
	);
}

const styles = StyleSheet.create({
    popup: {
        width: "70%",
        height: "70%",
        backgroundColor: "ccc"
    }
})