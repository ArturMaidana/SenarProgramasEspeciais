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

import {
  OutlineCalendarToday,
  LocationPin,
  UsersGroup,
  BaselineElectricBolt,
  BaselineCallMissedOutgoing,
  OutlineFileDownload,
  BackPage,
} from '../../components/Icons/Icons';

const reportData = {
  title: 'Mutirão Rural - Nº 2025M1620091219T - Alta Floresta',
  date: '12 de Agosto de 2025',
  location: 'Alta Floresta, MT',
  totalAttendees: 1050,
  services: [
    { name: 'Oftalmologia', percentage: 20, count: 410 },
    { name: 'Odontologia', percentage: 12, count: 273 },
    { name: 'Enfermagem', percentage: 19, count: 252 },
    { name: 'Barbearia', percentage: 6, count: 115 },
    { name: 'Confecção de Óculos', percentage: 3, count: 15 },
  ],
};

const ReportCard = ({ title, icon, children }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      {icon}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function ReportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackPage color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório de Atendimentos</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.statsTitle}>Estatísticas Médicas</Text>
          <Text style={styles.statsSubtitle}>{reportData.title}</Text>
          <View style={styles.statsRow}>
            <OutlineCalendarToday color="#757575" />
            <Text style={styles.statsText}>{reportData.date}</Text>
          </View>
          <View style={styles.statsRow}>
            <LocationPin color="#757575" />
            <Text style={styles.statsText}>{reportData.location}</Text>
          </View>
          <View style={styles.statsRow}>
            <UsersGroup color="#757575" />
            <Text style={styles.statsText}>
              {reportData.totalAttendees} atendimentos
            </Text>
          </View>
        </View>

        <ReportCard
          title="Distribuição de Atendimentos"
          icon={<BaselineElectricBolt color="#333" />}
        >
          <View style={styles.chartWrapper}>
            <PieChart
              data={reportData.services}
              totalValue={reportData.totalAttendees}
              size={s(180)}
            />
          </View>
        </ReportCard>

        <View style={styles.sectionHeader}>
          <BaselineCallMissedOutgoing
            width={s(22)}
            height={s(22)}
            color="#212121"
          />
          <Text style={styles.cardTitle}>Tipos de Atendimento</Text>
        </View>

        {reportData.services.map(service => (
          <TouchableOpacity
            key={service.name}
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate('ServiceDetails', {
                serviceName: service.name,
              })
            }
          >
            <View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePercentage}>
                {service.percentage}% do total
              </Text>
            </View>
            <View style={styles.serviceCountContainer}>
              <Text style={styles.serviceCount}>{service.count}</Text>
              <Text style={styles.serviceCountLabel}>atendimentos</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportButton}>
          <OutlineFileDownload width={s(20)} height={s(20)} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    paddingTop: ms(20),
    paddingBottom: vs(20),
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(18),
    color: '#212121',
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
  statsTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(15),
    color: '#333',
    marginBottom: vs(4),
  },
  statsSubtitle: {
    fontFamily: 'Ubuntu-Light',
    fontSize: ms(13),
    color: '#000000ff',
    marginBottom: vs(12),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  statsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#424242',
    marginLeft: s(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  cardTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(15),
    color: '#333',
    marginLeft: s(10),
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
    marginLeft: s(5),
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    padding: s(15),
    marginBottom: vs(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceName: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    color: '#333',
  },
  servicePercentage: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(13),
    color: '#757575',
    marginTop: vs(4),
  },
  serviceCountContainer: {
    alignItems: 'flex-end',
  },
  serviceCount: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    color: '#333',
  },
  serviceCountLabel: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(13),
    color: '#757575',
    marginTop: vs(2),
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
