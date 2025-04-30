import { Image, StyleSheet } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#faf0dc', dark: '#faf0dc' }}
      headerImage={
        <Image
          source={require('@/assets/images/pet_finder_logo_middle.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Welcome to Pet Finder
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.heading}>
          Our Mission
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Pet Finder is dedicated to reuniting lost pets with their families. Through a
          community-powered platform, users can report lost pets, share sightings, and connect
          with local resources.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.heading}>
          How It Works
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Create an account to post or search for pets. Use the login or sign-up options to begin.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.heading}>
          Need Help?
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Visit the Help section or contact support to learn how to make the most of Pet Finder.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FBF0DC',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e8d8c4',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#e8d8c4', // Soft brown box color to match LandingPage
    marginBottom: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  heading: {
    color: '#6b431f',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  paragraph: {
    color: '#4d3a2a',
    fontSize: 15,
    lineHeight: 22,
  },
  titleText: {
    color: '#6b431f',
    fontSize: 26,
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 200,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    top: '50%',
    marginTop: -100,
    resizeMode: 'cover',
    transform: [{ translateY: 25 }],
  },
});