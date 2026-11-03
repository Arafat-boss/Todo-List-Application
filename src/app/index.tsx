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
    weekday: 'short',
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
        {/* Modern Top Navbar */}
        <View style={styles.navbar}>
          <View style={styles.navLeft}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>✓</Text>
            </View>
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.navTitle}>Todo List</Text>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>LAB 1</Text>
                </View>
              </View>
              <Text style={styles.navSubtitle}>{todayFormatted}</Text>
            </View>
          </View>

          {/* Objective 8: Prominently displaying remaining tasks in Navbar */}
          <View style={styles.navRight}>
            <View style={styles.remainingPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.remainingPillText}>
                {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left
              </Text>
            </View>
          </View>
        </View>

        {/* Stats & Progress Overview */}
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
            <Text style={styles.progressDetail}>
              {completedCount} of {totalCount} tasks
            </Text>
          </View>
        </View>

        {/* Input Bar for adding new tasks */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?..."
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
                  : 'Switch filters below or add new tasks.'}
              </Text>
            </View>
          }
        />

        {/* Modern Bottom Dock & Footer */}
        <View style={styles.footerWrapper}>
          {/* Bottom Dock Navigation Tabs */}
          <View style={styles.dockBar}>
            <TouchableOpacity
              style={[styles.dockTab, activeFilter === 'all' && styles.dockTabActive]}
              onPress={() => setActiveFilter('all')}
              activeOpacity={0.7}
            >
              <Text style={styles.dockTabIcon}>📋</Text>
              <Text style={[styles.dockTabText, activeFilter === 'all' && styles.dockTabTextActive]}>
                All ({totalCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dockTab, activeFilter === 'active' && styles.dockTabActive]}
              onPress={() => setActiveFilter('active')}
              activeOpacity={0.7}
            >
              <Text style={styles.dockTabIcon}>⏳</Text>
              <Text style={[styles.dockTabText, activeFilter === 'active' && styles.dockTabTextActive]}>
                Pending ({remainingCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dockTab, activeFilter === 'completed' && styles.dockTabActive]}
              onPress={() => setActiveFilter('completed')}
              activeOpacity={0.7}
            >
              <Text style={styles.dockTabIcon}>✅</Text>
              <Text style={[styles.dockTabText, activeFilter === 'completed' && styles.dockTabTextActive]}>
                Done ({completedCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Bottom Bar with Branding & Clear Action */}
          <View style={styles.footerBottomBar}>
            <Text style={styles.footerCredit}>
              Designed by <Text style={styles.footerAuthor}>Arafat Sarker</Text>
            </Text>
            {completedCount > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearCompleted}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>🗑 Clear Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },

  /* Modern Top Navbar */
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  tagBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tagText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  navSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  navRight: {
    alignItems: 'flex-end',
  },
  remainingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  remainingPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },

  /* Stats Card */
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F1F5F9',
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
    fontWeight: '700',
    color: '#059669',
  },
  progressDetail: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },

  /* Input Card */
  inputCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 6,
    paddingLeft: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* List */
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CBD5E1',
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
    color: '#1E293B',
    lineHeight: 20,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
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
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  /* Modern Bottom Dock & Footer */
  footerWrapper: {
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#F8FAFC',
  },
  dockBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dockTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
  },
  dockTabActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  dockTabIcon: {
    fontSize: 14,
  },
  dockTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  dockTabTextActive: {
    color: '#FFFFFF',
  },
  footerBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  footerCredit: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  footerAuthor: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
});
