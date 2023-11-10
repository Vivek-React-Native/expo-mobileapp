import React from 'react';
import { Card, Avatar, Paragraph } from 'react-native-paper';
import dayjs from 'dayjs';
import crowdpass from '@/adapters/crowdpass';
import { EventDto } from '@/types/swagger';
import { StyleSheet } from 'react-native';

type EventCardProps = {
  event: EventDto;
  onPress: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const DefaultEventImage = require('@/assets/images/default-event-image.png');

  const handleImage = () => {
    if (event.pageBackgroundBlobId) {
      return {
        uri: `${process.env['NX_URI']}/blobs/${event.pageBackgroundBlobId}`,
        headers: {
          Authorization: `Bearer ${crowdpass.useToken.getState().token}`,
        },
      };
    } else {
      return DefaultEventImage;
    }
  };

  const handleDate = () => {
    const start = dayjs(event.startDate);
    const end = dayjs(event.endDate);

    if (start.isSame(end, 'day')) {
      const startFormatted = start.format('MMM DD, h:mm A');
      const endFormatted = end.format('h:mm A');

      return `${startFormatted} - ${endFormatted}`;
    } else {
      const startFormatted = start.format('MMM DD, h:mm A');
      const endFormatted = end.format('MMM DD, h:mm A');

      if (!event.endDate) return startFormatted;
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  return (
    <Card mode="elevated" style={styles.cartContainer} onPress={onPress}>
      <Card.Cover source={handleImage()} />
      <Card.Title
        title={event.title}
        titleVariant="titleMedium"
        subtitle={handleDate()}
        subtitleVariant="bodySmall"
        left={(props) => (
          <Avatar.Image
            {...props}
            {...(Number.isFinite(event.logoBlobId) && {
              source: {
                uri: `${process.env['NX_URI']}/blobs/${event.logoBlobId}`,
                headers: {
                  Authorization: `Bearer ${
                    crowdpass.useToken.getState().token
                  }`,
                },
              },
            })}
          />
        )}
      />
    </Card>
  );
};

export default EventCard;

export const styles = StyleSheet.create({
  cartContainer: {
    marginVertical: 8,
    borderRadius: 20,
  },
  cartTextContainer: {
    marginHorizontal: 12,
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
  },
  cartTitle: {
    marginBottom: 9,
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  cartSubtitle: {
    color: 'white',
    fontWeight: '400',
    fontSize: 13,
  },
});
