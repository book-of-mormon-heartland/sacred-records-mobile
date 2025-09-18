import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreScreenComponent from './StoreScreenComponent';
import ItemReviewScreenComponent from './ItemReviewScreenComponent';
import { useI18n } from '.././context/I18nContext'; 

const StoreStack = createNativeStackNavigator();

const StoreStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <StoreStack.Navigator>
      <StoreStack.Screen name="Store" 
        options = {{
          title: translate('store'),
        }}
        component={StoreScreenComponent} />
      <StoreStack.Screen name="ItemReview" 
        options = {{
          title: translate('item_review'),
        }}
        component={ItemReviewScreenComponent} />

    </StoreStack.Navigator>
  );
};

export default StoreStackNavigatorComponent;