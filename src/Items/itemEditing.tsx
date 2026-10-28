export default function EditButton{
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
}