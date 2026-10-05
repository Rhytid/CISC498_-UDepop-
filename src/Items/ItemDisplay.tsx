import { ThemedText } from "@/components/themed-text";
import type { TagType } from "@/Tag/TagDef";
import AnimatedMulti from "@/Tag/TagDef";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Item } from "./ItemDef";

const tempItem: Item = {
  Name: "test",
  Tags: [],
  Price: 42,
  Description: "This is an item",
};

export function ItemD() {
  //Creates callable functions from the functions created in Itembase.ts

  const items = useQuery(api.Itembase.get);
  const createItem = useMutation(api.Itembase.add);
  const deleteItem = useMutation(api.Itembase.remove);

  //Initialize the state to hold the textbox value
  const [Name, setName] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [Tags, setTags] = useState<TagType[]>([]);
  const [Description, setDescription] = useState<string>("");

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

  //Funton to update the textboxes and make a new Item
  //Eventually need to send this to user database and global database
  function AddItem() {
    const NewItem: Item = { Name, Price, Tags, Description };
    setTags([]);
    createItem(NewItem);
  }

  return (
    <div style={{ padding: "20px" }}>
      <label htmlFor="username">Enter Item Name: </label>
      <input
        id="name"
        type="text"
        value={Name}
        onChange={nameSet}
        placeholder="Type something..."
      />
      <label htmlFor="username">Enter Item Price: </label>
      <input
        id="price"
        type="text"
        value={Price}
        onChange={priceSet}
        placeholder="Type something..."
      />
      <label htmlFor="username">Select Relevant Tags: </label>
      <AnimatedMulti value={Tags} onChange={setTags} />
      <label htmlFor="username">Enter Item Description: </label>
      <input
        id="description"
        type="text"
        value={Description}
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
            {item.Name} - ${item.Price} -{" "}
            {item.Tags.map((t: { label: TagType }) => t.label).join(", ")} -{" "}
            {item.Description}
          </ThemedText>
          <button onClick={() => deleteItem({ id: item._id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}
export default ItemD;
