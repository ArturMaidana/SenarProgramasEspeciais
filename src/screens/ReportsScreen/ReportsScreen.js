import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import PieChart from '../../components/ui/PieChart';
import api from '../../services/endpont';
import { useRoute } from '@react-navigation/native';

import {
  BaselineElectricBolt,
  BaselineCallMissedOutgoing,
  CalendarFill,
  MapPin,
  PeopleFilled,
} from '../../components/Icons/Icons';
import Toolbar from '../../components/ui/Toolbar';

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
  const { eventId } = route.params || {};

  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await api.patchEventsServices(eventId, '', []);
        console.log('🔍 Dados completos do serviço clicado:', response.data);

        const data = response.data;
        const categoriesRaw = data.eventServices || [];

        const firstEvent = data.eventServices?.[0];

        function extractLocation(eventName) {
          if (!eventName) return 'Local não informado';

          const parts = eventName.split(':');
          return parts.length > 1 ? parts[1].trim() : 'Local não informado';
        }

        const location = extractLocation(firstEvent?.event_name);

        const rawDate = firstEvent?.date;

        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : '--/--/----';

        const CATEGORIES_ORDER = [
          'OFTALMOLOGIA',
          'ODONTOLOGIA',
          'ENFERMAGEM',
          'CORTE DE CABELO',
          'MAQUIAGEM',
          'ENTREGA DE ÓCULOS',
        ];

        const normalize = (name = '') => {
          const n = name.toString().trim().toUpperCase();

          if (n.includes('OFTAL')) return 'OFTALMOLOGIA';
          if (n.includes('ODONTO')) return 'ODONTOLOGIA';
          if (n.includes('ENFER')) return 'ENFERMAGEM';
          if (n.includes('CORTE') || n.includes('CABELO'))
            return 'CORTE DE CABELO';
          if (n.includes('MAQUI')) return 'MAQUIAGEM';
          if (n.includes('OCULO') || n.includes('ÓCULO'))
            return 'ENTREGA DE ÓCULOS';

          return null;
        };

        const categoryMap = {};

        categoriesRaw.forEach(cat => {
          categoriesRaw.forEach(cat => {
            console.log('🟩 Serviço:', cat.name);
            console.log('🟦 Lista completa de participants:', cat.participants);
          });

          const nameKey = normalize(cat.name);
          if (!nameKey) return;

          let count = Array.isArray(cat.participants)
            ? cat.participants.length
            : 0;

          categoryMap[nameKey] = count;
        });

        const services = CATEGORIES_ORDER.map(catName => ({
          name: catName,
          count: categoryMap[catName] || 0,
        }));

        const total = services.reduce((acc, c) => acc + c.count, 0);

        const servicesWithPct = services.map(s => ({
          ...s,
          percentage: total > 0 ? ((s.count / total) * 100).toFixed(1) : 0,
        }));

        setReport({
          title: firstEvent?.event_name || 'Mutirão Rural',

          date: formattedDate,
          location: location,

          totalAttendees: total,
          services: servicesWithPct,
        });
      } catch (err) {
        console.log('Erro relatório:', err);
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
      <Toolbar
        title="Relatório de Atendimentos"
        iconColor="#2e2e2eff"
        titleColor="#535353ff"
        onNavigate={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.statsTitle}>Estatísticas Mutirão Rural</Text>

          <View style={styles.statsRow}>
            <CalendarFill color="#00A859" />
            <Text style={styles.statsText}>{report.date}</Text>
          </View>

          <View style={styles.statsRow}>
            <MapPin color="#00A859" />
            <Text style={styles.statsText}>{report.location}</Text>
          </View>

          <View style={styles.statsRow}>
            <PeopleFilled color="#00A859" />
            <Text style={styles.statsText}>
              {report.totalAttendees} atendimentos
            </Text>
          </View>
        </View>

        <ReportCard
          title="Distribuição de Atendimentos"
          icon={<BaselineElectricBolt color="#00A859" />}
        >
          <View style={styles.chartWrapper}>
            <PieChart
              data={report.services}
              totalValue={report.totalAttendees}
              size={s(180)}
            />
          </View>
        </ReportCard>

        <View style={styles.sectionHeader}>
          <BaselineCallMissedOutgoing
            width={s(22)}
            height={s(22)}
            color="#00A859"
          />
          <Text style={styles.cardTitle}>Tipos de Atendimento</Text>
        </View>

        {report.services.map(service => (
          <TouchableOpacity
            key={service.name}
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate('ServiceDetails', {
                serviceName: service.name,
                eventId: eventId,
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

      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.exportButton}>
          <OutlineFileDownload width={s(20)} height={s(20)} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    paddingTop: ms(20),
    paddingBottom: vs(20),
  },
  headerTitle: {
    fontWeight: 'normal',
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
    elevation: 4,
    marginTop: 10,
  },
  statsTitle: {
    fontWeight: '600',
    fontSize: ms(15),
    color: '#333',
    marginBottom: vs(4),
  },
  statsSubtitle: {
    fontWeight: 'normal',
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
    fontWeight: 'normal',
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
    fontWeight: '600',
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
    marginBottom: vs(10),
    marginLeft: s(5),
    marginTop: 20,
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
    fontWeight: '600',
    fontSize: ms(14),
    color: '#333',
  },
  servicePercentage: {
    fontWeight: 'normal',
    fontSize: ms(13),
    color: '#757575',
    marginTop: vs(4),
  },
  serviceCountContainer: {
    alignItems: 'flex-end',
  },
  serviceCount: {
    fontWeight: 'bold',
    fontSize: ms(16),
    color: '#00A859',
  },
  serviceCountLabel: {
    fontWeight: 'normal',
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
    fontWeight: 'normal',
    fontSize: ms(14),
    color: '#FFFFFF',
    marginLeft: s(10),
  },
});
