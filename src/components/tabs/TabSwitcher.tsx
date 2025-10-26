import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { type TabSwitcherProps } from './TabSwitcher.types';
import { styles } from './TabSwitcher.styles';

const TabSwitcher = ({ tabs, activeTab, onTabChange }: TabSwitcherProps) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            activeTab === tab ? styles.activeTabButton : styles.inactiveTabButton
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === tab ? styles.activeTabButtonText : styles.inactiveTabButtonText
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSwitcher;
