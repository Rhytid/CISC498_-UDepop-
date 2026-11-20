/**
 * Returns the active palette from the shared light/dark design tokens.
 * Screens and UI components use this hook to render consistently with app preference.
 */

import { Colors } from '@/constants/theme';
import { useThemePreference } from '@/shared/hooks/theme-preference';

export function useTheme() {
  const { preference } = useThemePreference();

  return Colors[preference];
}
