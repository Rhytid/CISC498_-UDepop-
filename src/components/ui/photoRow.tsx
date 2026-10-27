import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function PhotoRow({ photos }: { photos?: string[] }) {
	const [index, setIndex] = React.useState(0);

	if (!photos || photos.length === 0) {
		return (
        <View>
            <Image source={require("../../../assets/images/no-image.jpg")} style={styles.image}></Image>
        </View>)
	}

	// Detect if photos are already URLs
	const areUrls = photos.every((p) => p.startsWith("http"));

	// Resolve storage IDs → URLs
	const urlMap = useQuery(
		api.storage.getUrls,
		!areUrls ? { storageIds: photos } : "skip",
	) as Record<string, string | null> | undefined;

	// Get current photo URI
	const current = photos[index];
	const uri = areUrls
		? current
		: urlMap
			? (urlMap[current] ?? null)
			: undefined;

	return (
		<View style={styles.carouselContainer}>
			{/* Left arrow */}
			{index > 0 && (
				<Pressable
					style={styles.arrowLeftContainer}
					onPress={() => setIndex((i) => i - 1)}
				>
					<Ionicons name="chevron-back-sharp" style={styles.arrow}></Ionicons>
				</Pressable>
			)}

			{/* Photo */}
			{uri === undefined ? (
				<View style={styles.photoPlaceholder}>
					<ActivityIndicator size="small" />
				</View>
			) : uri === null ? (
				<View style={styles.photoPlaceholder}>
					<Image source={require("../../../assets/images/no-image.jpg")}></Image>
				</View>
			) : (
				<Image source={{ uri }} style={styles.image} />
			)}

			{/* Right arrow */}
			{index < photos.length - 1 && (
				<Pressable
					onPress={() => setIndex((i) => i + 1)}
                    style={styles.arrowRightContainer}
				>
					<Ionicons name="chevron-forward-sharp" style={styles.arrow}></Ionicons>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height: 200,
		resizeMode: "contain",
		backgroundColor: "#fff",
		marginBottom: 20,
		borderRadius: 10,
	},
	photoPlaceholder: {
		width: 120,
		height: 90,
		borderRadius: 6,
		backgroundColor: "#f7f7f7",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 8,
	},
	moreWrap: {
		width: 40,
		height: 90,
		borderRadius: 6,
		backgroundColor: "#eee",
		alignItems: "center",
		justifyContent: "center",
	},
	carouselContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		position: "relative",
	},
	arrowLeftContainer: {
		position: "absolute",
		left: 10,
		zIndex: 10,
		padding: 10,
	},
	arrowRightContainer: {
		position: "absolute",
		right: 10,
		zIndex: 10,
		padding: 10,
	},
	arrow: {
        textShadowColor: ' rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2},
        textShadowRadius: 2,

	},
});
