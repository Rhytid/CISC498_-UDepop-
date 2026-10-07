import {
  TabList,
  TabListProps,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

import { useState } from 'react';

export default function AppTabs() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Tabs>
      <TabSlot style={{ height: '100%', paddingLeft: 200, }} />
      <TabList asChild>
        <CustomTabList isOpen={isOpen} setIsOpen={setIsOpen}>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Settings</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps & {isOpen: boolean; setIsOpen: (value:boolean) => void}) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View {...props} style={[styles.tabListContainer, { width: props.isOpen ? 240 : 80},]}>
      <ThemedView type="backgroundElement" style={[styles.innerContainer, !props.isOpen && styles.collapsedContainer]}>
        <Pressable onPress={() => props.setIsOpen(!props.isOpen)}>
          <ThemedText>☰</ThemedText>
        </Pressable>
        {props.isOpen && (
          <>
        <ThemedText type="smallBold" style={styles.brandText}>
          UDepop
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Contact Us</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
        </>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    padding: Spacing.three,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  innerContainer: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    justifyContent: 'flex-start',
  },
  brandText: {
    marginBottom: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
  collapsedContainer: {
    width: 60,
    height: 60,
    flexGrow: 0,
    padding: 0,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
