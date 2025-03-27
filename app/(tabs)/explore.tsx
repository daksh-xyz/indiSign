import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { db } from '@/db/firebaseConfig';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const { width } = Dimensions.get('window');
const OPTION_IMAGE_SIZE = Math.min(width * 0.75, 120); // Reduced image size for side-by-side layout

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedQuestions, setFetchedQuestions] = useState<Question[]>([]);
  const colorScheme = useColorScheme();


  interface Question {
    id: string;
    question: string;
    options: Array<{ text: string; image: string }>;
    correctAnswer: string;
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Questions"));
        const transformedQuestions: Question[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            question: data.Question,
            options: [
              { text: "A", image: data.OptionA },
              { text: "B", image: data.OptionB },
              { text: "C", image: data.OptionC },
              { text: "D", image: data.OptionD },
            ],
            correctAnswer: data.CorrectAnswer
          };
        });
        setFetchedQuestions(transformedQuestions);
        setError(null);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = fetchedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === fetchedQuestions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{fetchedQuestions.length}
          </Text>
          <Text style={styles.resultPercentage}>
            ({Math.round((score / fetchedQuestions.length) * 100)}%)
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {fetchedQuestions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestionIndex + 1) / fetchedQuestions.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {currentQuestion?.question && (
          <Text style={styles.question}>{currentQuestion.question}</Text>
        )}
        
        <View style={styles.optionsContainer}>
          {currentQuestion?.options?.map((option, index) => (
            <TouchableOpacity
              key={`${currentQuestion.id}-${index}`}
              style={[
                styles.optionButton,
                selectedAnswer === option.text && styles.selectedOption,
                selectedAnswer && option.text === currentQuestion.correctAnswer && styles.correctOption,
                selectedAnswer && selectedAnswer === option.text && selectedAnswer !== currentQuestion.correctAnswer && styles.wrongOption,
              ]}
              onPress={() => handleAnswerSelect(option.text)}
              disabled={selectedAnswer !== null}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedAnswer === option.text && styles.selectedOptionText,
                    ]}
                  >
                    {option.text}
                  </Text>
                </View>
                <Image
                  source={{ uri: option.image }}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  progressContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    color: isDark ? '#ffffff' : '#000000',
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: isDark ? '#333333' : '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: isDark ? '#ffffff' : '#000000',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    backgroundColor: isDark ? '#333333' : '#ffffff',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: OPTION_IMAGE_SIZE,
  },
  optionImage: {
    width: '70%',
    height: OPTION_IMAGE_SIZE,
  },
  optionTextContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: '#007AFF',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    borderColor: '#FF3B30',
    backgroundColor: '#FF3B30',
  },
  optionText: {
    fontSize: 18,
    color: isDark ? '#ffffff' : '#000000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: isDark ? '#333333' : '#cccccc',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDark ? '#ffffff' : '#000000',
  },
  resultScore: {
    fontSize: 24,
    marginBottom: 8,
    color: isDark ? '#ffffff' : '#000000',
  },
  resultPercentage: {
    fontSize: 20,
    marginBottom: 32,
    color: isDark ? '#ffffff' : '#000000',
  },
  restartButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    color: isDark ? '#ffffff' : '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  }
});