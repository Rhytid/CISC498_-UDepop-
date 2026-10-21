import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useConvex, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function ReviewsTest() {
  const convex = useConvex();
  const myReviews = useQuery(api.reviews.listByMe);
  const create = useMutation(api.reviews.create);

  const [listingId, setListingId] = useState("");
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState("");

  const doCreate = async () => {
    if (!listingId || !score) return;
    try {
      await create({
        listingId: listingId as Id<"listings">,
        score: Number(score),
        comment,
      });
      setResult("created");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doListByUser = async () => {
    if (!convex || !userId) return;
    const reviews = await convex.query(api.reviews.listByUser, {
      userId: userId as Id<"users">,
    });
    setResult(JSON.stringify(reviews, null, 2));
  };

  const doRating = async () => {
    if (!convex || !userId) return;
    const rating = await convex.query(api.reviews.getRating, {
      userId: userId as Id<"users">,
    });
    setResult(JSON.stringify(rating, null, 2));
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Create review</Section>
      <Field label="Listing id" value={listingId} onChangeText={setListingId} />
      <Field
        label="Score (1-5)"
        value={score}
        onChangeText={setScore}
        keyboardType="numeric"
      />
      <Field label="Comment" value={comment} onChangeText={setComment} />
      <Button label="Create review" onPress={doCreate} />

      <Section>Look up by user id</Section>
      <Field label="User id" value={userId} onChangeText={setUserId} />
      <Button label="List reviews about user" onPress={doListByUser} />
      <Button label="Get rating" onPress={doRating} />

      <Section>Reviews I wrote</Section>
      <Text style={styles.mono}>
        {myReviews === undefined
          ? "Loading…"
          : JSON.stringify(myReviews, null, 2)}
      </Text>

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  mono: { fontFamily: "monospace", fontSize: 12 },
});
