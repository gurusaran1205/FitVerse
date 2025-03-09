import AsyncStorage from '@react-native-async-storage/async-storage';

// Save Streak Data
const saveStreakData = async (streak, lastCompletedDate, highestStreak) => {
  try {
    await AsyncStorage.setItem('currentStreak', JSON.stringify(streak));
    await AsyncStorage.setItem('lastCompletedDate', lastCompletedDate);
    await AsyncStorage.setItem('highestStreak', JSON.stringify(highestStreak));
  } catch (error) {
    console.log('Error saving streak data:', error);
  }
};

// Get Streak Data
const getStreakData = async () => {
  try {
    const streak = await AsyncStorage.getItem('currentStreak');
    const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
    const highestStreak = await AsyncStorage.getItem('highestStreak');
    return {
      currentStreak: streak ? JSON.parse(streak) : 0,
      lastCompletedDate: lastCompletedDate || null,
      highestStreak: highestStreak ? JSON.parse(highestStreak) : 0,
    };
  } catch (error) {
    console.log('Error retrieving streak data:', error);
    return { currentStreak: 0, lastCompletedDate: null, highestStreak: 0 };
  }
};

// Update Streak Logic
const updateStreak = async () => {
  const { currentStreak, lastCompletedDate, highestStreak } = await getStreakData();
  const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

  // If already logged today, return
  if (lastCompletedDate === today) {
    console.log('Already logged today! ✅');
    return;
  }

  // Check if last completed date was yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = currentStreak;

  if (lastCompletedDate === yesterdayStr) {
    newStreak += 1; // Continue streak
  } else {
    newStreak = 1; // Reset streak if user missed a day
  }

  const newHighestStreak = Math.max(newStreak, highestStreak);

  // Save updated streak
  await saveStreakData(newStreak, today, newHighestStreak);
  console.log(`🔥 Streak Updated! Current Streak: ${newStreak}, Highest: ${newHighestStreak}`);
};

export { saveStreakData, getStreakData, updateStreak };
