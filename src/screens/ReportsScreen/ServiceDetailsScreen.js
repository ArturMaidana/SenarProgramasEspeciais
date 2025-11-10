import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import api from '../../services/endpont';

import {
  OutlineCalendarToday,
  LocationPin,
  UsersGroup,
  BarChart,
} from '../../components/Icons/Icons';
import Toolbar from '../../components/ui/Toolbar';

const screenWidth = Dimensions.get('window').width;

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

export default function ServiceDetailsScreen({ route, navigation }) {
  const { serviceName, eventId, date, location } = route.params;

  const [details, setDetails] = useState(null);

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
          setDetails({
            total: 0,
            sexo: [],
            prioridade: [],
            location: location || '--',
            date: date || '--',
          });
          return;
        }

        const participants = selectedService.participants || [];

        const sexoCount = {
          Masculino: participants.filter(p => p.sexo === 'Masculino').length,
          Feminino: participants.filter(p => p.sexo === 'Feminino').length,
        };

        const sexoChartData = [
          {
            name: 'Feminino',
            population: sexoCount.Feminino,
            color: '#00A859',
            legendFontColor: '#424242',
            legendFontSize: ms(14),
          },
          {
            name: 'Masculino',
            population: sexoCount.Masculino,
            color: '#e42727ff',
            legendFontColor: '#424242',
            legendFontSize: ms(14),
          },
        ];

        const prioridadeMap = {};
        participants.forEach(p => {
          const key = p.prioritie_name || 'Normal';
          prioridadeMap[key] = (prioridadeMap[key] || 0) + 1;
        });

        const prioridadeItens = Object.entries(prioridadeMap).map(
          ([category, count]) => ({
            category,
            count,
            color: '#f5bc42ff',
          }),
        );

        const sortedPrioridade = prioridadeItens.sort(
          (a, b) => b.count - a.count,
        );

        setDetails({
          total: participants.length,
          sexo: sexoChartData,
          prioridade: sortedPrioridade,
          location: location || '--',
          date: date || '--',
        });
      } catch (err) {
        console.log('Erro ao carregar detalhes:', err);
        setDetails({
          total: 0,
          sexo: [],
          prioridade: [],
          location: location || '--',
          date: date || '--',
        });
      }
    }

    loadDetails();
  }, [eventId, serviceName, date, location]);

  if (!details) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  const totalPriority = details.prioridade.reduce(
    (s, item) => s + item.count,
    0,
  );

  const totalGender = details.sexo.reduce((s, item) => s + item.population, 0);

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
          {totalGender > 0 ? (
            <RNPieChart
              data={details.sexo}
              width={screenWidth - s(60)}
              height={vs(180)}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              center={[s(10), 0]}
              absolute
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.noDataText}>Sem dados de sexo.</Text>
          )}
        </DetailCard>

        <DetailCard
          title="Distribuição por Prioridade"
          icon={<BarChart width={s(22)} height={s(22)} color="#212121" />}
        >
          {details.prioridade.length > 0 ? (
            <View style={styles.progressContainer}>
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
          ) : (
            <Text style={styles.noDataText}>Sem dados de prioridade.</Text>
          )}
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
  // Estilo do PieChart
  chartStyle: {
    marginVertical: vs(8),
    borderRadius: ms(12),
    alignItems: 'center', // Centraliza o PieChart
  },
  noDataText: {
    fontSize: ms(14),
    color: '#757575',
    textAlign: 'center',
    paddingVertical: vs(20),
  },

  // Estilos da Tela
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

  progressContainer: {
    paddingTop: vs(5),
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  barLabel: {
    flex: 0.35, // 35%
    fontSize: ms(14),
    color: '#444',
  },
  barContainer: {
    flex: 0.5, // 50%
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
    flex: 0.15, // 15%
    fontSize: ms(14),
    color: '#333',
    textAlign: 'right',
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

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 168, 89, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`,
  style: {
    borderRadius: 12,
  },
};
