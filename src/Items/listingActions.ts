import { useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

export function useListingActions(){
    const removeListing = useMutation(api.listings.remove);
    const deleteListing = useCallback(
        async (listingId: Id<"listings">) => {
            try {
                await removeListing({ id: listingId });
            } catch (error) {
                console.error("Error deleting listing:", error);
            }
        },
        [removeListing]
    )
    return { deleteListing };
}
