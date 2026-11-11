import ItemCard from "@/features/listings/components/itemCard";
import { NewItem } from "@/features/listings/components/newItem";
import { useListingActions } from "@/features/listings/hooks/listingActions";
import OwnMessages from "@/features/messaging/components/OwnMessages";
import ProfilePicture from "@/shared/ui/profilePicture";
import { api } from "@convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const me = useQuery(api.users.getMe);
  const rating = useQuery(
    api.reviews.getRating,
    me?._id ? { userId: me._id } : "skip",
  );
  const currentUserId = me?._id; //undefined while loading

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { addListing, deleteListing, sellList } = useListingActions();
  const [showRatings, setShowRatings] = useState(false);

  const reviews = useQuery(
    api.reviews.listByUser,
    showRatings && currentUserId ? { userId: currentUserId } : "skip",
  );

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
        <Text style={styles.bannerText}>@{me?.username ?? "Loading..."} </Text>

        <Pressable onPress={() => setShowRatings(true)}>
          <View style={styles.clickableRating}>
            {rating && rating.count > 0 ? (
              <>
                <Ionicons name="star" size={25} color="gold" />
                <Text>
                  {" "}
                  {rating.average.toFixed(1)} ({rating.count} reviews)
                </Text>
              </>
            ) : (
              <Text>No Ratings</Text>
            )}
          </View>
        </Pressable>
        <Text>
          {me?.firstName} {me?.lastName}
        </Text>
        {me?.bio ? <Text>{me.bio}</Text> : null}

        {me?.location ? <Text>{me.location}</Text> : null}
        <Text>{myListings.length} Products</Text>
      </View>
      <Text style={styles.bannerText}>Products:</Text>
      <View style={{ alignItems: "center" }}>
        {myListings.length === 0 && <Text>You have no listings</Text>}
        <Pressable onPress={() => setShowPopup(true)} style={styles.button}>
          <Text>Create New Listing</Text>
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
            onSellListing={sellList}
            onDeleteListing={deleteListing}
          />
        ))}
      </View>
      <Modal
        visible={showRatings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatings(false)}
      >
        <View style={styles.reviewsWindow}>
          <View style={styles.reviewsContent}>
            <Pressable onPress={() => setShowRatings(false)}>
              <Ionicons name="close" size={28} color="black" />
            </Pressable>

            <Text style={styles.reviewsTitle}>User Reviews</Text>

            <Text>
              {rating && rating.count > 0
                ? `⭐ ${rating.average.toFixed(1)} ($rating.count} reviews)`
                : "No Ratings Yet"}
            </Text>
            <ScrollView style={{ marginTop: 15 }}>
              {reviews === undefined ? (
                <Text>Loading</Text>
              ) : reviews.length === 0 ? (
                <Text>No Reviews</Text>
              ) : (
                reviews.map((review) => (
                  <View key={review._id} style={styles.reviewContainer}>
                    <Text style={{ fontWeight: "bold" }}>
                      @{review.rater?.username ?? "Anonymous"}
                    </Text>

                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.score ? "star" : "star-outline"}
                          size={18}
                          color="gold"
                        ></Ionicons>
                      ))}
                    </View>
                    {review.comment && <Text>{review.comment}</Text>}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <OwnMessages />
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
    width: 150,
    alignItems: "center",
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
