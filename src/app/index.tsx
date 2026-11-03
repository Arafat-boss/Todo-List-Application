import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Task data type
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoScreen() {
  // Objective 3: Use the useState hook to manage application state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Complete React Native Lab Task',
      completed: false,
      createdAt: 'Today',
    },
    {
      id: '2',
      text: 'Push project to GitHub repository',
      completed: true,
      createdAt: 'Today',
    },
    {
      id: '3',
      text: 'Take screenshots of running app & terminal',
      completed: false,
      createdAt: 'Today',
    },
    {
      id: '4',
      text: 'Submit assignment on Google Classroom',
      completed: false,
      createdAt: 'Today',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Objective 4: Add new tasks dynamically
  const handleAddTask = () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      if (Platform.OS === 'web') {
        alert('Please enter a task description!');
      } else {
        Alert.alert('Empty Task', 'Please enter a task description before adding.');
      }
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: 'Just now',
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  // Objective 6: Mark tasks as completed or incomplete
  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Objective 7: Delete tasks from the list
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Clear all completed tasks
  const handleClearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Objective 8: Display the number of remaining tasks
  const remainingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  // Current formatted date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // FlatList item renderer
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
      {/* Complete/Incomplete Toggle Button */}
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        onPress={() => handleToggleTask(item.id)}
        activeOpacity={0.7}
      >
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Task Content */}
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => handleToggleTask(item.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.taskTime}>{item.createdAt}</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{todayFormatted}</Text>
            <Text style={styles.appTitle}>Todo List</Text>
          </View>
          {/* Objective 8: Prominently displaying remaining tasks */}
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingBadgeNumber}>{remainingCount}</Text>
            <Text style={styles.remainingBadgeLabel}>Remaining</Text>
          </View>
        </View>

        {/* Stats & Progress Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#E11D48' }]}>
                {remainingCount}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#059669' }]}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressText}>{progressPercent}% completed</Text>
            {completedCount > 0 && (
              <TouchableOpacity onPress={handleClearCompleted} activeOpacity={0.7}>
                <Text style={styles.clearCompletedText}>Clear completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Input Bar for adding new tasks */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addButton, !inputText.trim() && styles.addButtonDisabled]}
            onPress={handleAddTask}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as FilterType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, activeFilter === tab && styles.filterPillActive]}
              onPress={() => setActiveFilter(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === tab && styles.filterPillTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {tab === 'all'
                  ? totalCount
                  : tab === 'active'
                  ? remainingCount
                  : completedCount}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Objective 5: Display tasks using FlatList */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'completed'
                  ? 'No completed tasks yet'
                  : activeFilter === 'active'
                  ? 'All tasks are completed!'
                  : 'No tasks added yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all'
                  ? 'Type in the box above and tap + Add to create your first task.'
                  : 'Switch filters or add new tasks.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  remainingBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  remainingBadgeNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  remainingBadgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E0E7FF',
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  clearCompletedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  inputCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    paddingLeft: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1F2937',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#F9FAFB',
    opacity: 0.85,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 20,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
