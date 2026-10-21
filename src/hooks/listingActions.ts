import { useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { TagType } from "@/tags/tagDef";

export interface NewListingInput {
    title: string;
    price: number;
    tags: string[];
    description: string;
    category: string;
    photos: string[];
}

export function useListingActions(){
    const createListing = useMutation(api.listings.create);
    const addListing = useCallback(
        async(input: NewListingInput): Promise<boolean> => {
            try {
                await createListing(input);
                return true;
            } catch (error) {
                console.error("Error creating listing:", error);
                return false;
            }
        },
        [createListing],
    )
    const removeListing = useMutation(api.listings.remove);
    const deleteListing = useCallback(
        async (listingId: Id<"listings">): Promise<boolean> => {
            try {
                await removeListing({ id: listingId });
                return true;
            } catch (error) {
                console.error("Error deleting listing:", error);
                return false;
            }
        },
        [removeListing]
    )
    return { addListing, deleteListing };
}
