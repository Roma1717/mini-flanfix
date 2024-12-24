import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Task = {
  id: string;
  name: string;
  project: string;
};

export default function TaskScreen() {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Task[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // Mock Data Fetching
  useEffect(() => {
    const mockData: Task[] = [
      { id: "1", name: "Task 1", project: "Project A" },
      { id: "2", name: "Task 2", project: "Project B" },
      { id: "3", name: "Task 3", project: "Project C" },
      { id: "4", name: "Task 4", project: "Project D" },
    ];
    setTimeout(() => {
      setData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskProject}>{item.project}</Text>
    </TouchableOpacity>
  );

  const filterOptions = [
    "All",
    "Incoming",
    "Outgoing",
    "Audited",
    "Favorites",
    "Repeating",
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#6c757d"
        />
      </View>

      {/* Task List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>No data found</Text>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filterOptions}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.filterItem}>
                  <Text style={styles.filterText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  taskItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "500",
  },
  taskProject: {
    fontSize: 14,
    color: "#6c757d",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterText: {
    fontSize: 16,
  },
});
