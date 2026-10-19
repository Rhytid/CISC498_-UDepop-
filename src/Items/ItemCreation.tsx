import type { TagType } from "@/tags/tagDef";
import AnimatedMulti from "@/tags/tagDef";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";

export function ItemC() {
  //Initialize the state to hold the textbox value
  const [Name, setName] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Tags, setTags] = useState<TagType[]>([]);
  const [Description, setDescription] = useState<string>("");
  const [Category, setCategory] = useState<string>("");
  // Updates the State whenever the user types
  const nameSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };
  const priceSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPrice(Number(event.target.value));
  };

  const descriptionSet = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDescription(event.target.value);
  };

  const createItem = useMutation(api.listings.create);
  //Function to handle adding an item with a button click
  async function handleSubmit() {
    try {
      await createItem({
        title: Name,
        description: Description,
        price: Price,
        category: Category,
        tags: Tags.map((t) => t.value),
        photos: [],
      });

      // reset the form after success
      setName("");
      setPrice(0);
      setTags([]);
      setDescription("");
    } catch (err) {
      console.error("Failed to create listing:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <label htmlFor="username">Enter Name: </label>
      <input
        id="name"
        type="text"
        value={Name}
        onChange={nameSet}
        placeholder="Type something..."
      />
      <input
        id="price"
        type="text"
        value={Price}
        onChange={priceSet}
        placeholder="Type something..."
      />
      <AnimatedMulti value={Tags} onChange={setTags} />

      <input
        id="description"
        type="text"
        value={Description}
        onChange={descriptionSet}
        placeholder="Type something..."
      />
      <button
        onClick={handleSubmit}
        style={{ backgroundColor: "#841584", color: "white" }}
      >
        Add Item
      </button>
    </div>
  );
}
export default ItemC;
