import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
//import BookScreenComponent from './BookScreenComponent';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent';
import QzBookScreenComponent from './QzBookScreenComponent';
import QzChaptersScreenComponent from './QzChaptersScreenComponent';
import QzChapterContentScreenComponent from './QzChapterContentScreenComponent';
import { useI18n } from '.././context/I18nContext'; 

const BooksStack = createNativeStackNavigator();

const QuetzalCondorStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="QuetzalBookshelf" options = {{
          title: translate('quetzal_condor_council'),
        }} component={QuetzalBooksScreenComponent} />
      <BooksStack.Screen name="Book" component={QzBookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={QzChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" options = {{
        title: translate('chapter')
      }} component={QzChapterContentScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default QuetzalCondorStackNavigatorComponent;