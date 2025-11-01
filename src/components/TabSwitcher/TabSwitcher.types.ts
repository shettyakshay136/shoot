export interface TabSwitcherProps {
  /**
   * Array of tab labels to display
   */
  tabs: string[];
  
  /**
   * Currently active tab
   */
  activeTab: string;
  
  /**
   * Callback function when a tab is pressed
   */
  onTabChange: (tab: string) => void;
}

export interface TabSwitcherStyles {
  tabsContainer: object;
  tabButton: object;
  activeTabButton: object;
  inactiveTabButton: object;
  tabButtonText: object;
  activeTabButtonText: object;
  inactiveTabButtonText: object;
}
