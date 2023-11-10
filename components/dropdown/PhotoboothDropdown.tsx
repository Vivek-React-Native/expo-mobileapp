import { Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PhotoboothDropdown({
  value,
  items,
  setValue,
  placeholder,
  color,
  open,
  setOpen,
}: any) {
  const theme = useTheme();
  return (
    <DropDownPicker
      style={{
        borderColor: color ?? '#006bd3',
        borderWidth: 0,
      }}
      placeholder={placeholder}
      itemKey="label"
      renderListItem={({ item }) => {
        const i = items.find((i: any) => i.label === item.label);

        return (
          <TouchableOpacity
            onPress={() => {
              setValue(item);
              setOpen(false);
            }}
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontSize: 16,
                marginTop: 4,
              }}
            >
              {item.label}
            </Text>
            <MaterialCommunityIcons
              name={item.icon}
              color={'#006bd3'}
              size={24}
            />
          </TouchableOpacity>
        );
      }}
      selectedItemContainerStyle={{
        borderRadius: 20,
      }}
      dropDownContainerStyle={{
        backgroundColor: '#006bd3',
        borderRadius: 20,
        width: '100%',
        borderColor: color ?? '#006bd3',
      }}
      searchContainerStyle={{
        display: 'none',
      }}
      listMode="SCROLLVIEW"
      TickIconComponent={() => (
        <MaterialCommunityIcons name="check" color={'#006bd3'} size={24} />
      )}
      textStyle={{ color: color ?? theme.colors.background }}
      ArrowDownIconComponent={() => (
        <MaterialCommunityIcons
          name="chevron-down"
          color={color ?? '#006bd3'}
          size={24}
        />
      )}
      ArrowUpIconComponent={() => (
        <MaterialCommunityIcons name="chevron-up" color={'#006bd3'} size={24} />
      )}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
    />
  );
}
