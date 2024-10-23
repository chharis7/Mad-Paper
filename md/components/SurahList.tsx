// components/SurahList.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import useSurahData from '../hooks/useSurahData';
import useQuranData from '../hooks/useQuranData';

const SurahList = () => {
  const { data, loading, error } = useSurahData(); // Fetch Surah metadata
  const { data: quranData, loading: quranLoading, error: quranError } = useQuranData(); // Fetch Quran data
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  if (loading || quranLoading) {
    return <ActivityIndicator size="large" color="#00ffcc" />; // Updated loading color
  }

  if (error || quranError) {
    return <Text style={styles.errorText}>Error: {error || quranError}</Text>; // Added error text styling
  }

  const handlePress = (index: number) => {
    setSelectedSurah(index === selectedSurah ? null : index); // Toggle the clicked Surah
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.number.toString()}
      renderItem={({ item, index }) => (
        <View>
          <TouchableOpacity onPress={() => handlePress(index)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.englishName}</Text>
              <Text style={styles.subTitle}>{item.revelationType} - {item.numberOfAyahs} verses</Text>
            </View>
          </TouchableOpacity>

          {selectedSurah === index && (
            <View style={styles.content}>
              <Text style={styles.surahTitle}>Surah: {item.englishName}</Text>
              {quranData && quranData[index] && (
                <FlatList
                  data={quranData[index].ayahs} // Fetching Ayahs of the clicked Surah
                  keyExtractor={(ayah) => ayah.number.toString()}
                  renderItem={({ item: ayah }) => (
                    <Text style={styles.ayahText}>
                      {ayah.numberInSurah}. {ayah.text}
                    </Text>
                  )}
                />
              )}
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: '#333', // Dark background for Surah list items
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    color: '#ffffff', // Light text for contrast
  },
  subTitle: {
    fontSize: 14,
    color: '#b0b0b0', // Subtle gray for subtitle text
  },
  content: {
    padding: 20,
    backgroundColor: '#f0f0f0', // Light background for the expanded content
    borderRadius: 8,
  },
  surahTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Darker text for the Surah title
  },
  ayahText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#222', // Dark text for Ayah content
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SurahList;
