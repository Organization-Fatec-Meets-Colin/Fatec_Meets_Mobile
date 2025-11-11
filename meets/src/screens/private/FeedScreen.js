import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import Post from "../../components/Post";
import { usePosts } from "../../hooks/usePosts";

export default function FeedScreen({ navigation }) {
    const { posts, loading, error, refresh } = usePosts();
    const [refreshing, setRefreshing] = useState(false);

    const handlePostPress = (post) => {
        navigation.navigate('PostDetails', { post });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9C2222']}
                        tintColor="#9C2222"
                    />
                }
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>meets</Text>
                </View>

                <View style={styles.feedContainer}>
                    {loading && !refreshing && (
                        <ActivityIndicator size="large" color="#9C2222" style={styles.loader} />
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Erro ao carregar posts</Text>
                            <Text style={styles.errorSubtext}>{error}</Text>
                        </View>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
                            <Text style={styles.emptySubtext}>Seja o primeiro a postar! 🚀</Text>
                        </View>
                    )}

                    {posts.map((post) => (
                        <Post key={post.id} post={post} onPress={() => handlePostPress(post)} />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    scrollView: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D88D8D',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9C2222',
    },
    feedContainer: {
        flex: 1,
        marginBottom: 60,
    },
    loader: {
        marginTop: 50,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#FFE5E5',
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 5,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
    },
})