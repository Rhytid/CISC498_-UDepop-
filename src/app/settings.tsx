import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
      ...safeAreaInsets,
      bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    const theme = useTheme();
}