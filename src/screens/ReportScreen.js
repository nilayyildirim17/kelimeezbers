import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const ReportScreen = () => {
  const [report, setReport] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    const fileUri = FileSystem.documentDirectory + 'words.json';
    const storedQuestions = await FileSystem.readAsStringAsync(fileUri);
    const questionsArray = JSON.parse(storedQuestions);
    const countCorrectAnswers = questionsArray.filter(q => q.correct).length;
    const totalQuestionCount = questionsArray.length;
    const successRate = ((countCorrectAnswers / totalQuestionCount) * 100).toFixed(2);

    setCorrectCount(countCorrectAnswers);
    setTotalCount(totalQuestionCount);

    const reportText = `Başarı Oranı: ${successRate}%\nDoğru Cevaplanan Soru Sayısı: ${countCorrectAnswers}\nToplam Soru Sayısı: ${totalQuestionCount}\nToplam Çözülen Soru Sayısı: ${totalQuestionCount}`;
    setReport(reportText);
  };

  const shareReport = async () => {
    const fileUri = FileSystem.documentDirectory + 'report.txt';
    await FileSystem.writeAsStringAsync(fileUri, report);
    await shareAsync(fileUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.reportText}>{report}</Text>
      <Button title="Raporu Paylaş" onPress={shareReport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  reportText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ReportScreen;
