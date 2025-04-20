import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

const Labels = () => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([
    'Sensitive',
    'Game',
    'Music',
    'Art',
    'Travel',
    'Sport',
    'Photography',
    'Emotion talk',
  ]);

  const maxLabels = 10;

  const labels = {
    AboutMe: [
      'Passionate',
      'Optimistic',
      'Unpredictable',
      'Single',
      'Emotion mentor',
      'Understanding',
      'Charming',
      'Lighthearted',
      'Clumsy',
      'Energetic',
      'Vegetarian',
      'Fun',
      'Ambitious',
      'Rational',
      'Romantic',
      'Mature',
      'Sexy',
      'Shapely',
      'Slow to warm up',
      'Pretty',
      'Plump',
      'Elegant',
      'Cute',
      'Handsome',
      'Strong',
      'Freshly young',
    ],
    MyThing: [
      'Food',
      'Movie',
      'Idol',
      'ACG',
      'Party',
      'Singing',
      'Cat',
      'Dog',
      'K-pop',
      'Fashion',
      'Makeup',
      'Outdoor',
      'Variety',
      'Dance',
      'Binge-watching',
    ],
    InviteMe: [
      'MLBB',
      'Werewolf',
      'Playmate',
      'Chat',
      'KTV',
      'Dating',
      'Group video',
      'Ludo',
    ],
  };

  const handleSelectLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(item => item !== label));
    } else if (selectedLabels.length < maxLabels) {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const renderLabel = (label: string) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.label,
        selectedLabels.includes(label) && styles.selectedLabel,
      ]}
      onPress={() => handleSelectLabel(label)}>
      <Text
        style={[
          styles.labelText,
          selectedLabels.includes(label) && styles.selectedLabelText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: string[]) => (
    <View key={title} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({item}) => renderLabel(item)}
        keyExtractor={item => item}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.labelsContainer}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Selected labels ({selectedLabels.length}/{maxLabels})
        </Text>
        <TouchableOpacity style={styles.okButton}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {renderSection('About Me', labels.AboutMe)}
        {renderSection('My Thing', labels.MyThing)}
        {renderSection('Invite Me', labels.InviteMe)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: '#FFCC00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  okButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  labelsContainer: {
    justifyContent: 'flex-start',
  },
  label: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLabel: {
    backgroundColor: '#FFCC00',
  },
  labelText: {
    fontSize: 14,
    color: '#000',
  },
  selectedLabelText: {
    color: '#fff',
  },
});

export default Labels;
