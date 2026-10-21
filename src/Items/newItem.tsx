import type { newListingInput } from "@/items/listingActions";
import type { TagType } from "@/tags/tagDef";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { Modal, ScrollView } from "react-native";
import { api } from "../../convex/_generated/api";

interface newItemProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (input: newListingInput) => Promise<boolean>;
}

export function newItem() {
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
		<Modal>
			<ScrollView></ScrollView>
		</Modal>
	);
}
