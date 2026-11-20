import { BookmarkToggleButton } from "@/features/bookmarks/components/bookmark-toggle-button";
// Marketplace listing card with photo, seller messaging, and owner actions.
// Used by listing feeds and profile pages to expose common listing interactions.
import EditListingButton from "@/features/listings/components/itemEditing";
import MessageButton from "@/features/messaging/components/CallingMessagePopup";
import PhotoRow from "@/shared/ui/photoRow";
import { Doc, Id } from "@convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ItemCardProps {
  listing: Doc<"listings">;
  currentUserId?: Doc<"users">["_id"];
  onMessageSeller?: (sellerId: Id<"users">) => void;
  onEditListing?: (listingId: Id<"listings">) => void;
  onDeleteListing?: (listingId: Id<"listings">) => void;
  onSellListing?: (
    listingId: Id<"listings">,
    sold: boolean,
  ) => Promise<boolean> | void;
}

export default function ItemCard({
  listing,
  currentUserId,
  onMessageSeller,
  onEditListing,
  onDeleteListing,
  onSellListing,
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

  const isOwner =
    currentUserId !== undefined && listing.ownerId === currentUserId;

  const router = useRouter();

  return (
    <Pressable
      style={styles.cardWrapper}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      {
        <Animated.View style={[styles.card, animatedCard]}>
          <Pressable onPress={handlePress}>
            <PhotoRow photos={listing.photos as string[] | undefined} />
            <Text style={styles.name}>
              {listing.title}
              {listing.sold && <Text style={{ color: "red" }}> (Sold)</Text>}
            </Text>
            <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
          </Pressable>
          <BookmarkToggleButton
            listingId={listing._id}
            style={styles.bookmarkButton}
          />

          {expanded && (
            <Animated.View style={{ flex: 1 }} exiting={FadeOut.duration(300)}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                <Text style={styles.listingMeta}>
                  {listing.category} · Condition:{" "}
                  {listing.condition?.trim() || "Not specified"}
                </Text>
                {listing.tags.length > 0 && (
                  <Text style={{ fontStyle: "italic" }}>
                    Tags: {listing.tags.join(", ")}
                  </Text>
                )}
                <Text style={styles.description}>{listing.description}</Text>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {!isOwner && (
                    <Pressable
                      style={styles.button}
                      onPress={() => {
                        if (onMessageSeller) {
                          onMessageSeller(listing.ownerId);
                        }
                      }}
                    >
                      <MessageButton listingId={listing._id}></MessageButton>
                    </Pressable>
                  )}
                  {isOwner && <EditListingButton listingId={listing._id} />}
                  {isOwner && (
                    <Pressable
                      style={styles.button}
                      onPress={async () => {
                        console.log("pressed", listing.sold);
                        const markingSold = !listing.sold;

                        if (onSellListing) {
                          const result = await onSellListing(
                            listing._id,
                            markingSold,
                          );
                          if (result === false) return; // the update failed, so don't navigate
                        }

                        if (markingSold) {
                          router.push({
                            pathname: "/selectuserreview",
                            params: { listingId: listing._id },
                          });
                        }
                      }}
                    >
                      <Text style={styles.description}>Sold?</Text>
                    </Pressable>
                  )}

                  {isOwner && (
                    <Pressable
                      style={styles.button}
                      onPress={() => {
                        if (onDeleteListing) {
                          onDeleteListing(listing._id);
                        }
                      }}
                    >
                      <Ionicons name="trash-outline" size={40} />
                    </Pressable>
                  )}
                </View>
              </ScrollView>
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
    position: "relative",
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
  bookmarkButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
  },
  listingMeta: {
    fontSize: 13,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
