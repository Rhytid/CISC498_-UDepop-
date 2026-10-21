import React from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Doc, Id } from "../../convex/_generated/dataModel";

export interface ItemCardProps {
	listing: Doc<"listings">;
	onMessageSeller?: (sellerId: Id<"users">) => void;
}

export default function ItemCard({ listing, onMessageSeller }: ItemCardProps) {
	const [expanded, setExpanded] = React.useState(false);
	const hoverAnim = useSharedValue<number>(0);
	const expandAnim = useSharedValue<number>(300);

	//Pulls the list of items from the cloud

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

	return (
		<Pressable
			style={styles.cardWrapper}
			onHoverIn={handleHoverIn}
			onHoverOut={handleHoverOut}
			onPress={handlePress}
		>
			{
				<Animated.View style={[styles.card, animatedCard]}>
          <Image
            source={listing.photos[0] ? { uri: listing.photos[0] }: require("../../assets/images/no-image.jpg")}
            style={styles.image}
          />
					<Text style={styles.name}>
						{listing.title}
						{listing.sold && (<Text style={{ color: "red" }}> (Sold)</Text>)}
					</Text>
					<Text style={styles.price}>${listing.price.toFixed(2)}</Text>
          {listing.tags.length > 0 && (
            <Text style={{ fontStyle: "italic" }}>Tags: {listing.tags.join(", ")}</Text>
          )}
          {expanded && (
            <View>
              <Text style={styles.description}>{listing.description}</Text>
              <Button
                title="Message Seller"
                onPress={() => {
                  if (onMessageSeller) {
                    onMessageSeller(listing.ownerId);
                  }
                }}
              />
          </View>
          )
        }
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
});
