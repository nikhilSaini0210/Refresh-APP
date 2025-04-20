import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {labels} from '@utils/DummyData';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack} from '@utils/NavigationUtils';
import MixedButton from '@components/ui/MixedButton';

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
        selectedLabels.includes(label) && labels.AboutMe.includes(label)
          ? styles.selectedLabel1
          : selectedLabels.includes(label) && labels.MyThing.includes(label)
          ? styles.selectedLabel2
          : selectedLabels.includes(label) && labels.InviteMe.includes(label)
          ? styles.selectedLabel3
          : null,
      ]}
      onPress={() => handleSelectLabel(label, title)}>
      <Text
        style={[
          styles.labelText,
          selectedLabels.includes(label) && styles.selectedLabelText,
        ]}>
        {label}
      </Text>
      {title === 'Selected labels' && (
        <View style={styles.crossButton}>
          <CustomText
            style={styles.cross}
            fontFamily={Fonts.SemiBold}
            fontSize={RFValue(8)}>
            X
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: string[]) => (
    <View key={title} style={styles.section}>
      {title === 'Selected labels' ? (
        <CustomText
          fontFamily={Fonts.Medium}
          fontSize={RFValue(14)}
          style={styles.sectionTitle}>
          Selected labels ({selectedLabels.length}/{maxLabels})
        </CustomText>
      ) : (
        <CustomText
          fontFamily={Fonts.Medium}
          fontSize={RFValue(14)}
          style={styles.sectionTitle}>
          {title}
        </CustomText>
      )}

      <FlatList
        data={data}
        renderItem={({item}) => renderLabel(item, title)}
        keyExtractor={item => item}
        scrollEnabled={false}
        contentContainerStyle={styles.labelsContainer}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <CustomText
            variant="h5"
            fontFamily={Fonts.SemiBold}
            style={styles.headerText}>
            Labels
          </CustomText>
        </View>
        <View style={styles.okButtonCont}>
          <MixedButton
            title="OK"
            textColor="#FFF"
            style={styles.okButton}
            onPress={() => {}}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {selectedLabels.length > 0 &&
          renderSection('Selected labels', selectedLabels)}
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
    marginBottom: 5,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    color: '#000',
  },
  okButtonCont: {
    width: '20%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okButton: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  labelsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
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
  selectedLabel1: {
    backgroundColor: Colors.lightYellow,
  },
  selectedLabel2: {
    backgroundColor: Colors.lightBlue2,
  },
  selectedLabel3: {
    backgroundColor: Colors.lightPink2,
  },
  labelText: {
    fontSize: 14,
    color: '#000',
  },
  selectedLabelText: {
    color: '#000',
  },
  cross: {
    color: '#FFF',
  },
  crossButton: {
    position: 'absolute',
    top: -5,
    right: 0,
    borderRadius: 50,
    width: 15,
    height: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Labels;
