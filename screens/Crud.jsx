import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAIQj1H05h4KhDVioVON9WeXvRYPfb6JyA",
  authDomain: "crud-f6b47.firebaseapp.com",
  databaseURL: "https://crud-f6b47-default-rtdb.firebaseio.com",
  projectId: "crud-f6b47",
  storageBucket: "crud-f6b47.firebasestorage.app",
  messagingSenderId: "376192234956",
  appId: "1:376192234956:web:d5cbb712d828fa27845969"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Crud = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marks, setMarks] = useState('');
  const [phone, setPhone] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const profilesRef = ref(db, 'profiles');
    onValue(profilesRef, (snapshot) => {
      const data = snapshot.val();
      const profilesList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProfiles(profilesList);
    });
  }, []);

    const handleAddOrUpdateProfile = () => {
    const profilesRef = ref(db, 'profiles');
    if (selectedProfile) {
      const selectedProfileRef = ref(db, `profiles/${selectedProfile.id}`);
      update(selectedProfileRef, { name, email, marks, phone });
    } else {
      push(profilesRef, { name, email, marks, phone });
    }
    setName('');
    setEmail('');
    setMarks('');
    setPhone('');
    setSelectedProfile(null);
  };

  const handleDeleteProfile = (id) => {
    const profileRef = ref(db, `profiles/${id}`);
    remove(profileRef);
  };

  const handleSelectProfile = (profile) => {
    setName(profile.name);
    setEmail(profile.email);
    setMarks(profile.marks);
    setPhone(profile.phone);
    setSelectedProfile(profile);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Marks"
        value={marks}
        onChangeText={setMarks}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <Button
        title={selectedProfile ? "Update Profile" : "Add Profile"}
        onPress={handleAddOrUpdateProfile}
      />
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.profileItem}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.marks}</Text>
            <Text>{item.phone}</Text>
            <Button title="Edit" onPress={() => handleSelectProfile(item)} />
            <Button title="Delete" onPress={() => handleDeleteProfile(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  profileItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default Crud;
