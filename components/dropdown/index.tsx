import { useState } from 'react';
import { Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Dropdown({
  value,
  items,
  setValue,
  placeholder,
  color,
}: any) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <DropDownPicker
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
            <Text style={{ color: i.value.color, marginTop: 4 }}>
              {item.label}
            </Text>
            <MaterialCommunityIcons
              name={item.icon}
              color={theme.colors.primary}
              size={24}
            />
          </TouchableOpacity>
        );
      }}
      style={{ width: '100%', borderColor: color ?? theme.colors.primary }}
      dropDownContainerStyle={{ borderColor: color ?? theme.colors.primary }}
      listMode="SCROLLVIEW"
      TickIconComponent={() => (
        <MaterialCommunityIcons
          name="check"
          color={theme.colors.primary}
          size={24}
        />
      )}
      textStyle={{ color: color ?? theme.colors.primary }}
      ArrowDownIconComponent={() => (
        <MaterialCommunityIcons
          name="chevron-down"
          color={color ?? theme.colors.primary}
          size={24}
        />
      )}
      ArrowUpIconComponent={() => (
        <MaterialCommunityIcons
          name="chevron-up"
          color={theme.colors.primary}
          size={24}
        />
      )}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
    />
  );
}
