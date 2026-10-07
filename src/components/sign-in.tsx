import { useAuthActions } from "@convex-dev/auth/react";
import { Button, Field, Section } from "@/components/test-ui";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await signIn("password", {
        flow,
        email,
        password,
        ...(flow === "signUp" ? { username, firstName, lastName } : {}),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UDepop</Text>
      <Section>{flow === "signIn" ? "Sign in" : "Create account"}</Section>

      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />

      {flow === "signUp" && (
        <>
          <Field
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Field label="First name" value={firstName} onChangeText={setFirstName} />
          <Field label="Last name" value={lastName} onChangeText={setLastName} />
          <Text style={styles.hint}>Password must be at least 8 characters.</Text>
        </>
      )}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Button
        label={
          submitting
            ? "Please wait…"
            : flow === "signIn"
              ? "Sign in"
              : "Sign up"
        }
        onPress={submit}
      />
      <Button
        label={
          flow === "signIn"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"
        }
        onPress={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
          setError("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  hint: { fontSize: 12, color: "#666" },
  error: { color: "#dc2626" },
});
