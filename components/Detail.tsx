import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Detail: { userId: string; token: string; apiUrl: string; method: 'GET' | 'POST' };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type StatusText = {
  lang: string;
  name: string;
};

type Status = {
  id: number;
  name: string;
  color: string;
  isActive: boolean;
  hasDeadline: boolean;
  isAppliedIndividually: boolean;
  texts: StatusText[];
};

type UserDetail = {
  id: number;
  name: string;
  description: string;
  status: Status | null;
};

export default function Detail({ route }: { route: DetailScreenRouteProp }) {
  const { userId, token, apiUrl, method } = route.params;
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const body = {
    offset: 0,
    pageSize: 100,
    fields: 'id,name,description,status',
    sourceId: '797f5a94-3689-4ac8-82fd-d749511ea2b2',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Запрос к API...');
        const options: any = {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        if (method === 'POST') {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        console.log('Ответ от API:', json);

        const user = Array.isArray(json)
          ? json.find((item: any) => item.id === Number(userId))
          : json.tasks?.find((task: any) => task.id === Number(userId));

        console.log('Найденный пользователь:', user);

        if (user) {
          setUserData({
            id: user.id,
            name: user.name || 'Имя не указано',
            description: user.description || '<p>Описание отсутствует</p>',
            status: user.status || null,
          });
        } else {
          console.log('Пользователь не найден');
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : userData ? (
        <ScrollView style={styles.body}>
          <Text style={styles.header}>Детали задачи:</Text>
          <Text style={styles.text}>Id: {userData.id}</Text>
          <Text style={styles.text}>Имя: {userData.name}</Text>

          <Text style={styles.subHeader}>Описание:</Text>
          <RenderHTML
            contentWidth={width}
            source={{ html: userData.description }}
          />

          {userData.status ? (
            <>
              <Text style={styles.text}>Статус: {userData.status.name}</Text>
              <Text style={styles.text}>Цвет: {userData.status.color}</Text>
              <Text style={styles.text}>
                Активный: {userData.status.isActive ? 'Да' : 'Нет'}
              </Text>

              {userData.status.texts && (
                <View style={styles.translationContainer}>
                  <Text style={styles.subHeader}>Переводы статуса:</Text>
                  {userData.status.texts.map((text, index) => (
                    <Text key={index} style={styles.text}>
                      {text.lang}: {text.name}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.text}>Статус: отсутствует</Text>
          )}
        </ScrollView>
      ) : (
        <Text style={styles.text}>Данные пользователя не найдены</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2022',
    padding: 15,
  },
  body: {
    backgroundColor: '#30475e',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#e2e8f0',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: '#f8fafc',
  },
  translationContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#94a3b8',
  }
});
