import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

const ParetoBarChart = ({ data, totalValue }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Sem dados de prioridade.</Text>
      </View>
    );
  }

  // Ordena os dados em ordem decrescente de count
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <View style={styles.chartContainer}>
      {sortedData.map((item, index) => {
        const percentage = totalValue > 0 ? (item.count / totalValue) * 100 : 0;
        const barWidth = percentage > 0 ? `${percentage.toFixed(0)}%` : '0%';
        const displayLabel =
          item.category.length > 15
            ? item.category.substring(0, 12) + '...'
            : item.category;

        return (
          <View key={item.category} style={styles.barWrapper}>
            <View style={styles.labelValueContainer}>
              <Text style={styles.barLabel}>{displayLabel}</Text>
              <Text style={styles.barValue}>{item.count}</Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: barWidth, backgroundColor: item.color || '#00A859' },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingVertical: vs(10),
    paddingHorizontal: s(5),
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  noDataText: {
    fontSize: ms(14),
    color: '#757575',
  },
  barWrapper: {
    marginBottom: vs(15),
  },
  labelValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  barLabel: {
    fontSize: ms(13),
    color: '#424242',
    maxWidth: '70%', // Para evitar que o texto do label empurre o valor
  },
  barValue: {
    fontSize: ms(13),
    color: '#212121',
    fontWeight: 'bold',
  },
  barBackground: {
    height: vs(15),
    backgroundColor: '#EEEEEE',
    borderRadius: ms(8),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(8),
  },
});

export default ParetoBarChart;
