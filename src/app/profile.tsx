import ProfilePicture from "@/components/ui/profilePicture";
import { useListingActions } from "@/hooks/listingActions";
import ItemCard from "@/items/itemCard";
import { NewItem } from "@/items/newItem";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function ProfileScreen() {
	const me = useQuery(api.users.getMe);
	const currentUserId = me?._id; //undefined while loading

	const [showPopup, setShowPopup] = useState<boolean>(false);
	const { addListing, deleteListing } = useListingActions();

	const myListings = useQuery(
		api.listings.listByUser,
		currentUserId ? { userId: currentUserId } : "skip",
	);
	if (myListings === undefined) {
		return <Text>Loading...</Text>;
	}

	return (
		<ScrollView>
			<View style={styles.banner}>
				<ProfilePicture />
				<Text style={styles.bannerText}>
					@username <Ionicons name="star" size={25} color="gold" />{" "}
					5.0
				</Text>
				<Text>3 Products | 50 Followers</Text>
			</View>
			<Text style={styles.bannerText}>Products:</Text>
			<View style={{ alignItems: "center" }}>
				{myListings.length === 0 && <Text>You have no listings</Text>}
					<Pressable onPress={() => setShowPopup(true)} style={styles.button}>
						<Text>New Listing</Text>
					</Pressable>
					<NewItem
						visible={showPopup}
						onClose={() => setShowPopup(false)}
						onSubmit={addListing}
					></NewItem>
			</View>
			<View style={styles.itemContainer}>
				{myListings.map((item) => (
					<ItemCard
						key={item._id}
						listing={item}
						currentUserId={item.ownerId}
						onDeleteListing={deleteListing}
					/>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	banner: {
		width: "100%",
		height: 250,
		borderRadius: 10,
		marginTop: 10,
		backgroundColor: "#ccc",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	bannerText: {
		fontSize: 24,
		fontWeight: "bold",
		paddingTop: 20,
	},
	itemContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	button: {
		backgroundColor: "#eee",
		borderRadius: 10,
		padding: 10,
		margin: 10,
		width: "10%"
	}
});
