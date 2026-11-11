import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";

export function MessageComposer({
  disabled,
  sending,
  onSend,
}: {
  disabled?: boolean;
  sending: boolean;
  onSend: (body: string) => Promise<boolean>;
}) {
  const theme = useTheme();
  const [text, setText] = useState("");

  const send = async () => {
    const body = text.trim();
    if (!body || sending || disabled) {
      return;
    }
    if (await onSend(body)) {
      setText("");
    }
  };

  return (
    <View
      style={[
        styles.composer,
        { borderTopColor: theme.backgroundSelected },
      ]}
    >
      <TextInput
        accessibilityLabel="Message"
        accessibilityHint="Press Enter to send. Use Shift and Enter for a new line."
        value={text}
        onChangeText={setText}
        placeholder="Write a message..."
        placeholderTextColor={theme.textSecondary}
        multiline
        blurOnSubmit
        onSubmitEditing={() => void send()}
        editable={!disabled && !sending}
        returnKeyType="send"
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
          },
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        disabled={disabled || sending || text.trim().length === 0}
        onPress={() => void send()}
        style={({ pressed }) => [
          styles.sendButton,
          { backgroundColor: theme.text },
          pressed && styles.pressed,
          (disabled || sending || text.trim().length === 0) &&
            styles.sendDisabled,
        ]}
      >
        {sending ? (
          <ActivityIndicator size="small" color={theme.background} />
        ) : (
          <Ionicons name="send" size={17} color={theme.background} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    padding: 16,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
});
