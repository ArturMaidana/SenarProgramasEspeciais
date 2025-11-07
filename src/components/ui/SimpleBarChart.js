import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { s, vs, ms } from 'react-native-size-matters';

const SimpleBarChart = ({ data, height, barWidth, spacing, barColor }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(item => item.value));

  const chartWidth = data.length * (barWidth + spacing) - spacing;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * height : 0;
          const x = index * (barWidth + spacing);
          const y = height - barHeight;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx={ms(4)}
            />
          );
        })}
      </Svg>
      <View style={[styles.labelsContainer, { width: chartWidth }]}>
        {data.map((item, index) => (
          <Text key={index} style={[styles.label, { width: barWidth }]}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  label: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(11),
    color: '#424242',
    textAlign: 'center',
  },
});

export default SimpleBarChart;
