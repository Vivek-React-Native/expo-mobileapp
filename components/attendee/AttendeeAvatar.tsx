import crowdpass from '@/adapters/crowdpass';
import { AttendeeDto } from '@/types/swagger';
import { Avatar } from 'react-native-paper';

interface AttendeeAvatarProps {
  attendee: AttendeeDto;
  size: number;
}

export default function AttendeeAvatar({
  attendee,
  size = 24,
  ...props
}: AttendeeAvatarProps) {
  if (Number.isFinite(attendee.profilePhotoBlobId)) {
    return (
      <Avatar.Image
        size={size}
        {...props}
        source={{
          uri: `${process.env['NX_URI']}/blobs/${attendee.profilePhotoBlobId}`,
          headers: {
            Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
          },
        }}
      />
    );
  }
  return (
    <Avatar.Text
      size={size}
      {...props}
      label={`${attendee.firstName.charAt(0)}${attendee.lastName.charAt(0)}`}
    />
  );
}
