import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

import PieChart from '../../components/PieChart';
import SimpleBarChart from '../../components/SimpleBarChart';

import {
  BackPage,
  OutlineCalendarToday,
  LocationPin,
  UsersGroup,
  BarChart,
  ChartPie,
  OutlineFileDownload,
} from '../../components/Icons/Icons';

const DetailCard = ({ title, icon, children }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      {icon}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const ProgressBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );
};

const serviceDetailsData = {
  location: 'Alta Floresta, MT',
  date: '12 de Agosto de 2025',
  totalAttendees: 410,
  ageDistribution: [
    { category: 'Criança\n(0-12)', count: 85, percentage: 21 },
    { category: 'Adolescente\n(13-17)', count: 62, percentage: 15 },
    { category: 'Adulto\n(18-59)', count: 180, percentage: 44 },
    { category: 'Idoso\n(60+)', count: 83, percentage: 20 },
  ],
  genderDistribution: [
    { category: 'Feminino', count: 245, percentage: 60, color: '#00A859' },
    { category: 'Masculino', count: 165, percentage: 40, color: '#BDBDBD' },
  ],
  priorityDistribution: [
    { category: 'Urgente', count: 45, color: '#EF5350' },
    { category: 'Prioridade', count: 285, color: '#42A5F5' },
    { category: 'Normal', count: 80, color: '#66BB6A' },
  ],
};

export default function ServiceDetailsScreen({ route, navigation }) {
  const { serviceName } = route.params;

  const barChartData = serviceDetailsData.ageDistribution.map(item => ({
    label: item.category,
    value: item.count,
  }));

  const totalPriority = serviceDetailsData.priorityDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const totalGender = serviceDetailsData.genderDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackPage width={s(24)} height={s(24)} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório de atendimentos</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.detailsTitle}>Detalhes - {serviceName}</Text>
          <View style={styles.detailsRow}>
            <LocationPin width={s(14)} height={s(14)} color="#757575" />
            <Text style={styles.detailsText}>
              {serviceDetailsData.location}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <OutlineCalendarToday
              width={s(14)}
              height={s(14)}
              color="#757575"
            />
            <Text style={styles.detailsText}>{serviceDetailsData.date}</Text>
          </View>
          <View style={styles.detailsRow}>
            <UsersGroup width={s(14)} height={s(14)} color="#757575" />
            <Text style={styles.detailsText}>
              {serviceDetailsData.totalAttendees} atendimentos
            </Text>
          </View>
        </View>

        <DetailCard
          title="Distribuição por Idade"
          icon={<ChartPie width={s(22)} height={s(22)} color="#212121" />}
        >
          <SimpleBarChart
            data={barChartData}
            height={vs(150)}
            barWidth={s(45)}
            spacing={s(25)}
            barColor="#00A859"
          />
          {serviceDetailsData.ageDistribution.map(item => (
            <View key={item.category} style={styles.legendRow}>
              <Text style={styles.legendLabel}>
                {item.category.replace('\n', ' ')}
              </Text>
              <Text style={styles.legendValue}>
                {item.count} ({item.percentage}%)
              </Text>
            </View>
          ))}
        </DetailCard>

        <DetailCard
          title="Distribuição por Sexo"
          icon={<BarChart width={s(22)} height={s(22)} color="#212121" />}
        >
          <View style={styles.pieChartContainer}>
            <PieChart
              data={serviceDetailsData.genderDistribution}
              totalValue={totalGender}
              size={s(180)}
            />
          </View>
          <View style={styles.pieLegend}>
            {serviceDetailsData.genderDistribution.map(item => (
              <View key={item.category} style={styles.legendItem}>
                <View style={styles.legendLabelContainer}>
                  <View
                    style={[styles.legendDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.legendLabel}>{item.category}</Text>
                </View>
                <Text style={styles.legendValue}>
                  {item.count} ({item.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </DetailCard>

        <DetailCard
          title="Distribuição por Prioridade"
          icon={<BarChart color="#333" />}
        >
          <View style={styles.progressSection}>
            {serviceDetailsData.priorityDistribution.map(item => (
              <ProgressBar
                key={item.category}
                label={item.category}
                value={item.count}
                total={totalPriority}
                color={item.color}
              />
            ))}
          </View>
        </DetailCard>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportButton}>
          <OutlineFileDownload color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    paddingTop: vs(20),
    paddingBottom: vs(15),
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(18),
    color: '#333',
    marginLeft: s(15),
  },
  scrollContent: {
    paddingHorizontal: s(15),
    paddingBottom: vs(100),
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    padding: s(15),
    marginBottom: vs(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  cardTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(15),
    color: '#212121',
    marginLeft: s(10),
  },
  detailsTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(15),
    color: '#333',
    marginBottom: vs(12),
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  detailsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#424242',
    marginLeft: s(10),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(6),
    marginTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  legendLabel: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#424242',
  },
  legendValue: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(12),
    color: '#212121',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
  },
  pieLegend: {
    width: '100%',
    marginTop: vs(15),
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  legendLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    marginRight: s(10),
  },
  progressSection: {
    paddingVertical: vs(10),
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  progressLabel: {
    flex: 0.35,
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#424242',
  },
  progressContainer: {
    flex: 0.65,
    height: vs(12),
    backgroundColor: '#EEEEEE',
    borderRadius: ms(6),
    overflow: 'hidden',
    marginHorizontal: s(10),
  },
  progressBar: {
    height: '100%',
    borderRadius: ms(6),
  },
  progressValue: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    color: '#212121',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: s(15),
    paddingBottom: vs(25),
    paddingTop: vs(10),
    backgroundColor: '#ffffffff',
  },
  exportButton: {
    backgroundColor: '#00A859',
    borderRadius: ms(10),
    paddingVertical: vs(14),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  exportButtonText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#FFFFFF',
    marginLeft: s(10),
  },
});
