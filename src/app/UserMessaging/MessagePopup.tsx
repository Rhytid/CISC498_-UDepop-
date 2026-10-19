import React, { useEffect, useState } from "react";

const PopupPage = () => {
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Optionally: restrict to same-origin in production
      if (event.origin !== window.location.origin) return;

      console.log("Received message:", event.data);
      setMessage(event.data);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Popup Window</h2>
      <p>
        <strong>Message from parent:</strong>
      </p>
      <pre style={{ background: "#eee", padding: "10px" }}>
        {message ? JSON.stringify(message, null, 2) : "No message received"}
      </pre>
    </div>
  );
};

export default PopupPage;
