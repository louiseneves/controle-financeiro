// src/screens/settings/CurrencySelectorScreen.js
import React, { useState,useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsService from '../../services/SettingsService';

const CurrencySelectorScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { currentCurrency, onSelect } = route.params;
  const [searchText, setSearchText] = useState('');
  
  const allCurrencies = SettingsService.getCurrencies();

  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchText.toLowerCase()) ||
    currency.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (currencyId) => {
    if (onSelect) {
      onSelect(currencyId);
    }
    navigation.goBack();
  };

  const renderCurrency = ({ item }) => {
    const isSelected = item.id === currentCurrency;

    return (
      <TouchableOpacity
        style={[styles.currencyItem, isSelected && styles.currencyItemSelected]}
        onPress={() => handleSelect(item.id)}
      >
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyFlag}>{item.flag}</Text>
          <View style={styles.currencyText}>
            <Text style={styles.currencyName}>{item.name}</Text>
            <Text style={styles.currencyCode}>
              {item.id} • {item.symbol}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecionar Moeda</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar moeda..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.placeholder}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Moedas */}
      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrency}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Info */}
      <View style={styles.infoCard}>
        <Icon name="information" size={18} color="#666" />
        <Text style={styles.infoText}>
          A moeda selecionada será usada em todo o app
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowcolor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    padding: 15,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowcolor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currencyItemSelected: {
    borderWidth: 2,
    bordercolor: colors.success,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  currencyText: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 10,
  },
});

export default CurrencySelectorScreen;