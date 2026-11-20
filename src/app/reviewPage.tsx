import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

export default function reviewScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: any }>();
  const createReview = useMutation(api.reviews.create);
  const [Rating, SetRating] = useState<string>("1");
  const [Comment, SetComment] = useState<string>("");

  async function submitRating(Score: number, review: string) {
    try {
      await createReview({
        listingId: listingId,
        score: Score,
        comment: review,
      });
      router.push({ pathname: "/(tabs)" });
    } catch (err) {
      console.error("Failed to create review:", err);
    }
  }
  return (
    <>
      <Text style={styles.banner}>
        Please leave a rating of 1-5 stars and an optional comment
      </Text>
      <TextInput
        value={Rating}
        onChangeText={SetRating}
        style={styles.button}
        placeholder="Leave a rating here"
      />
      <TextInput
        value={Comment}
        onChangeText={SetComment}
        style={styles.button}
        placeholder="Leave a comment here"
      />
      <Pressable
        style={styles.button}
        onPress={() => submitRating(Number(Rating), String(Comment))}
      >
        <Text>Submit Review</Text>
      </Pressable>
    </>
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
    width: 150,
    alignItems: "center",
  },
  bookmarksCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  bookmarksCopy: {
    flex: 1,
  },
  bookmarksTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  bookmarksSubtitle: {
    marginTop: 3,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.75,
  },
  clickableRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewsWindow: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    maxWidth: 450,
    maxHeight: "80%",
  },
  reviewsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reviewContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
