import { MaxContentWidth } from "@/constants/theme";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
    return (
        <ScrollView>
            <View style={styles.banner}>Banner</View>
            <Text>Profile Display</Text>

        </ScrollView>
    )
}
//Test
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        maxWidth: MaxContentWidth,
        flexGrow: 1,
    },
    banner: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: '#ccc',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 36,
        fontWeight: 'bold',
    },

});