import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Item } from "./itemDef";

export default function ItemCard({ item }: { item: Item }) {
	const [expanded, setExpanded] = React.useState(false);
	const hoverAnim = useSharedValue<number>(0);
	const expandAnim = useSharedValue<number>(400);

	const animatedCard = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: hoverAnim.value }],
			height: expandAnim.value,
		};
	});

	const animatedExpand = useAnimatedStyle(() => {
		return {
			transform: [{ scale: expandAnim.value }],
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
			? (expandAnim.value = withTiming(400, { duration: 300 }))
			: (expandAnim.value = withTiming(600, { duration: 300 }));
		setExpanded(!expanded);
	};

	return (
		<Pressable
			style={styles.cardWrapper}
			onHoverIn={handleHoverIn}
			onHoverOut={handleHoverOut}
			onPress={handlePress}
		>
			<Animated.View style={[styles.card, animatedCard]} key={item.name}>
				<Image source={{ uri: item.image }} style={styles.image} />
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.price.toFixed(2)}</Text>
				<Text style={styles.description}>{item.description}</Text>
			</Animated.View>
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
		height: 400,
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
