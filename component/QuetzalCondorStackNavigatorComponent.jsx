import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
//import BookScreenComponent from './BookScreenComponent';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent';
import BookScreenComponent from './BookScreenComponent';
import ChaptersScreenComponent from './ChaptersScreenComponent';
import ChapterContentScreenComponent from './ChapterContentScreenComponent';
import { useI18n } from '.././context/I18nContext'; 

const BooksStack = createNativeStackNavigator();

const QuetzalCondorStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="QuetzalBookshelf" options = {{
          title: translate('quetzal_condor_council'),
        }} component={QuetzalBooksScreenComponent} />
      <BooksStack.Screen name="Book" component={BookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={ChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" options = {{
        title: translate('chapter')
      }} component={ChapterContentScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default QuetzalCondorStackNavigatorComponent;