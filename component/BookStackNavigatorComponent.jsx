import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
import BookScreenComponent from './BookScreenComponent';
import ChaptersScreenComponent from './ChaptersScreenComponent';
import ChapterContentScreenComponent from './ChapterContentScreenComponent';

const BooksStack = createNativeStackNavigator();

const BookStackNavigatorComponent = () => {
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="Library" component={HomeScreenComponent} />
      <BooksStack.Screen name="Books" component={BookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={ChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" component={ChapterContentScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default BookStackNavigatorComponent;