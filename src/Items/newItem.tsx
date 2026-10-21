import type { NewListingInput } from "@/hooks/listingActions";
import type { TagType } from "@/tags/tagDef";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { api } from "../../convex/_generated/api";
import AnimatedMulti from "@/tags/tagDef";

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
		<Modal
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
			transparent
		>
			<View style={styles.overlay}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<View style={styles.card}>
					<Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </Pressable>
                    <Text>Add New Listing</Text>
                    <TextInput style={styles.input} placeholder="Enter name" value={title} onChangeText={setTitle}/>
                    <TextInput style={styles.input} placeholder="Enter price" inputMode="numeric" value={price === 0 ? '' : price.toString()} onChangeText={(value) => setPrice(+value)}/>
                    <TextInput style={[styles.input, styles.multilineinput]} multiline maxLength={500} placeholder="Enter description (max 500 characters)" value={description} onChangeText={setDescription}/>
                    <AnimatedMulti value={tags} onChange={setTags}/>
				</View>
			</View>
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
		width: "70%",
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
        padding: 10,
        marginBottom: 10,
    },
    multilineinput: {
        minHeight: 80,
        textAlignVertical: "top",
    }
});
