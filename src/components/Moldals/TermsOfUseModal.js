import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';

import { ShieldCheckIcon } from '../Icons/Icons';

const CloseIcon = () => (
  <Text style={{ fontSize: 24, color: '#333', fontWeight: '300' }}>×</Text>
);

export default function TermsOfUseModal({ isVisible, onClose }) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.5}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionOutTiming={1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <ShieldCheckIcon width={22} height={22} />
            <Text style={styles.headerTitle}>Termos de Uso</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title}>
            Termos de Uso – Aplicativo Senar Mutirão
          </Text>
          <Text style={styles.subtitle}>
            Última atualização: outubro de 2025
          </Text>

          <Text style={styles.paragraph}>
            Bem-vindo ao Senar Mutirão, aplicativo oficial do Serviço Nacional
            de Aprendizagem Rural de Mato Grosso (SENAR-MT).
          </Text>
          <Text style={styles.paragraph}>
            Ao utilizar o aplicativo, você concorda com os presentes Termos de
            Uso, que têm como objetivo informar as condições de utilização e as
            responsabilidades envolvidas no acesso e uso dos serviços
            oferecidos.
          </Text>

          <Text style={styles.sectionTitle}>1. Sobre o aplicativo</Text>
          <Text style={styles.paragraph}>
            O Senar Mutirão é uma plataforma criada para facilitar o acesso às
            informações sobre os mutirões realizados e em andamento pelo
            SENAR-MT, permitindo a visualização de dados e o cadastro de
            participantes nas ações promovidas, como atendimentos de
            oftalmologia, odontologia, enfermagem, corte de cabelo, maquiagem,
            confecção de óculos, entre outros serviços.
          </Text>

          <Text style={styles.sectionTitle}>2. Aceitação dos Termos</Text>
          <Text style={styles.paragraph}>
            Ao acessar ou utilizar o aplicativo, o usuário declara ter lido,
            compreendido e concordado integralmente com estes Termos de Uso.
            Caso não concorde com qualquer parte, o usuário deve interromper o
            uso do aplicativo.
          </Text>

          <Text style={styles.sectionTitle}>3. Cadastro e Dados Pessoais</Text>
          <Text style={styles.paragraph}>
            Para participar de mutirões e registrar atendimentos, o aplicativo
            poderá solicitar dados pessoais, como:
          </Text>
          <Text style={styles.bullet}>• Nome completo</Text>
          <Text style={styles.bullet}>• CPF</Text>
          <Text style={styles.bullet}>• Data de nascimento</Text>
          <Text style={styles.bullet}>• Endereço</Text>
          <Text style={styles.bullet}>
            • Informações de contato (telefone, e-mail)
          </Text>
          <Text style={styles.bullet}>
            • Dados de atendimento ou serviço prestado
          </Text>
          <Text style={styles.paragraph}>
            Esses dados são coletados exclusivamente para fins de identificação,
            controle e registro das atividades do SENAR-MT, respeitando a Lei
            Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
          </Text>
          <Text style={styles.paragraph}>
            O SENAR-MT compromete-se a não compartilhar, vender ou divulgar os
            dados pessoais dos usuários a terceiros sem autorização, exceto
            quando exigido por lei.
          </Text>

          <Text style={styles.sectionTitle}>
            4. Responsabilidades do Usuário
          </Text>
          <Text style={styles.paragraph}>O usuário se compromete a:</Text>
          <Text style={styles.bullet}>
            • Fornecer informações verdadeiras, completas e atualizadas durante
            o cadastro;
          </Text>
          <Text style={styles.bullet}>
            • Utilizar o aplicativo apenas para os fins propostos e de forma
            ética;
          </Text>
          <Text style={styles.bullet}>
            • Não tentar acessar informações, áreas restritas ou sistemas de
            terceiros sem autorização;
          </Text>
          <Text style={styles.bullet}>
            • Não praticar atos que possam comprometer o funcionamento, a
            segurança ou a integridade do aplicativo.
          </Text>

          <Text style={styles.sectionTitle}>
            5. Responsabilidades do SENAR-MT
          </Text>
          <Text style={styles.paragraph}>O SENAR-MT:</Text>
          <Text style={styles.bullet}>
            • Pode atualizar ou modificar o aplicativo a qualquer momento, com o
            objetivo de melhorar a experiência e os serviços oferecidos;
          </Text>
          <Text style={styles.bullet}>
            • Não se responsabiliza por indisponibilidades temporárias, falhas
            de conexão ou uso indevido do aplicativo por terceiros;
          </Text>
          <Text style={styles.bullet}>
            • Garante a proteção dos dados pessoais armazenados, adotando
            medidas de segurança adequadas para evitar acessos não autorizados.
          </Text>

          <Text style={styles.sectionTitle}>
            6. Direitos de Propriedade Intelectual
          </Text>
          <Text style={styles.paragraph}>
            Todo o conteúdo disponível no aplicativo, incluindo textos, imagens,
            logotipos, ícones, layout e informações, é de propriedade do
            SENAR-MT e protegido por leis de direitos autorais e propriedade
            intelectual.
          </Text>
          <Text style={styles.paragraph}>
            É proibida qualquer reprodução, modificação ou distribuição sem
            autorização prévia e expressa do SENAR-MT.
          </Text>

          <Text style={styles.sectionTitle}>
            7. Alterações dos Termos de Uso
          </Text>
          <Text style={styles.paragraph}>
            O SENAR-MT poderá alterar estes Termos de Uso a qualquer momento. As
            alterações entrarão em vigor assim que publicadas no aplicativo.
          </Text>
          <Text style={styles.paragraph}>
            O uso contínuo do aplicativo após as alterações será considerado
            como aceitação das novas condições.
          </Text>

          <Text style={styles.sectionTitle}>8. Contato</Text>
          <Text style={styles.paragraph}>
            Em caso de dúvidas, solicitações ou reclamações relacionadas ao uso
            do aplicativo ou ao tratamento de dados pessoais, entre em contato
            com o SENAR-MT por meio dos canais oficiais:
          </Text>
          <Text style={styles.paragraph}>
            📧 E-mail: [inserir e-mail oficial do SENAR-MT]
          </Text>
          <Text style={styles.paragraph}>
            🌐 Site: https://www.senarmt.org.br
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 15,
    color: '#212121',
    marginLeft: 10,
  },
  scrollView: {},
  title: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 12,
    color: '#757575',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 13,
    color: '#000000ff',
    lineHeight: 22,
    marginBottom: 12,
  },
  bullet: {
    fontFamily: 'Ubuntu-Light',
    fontSize: 14,
    color: '#000000ff',
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 10,
  },
});
