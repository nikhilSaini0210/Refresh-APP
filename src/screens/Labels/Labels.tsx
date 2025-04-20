import {labels} from '@utils/DummyData';
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
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [aboutMeLabels, setAboutMeLabels] = useState<string[]>(labels.AboutMe);
  const [myThingLabels, setMyThingLabels] = useState<string[]>(labels.MyThing);
  const [inviteMeLabels, setInviyeMeLabels] = useState<string[]>(
    labels.InviteMe,
  );

  const maxLabels = 10;

  const handleSelectLabel = (label: string, title: string) => {
    if (title === 'About Me') {
      setSelectedLabels([...selectedLabels, label]);
      setAboutMeLabels(aboutMeLabels.filter(item => item !== label));
    }
    if (title === 'My Thing') {
      setSelectedLabels([...selectedLabels, label]);
      setMyThingLabels(myThingLabels.filter(item => item !== label));
    }
    if (title === 'Invite Me') {
      setSelectedLabels([...selectedLabels, label]);
      setInviyeMeLabels(inviteMeLabels.filter(item => item !== label));
    }
    if (title === 'Selected labels') {
      if (labels.AboutMe.includes(label)) {
        setSelectedLabels(selectedLabels.filter(item => item !== label));
        setAboutMeLabels([...aboutMeLabels, label]);
      }
      if (labels.MyThing.includes(label)) {
        setSelectedLabels(selectedLabels.filter(item => item !== label));
        setMyThingLabels([...myThingLabels, label]);
      }
      if (labels.InviteMe.includes(label)) {
        setSelectedLabels(selectedLabels.filter(item => item !== label));
        setInviyeMeLabels([...inviteMeLabels, label]);
      }
    }
  };

  const renderLabel = (label: string, title: string) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.label,
        selectedLabels.includes(label) && styles.selectedLabel,
      ]}
      onPress={() => handleSelectLabel(label, title)}>
      <Text
        style={[
          styles.labelText,
          selectedLabels.includes(label) && styles.selectedLabelText,
        ]}>
        {label}
      </Text>
      <View
        style={{
          position: 'absolute',
          top: -5,
          right: 0,
          borderRadius: 50,
          width: 15,
          height: 15,
          backgroundColor: 'red',
        }}></View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: string[]) => (
    <View key={title} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({item}) => renderLabel(item, title)}
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
        {renderSection('Selected labels', selectedLabels)}
        {renderSection('About Me', aboutMeLabels)}
        {renderSection('My Thing', myThingLabels)}
        {renderSection('Invite Me', inviteMeLabels)}
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
    marginTop: 7,
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
