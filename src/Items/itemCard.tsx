import MessageButton from "@/app/UserMessaging/CallingMessagePopup";
import { useQuery } from "convex/react";
import React from "react";
import {
	ActivityIndicator,
	Button,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export interface ItemCardProps {
	listing: Doc<"listings">;
	currentUserId?: Doc<"users">["_id"];
	onMessageSeller?: (sellerId: Id<"users">) => void;
	onEditListing?: (listingId: Id<"listings">) => void;
	onDeleteListing?: (listingId: Id<"listings">) => void;
}

export default function ItemCard({
	listing,
	currentUserId,
	onMessageSeller,
	onEditListing,
	onDeleteListing,
}: ItemCardProps) {
	const [expanded, setExpanded] = React.useState(false);
	const hoverAnim = useSharedValue<number>(0);
	const expandAnim = useSharedValue<number>(300);
	const animatedCard = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: hoverAnim.value }],
			height: expandAnim.value,
		};
	});

	const handleHoverIn = () => {
		hoverAnim.value = withTiming(-10, { duration: 200 });
	};

	const handleHoverOut = () => {
		hoverAnim.value = withTiming(0, { duration: 200 });
	};

	const handlePress = () => {
		expanded
			? (expandAnim.value = withTiming(300, { duration: 300 }))
			: (expandAnim.value = withTiming(500, { duration: 300 }));
		setExpanded(!expanded);
	};

	function PhotoRow({ photos }: { photos?: string[] }) {
		const [index, setIndex] = React.useState(0);

		if (!photos || photos.length === 0) {
			return <Text style={styles.image}>No photos</Text>;
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
						style={styles.arrowLeft}
						onPress={() => setIndex((i) => i - 1)}
					>
						<Text style={styles.arrowText}>{"<"}</Text>
					</Pressable>
				)}

				{/* Photo */}
				{uri === undefined ? (
					<View style={styles.photoPlaceholder}>
						<ActivityIndicator size="small" />
					</View>
				) : uri === null ? (
					<View style={styles.photoPlaceholder}>
						<Text>No photo</Text>
					</View>
				) : (
					<Image source={{ uri }} style={styles.image} />
				)}

				{/* Right arrow */}
				{index < photos.length - 1 && (
					<Pressable
						style={styles.arrowRight}
						onPress={() => setIndex((i) => i + 1)}
					>
						<Text style={styles.arrowText}>{">"}</Text>
					</Pressable>
				)}
			</View>
		);
	}

	const isOwner =
		currentUserId !== undefined && listing.ownerId === currentUserId;

	return (
		<Pressable
			style={styles.cardWrapper}
			onHoverIn={handleHoverIn}
			onHoverOut={handleHoverOut}
			onPress={handlePress}
		>
			{
				<Animated.View style={[styles.card, animatedCard]}>
					<PhotoRow photos={listing.photos as string[] | undefined} />
					<Text style={styles.name}>
						{listing.title}
						{listing.sold && (
							<Text style={{ color: "red" }}> (Sold)</Text>
						)}
					</Text>
					<Text style={styles.price}>
						${listing.price.toFixed(2)}
					</Text>
					{expanded && (
						<Animated.View exiting={FadeOut.duration(300)}>
							{listing.tags.length > 0 && (
								<Text style={{ fontStyle: "italic" }}>
									Tags: {listing.tags.join(", ")}
								</Text>
							)}
							<View>
								<Text style={styles.description}>
									{listing.description}
								</Text>
								<MessageButton listingId={listing._id} />
								<Button
									title="Edit Listing"
									onPress={() => {
										if (onEditListing) {
											onEditListing(listing._id);
										}
									}}
								/>
								{isOwner && (
									<Button
										title="Delete Listing"
										onPress={() => {
											if (onDeleteListing) {
												onDeleteListing(listing._id);
											}
										}}
									/>
								)}
							</View>
						</Animated.View>
					)}
				</Animated.View>
			}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	cardWrapper: {
		alignSelf: "flex-start",
		borderRadius: 20,
	},
	card: {
		width: 300,
		height: 300,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 20,
		padding: 10,
		margin: 10,
		backgroundColor: "#ddd",
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	price: {
		fontSize: 16,
		marginBottom: 5,
	},
	description: {
		fontSize: 14,
		padding: 10,
		marginBottom: 10,
	},
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
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		position: "relative",
	},
	arrowLeft: {
		position: "absolute",
		left: 10,
		zIndex: 10,
		padding: 10,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 20,
	},
	arrowRight: {
		position: "absolute",
		right: 10,
		zIndex: 10,
		padding: 10,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 20,
	},
	arrowText: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
});
