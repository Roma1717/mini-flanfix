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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Task = {
  id: string;
  name: string;
  project?: string;
};

export default function TaskScreen() {
  const navigation = useNavigation();

  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Task[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const bearerToken = "e6b81f457abb73f6a9d9c7a9aa6decf0";
  const url = "https://artiomdem4enko.planfix.com/rest/task/list";
  const requestMethod = "POST";

  const getDataFromServer = async () => {
    const body = {
      offset: 0,
      pageSize: 100,
      fields: "id,name",
      sourceId: "797f5a94-3689-4ac8-82fd-d749511ea2b2",
    };

    try {
      const options: any = {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      };

      if (requestMethod === "POST") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      let tasks = [];
      if (json.tasks && Array.isArray(json.tasks)) {
        tasks = json.tasks.map((task: any) => ({
          id: task.id || "",
          name: task.name || "Имя отсутствует",
        }));
      } else if (Array.isArray(json)) {
        tasks = json.map((item: any) => ({
          id: item.id || "",
          name: item.name || "Имя отсутствует",
        }));
      } else {
        console.warn("Непредвиденная структура данных:", json);
      }

      setData(tasks);
      setFilteredData(tasks);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataFromServer();
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

  const categories = [
    {
      id: "1",
      title: "Все",
      subcategories: [
        { id: "1-1", name: "Все" },
        { id: "1-2", name: "Новая" },
        { id: "1-3", name: "В работе" },
        { id: "1-4", name: "Выполненная" },
        { id: "1-5", name: "Черновик" },
        { id: "1-6", name: "Завершенная" },
        { id: "1-7", name: "Отмененная" },
      ],
    },
    { id: "2", title: "Входящие", subcategories: [] },
    { id: "3", title: "Исходящие", subcategories: [] },
    { id: "4", title: "Аудируемые", subcategories: [] },
    { id: "5", title: "Избранное", subcategories: [] },
  ];

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  const renderCategory = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => toggleCategory(item.id)}
      >
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          {item.subcategories.length > 0 && (
            <Icon
              name={
                expandedCategory === item.id ? "chevron-up" : "chevron-down"
              }
              size={24}
              color="#007bff"
            />
          )}
        </View>
      </TouchableOpacity>
      {expandedCategory === item.id && item.subcategories.length > 0 && (
        <View style={styles.subcategoryList}>
          {item.subcategories.map((sub: any) => (
            <Text key={sub.id} style={styles.subcategoryItem}>
              ● {sub.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskProject}>{item.project || "Без проекта"}</Text>
      </View>
      <View style={styles.taskActions}>
        <Icon name="star-outline" size={24} color="#007bff" />
        <Icon
          name="cloud-download-outline"
          size={24}
          color="#007bff"
          style={{ marginLeft: 16 }}
        />
        <Icon
          name="dots-horizontal"
          size={24}
          color="#6c757d"
          style={{ marginLeft: 16 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Задачи</Text>
        <View style={styles.iconContainer}>
          <Icon name="bell-outline" size={24} color="#007bff" />
          <Text style={styles.notificationCount}>25</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск"
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#6c757d"
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-outline" size={24} color="#6c757d" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyText}>Данные отсутствуют</Text>
      )}

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark-outline" size={24} color="#ffffff" />
          <Text style={styles.navText}>Хроника</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-outline" size={24} color="#ffffff" />
          <Text style={styles.navText}>Планировщик</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavItemContainer}>
            <Icon name="file-document-outline" size={24} color="#ffffff" />
            <Text style={styles.activeNavText}>Задачи</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="dots-horizontal" size={24} color="#ffffff" />
          <Text style={styles.navText}>Еще</Text>
        </TouchableOpacity>
      </View>

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
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    paddingVertical: 8,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  taskProject: {
    fontSize: 14,
    color: "#6c757d",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#6c757d",
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: "#007bff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
  },
  activeNavItem: {
    borderRadius: 20,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activeNavItemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  activeNavText: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
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
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    color: "#000",
  },
  subcategoryList: {
    paddingLeft: 16,
    paddingTop: 8,
  },
  subcategoryItem: {
    fontSize: 14,
    color: "#6c757d",
    paddingVertical: 4,
  },
});
