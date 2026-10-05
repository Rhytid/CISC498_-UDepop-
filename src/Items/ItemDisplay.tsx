import { ThemedText } from "@/components/themed-text";
import type { TagType } from "@/Tag/TagDef";
import AnimatedMulti from "@/Tag/TagDef";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";

export function ItemD() {
  // Create callable functions from the functions defined in listings.ts
  const items = useQuery(api.listings.list);
  const createItem = useMutation(api.listings.create);
  const deleteItem = useMutation(api.listings.remove);

  // Initialize the state to hold the textbox values
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [tags, setTags] = useState<TagType[]>([]);
  const [description, setDescription] = useState<string>("");

  // Updates the state whenever the user types
  const titleSet = (event: { target: { value: string } }) => {
    setTitle(event.target.value);
  };
  const priceSet = (event: { target: { value: string } }) => {
    setPrice(Number(event.target.value));
  };
  const descriptionSet = (event: { target: { value: string } }) => {
    setDescription(event.target.value);
  };

  // Create a new listing from the textboxes and tag selector
  function AddItem() {
    createItem({
      title,
      price,
      tags: tags.map((t) => t.value),
      description,
    });
    setTags([]);
  }

  return (
    <div style={{ padding: "20px" }}>
      <label htmlFor="name">Enter Item Name: </label>
      <input
        id="name"
        type="text"
        value={title}
        onChange={titleSet}
        placeholder="Type something..."
      />
      <label htmlFor="price">Enter Item Price: </label>
      <input
        id="price"
        type="text"
        value={price}
        onChange={priceSet}
        placeholder="Type something..."
      />
      <label htmlFor="tags">Select Relevant Tags: </label>
      <AnimatedMulti value={tags} onChange={setTags} />
      <label htmlFor="description">Enter Item Description: </label>
      <input
        id="description"
        type="text"
        value={description}
        onChange={descriptionSet}
        placeholder="Type something..."
      />
      <button
        onClick={AddItem}
        style={{ backgroundColor: "#841584", color: "white" }}
      >
        Add Item
      </button>

      {items?.map((item) => (
        <div key={item._id}>
          <ThemedText>
            {item.title} - ${item.price} - {item.tags.join(", ")} -{" "}
            {item.description}
          </ThemedText>
          <button onClick={() => deleteItem({ id: item._id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}
export default ItemD;
