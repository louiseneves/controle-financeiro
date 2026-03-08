import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  leftIcon,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.inputBorder,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={styles.iconContainer}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const createStyles = colors =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.text,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      height: 50,
      paddingHorizontal: 12,
    },
    iconContainer: {
      marginHorizontal: 4,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.inputText || colors.text,
    },
    error: {
      fontSize: 12,
      marginTop: 4,
      color: colors.error,
    },
  });

export default Input;

