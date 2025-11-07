import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

import api from '../../services/endpont';

import {
  BackPage,
  OutlineCalendarToday,
  LocationPin,
  UsersGroup,
  BarChart,
  OutlineFileDownload,
} from '../../components/Icons/Icons';
import Toolbar from '../../components/ui/Toolbar';

// ------------------------------
// COMPONENTES
// ------------------------------
const DetailCard = ({ title, icon, children }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      {icon}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Barra horizontal para Sexo
const HorizontalBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>

      <View style={styles.barContainer}>
        <View
          style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]}
        />
      </View>

      <Text style={styles.barValue}>{value}</Text>
    </View>
  );
};

// Barra Progress para Prioridade
const ProgressBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${pct}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );
};

// ========================================================
// TELA PRINCIPAL
// ========================================================
export default function ServiceDetailsScreen({ route, navigation }) {
  const { serviceName, eventId } = route.params;

  const [details, setDetails] = useState(null);

  // 🔎 NORMALIZE igual ao da ReportScreen
  const normalize = name => {
    const n = (name || '').toUpperCase();
    if (n.includes('OFTAL')) return 'OFTALMOLOGIA';
    if (n.includes('ODONTO')) return 'ODONTOLOGIA';
    if (n.includes('ENFER')) return 'ENFERMAGEM';
    if (n.includes('CORTE') || n.includes('CABELO')) return 'CORTE DE CABELO';
    if (n.includes('MAQUI')) return 'MAQUIAGEM';
    if (n.includes('OCULO') || n.includes('ÓCULO')) return 'ENTREGA DE ÓCULOS';
    return null;
  };

  useEffect(() => {
    async function loadDetails() {
      try {
        const response = await api.patchEventsServices(eventId, '', []);
        const eventServices = response.data.eventServices || [];

        const selectedService = eventServices.find(
          svc => normalize(svc.name) === serviceName,
        );

        if (!selectedService) {
          console.log('❌ Serviço não encontrado:', serviceName);
          return;
        }

        const participants = selectedService.participants || [];

        const sexoCount = {
          Masculino: participants.filter(p => p.sexo === 'Masculino').length,
          Feminino: participants.filter(p => p.sexo === 'Feminino').length,
        };

        const sexoChart = [
          { category: 'Feminino', count: sexoCount.Feminino, color: '#00A859' },
          {
            category: 'Masculino',
            count: sexoCount.Masculino,
            color: '#e42727ff',
          },
        ];

        const prioridadeMap = {};
        participants.forEach(p => {
          const key = p.prioritie_name || 'Normal';
          prioridadeMap[key] = (prioridadeMap[key] || 0) + 1;
        });

        const prioridadeChart = Object.entries(prioridadeMap).map(
          ([category, count]) => ({
            category,
            count,
            color: '#f5bc42ff',
          }),
        );

        setDetails({
          total: participants.length,
          sexo: sexoChart,
          prioridade: prioridadeChart,
          location: response.data.city || '--',
          date: response.data.date || '--',
        });
      } catch (err) {
        console.log('Erro ao carregar detalhes:', err);
      }
    }

    loadDetails();
  }, [eventId, serviceName]);

  if (!details) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  const totalGender = details.sexo.reduce((s, item) => s + item.count, 0);
  const totalPriority = details.prioridade.reduce(
    (s, item) => s + item.count,
    0,
  );

  return (
    <View style={styles.container}>
      <Toolbar
        title="Detalhes de atendimento"
        iconColor="#2e2e2eff"
        titleColor="#535353ff"
        onNavigate={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.detailsTitle}>Detalhes - {serviceName}</Text>

          <View style={styles.detailsRow}>
            <LocationPin width={s(14)} height={s(14)} color="#757575" />
            <Text style={styles.detailsText}>{details.location}</Text>
          </View>

          <View style={styles.detailsRow}>
            <OutlineCalendarToday
              width={s(14)}
              height={s(14)}
              color="#757575"
            />
            <Text style={styles.detailsText}>{details.date}</Text>
          </View>

          <View style={styles.detailsRow}>
            <UsersGroup width={s(14)} height={s(14)} color="#757575" />
            <Text style={styles.detailsText}>{details.total} atendimentos</Text>
          </View>
        </View>

        <DetailCard
          title="Distribuição por Sexo"
          icon={<BarChart width={s(22)} height={s(22)} color="#212121" />}
        >
          {details.sexo.map(item => (
            <HorizontalBar
              key={item.category}
              label={item.category}
              value={item.count}
              total={totalGender}
              color={item.color}
            />
          ))}
        </DetailCard>

        <DetailCard
          title="Distribuição por Prioridade"
          icon={<BarChart width={s(22)} height={s(22)} color="#212121" />}
        >
          <View style={styles.progressSection}>
            {details.prioridade.map(item => (
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

      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.exportButton}>
          <OutlineFileDownload color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    paddingTop: vs(20),
    paddingBottom: vs(15),
  },
  headerTitle: {
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
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  cardTitle: {
    fontSize: ms(15),
    color: '#212121',
    marginLeft: s(10),
  },

  detailsTitle: {
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
    fontSize: ms(14),
    color: '#424242',
    marginLeft: s(10),
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  barLabel: {
    flex: 0.35,
    fontSize: ms(14),
    color: '#444',
  },
  barContainer: {
    flex: 0.65,
    height: vs(12),
    backgroundColor: '#E0E0E0',
    borderRadius: ms(6),
    overflow: 'hidden',
    marginHorizontal: s(10),
  },
  barFill: {
    height: '100%',
    borderRadius: ms(6),
  },
  barValue: {
    fontSize: ms(14),
    color: '#333',
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
    backgroundColor: '#fff',
  },
  exportButton: {
    backgroundColor: '#00A859',
    borderRadius: ms(10),
    paddingVertical: vs(14),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: ms(14),
    color: '#FFFFFF',
    marginLeft: s(10),
  },
});
