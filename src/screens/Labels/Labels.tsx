import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {labels} from '@utils/DummyData';
import React, {FC, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {View, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack} from '@utils/NavigationUtils';
import MixedButton from '@components/ui/MixedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useRoute} from '@react-navigation/native';

type LabelsEditRouteParams = {
  params: {
    labelsItem: string[];
  };
};

const maxLabels = 10;

const Labels: FC = () => {
  const route = useRoute<RouteProp<LabelsEditRouteParams, 'params'>>();
  const {labelsItem} = route?.params;
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    labelsItem && labelsItem.length > 0 ? labelsItem : [],
  );
  const [aboutMeLabels, setAboutMeLabels] = useState<string[]>(labels.AboutMe);
  const [myThingLabels, setMyThingLabels] = useState<string[]>(labels.MyThing);
  const [inviteMeLabels, setInviyeMeLabels] = useState<string[]>(
    labels.InviteMe,
  );

  const areArraysEqual = (array1: string[], array2: string[]) => {
    if (array1.length !== array2.length) {
      return false;
    }
    return array1.every(item => array2.includes(item));
  };

  const handleSelectLabel = (label: string, title: string) => {
    if (selectedLabels.length === maxLabels) {
      return;
    }
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

  const onSaveLabels = async () => {
    try {
      if (
        labelsItem &&
        labelsItem.length > 0 &&
        areArraysEqual(selectedLabels, labelsItem)
      ) {
        goBack();
        return;
      }

      await AsyncStorage.setItem('user_labels', JSON.stringify(selectedLabels));
      goBack();
    } catch (error) {
      console.error('Error saving labels:', error);
    }
  };

  const renderLabel = (label: string, title: string, index: number) => (
    <TouchableOpacity
      key={index}
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
      <CustomText
        fontFamily={Fonts.Medium}
        fontSize={RFValue(10)}
        style={[
          selectedLabels.includes(label)
            ? styles.selectedLabelText
            : styles.labelText,
        ]}>
        {label}
      </CustomText>
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
      <ScrollView
        contentContainerStyle={styles.labelsContainer}
        scrollEnabled={false}>
        {data.map((item, index) => (
          <View key={index}>{renderLabel(item, title, index)}</View>
        ))}
      </ScrollView>
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
            onPress={onSaveLabels}
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
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okButton: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
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
    right: -5,
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
