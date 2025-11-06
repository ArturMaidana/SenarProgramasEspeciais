import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import PieChart from '../../components/PieChart';
import api from '../../services/endpont';
import { useRoute } from '@react-navigation/native';

import {
  OutlineCalendarToday,
  LocationPin,
  UsersGroup,
  BaselineElectricBolt,
  BaselineCallMissedOutgoing,
  OutlineFileDownload,
  BackPage,
} from '../../components/Icons/Icons';

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
  const route = useRoute();
  const { eventId } = route.params; // ✅ ID do mutirão selecionado

  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await api.getShowEvent(eventId);
        const data = response?.data;

        if (!data) {
          console.log('❌ Nenhum dado retornado da API');
          return;
        }

        const event = data.event || {};
        const categories = data.services_category || [];

        const title = event.name || 'Evento';
        const date = new Date(event.started_at).toLocaleDateString('pt-BR');
        const location = `${event.city || 'Cidade não informada'}, MT`;

        // ✅ total geral
        const total = categories.reduce(
          (acc, c) => acc + (c.participants?.length || 0),
          0,
        );

        // ✅ distribuição por categoria
        const services = categories.map(c => {
          const count = c.participants?.length || 0;
          const pct =
            total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;

          return {
            name: c.name,
            count,
            percentage: pct,
          };
        });

        setReport({
          title,
          date,
          location,
          totalAttendees: total,
          services,
        });
      } catch (err) {
        console.log('Erro ao carregar relatório:', err);
      }
    }

    loadReport();
  }, [eventId]);
  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando relatório...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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
        {/* CARD PRINCIPAL */}
        <View style={styles.cardContainer}>
          <Text style={styles.statsTitle}>Estatísticas Médicas</Text>
          <Text style={styles.statsSubtitle}>{report.title}</Text>

          <View style={styles.statsRow}>
            <OutlineCalendarToday color="#757575" />
            <Text style={styles.statsText}>{report.date}</Text>
          </View>

          <View style={styles.statsRow}>
            <LocationPin color="#757575" />
            <Text style={styles.statsText}>{report.location}</Text>
          </View>

          <View style={styles.statsRow}>
            <UsersGroup color="#757575" />
            <Text style={styles.statsText}>
              {report.totalAttendees} atendimentos
            </Text>
          </View>
        </View>

        {/* GRÁFICO */}
        <ReportCard
          title="Distribuição de Atendimentos"
          icon={<BaselineElectricBolt color="#333" />}
        >
          <View style={styles.chartWrapper}>
            <PieChart
              data={report.services}
              totalValue={report.totalAttendees}
              size={s(180)}
            />
          </View>
        </ReportCard>

        {/* LISTA DE TIPOS */}
        <View style={styles.sectionHeader}>
          <BaselineCallMissedOutgoing
            width={s(22)}
            height={s(22)}
            color="#212121"
          />
          <Text style={styles.cardTitle}>Tipos de Atendimento</Text>
        </View>

        {report.services.map(service => (
          <TouchableOpacity key={service.name} style={styles.serviceCard}>
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

      {/* BOTÃO PDF */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportButton}>
          <OutlineFileDownload width={s(20)} height={s(20)} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* --- STYLES --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Ubuntu-Regular', fontSize: 16, color: '#555' },
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
    color: '#000',
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
  serviceCountContainer: { alignItems: 'flex-end' },
  serviceCount: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    color: '#333',
  },
  serviceCountLabel: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(13),
    color: '#757575',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: s(15),
    paddingBottom: vs(25),
    paddingTop: vs(10),
    backgroundColor: '#fff',
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
