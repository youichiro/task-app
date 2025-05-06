import { useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import InfinitePager from 'react-native-infinite-pager';
import {
  addMonths,
  startOfDay,
  isSameDay,
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getYear,
  getMonth,
  differenceInMonths,
  getDate,
} from 'date-fns';
import { ja } from 'date-fns/locale';

const WEEK_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const today = startOfDay(new Date());

const MonthView = ({ year, month }: { year: number, month: number }) => {
  const monthStartDate = new Date(year, month, 1);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(monthStartDate);
    const lastDayOfMonth = endOfMonth(monthStartDate);
    // 月の最初の日を基準に、その週の最初の日を取得
    const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
    // 月の最後の日を基準に、その週の最後の日を取得
    const end = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

    return eachDayOfInterval({ start, end });
  }, [monthStartDate]);

  return (
    <View className="flex-1 p-2">
      <View className="flex-row justify-around mb-2 h-6">
        {WEEK_LABELS.map((label) => (
          <View key={label} className="w-10 items-center">
            <Text>{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-wrap flex-row">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = getMonth(date) === month;
          const isToday = isSameDay(date, today);
          const dayNumber = getDate(date);
          const key = `day-${format(date, 'yyyy-MM-dd')}-${index}`;

          return (
            <View
              key={key}
              className={`w-[14.28%] aspect-square items-center justify-center ${isToday ? 'bg-blue-100 rounded-full' : ''}`}
            >
              <Text className={`text-center ${!isCurrentMonth ? 'text-gray-400' : ''} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {dayNumber}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function CalendarScreen() {
  const referenceDate = useMemo(() => startOfMonth(new Date()), []);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(referenceDate);

  const renderPage = useCallback(
    ({ index }: { index: number }) => {
      const targetMonthDate = addMonths(referenceDate, index);
      const year = getYear(targetMonthDate);
      const month = getMonth(targetMonthDate); // 0-indexed

      return <MonthView year={year} month={month} />;
    },
    [referenceDate]
  );

  const initialPageIndex = useMemo(() => {
    return differenceInMonths(startOfMonth(new Date()), referenceDate);
  }, [referenceDate]);

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      const newDate = addMonths(referenceDate, pageIndex);
      setCurrentDisplayDate(newDate);
    },
    [referenceDate]
  );

  return (
    <View className="flex-1 bg-white pt-4">
      <View className="items-center mb-4">
        <Text className="text-xl font-bold">
          {format(currentDisplayDate, 'yyyy年 M月', { locale: ja })}
        </Text>
      </View>

      <InfinitePager
        pageBuffer={2}
        renderPage={renderPage}
        onPageChange={handlePageChange}
        initialIndex={initialPageIndex}
        style={{ flex: 1 }}
      />
    </View>
  );
}
